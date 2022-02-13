import * as iam from "@aws-cdk/aws-iam";
import * as ssm from "@aws-cdk/aws-ssm";
import * as secretmanager from "@aws-cdk/aws-secretsmanager";
import { StorageStack } from "./storage"
import { Config } from "../config";
import * as cdk from "@aws-cdk/core";

export class RegionStack extends cdk.Stack {
    conf: Config;
    storage: StorageStack;
    secret: secretmanager.ISecret;

    constructor(scope: cdk.Construct, conf: Config) {
        let id = conf.prefix + "-" + conf.region + "-region";
        super(scope, id, {
            env: {
                region: conf.region,
                account: conf.account,
            }
        });
        this.conf = conf;

        let role_str = ssm.StringParameter.fromStringParameterName(
            this,
            "RoleArn",
            this.conf.ssm_params().role_arn,
        );

        const role = iam.Role.fromRoleArn(
            this,
            "lambda-role",
            role_str.stringValue
        );

        this.secret = secretmanager.Secret.fromSecretNameV2(
            this,
            "secret",
            this.conf.secret_name
        );
        this.secret.grantRead(role);
        this.storage = new StorageStack(this, conf);
    }
}
