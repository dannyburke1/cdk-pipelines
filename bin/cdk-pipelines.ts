#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkPipelinesStack } from '../lib/cdk-pipelines-stack';

const app = new cdk.App();
new CdkPipelinesStack(app, 'PipelineStack', {
  env: {
    account: '777435212579',
    region: 'eu-west-1',
  }
});

app.synth();