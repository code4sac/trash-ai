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
    public_bucket: string;
    dns_domain_map_root: boolean;
    mainBucketName: string;
    test_role: string = "";

    repo: string;
    repo_owner: string;
    zone_name: string;

    constructor(map_value: { [key: string]: any }) {
        this.repo = this._get_map_val(map_value, "github_repo_name");
        this.repo_owner = this._get_map_val(map_value, "github_repo_owner");
        this.account = this._get_map_val(map_value, "aws_account_number");
        this.region = this._get_map_val(map_value, "region");
        this.public_bucket = this._get_map_val(map_value, "public_bucket");
        this.branch = this._get_map_val(map_value, "branch");
        this.stage = this._get_map_val(map_value, "branch").replace(
            /^aws\//,
            ""
        );
        this.zone_name = this._get_map_val(map_value, "dns_domain");
        this.dns_domain_map_root = this._get_map_boolean(map_value, "dns_domain_map_root");
        this.mainBucketName = `${this.prefix}-${this.region}-main`;
    }

    _get_map_boolean(map_value: { [key: string]: boolean }, key: string) {
        if (map_value[key] === undefined) {
            return false;
        }
        return map_value[key]
    }

    _get_map_val(_map_value: { [key: string]: string }, key: string) {
        if (_map_value[key] === undefined) {
            const display = JSON.stringify(_map_value, null, 4);
            console.error(
                `key: "${key}" not found in deploy_map.json file, section:\n${display}`
            );
            process.exit(1);
        }
        return _map_value[key];
    }

    //    this._dns_domain_map_root = this._get_map_val(map_value, "dns_domain_map_root")
    get is_bootstrap() {
        return env.BOOTSTRAP === "true";
    }

    set_test_role(role: string) {
        this.test_role = role;
    }

    get secret_name() {
        return `${this.prefix}/${this.region}/secret`;
    }

    get is_production() {
        return this.stage === "production";
    }

    get is_github() {
        return env.GITHUB_ACTIONS === "true";
    }

    get is_local() {
        return this.stage === "local";
    }

    get skip_frontend() {
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
        if (this.is_local) {
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
            return "ERROR-cdk-get-api-error.local";
        } else {
            return dval.Value && dval.Value.replace(/^https?:\/\//, "");
        }
    }
    async get_secret_dict() {
        if (this.is_local) {
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
                    .getSecretValue({ SecretId: this.secret_name })
                    .promise();
                return JSON.parse(secval.SecretString || "{}");
            } catch (e) {
                console.error(`Secret ${this.secret_name} not found`);
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
        const prefix = `sls-${this.prefix}-${this.region}-${this.stage}`;
        return {
            api_url: `${prefix}-HttpApiUrl`,
            deploy_bucket: `${prefix}-ServerlessDeploymentBucketName`,
            function_arn: `${prefix}-ApiLambdaFunctionQualifiedArn`,
            api_id: `${prefix}-HttpApiId`,
        };
    }
    public toJSON(): { [key: string]: any } {
        let classvalues: { [key: string]: any } = {};
        Object.entries(this).forEach(([key, value]) => {
            classvalues[key] = value;
        });
        Object.entries(
            Object.getOwnPropertyDescriptors(Reflect.getPrototypeOf(this))
        ).forEach(([key, val]) => {
            if (val.get) {
                let injval = val.get.bind(this);
                classvalues[key] = injval();
            }
        });
        return classvalues;
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
        console.log(`Adding EnvConf: stage:${conf.stage} branch:${conf.branch}`);
        EnvConf[conf.branch] = conf;
    }
);

export default EnvConf;
