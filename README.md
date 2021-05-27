# Monorepo README

## Getting started

**Prerequisite #1: Install**

    npm install
    npm install -g nx

**Prerequisite #2: Setting up environment files**

Create a file .local.env in root and each of the apps/x directories then copy the
values from 1 password into them.

**Prerequisite #3: Configuring Github Actions**

Push code to a Github repository, enable actions and set the following secrets:
 - AWS_SECRET_ACCESS_KEY
 - SDK_API_POSTGRES_PASSWORD
 - SENTRY_AUTH_TOKEN
 - SERVERLESS_ACCESS_KEY
 - WEB_API_STRIPE_SECRET
 - WEB_API_GOOGLE_OAUTH_CLIENT_SECRET


**Prerequisite #4: Making your first deployment**

Running this project locally requires that the web-api is first deployed to the 'dev' stage in order
to access Cognito and so that the serverless-output-to-env can create a .env file
in root directory which is used by NX CLI. To deploy, simply push to main branch and the Github action
will be triggered.

Once finished, run this command to setup your .env file in root:

    nx run web-api:sls --cmd=output-to-env

**Prerequisite #5: Configure AWS SES**

You must manually create SES resources in the AWS Dashboard. You can follow this guide [here](https://aws.amazon.com/getting-started/hands-on/send-an-email/) .

1.  Create SMTP Credentials and then set /apps/web-api/.local.env `WEB_API_SMTP_USERNAME` and `WEB_API_SMTP_PASSWORD` accordingly.
2.  Verify the email addresses that you will be sending from.

All your non-production environments can share the same SMTP credentials and FROM address. You should however use separate credentials for Production.

NB: You'll initially be in a sandbox mode which has rate restrictions and you'll only be able to send verified emails. You can read [here](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html?icmpid=docs_ses_console) for more information on how to get production access.

**Prerequisite #6: PGAdmin setup**

`nx run web-api:db` and go to http://localhost:$WEB_API_POSTGRES_PORT
Login with credentials from /apps/web-api/.local.env:

- Email: $PGADMIN_DEFAULT_ADMIN
- Password: $PGADMIN_DEFAULT_ADMIN

Then right click on servers & 'Create' -> 'Server'

- Host: host.docker.internal
- Port: $WEB_API_POSTGRES_PORT
- Username: $WEB_API_POSTGRES_USER
- Password: $WEB_API_POSTGRES_PASSWORD

*Then repeat the same process for sdk-api using the SDK_API_X variables instead of WEB_API_X*

**Prerequisite #7: Self signed certs**

_API uses self-signed cert which browsers will complain about. You can bypass this in Chrome by enabling this flag: chrome://flags/#allow-insecure-localhost_

**Prerequisite #8: Google Login (Optional)**

To setup Google Login, login to Google Cloud console and:

Create OAuth 2.0 credentials are save values in /apps/web-api/.local.env:

WEB_API_GOOGLE_OAUTH_CLIENT_ID
WEB_API_GOOGLE_OAUTH_CLIENT_SECRET

Under authorised javascript origins put one for local and one for each environment.

- https://localhost:4200
- https://monorepo-dev.auth.eu-west-2.amazoncognito.com

Under authorised redirect URIs, put one for local and one for each environment.

- https://localhost:4200/oauth2/idpresponse
- https://monorepo-dev.auth.eu-west-2.amazoncognito.com/oauth2/idpresponse

_NB: Before go-live you'll need to click on 'OAuth Consent Screen' and publish your app and also verify your domain if using web hooks._

**Prerequisite #9: Seed data**

To setup Seed data in your local (or deployed) environments, issue a POST request to /seed for web-api.

**How to run**

To run web-api

    nx db web-api
    nx serve web-api #(or nx offline web-api for serverless-offline mode)
    nx db-down web-api #(when finished)

To run sdk-api

    nx db sdk-api
    nx serve sdk-api #(or nx offline sdk-api for serverless-offline mode)
    nx db-down sdk-api #(when finished)

Serve Web:

    nx serve web

To finish

    docker-compose stop

Other useful commands:

- `nx run web-api:db-migration --args=--name=initial` Creates migration (Same for sdk-api)
- `nx format:write` Format all files
- `nx test web-api` web-api unit tests
- `nx e2e web-api` web-api e2e tests
- `nx test sdk-api` sdk-api unit tests
- `nx e2e sdk-api` sdk-api e2e tests
- `nx test web` web unit tests
- `nx e2e web-e2e` web e2e tests
- `nx affected:e2e` Run tests only affected by a change

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

**How to debug**

Debugging has been configured for Visual Studio Code in the web-api project.
- Serve the web-api as normal
- Click on the Debug icon in VSC & Select 'Debug web-api' from dropdown and click Play

More information available [here](https://blog.nrwl.io/debugging-nx-in-vs-code-cb1dbe9eeeba)

**How to deploy**

Push to main branch -> Deploys to Dev
Create a release in Github dashboard -> Deploys to other environments
- staging-x.x.x --> staging
- production-x.x.x --> production

**How to add more stages**

- Create new file .github/assets/environment-variables/.STAGENAME.env
- Create new file .github/assets/robots/.STAGENAME.env
- Add a configuration object to the configurations object in angular.json projects.web.architect.build-ng
- Update apps/web-api/serverless.yml custom.domainComponents.subDomain & custom.websiteUri.subDomain
- Update apps/sdk-api/serverless.yml custom.domainComponents.subDomain
- Add a value to the Environments enum in /libs/common

**How to remove a stage**

Complete the following in sequence:

- Go to Route 53 and remove any domains used in stack
- Go to API Gateway -> Custom domain names and remove any used in the stack
- Go to S3 & delete all buckets in stack (including the -serverless variant)
- Delete stack for API in Cloudformation
- Go to Web's Cloudfront Distribution -> Behaivours -> Edit -> Lambda Function Associations & Remove serverless-website-domain's function. (Then wait for AWS to release, takes > 30 mins)
- Delete serverless-website-domain's Lambda (us-east-1 region)
- Delete stack for Web in Cloudformation

