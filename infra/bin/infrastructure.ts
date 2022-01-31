#!/usr/bin/env node
import EnvConf from "../lib/config";
import * as cdk from "@aws-cdk/core";
import { AccountStack } from "../lib/global/main";
import { RegionStack } from "../lib/region/main";
import { GithubDeployStack } from "../lib/bootstrap/main";
import { FrontEndStack } from "../lib/frontend/main";
import { env } from "process";
import { execSync } from "child_process";

let branch;
if (env.GITHUB_REF_NAME) {
    // we're on github actions
    branch = env.GITHUB_REF_NAME;
} else if (env.STAGE) {
    // override branch for local testing
    branch = env.STAGE;
} else {
    // default to local branch
    branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

let conf = EnvConf[branch];
if (!conf) {
    const display = `key: "${branch}" not found in deploy_map.json file inside "deployments" list/array`;
    console.log(display);
    process.exit(1);
}
console.log(`Deploying to ${branch}`);
if (!conf.is_github) {
    console.log(`Setting profile to ${conf.profile}`);
    env.AWS_PROFILE = conf.profile;
}
env.AWS_DEFAULT_REGION = conf.region;
console.log(`Using config:\n`, JSON.stringify(conf, null, 2));

const app = new cdk.App();
if (!conf.is_bootstrap) {
    new RegionStack(app, EnvConf[branch]);
    // this takes a lot of time
    if (!conf.skip_frontend) {
        new FrontEndStack(app, EnvConf[branch]);
    }
}
let acct = new AccountStack(app, EnvConf[branch]);
let ghdeploy = new GithubDeployStack(app, EnvConf[branch]);
ghdeploy.addDependency(acct);
