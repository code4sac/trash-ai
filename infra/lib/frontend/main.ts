import * as cdk from "@aws-cdk/core";
import { Config } from "../config";
import { AmplifyStack } from "./amplify";

export class FrontEndStack extends cdk.Stack {
    amplify: AmplifyStack;
    stage: string;
    conf: Config;

    constructor(scope: cdk.Construct, conf: Config) {
        let id =
            conf.prefix + "-" + conf.region + "-" + conf.stage + "-frontend";
        super(scope, id, {
            env: {
                account: conf.account,
                region: conf.region,
            },
        });
        this.conf = conf;
        if (!this.conf.is_local()) {
            this.amplify = new AmplifyStack(this, conf);
        }
    }
}
