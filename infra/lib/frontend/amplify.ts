import * as amplify from "@aws-cdk/aws-amplify";
import * as cdk from "@aws-cdk/core";
// import * as path from "path";
// import * as fs from "fs";
import { Config } from "../config";
// import { DockerImage } from "@aws-cdk/core";
// import { Asset } from "@aws-cdk/aws-s3-assets";
// import { hashElement } from "folder-hash";
import * as r53 from "@aws-cdk/aws-route53";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
// import * as os from "os";

// const user_id = os.userInfo().uid;

export class AmplifyStack extends cdk.NestedStack {
    amplify: amplify.IApp;
    stage: string;
    conf: Config;
    api_host: any;

    constructor(scope: cdk.Construct, conf: Config) {
        super(scope, "amplify");
        this.conf = conf;
        if (this.stage === "local") {
            console.log(
                `stage:"${this.conf.stage}" Is local - skipping amplify`
            );
            process.exit(0);
        }
        conf.get_api_host().then((host) => {
            this.api_host = host;
            console.log(`API Host: ${this.api_host}`);
            this.setAmplify();
        });
        // check for api key env variable
        if (!process.env.VITE_GOOGLE_MAPS_API_KEY) {
            console.log("VITE_GOOGLE_MAPS_API_KEY not set - exiting");
            process.exit(1);
        }
    }

    // async getAssetFile() {
    //     const frontendpath = path.join(__dirname, "../../../frontend");
    //     const fhash = await hashElement(frontendpath, {
    //         encoding: "hex",
    //         folders: {
    //             exclude: [".*", "node_modules", "dist", "build"],
    //         },
    //         files: {
    //             include: [
    //                 "**/*.js",
    //                 "**/*.css",
    //                 "**/*.html",
    //                 "**/*.json",
    //                 "**/*.vue",
    //                 "**/*.ts",
    //             ],
    //         },
    //     });
    //     const fname = `${fhash.hash.toString()}.zip`;
    //     const localdir = `/tmp/asset-output`;
    //     const dockerdir = `/asset-output`;
    //     const localfilename = `${localdir}/${fname}`;
    //     const dockerfilename = `${dockerdir}/${fname}`;
    //
    //     console.log(`frontend asset local file ${localfilename}`);
    //
    //     if (fs.existsSync(localfilename)) {
    //         return localfilename;
    //     } else {
    //         let gen_cmd = [
    //             `VITE_BACKEND_FQDN=${this.api_host}`,
    //             `VITE_GOOGLE_MAPS_API_KEY=${process.env.VITE_GOOGLE_MAPS_API_KEY}`,
    //             "yarn build",
    //         ];
    //
    //         let cmd_arr = [
    //             gen_cmd.join(" "),
    //             "pwd",
    //             "cd dist/",
    //             `zip ${dockerfilename} -r .`,
    //             `unzip -l ${dockerfilename}`,
    //             `ls -l ${dockerfilename}`,
    //             `chown -R ${user_id}:${user_id} ${dockerdir}`,
    //         ];
    //         // let img = DockerImage.fromBuild(frontendpath, {
    //         //     file: "build.Dockerfile",
    //         // });
    //
    //         let cmd = " && ".concat(cmd_arr.join(" && "));
    //         img.run({
    //             command: ["sh", "-c", `cd /builder ${cmd}`],
    //             volumes: [
    //                 {
    //                     hostPath: localdir,
    //                     containerPath: dockerdir,
    //                 },
    //             ],
    //         });
    //         // copy to /tmp/foo.zip
    //         fs.copyFileSync(localfilename, '/tmp/test.zip');
    //         return localfilename;
    //     }
    // }

    async setAmplify() {
        const secret = await this.conf.get_secret_dict();
        if (!secret.BASIC_USERNAME) {
            throw new Error(
                `No BASIC_USERNAME basic_username found in secret ${
                    this.conf.secret_name
                }, ${JSON.stringify(secret)}`
            );
        }
        if (!secret.BASIC_PASSWORD) {
            throw new Error(
                `No BASIC_PASSWORD found in secret ${
                    this.conf.secret_name
                }, ${JSON.stringify(secret)}`
            );
        }
        console.log(`setting BASIC_USERNAME: ${secret.BASIC_USERNAME}`);
        console.log(`setting BASIC_PASSWORD: ${secret.BASIC_PASSWORD}`);

        let amp = new amplify.App(
            this,
            `${this.conf.prefix}-${this.conf.region}-${this.conf.stage}-amplify`,
            {}
        );

        const zone = r53.HostedZone.fromLookup(this, "HostedZone", {
            domainName: this.conf.zone_name,
        });

        new DnsValidatedCertificate(this, "Certificate", {
            hostedZone: zone,
            domainName: this.conf.zone_name,
            cleanupRoute53Records: true,
        });

        amp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);

        let domain = amp.addDomain("domain", {
            domainName: this.conf.zone_name,
        });

        let basic_auth = amplify.BasicAuth.fromCredentials(
            secret.BASIC_USERNAME,
            secret.BASIC_PASSWORD
        );

        // let asset = new Asset(this, "deploy.zip", {
        //     path: await this.getAssetFile(),
        // });

        if (this.conf.dns_domain_map_root) {
            let main_branch = amp.addBranch(this.conf.stage, {
                autoBuild: true,
                // asset: asset,
            });
            domain.mapRoot(main_branch);
            domain.mapSubDomain(main_branch, this.conf.stage);
            domain.mapSubDomain(main_branch, "www");
        } else {
            let main_branch = amp.addBranch(this.conf.stage, {
                autoBuild: true,
                basicAuth: basic_auth,
                // asset: asset,
            });
            domain.mapSubDomain(main_branch, this.conf.stage);
        }

        return amp;
    }
}
