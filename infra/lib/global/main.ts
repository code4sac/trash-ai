import { Route53Stack } from "./r53";
import { Config } from "../config";
import * as iam from "@aws-cdk/aws-iam";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";

export class AccountStack extends cdk.Stack {
    conf: Config;
    r53: Route53Stack;
    role: iam.Role;

    constructor(scope: cdk.Construct, conf: Config) {
        super(scope, conf.prefix + "-global", {
            env: {
                account: conf.account,
                region: conf.region,
            },
        });
        this.conf = conf;
        this.role = this.getRoleArn();
        if (this.conf.branch !== "local") {
            this.r53 = new Route53Stack(this, this.conf);
        }
    }

    getRoleArn() {
        let role = new iam.Role(this, "lambda-role", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    "service-role/AWSLambdaBasicExecutionRole"
                ),
            ],
        });
        new ssm.StringParameter(this, "SSMRoleArn", {
            parameterName: this.conf.ssm_params().role_arn,
            stringValue: role.roleArn,
            description: "Role ARN for the lambda role",
            type: ssm.ParameterType.STRING,
        });

        new cdk.CfnOutput(this, `CfnRoleArn`, {
            exportName: `${this.conf.prefix}-role-arn`,
            value: role.roleArn,
            description: "Role ARN for the lambda role",
        });

        return role;
    }
}
