import * as cdk from "@aws-cdk/core";
import { Config } from "../config";
import { GithubDeployRoleCDKStack } from "./deployrole";

export class GithubDeployStack extends cdk.Stack {
    conf: Config;
    deploy: GithubDeployRoleCDKStack;

    constructor(scope: cdk.Construct, conf: Config) {
        super(scope, conf.prefix + "-github", {
            env: {
                account: conf.account,
                region: conf.region,
            },
        });
        this.deploy = new GithubDeployRoleCDKStack(this, conf);
    }
}
