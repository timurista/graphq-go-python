import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import FederationGql = require('../lib/federation-gql-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new FederationGql.FederationGqlStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
