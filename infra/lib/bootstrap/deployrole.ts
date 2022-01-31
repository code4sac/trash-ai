import { Config } from "../config";
import * as iam from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";
import * as aws_ssm from "@aws-cdk/aws-ssm";

function chunk(arr: Array<any>, chunkSize: number) {
    if (chunkSize <= 0) throw "Invalid chunk size";
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
}

export class GithubDeployRoleCDKStack extends cdk.NestedStack {
    role: iam.IRole;
    conf: Config;
    zoneId: string;

    constructor(scope: cdk.Construct, conf: Config) {
        super(scope, "cdk-deploy-user-account");
        this.conf = conf;

        const provider = new iam.OpenIdConnectProvider(
            this,
            "github-provider",
            {
                url: "https://token.actions.githubusercontent.com",
                clientIds: ["sts.amazonaws.com"],
            }
        );

        const githubprincipal = new iam.OpenIdConnectPrincipal(
            provider
        ).withConditions({
            StringLike: {
                "token.actions.githubusercontent.com:sub": `repo:${conf.repo_owner}/${conf.repo}:*`,
            },
        });

        this.zoneId = aws_ssm.StringParameter.fromStringParameterName(
            this,
            "ZoneIdPermissions",
            this.conf.ssm_params().zone_id
        ).stringValue;

        this.role = new iam.Role(this, this.conf.github_role_prefix(), {
            assumedBy: githubprincipal,
            description: "Github Deploy Role",
            maxSessionDuration: cdk.Duration.hours(1),
        });

        const gatewaypolicy = iam.ManagedPolicy.fromManagedPolicyArn(
            this,
            "gateway-policy",
            "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
        );

        this.role.addManagedPolicy(gatewaypolicy);
        this.add_policies();

        new cdk.CfnOutput(this, "GithubDeployRoleArn", {
            exportName: this.conf.github_role_prefix(),
            value: this.role.roleArn,
        });
    }

    // borrowed in large part from
    // https://serverlessfirst.com/create-iam-deployer-roles-serverless-app/
    add_policies() {
        const statement_chunks = chunk(this.get_statements(), 10);
        console.log(`Chunks: ${statement_chunks.length}`);
        let idx = 0;
        for (const statements of statement_chunks) {
            idx += 1;
            console.log(`Chunk ${idx} - ${statements.length}`);
            const policy_document = iam.PolicyDocument.fromJson({
                Version: "2012-10-17",
                Statement: statements,
            });
            const policy = new iam.ManagedPolicy(
                this,
                `${this.conf.github_role_prefix()}-policy-${idx}`,
                {
                    document: policy_document,
                }
            );
            this.role.addManagedPolicy(policy);
        }
    }

