#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FederationGqlStack } from '../lib/federation-gql-stack';

const app = new cdk.App();
new FederationGqlStack(app, 'FederationGqlStack', {
    env: {
        region: 'us-east-1',
        account: '133400538676'  // linux academy accounts that change frequently
    } 
});
