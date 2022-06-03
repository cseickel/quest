import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { join } from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class RearcQuestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const image = new DockerImageAsset(this, 'quest-image', {
      directory: join(__dirname, '../../')
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
        containerPort: 3000
      },
      publicLoadBalancer: true
    });
  }
}
