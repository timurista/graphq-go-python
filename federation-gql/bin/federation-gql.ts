#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FederationGqlStack } from '../lib/federation-gql-stack';

const app = new cdk.App();
new FederationGqlStack(app, 'FederationGqlStack');