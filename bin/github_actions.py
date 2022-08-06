#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Show What Files were changed in Git / map actions to those files."""
import argparse
from itertools import chain
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys
from typing import Iterable, List

import boto3

IS_GITHUB = os.environ.get("GITHUB_ACTIONS", "false") == "true"

CDIR = Path(__file__).parent
FRONTEND = CDIR.joinpath("../frontend")
FRONTEND_DIST = FRONTEND.joinpath("dist")
FRONTEND_ZIPFILE = Path("/tmp/deploy.zip")


class GHOut:
    """GHOut."""

    @staticmethod
    def error(msg: str) -> None:
        """error.

        Args:
            msg (str): msg

        """
        print(f"::error::{msg}", file=sys.stdout, flush=True)

    @staticmethod
    def debug(msg: str) -> None:
        """debug.

        Args:
            msg (str): msg

        """
        print(f"::debug::{msg}", file=sys.stdout, flush=True)

    @staticmethod
    def notice(msg: str) -> None:
        """notice.

        Args:
            msg (str): msg

        """
        print(f"::notice::{msg}", file=sys.stdout, flush=True)

    @staticmethod
    def warning(msg: str) -> None:
        """warning.

        Args:
            msg (str): msg

        """
        print(f"::warning::{msg}", file=sys.stdout, flush=True)

    @staticmethod
    def groupstart(title: str) -> None:
        """Start a group."""
        print(f"::group::{title}", flush=True, file=sys.stdout)

    @staticmethod
    def groupend() -> None:
        """groupend.

        Args:

        """
        print("::endgroup::", flush=True, file=sys.stdout)


class Cmd:
    """Cmd."""

    def __init__(self, name: str, working_dir: Path, cmd: str, callback=None) -> None:
        """__init__.

        Args:
            working_dir (Path): working_dir
            cmd (str): cmd

        Returns:
            None:
        """
        self.callback = callback
        self.name = name
        self.working_dir = working_dir
        self.cmd = shlex.split(cmd)

    def execute(self, doit: bool):
        """Execute command."""
        has_err = False
        if doit:
            cmd_txt = " ".join(self.cmd)
            GHOut.groupstart(f"{self.name} {cmd_txt}")
            GHOut.notice(f"Executing {cmd_txt}, working dir: {self.working_dir}")
            try:
                with subprocess.Popen(
                    self.cmd,
                    cwd=str(self.working_dir),
                    stdout=subprocess.PIPE,
                    env=os.environ,
                ) as process:
                    if process.stdout:
                        for c in iter(lambda: process.stdout.read(1), b""):  # type: ignore
                            sys.stdout.buffer.write(c)
                            sys.stdout.flush()
                    if process.stderr:
                        for c in iter(lambda: process.stderr.read(1), b""):  # type: ignore
                            sys.stderr.buffer.write(c)
                            sys.stderr.flush()
                    if process.poll() is not None:
                        retcode = process.wait()
                        if retcode != 0:
                            raise subprocess.CalledProcessError(retcode, self.cmd)
            except subprocess.CalledProcessError as e:
                GHOut.error(f"{e.cmd} failed with return code {e.returncode}")
                GHOut.error(f"Command: {self.cmd}")
                GHOut.error(f"Working dir: {self.working_dir}")
                GHOut.error(f"Output: {e.output}")
                GHOut.error(f"Return Code: {e.returncode}")
                GHOut.error(f"Error: {e.stderr}")
                has_err = True
            finally:
                GHOut.groupend()
                if has_err:
                    raise SystemExit(":(")
                if self.callback:
                    GHOut.notice(f"Running callback for {self.name}")
                    self.callback()


