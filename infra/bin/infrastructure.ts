#!/usr/bin/env node
import EnvConf from "../lib/config";
import * as cdk from "@aws-cdk/core";
import { AccountStack } from "../lib/global/main";
import { RegionStack } from "../lib/region/main";
import { GithubDeployStack } from "../lib/bootstrap/main";
import { FrontEndStack } from "../lib/frontend/main";
import { env } from "process";
import { execSync } from "child_process";


let branch
if (env.GITHUB_REF_NAME) {
    // we're on github actions
    branch = env.GITHUB_REF_NAME
} else if (env.STAGE) {
    // override branch for local testing
    branch = env.STAGE;
} else {
    // default to local branch
    branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

console.log(`Deploying to ${branch}`);
let conf = EnvConf[branch];
env.AWS_DEFAULT_REGION = conf.region;
if (!conf) {
    console.log(`No config found for "${branch}"`);
    process.exit(1);
}
console.log(`Using config:`, EnvConf[branch]);

const app = new cdk.App();
if (!conf.is_bootstrap()) {
    new RegionStack(app, EnvConf[branch]);
    // this takes a lot of time
    if (!conf.skip_frontend()) {
        new FrontEndStack(app, EnvConf[branch]);
    }
}
let acct = new AccountStack(app, EnvConf[branch]);
let ghdeploy = new GithubDeployStack(app, EnvConf[branch]);
ghdeploy.addDependency(acct);
