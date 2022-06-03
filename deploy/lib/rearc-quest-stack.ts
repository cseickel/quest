import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage, Secret } from 'aws-cdk-lib/aws-ecs';
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { join } from "path";
import { LoadBalancerTarget } from 'aws-cdk-lib/aws-route53-targets';
import { SslPolicy } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { listeners } from 'process';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class RearcQuestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const image = new DockerImageAsset(this, 'quest-image', {
      directory: join(__dirname, '../../')
    });

    const domainZone = route53.HostedZone.fromLookup(this, 'quest-rearc-domain-zone', {
      domainName: 'seickel.org',
    });
    const domainName = 'rearc-quest.seickel.org';
    const certificate = new Certificate(this, 'alfresco-cert', {
      domainName,
      validation: CertificateValidation.fromDns(domainZone),
    });

    const vpc = new Vpc(this, 'quest-rearc-vpc', {});
    const cluster = new Cluster(this, 'quest-rearc-cluster', { vpc });
    const srv = new ApplicationLoadBalancedFargateService(this, 'quest-rearc-service', {
      cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      taskImageOptions: {
        image: ContainerImage.fromDockerImageAsset(image),
        containerPort: 3000,
        secrets: {
          'SECRET_WORD': Secret.fromSsmParameter(
            ssm.StringParameter.fromSecureStringParameterAttributes(this, 'idb-basic-auth-user', {
              parameterName: '/rearc/quest/SECRET_WORD',
              simpleName: false,
              version: 1,
            })
          )
        }
      },
      publicLoadBalancer: true,
      certificate,
      domainName,
      domainZone
    });
  }
}