class Config:
    """Config class."""

    BASE = Path(__file__).parent.parent
    MAP = json.loads(Path(__file__).parent.joinpath("../deploy_map.json").read_text())
    BRANCH_DICT = {i["branch"]: i for i in MAP["deployments"]}
    PREFIX = "trash-ai"

    ACTION_CHANGE_DIRS = {
        "deploy_role_stack": chain(
            set(
                chain(
                    BASE.glob("infra/lib/bootstrap/*"),
                )
            )
        ),
        "all_stack": chain(
            set(
                chain(
                    BASE.glob("infra/bin/infrastructure.ts"),
                    BASE.glob("infra/lib/config.ts"),
                )
            )
        ),
        "region_stack": set(
            chain(
                BASE.glob("infra/lib/region/**/*"),
            )
        ),
        "frontend_stack": set(
            chain(
                BASE.glob("frontend/*.json"),
                BASE.glob("frontend/src/**/*"),
                BASE.glob("frontend/**/*.ts"),
                BASE.glob("frontend/**/*.js"),
                BASE.glob("frontend/**/*.vue"),
                BASE.glob("frontend/package.json"),
                BASE.glob("infra/lib/frontend/**/*"),
            )
        ),
        "global_stack": set(
            chain(
                BASE.glob("infra/lib/global/**/*"),
            )
        ),
        "backend_stack": set(
            chain(
                BASE.glob("backend/src/**/*"),
                BASE.glob("backend/*.js"),
                BASE.glob("backend/package.json"),
                BASE.glob("backend/serverless.*"),
                BASE.glob("backend/Dockerfile"),
            )
        ),
    }

    def __init__(self) -> None:
        """Init."""
        try:
            self.skip_frontend = (
                os.environ.get("SKIP_FRONTEND", "false") == "true"
            )  # type: bool
            json_data = self._get_config()
            self.aws_account_number = json_data["aws_account_number"]
            self.public_bucket = json_data["public_bucket"]
            self.region = json_data["region"]
            self.session = boto3.Session(region_name=self.region)
            self.github_repo_owner = json_data["github_repo_owner"]
            self.github_repo_name = json_data["github_repo_name"]
            self.dns_domain = json_data["dns_domain"]
            self.log_retention_days = int(json_data["log_retention_days"])
            self.dns_domain_root = (
                True if json_data["dns_domain_map_root"] == "true" else False
            )
            self.branch = json_data["branch"]
            self.stage = re.sub(r"^aws/", "", self.branch)
            os.environ.update({"DOMAIN": self.dns_domain})
            os.environ.update(
                {"IS_ROOT_DOMAIN": "true" if self.dns_domain_root else "false"}
            )
        except KeyError as e:
            raise SystemExit(f"Missing config key: {e}") from e

    @property
    def synth_only_stack(self):
        cmd = "yarn cdk synth"
        return [
            Cmd(
                "synth_only_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd="yarn",
            ),
            Cmd(
                "synth_only_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd=cmd,
            ),
        ]

    @property
    def global_stack(self):
        """global_stack."""
        stack = f"{self.PREFIX}-global"
        cmd = f"yarn cdk deploy {stack}"
        return [
            Cmd(
                "global_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd="yarn",
            ),
            Cmd(
                "global_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd=cmd,
            ),
        ]

    @property
    def region_stack(self):
        """region_stack."""
        stack = f"{self.PREFIX}-{self.region}-region"
        cmd = f"yarn cdk deploy {stack}"
        return [
            Cmd(
                "region_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd="yarn",
            ),
            Cmd(
                "region_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd=cmd,
            ),
        ]

    @property
    def deploy_role_stack(self):
        """deploy_role."""
        stack = f"{self.PREFIX}-github"
        cmd = f"yarn cdk deploy {stack}"
        return [
            # update yarn
            Cmd(
                "deploy_role_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd="yarn",
            ),
            # deploy
            Cmd(
                "deploy_role_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd=cmd,
            ),
        ]

    def amplify_deploy(self):
        subprocess.check_call(
            cwd=FRONTEND_DIST, args=["zip", "-r", str(FRONTEND_ZIPFILE), "."]
        )
        s3 = self.session.client("s3")
        amplifycli = self.session.client("amplify")
        s3.upload_file(str(FRONTEND_ZIPFILE), self.public_bucket, "deploy.zip")
        response = amplifycli.list_apps()["apps"]
        d = {}
        for app in response:
            name = app["name"]
            appid = app["appId"]
            print(app)
            if "staging" in name:
                d["staging"] = appid
            elif "production" in name:
                d["production"] = appid
        if "staging" in self.branch:
            appid = d["staging"]
        elif "production" in self.branch:
            appid = d["production"]
        else:
            raise SystemExit(f"Unknown branch: {self.branch}")
        response = amplifycli.start_deployment(
            appId=appid,
            branchName=self.branch,
            sourceUrl=f"s3://{self.public_bucket}/deploy.zip",
        )

    @property
    def frontend_stack(self):
        """frontend_stack."""
        if self.skip_frontend:
            GHOut.warning("Skipping frontend stack SKIP_FRONTEND is set")
            return []
        stack = f"{self.PREFIX}-{self.region}-{self.stage}-frontend"
        cmd = f"yarn cdk deploy {stack}"
        return [
            Cmd(
                "frontend_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd="yarn",
            ),
            Cmd(
                "frontend_stack",
                working_dir=self.BASE.joinpath("infra"),
                cmd=cmd,
            ),
            Cmd(
                "frontend_stack",
                working_dir=FRONTEND,
                cmd="yarn vite build",
                callback=self.amplify_deploy,
            ),
        ]

    def set_log_retention(self) -> str:
        """Set log retention."""
        cli = self.session.client("logs", region_name=self.region)
        for log_group_name in cli.describe_log_groups()["logGroups"]:
            if log_group_name["logGroupName"].startswith(f"/aws/lambda/{self.PREFIX}-"):
                GHOut.notice(
                    f"Setting log retention for {log_group_name['logGroupName']} for {self.log_retention_days} days"
                )
                cli.put_retention_policy(
                    logGroupName=log_group_name["logGroupName"],
                    retentionInDays=self.log_retention_days,
                )
            else:
                GHOut.warning(f"Skipping log group {log_group_name['logGroupName']}")
        return "Log retention set"

    @property
    def backend_stack(self) -> List[Cmd]:
        """backend_stack.

        Args:

        Returns:
            List[Cmd]:
        """
        return [
            Cmd(
                "backend_stack",
                working_dir=self.BASE.joinpath("backend"),
                cmd="yarn",
            ),
            Cmd(
                "backend_stack",
                working_dir=self.BASE.joinpath("backend"),
                cmd="mkdir -p layers/requirements/python/lib/python3.8/site-packages",
            ),
            Cmd(
                "backend_stack",
                working_dir=self.BASE.joinpath("backend"),
                cmd="pip install -t layers/requirements/python/lib/python3.8/site-packages -r requirements.txt",
            ),
            Cmd(
                "backend_stack",
                working_dir=self.BASE.joinpath("backend"),
                cmd=f"yarn serverless deploy -r {self.region} -s {self.stage}",
                callback=self.set_log_retention,
            ),
        ]

    def _get_config(self):
        """get_config."""
        if os.environ.get("GITHUB_REF_NAME"):
            branch = os.environ.get("GITHUB_REF_NAME")
        else:
            branch = (
                subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"])
                .decode("utf-8")
                .strip()
            )
        if branch in self.BRANCH_DICT:
            return self.BRANCH_DICT[branch]
        raise SystemExit(f"Branch {branch} not found in deploy_map.json")

    @property
    def order(self) -> Iterable[Cmd]:
        """order.

        Args:

        """
        yield from self.deploy_role_stack
        yield from self.global_stack
        yield from self.region_stack
        yield from self.backend_stack
        yield from self.frontend_stack

    @property
    def all_stack(self) -> Iterable[Cmd]:
        """all_stack.

        Args:
        """
        yield from self.order

    def action_map(self):
        """action_map."""
        retval = []
        s1 = [str(i.absolute()) for i in self.changed_files]
        for k, afiles in self.ACTION_CHANGE_DIRS.items():
            s2 = [str(i.absolute()) for i in afiles]
            inter = set(s1).intersection(s2)
            if inter:
                retval.append(k)
        if "all_stack" in retval:
            # if all_stack is in the list, then we need to add all the other stacks
            retval = ["all_stack"]
        return retval

    @property
    def changed_files(self) -> List[Path]:
        """Return a list of changed files."""
        lines = (
            subprocess.check_output(
                ["git", "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]
            )
            .decode("utf-8")
            .splitlines()
        )
        return [self.BASE.joinpath(i) for i in lines]

    @property
    def github_actions_testerr_stack(self) -> List[Cmd]:
        """_testerr."""
        cmds = [
            Cmd("testerr", working_dir=self.BASE, cmd="printf 'Test 1\\n'"),
            Cmd("testerr", working_dir=self.BASE, cmd="printf 'Test 2\\n'"),
            Cmd("testerr", working_dir=self.BASE, cmd="printf 'Test 3\\n'"),
            Cmd("testerr", working_dir=self.BASE, cmd="printf 'Test 4\\n'"),
            Cmd("testerr", working_dir=self.BASE, cmd="false"),
            Cmd(
                "testafter",
                working_dir=self.BASE,
                cmd="printf 'Test 2 (shoulnt not see this)\\n'",
            ),
        ]
        return cmds

    def runall(self):
        """runall."""
        for cmd in self.all_stack:
            cmd.execute(True)

    def run_manual(self, args):
        """run_manual.

        Args:
            args:
        """
        cmds = getattr(self, args.stack)
        for cmd in cmds:
            cmd.execute(True)

    @property
    def first_run_stack(self) -> Iterable[Cmd]:
        """first_run."""
        GHOut.notice("Initial run, running all stacks")
        os.environ.update({"SKIP_FRONTEND": "true"})
        self.skip_frontend = True
        yield from self.all_stack
        os.environ.update({"SKIP_FRONTEND": "false"})
        self.skip_frontend = False
        yield from self.frontend_stack

    def run(self, args):
        """Run."""
        lst = list(self.action_map())
        GHOut.notice(f"Actions defined: {lst}")
        if "all_stack" in lst:
            self.runall()
        else:
            for cmd in self.order:
                if cmd.name in lst:
                    GHOut.notice(f"Running {cmd.name}")
                    cmd.execute(args.doit)
                else:
                    GHOut.notice(f"Skipping {cmd.name}")


FUNCION_MAP = {
    "deploy": lambda args: Config().run(args),
    "region": lambda _: Config().region,
    "domain": lambda _: Config().dns_domain,
    "manual": lambda args: Config().run_manual(args),
    "set_log_retention": lambda _: Config().set_log_retention(),
    "first_run": lambda args: Config().run_manual(args),
}


def main():
    """Run main function."""
    parser = argparse.ArgumentParser(
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description=__doc__,
    )
    parser.add_argument(
        "action",
        choices=FUNCION_MAP.keys(),
        help="Action to perform",
    )
    parser.add_argument(
        "--doit",
        help="Perform the deployment",
        default=False,
        action="store_true",
    )
    parser.add_argument(
        "--stack",
        help="Perform action against specific stack",
        choices=[i for i in dir(Config) if i.endswith("_stack")],
        default=None,
        type=str,
    )
    args = parser.parse_args()
    if args.action == "manual":
        if not args.stack:
            parser.error("--stack is required for manual action")
    print(FUNCION_MAP[args.action](args))


if __name__ == "__main__":
    main()
