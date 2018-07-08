# Subscriptions

## Dev Setup
* install `serverless`
* run `sls dynamodb install` to install the local version of dynamodb for development
* run `yarn dev`
* import postman api script into Postman and hit the api's 🍻
> **any change to the package.json file break local dynamo db installation as per the bug mentioned [here](https://github.com/99xt/serverless-dynamodb-local/issues/127). The workaround is running `sls dynamodb remove && sls dynamodb install`**

## Commands

## Deployment

## Resources
* [serverless documentation](https://serverless.com/)
* [storing sensitive information in env variables](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-env_console.html)

## Tasks List
* [x] setup aws lambda project with serverless and dynamodb
* [x] create and get api
* [ ] getAll subscriptions for a user
* [ ] unit test 
* [ ] functional test
* [ ] deployment scripts
* [ ] ci-cd

## Limitations
* no pagination added to `GET /{userId}/subscriptions`
