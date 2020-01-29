import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import ec2 = require('@aws-cdk/aws-ec2');

import path = require('path')

export class FederationGqlStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'myVpc', {
      maxAzs: 2,
    })

    const vpcLink = new apigw.VpcLink(this, 'vpclink')

    const nlb = new elbv2.NetworkLoadBalancer(this, 'MyNLB', {
      vpc
    })
    vpcLink.addTargets(nlb)

    const nodeGql = new lambda.Function(this, 'NodeGqlHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset(path.resolve(__dirname, 'node-example')),  // code loaded from the "lambda" directory
      handler: 'server.handler'               
    });

    const nodeGqlInt = new apigw.LambdaIntegration(nodeGql, {
      vpcLink: vpcLink,
      connectionType: apigw.ConnectionType.VPC_LINK
    })


    const lambdaAPI = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: nodeGql,
      proxy: false,
      defaultIntegration: nodeGqlInt
    });

    const pythonGQL = new lambda.Function(this, 'PythonGqlHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset(path.resolve(__dirname, 'python-example')),  // code loaded from the "lambda" directory
      handler: 'server.handler'               
    });

    // where we can add the vpc link
    const pythonGQLInt = new apigw.LambdaIntegration(pythonGQL, {
      vpcLink: vpcLink,
      connectionType: apigw.ConnectionType.VPC_LINK
    })

    const pythonGQLAPI = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: pythonGQL,
      proxy: false,
      defaultIntegration: pythonGQLInt
    });



    const pythonGQLResource = pythonGQLAPI.root.addResource('graphql');
    pythonGQLResource.addMethod('GET')
    pythonGQLResource.addMethod('POST')


    // make lambda 
    // make apollo gateway

    //


    const gatewayLambda = new lambda.Function(this, 'ApolloGatewayHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,      // execution environment
      code: lambda.Code.asset(path.resolve(__dirname, 'apollo-gateway')),  // code loaded from the "lambda" directory
      handler: 'server.handler',             // file is "hello", function is "handler"
      environment: {
        NODE_GQL_HOST: lambdaAPI.url+'/graphql'
      }
    });

    const gatewayLambdaInt = new apigw.LambdaIntegration(gatewayLambda, {
      vpcLink: vpcLink,
      connectionType: apigw.ConnectionType.VPC_LINK
    })


    const federatedGatewayApi = new apigw.LambdaRestApi(this, 'FederatedGateway', {
      handler: gatewayLambda,
      proxy: false,
      defaultIntegration: gatewayLambdaInt
    });

    // federatedGatewayApi.add
    // fix: https://github.com/apollographql/apollo-server/pull/2241/commits/2f95295d6f44fcb335a6e6d69a7ac7c5ebab7380

    const gatewayLambdaResource = federatedGatewayApi.root.addResource('graphql');
    gatewayLambdaResource.addMethod('GET')
    gatewayLambdaResource.addMethod('POST')


  }
}
