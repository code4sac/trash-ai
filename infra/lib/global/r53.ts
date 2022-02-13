import * as cdk from "@aws-cdk/core";
import * as r53 from "@aws-cdk/aws-route53";
import * as aws_ssm from "@aws-cdk/aws-ssm";
import { Config } from "../config";

export class Route53Stack extends cdk.NestedStack {
    zone: r53.IHostedZone;
    param: aws_ssm.StringParameter;

    constructor(scope: cdk.Construct, conf: Config) {
        super(scope, "r53");

        let pval
        if (!conf.is_local) {
            this.zone = r53.HostedZone.fromLookup(this, "zone", {
                domainName: conf.zone_name,
                privateZone: false,
            });
            pval = this.zone.hostedZoneId
        } else {
            pval = "local"
        }

        this.param = new aws_ssm.StringParameter(this, "zone_id", {
            parameterName: conf.ssm_params().zone_id,
            stringValue: pval,
        });

    }
}
