import { Config } from "../config";
import * as aws_s3 from "@aws-cdk/aws-s3";
import * as aws_iam from "@aws-cdk/aws-iam";
import * as aws_ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";

export class StorageStack extends cdk.NestedStack {
    main_bucket: aws_s3.IBucket;

    constructor(scope: cdk.Construct, conf: Config) {
        super(scope, "storage");

        this.main_bucket = new aws_s3.Bucket(this, "MainBucket", {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        let param = new aws_ssm.StringParameter(this, "MainBucketName", {
            parameterName: conf.ssm_params().bucket_name,
            stringValue: this.main_bucket.bucketName,
            description: "The name of the main bucket",
            type: aws_ssm.ParameterType.STRING,
        });

        let role_arn = aws_ssm.StringParameter.fromStringParameterName(
            this,
            "bucketrolelookup",
            conf.ssm_params().role_arn
        ).stringValue;

        let role = aws_iam.Role.fromRoleArn(
            this,
            "BucketLambdaRole",
            role_arn
        );

        if (conf.stage !== "local") {
            this.main_bucket.grantReadWrite(role);
            param.grantRead(role);
        }
    }
}
