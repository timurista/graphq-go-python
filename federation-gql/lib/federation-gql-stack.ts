import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import path = require('path')

export class FederationGqlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nodeGql = new lambda.Function(this, 'NodeGqlHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset(path.resolve(__dirname, 'node-example')),  // code loaded from the "lambda" directory
      handler: 'server.handler'               
    });

    const lambdaAPI = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: nodeGql,
      proxy: false
    });

    const pythonGQL = new lambda.Function(this, 'PythonGqlHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset(path.resolve(__dirname, 'python-example')),  // code loaded from the "lambda" directory
      handler: 'server.handler'               
    });

    const pythonGQLAPI = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: pythonGQL,
      proxy: false
    });

    const pythonGQLResource = pythonGQLAPI.root.addResource('graphql');
    pythonGQLResource.addMethod('GET')
    pythonGQLResource.addMethod('POST')

    // make lambda 
    // make apollo gateway
    const gatewayLambda = new lambda.Function(this, 'ApolloGatewayHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,      // execution environment
      code: lambda.Code.asset(path.resolve(__dirname, 'apollo-gateway')),  // code loaded from the "lambda" directory
      handler: 'server.handler',             // file is "hello", function is "handler"
      environment: {
        NODE_GQL_HOST: lambdaAPI.url+'/graphql'
      }
    });


    const federatedGatewayApi = new apigw.LambdaRestApi(this, 'FederatedGateway', {
      handler: gatewayLambda,
      proxy: false
    });

    // federatedGatewayApi.add
    // fix: https://github.com/apollographql/apollo-server/pull/2241/commits/2f95295d6f44fcb335a6e6d69a7ac7c5ebab7380

    const gatewayLambdaResource = federatedGatewayApi.root.addResource('graphql');
    gatewayLambdaResource.addMethod('GET')
    gatewayLambdaResource.addMethod('POST')


  }
}
