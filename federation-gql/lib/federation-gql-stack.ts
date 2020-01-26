import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');

export class FederationGqlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // make lambda
    // make gateway
    const nodeGql = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,      // execution environment
      code: lambda.Code.asset('node-example'),  // code loaded from the "lambda" directory
      handler: 'server.handler'                // file is "hello", function is "handler"
    });
    // defines an API Gateway REST API resource backed by our "hello" function.
    const lambdaAPI = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: nodeGql
    });

    // make lambda 
    // make apollo gateway
  }
}
