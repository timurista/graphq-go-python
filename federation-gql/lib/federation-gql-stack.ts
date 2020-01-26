import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import path = require('path')

export class FederationGqlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodeGql = new lambda.Function(this, 'NodeGqlHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,      // execution environment
      code: lambda.Code.asset(path.resolve(__dirname, 'node-example')),  // code loaded from the "lambda" directory
      handler: 'server.handler'                // file is "hello", function is "handler"
    });
    // defines an API Gateway REST API resource backed by our "hello" function.
    const lambdaAPI = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: nodeGql,
      proxy: false
    });

    const nodeGqlResource = lambdaAPI.root.addResource('graphql');
    nodeGqlResource.addMethod('GET')
    nodeGqlResource.addMethod('POST')

    // make lambda 
    // make apollo gateway
    const gatewayLambda = new lambda.Function(this, 'ApolloGatewayHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,      // execution environment
      code: lambda.Code.asset(path.resolve(__dirname, 'apollo-gateway')),  // code loaded from the "lambda" directory
      handler: 'server.handler',             // file is "hello", function is "handler"
      environment: {
        NODE_GQL_HOST: lambdaAPI.url
      }
    });


    const federatedGatewayApi = new apigw.LambdaRestApi(this, 'FederatedGateway', {
      handler: gatewayLambda,
      proxy: false
    });

    const gatewayLambdaResource = federatedGatewayApi.root.addResource('graphql');
    gatewayLambdaResource.addMethod('GET')
    gatewayLambdaResource.addMethod('POST')


  }
}