    get_statements() {
        return [
            {
                Effect: "Allow",
                // General READ ONLY access types
                Action: [
                    "logs:Describe*",
                    "iam:GetPolicy",
                    "iam:GetRole",
                    "iam:GetRolePolicy",
                    "cloudformation:DescribeChangeSet",
                    "cloudformation:DescribeStackEvents",
                    "cloudformation:DescribeStackResource",
                    "cloudformation:DescribeStackResources",
                    "cloudformation:DescribeStacks",
                    "cloudformation:GetTemplate",
                    "cloudformation:ValidateTemplate",
                    "cloudformation:List*",
                    "route53:ListHostedZonesByName",
                    "route53:GetChange",
                ],
                Resource: ["*"],
            },
            {
                Effect: "Allow",
                Action: [
                    "route53:ChangeResourceRecordSets",
                    "route53:ListResourceRecordSets",
                    "route53:GetHostedZone",
                ],
                Resource: [`arn:aws:route53:::hostedzone/${this.zoneId}`],
            },
            {
                // Splat create
                Effect: "Allow",
                Action: [
                    "cloudformation:CreateStack",
                    "cloudformation:CreateStackSet",
                    "cloudformation:CreateUploadBucket",
                    "cloudformation:List*",
                ],
                Resource: ["*"],
            },
            {
                // Any Cloudformation with out application prefix
                Effect: "Allow",
                Action: ["cloudformation:*"],
                Resource: [
                    `arn:aws:cloudformation:${this.conf.region}:${this.conf.account}:stack/${this.conf.prefix}*`,
                ],
            },
            {
                // Any Secret value with our app prefix
                Effect: "Allow",
                Action: ["secretsmanager:GetSecretValue"],
                Resource: [
                    `arn:aws:secretsmanager:${this.conf.region}:${this.conf.account}:secret:${this.conf.prefix}*`,
                ],
            },
            {
                // Any SSM Parameter with our app prefix
                Effect: "Allow",
                Action: [
                    // allow write to app prefix ssm params
                    "ssm:PutParameter",
                    "ssm:DeleteParameter",
                    "ssm:GetParameterHistory",
                    "ssm:GetParametersByPath",
                    "ssm:GetParameters",
                    "ssm:GetParameter",
                    "ssm:DeleteParameters",
                ],
                Resource: [
                    `arn:aws:ssm:${this.conf.region}:${this.conf.account}:parameter/${this.conf.prefix}*`,
                ],
            },
            // Amplify State machine stuff
            {
                Effect: "Allow",
                Action: ["states:*"],
                Resource: [
                    `arn:aws:states:${this.conf.region}:${this.conf.account}:*:amplify*`,
                ],
            },
            {
                // pretty much anything in amplify, not way to use prefix here
                Effect: "Allow",
                Action: "amplify:*",
                Resource: [
                    `arn:aws:amplify:*:${this.conf.account}:apps/*/branches/*/jobs/*`,
                    `arn:aws:amplify:*:${this.conf.account}:apps/*/domains/*`,
                    `arn:aws:amplify:*:${this.conf.account}:apps/*/branches/*`,
                    `arn:aws:amplify:*:${this.conf.account}:apps/*`,
                ],
            },
            {
                // iam stuff with our prefix
                Effect: "Allow",
                Action: "iam:*",
                Resource: [
                    `arn:aws:iam::${this.conf.account}:role/${this.conf.prefix}-*`,
                    `arn:aws:iam::${this.conf.account}:group/${this.conf.prefix}-*`,
                    `arn:aws:iam::${this.conf.account}:policy/${this.conf.prefix}-*`,
                    `arn:aws:iam::${this.conf.account}:user/${this.conf.prefix}-*`,
                ],
            },
            {
                // Lambda Policies with our prefix
                Effect: "Allow",
                Action: [
                    "lambda:Get*",
                    "lambda:List*",
                    "lambda:CreateFunction",
                    "lambda:DeleteFunction",
                    "lambda:CreateFunction",
                    "lambda:DeleteFunction",
                    "lambda:UpdateFunctionConfiguration",
                    "lambda:UpdateFunctionCode",
                    "lambda:PublishVersion",
                    "lambda:CreateAlias",
                    "lambda:DeleteAlias",
                    "lambda:UpdateAlias",
                    "lambda:AddPermission",
                    "lambda:RemovePermission",
                    "lambda:InvokeFunction",
                ],
                Resource: [
                    `arn:aws:lambda:${this.conf.region}:${this.conf.account}:function:${this.conf.prefix}*`,
                ],
            },
            {
                // logs and log groups with our prefix
                Effect: "Allow",
                Action: [
                    "logs:CreateLogGroup",
                    "logs:Get*",
                    "logs:Describe*",
                    "logs:List*",
                    "logs:DeleteLogGroup",
                    "logs:PutResourcePolicy",
                    "logs:DeleteResourcePolicy",
                    "logs:PutRetentionPolicy",
                    "logs:DeleteRetentionPolicy",
                    "logs:TagLogGroup",
                    "logs:UntagLogGroup",
                ],
                Resource: [
                    `arn:aws:log:${this.conf.region}:${this.conf.account}:log-group:/aws/lambda/${this.conf.prefix}*`,
                    `arn:aws:log:${this.conf.region}:${this.conf.account}:log-group:/aws/http-api/${this.conf.prefix}*`,
                ],
            },
            {
                // splat log delivery 
                Effect: "Allow",
                Action: [
                    "logs:CreateLogDelivery",
                    "logs:DeleteLogDelivery",
                    "logs:DescribeResourcePolicies",
                    "logs:DescribeLogGroups",
                ],
                Resource: "*",
            },
            {
                // Readonly / List buckets
                Effect: "Allow",
                Action: ["s3:ListAllMyBuckets", "s3:ListBucket"],
                Resource: "*",
            },
            {
                // bucket related operations with our prefix
                Effect: "Allow",
                Action: [
                    "s3:Get*",
                    "s3:List*",
                    "s3:CreateBucket",
                    "s3:DeleteBucket",
                    "s3:PutObject",
                    "s3:DeleteObject",
                    "s3:PutBucketPolicy",
                    "s3:DeleteBucketPolicy",
                    "s3:PutEncryptionConfiguration",
                ],
                Resource: [`arn:aws:s3:::${this.conf.prefix}*`],
            },
            {
                // Any cloudfront operations in our account
                Effect: "Allow",
                Action: [
                    "cloudfront:Get*",
                    "cloudfront:List*",
                    "cloudfront:CreateDistribution",
                    "cloudfront:UpdateDistribution",
                    "cloudfront:DeleteDistribution",
                    "cloudfront:TagResource",
                    "cloudfront:UntagResource",
                ],
                Resource: [`arn:aws:cloudfront::${this.conf.account}:*/*`],
            },
            {
                Effect: "Allow",
                Action: [
                    "cloudfront:CreateCloudFrontOriginAccessIdentity",
                    "cloudfront:UpdateCloudFrontOriginAccessIdentity",
                    "cloudfront:GetCloudFrontOriginAccessIdentity",
                    "cloudfront:GetCloudFrontOriginAccessIdentityConfig",
                    "cloudfront:DeleteCloudFrontOriginAccessIdentity",
                    "cloudfront:ListCloudFrontOriginAccessIdentities",
                ],
                Resource: "*",
            },
            {
                Effect: "Allow",
                Action: [
                    "apigateway:GET",
                    "apigateway:POST",
                    "apigateway:PUT",
                    "apigateway:PATCH",
                    "apigateway:DELETE",
                ],
                Resource: [
                    `arn:aws:apigateway:${this.conf.region}::/apis`,
                    `arn:aws:apigateway:${this.conf.region}::/apis/*`,
                ],
            },
            {
                // amplify event bus related stuff with out prefix
                Effect: "Allow",
                Action: [
                    "events:Describe*",
                    "events:Get*",
                    "events:List*",
                    "events:CreateEventBus",
                    "events:DeleteEventBus",
                    "events:PutRule",
                    "events:DeleteRule",
                    "events:PutTargets",
                    "events:RemoveTargets",
                    "events:TagResource",
                    "events:UntagResource",
                ],
                Resource: [
                    `arn:aws:events:${this.conf.region}:${this.conf.account}:event-bus/${this.conf.prefix}-*`,
                    `arn:aws:events:${this.conf.region}:${this.conf.account}:rule/${this.conf.prefix}-*`,
                ],
            },
            {
                // Sns related stuff with our prefix
                Effect: "Allow",
                Action: [
                    "sns:Get*",
                    "sns:Describe*",
                    "sns:CreateTopic",
                    "sns:DeleteTopic",
                    "sns:SetTopicAttributes",
                    "sns:Subscribe",
                    "sns:Unsubscribe",
                    "sns:TagResource",
                ],
                Resource: [
                    `arn:aws:sns:${this.conf.region}:${this.conf.account}:${this.conf.prefix}-*`,
                ],
            },
            {
                // DynamoDB related stuff with our prefix
                Effect: "Allow",
                Action: [
                    "dynamodb:CreateTable",
                    "dynamodb:CreateTableReplica",
                    "dynamodb:CreateGlobalTable",
                    "dynamodb:DeleteTable",
                    "dynamodb:DeleteGlobalTable",
                    "dynamodb:DeleteTableReplica",
                    "dynamodb:Describe*",
                    "dynamodb:List*",
                    "dynamodb:Get*",
                    "dynamodb:TagResource",
                    "dynamodb:UntagResource",
                    "dynamodb:UpdateContinuousBackups",
                    "dynamodb:UpdateGlobalTable",
                    "dynamodb:UpdateGlobalTableSettings",
                    "dynamodb:UpdateTable",
                    "dynamodb:UpdateTableReplicaAutoScaling",
                    "dynamodb:UpdateTimeToLive",
                ],
                Resource: [
                    `arn:aws:dynamodb:${this.conf.region}:${this.conf.account}:table/${this.conf.prefix}-*`,
                    `arn:aws:dynamodb::${this.conf.account}:global-table/${this.conf.prefix}-*`,
                ],
            },
            {
                // SQS related stuff with our prefix
                Effect: "Allow",
                Action: [
                    "sqs:CreateQueue",
                    "sqs:DeleteQueue",
                    "sqs:SetQueueAttributes",
                    "sqs:AddPermission",
                    "sqs:RemovePermission",
                    "sqs:TagQueue",
                    "sqs:UntagQueue",
                    "sqs:Get*",
                    "sqs:List*",
                ],
                Resource: [
                    `arn:aws:sqs:${this.conf.region}:${this.conf.account}:${this.conf.prefix}-*`,
                ],
            },
            {
                // SSM related stuff with our prefix
                Effect: "Allow",
                Action: [
                    "ssm:GetParameter*",
                    "ssm:DescribeParameters",
                    "ssm:DeleteParameter*",
                    "ssm:PutParameter",
                ],
                Resource: [
                    `arn:aws:ssm:${this.conf.region}:${this.conf.account}:parameter/${this.conf.prefix}`,
                    `arn:aws:ssm:${this.conf.region}:${this.conf.account}:parameter/${this.conf.prefix}/*`,
                ],
            },
        ];
    }
}
