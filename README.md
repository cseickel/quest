# A quest in the clouds

### Q. What do I have to do ?
You may do all or some of the following tasks. Please read over the complete list before starting.

- [x] If you know how to use git, start a git repository (local-only is acceptable) and commit all of your work to it.
- [x] Deploy the app in any public cloud and navigate to the index page. Use Linux 64-bit x86/64 as your OS (Amazon Linux preferred in AWS, Similar Linux flavor preferred in GCP and Azure)
- [x] Deploy the app in a Docker container. Use `node` as the base image. Version `node:10` or later should work.
- [x] Inject an environment variable (`SECRET_WORD`) in the Docker container. The value of `SECRET_WORD` should be the secret word discovered on the index page of the application.
- [x] Deploy a load balancer in front of the app.
- [x] Use Infrastructure as Code (IaC) to "codify" your deployment. Terraform is ideal, but use whatever you know, e.g. CloudFormation, CDK, Deployment Manager, etc.
- [x] Add TLS (https). You may use locally-generated certs.


### Deployment :rocket:

For instructions on how to deploy this, please view the deploy [README](deploy/README).

### Notes :memo:

- I chose to deploy this with the AWS CDK because I amost familiar with that mechanism and I happen to believe it's the best way to create infrastructure.
- I put the `SECRET_WORD` variable in parameter store so that I could avoid storing secrets in code. This is my usual practice. Also, because it is specified
as a `secret` instead of an `environment` variable, it will not be visible in the web console either, it is only decrypted at runtime.
- The requirements didn't specify creating a domain name, but who wants to lookup the randomly generated load balancer address? Not me.

### Areas to improve :construction_worker_man:
- Manually editing a file to add your domain name is hacky, but hey it's almost dinner time. :man_shrugging: :pizza:
- The cdk deployment itself could be in a github action and happen on every merge to `main`
- There is no scaling policies at all. In a real scenario, I would specify minimum and maximum number of tasks, rules of when to scale out and in, and possibly schedules to alter the min and max values.
- Considering this is going to receive almost no traffic, it probably should have been depoyed to a Lambda behind an API Gateway. I have not used that option yet so I opted for what I knew best.
- I didn't bother to redeirect port 80 to 443, but that should be done. Again, dinner time!
- I didn't configure logging at all. The default log group will never expire that will get costly eventually in a real application.

### Thank You!

This was fun!

