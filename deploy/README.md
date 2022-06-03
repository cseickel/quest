# Welcome to the Rearc Quest Deployment Project

This is an AWS CDK project which will deploy the "quest" project in a docker container on the Elastic Container Service.


## Requiremnts

To run this, you need to have:
1. A functioning AWS account with credentials that will work from the cli. 
2. The aws-cli installed and configured: [https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
3. The AWS CDK installed: `sudo npm install --global aws-cdk`
4. A hosted zone setup in AWS Route53.


## Quickstart

First, you will need to edit [deploy/lib/rearc-quest-deploy.ts](deploy/lib/rearc-quest-deploy.ts)
and change the `domainZoneName` constant from `seickel.org` to your own domain name.

Next, you will need to add the SECRET_WORD parameter in SSM Parameter Store. The Parameter name should be:
```
/rearc/quest/SECRET_WORD
```
and the value should be a SecureString with the correct value. This value will be injected into the container at runtime.

Finally, run these commands to deploy everything:

```
cd deploy
npm run build
cdk deploy quest
```


## Useful commands

* `npm run build`   compile typescript to js
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
