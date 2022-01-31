import * as aws from "aws-sdk";
import * as path from "path";
import * as fs from "fs";
import { env } from "process";

export class Config {
    prefix: string = "trash-ai";
    account: string;
    region: string;
    stage: string;
    branch: string;
    mainBucketName: string;
    test_role: string = "";

    repo: string;
    repo_owner: string;
    zone_name: string;

    constructor(map_value: { [key: string]: string }) {
        this.repo = map_value["github_repo_name"];
        this.repo_owner = map_value["github_repo_owner"];
        this.account = map_value["aws_account_number"];
        this.region = map_value["region"];
        this.branch = map_value["branch"];
        this.stage = map_value["branch"].replace(/^aws\//, "");
        this.zone_name = map_value["dns_domain"];
        this.mainBucketName = `${this.prefix}-${this.region}-main`;
    }

    is_bootstrap() {
        return env.BOOTSTRAP === "true";
    }

    set_test_role(role: string) {
        this.test_role = role;
    }

    secret_name() {
        return `${this.prefix}/${this.region}/secret`;
    }

    is_production() {
        return this.stage === "production";
    }

    is_github() {
        return env.GITHUB_ACTIONS === "true";
    }

    is_local() {
        return this.stage === "local";
    }

    skip_frontend() {
        return env.SKIP_FRONTEND === "true";
    }

    async get_exports() {
        return await new aws.CloudFormation({
            region: this.region,
        })
            .listExports()
            .promise();
    }

    async get_api_host() {
        if (this.is_local()) {
            return "localhost";
        }
        const data = await this.get_exports();
        const dval =
            (data.Exports &&
                data.Exports.find(
                    (e) => e.Name === this.backend_cfn_keys().api_url
                )) ||
            null;
        if (!dval) {
            console.error("Could not find API URL");
            if (!this.skip_frontend()) {
                process.exit(1);
            } else {
                return "cdk-get-api-error.local";
            }
        } else {
            return dval.Value && dval.Value.replace(/^https?:\/\//, "");
        }
    }
    async get_secret_dict() {
        if (this.is_local()) {
            return {
                BASIC_USERNAME: "MOCK",
                BASIC_PASSWORD: "MOCK",
            };
        } else {
            const secretsmanager = new aws.SecretsManager({
                region: this.region,
            });
            try {
                const secval = await secretsmanager
                    .getSecretValue({ SecretId: this.secret_name() })
                    .promise();
                return JSON.parse(secval.SecretString || "{}");
            } catch (e) {
                console.error(`Secret ${this.secret_name()} not found`);
                throw e;
            }
        }
    }

    github_role_prefix() {
        return `github-deploy-${this.region}`;
    }

    ssm_params() {
        return {
            role_arn: `/${this.prefix}/role_arn`,
            bucket_name: `/${this.prefix}/${this.region}/main_bucket_name`,
            zone_id: `/${this.prefix}/zone_id`,
        };
    }

    backend_cfn_keys() {
        const prefix = `sls-${this.prefix}-serverless-backend-${this.stage}`;
        return {
            api_url: `${prefix}-HttpApiUrl`,
            deploy_bucket: `${prefix}-ServerlessDeploymentBucketName`,
            function_arn: `${prefix}-ApiLambdaFunctionQualifiedArn`,
            api_id: `${prefix}-HttpApiId`,
        };
    }
}

export interface IEnvConf {
    [key: string]: Config;
}

const deployment_map = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../deploy_map.json"), "utf8")
);
const EnvConf: IEnvConf = {};
deployment_map["deployments"].forEach(
    (map_value: { [key: string]: string }) => {
        let conf = new Config(map_value);
        console.log(
            `Adding EnvConf: stage:${conf.stage} / ${
            conf.branch
            } ${JSON.stringify(map_value)}`
        );
        EnvConf[conf.branch] = conf;
    }
);

export default EnvConf;
