#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipelinesStack } from '../lib/cdk-pipelines-stack';
import { App } from '@aws-cdk/core';


class AppStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
    new CdkPipelinesStack(this, 'cdk-pipelines-example')
    }
}

class PipelinesStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
    
      // Create codepipeline artifact to store source code from repo
      const sourceArtifact = new codepipeline.Artifact();
      // Create artifact store synthed code
      const cloudAssemblyArtifact = new codepipeline.Artifact();

      const pipeline = new CdkPipeline(this, 'Pipeline', {
        pipelineName: 'DeliveryPipeline',
        cloudAssemblyArtifact,
        sourceAction: new codepipeline_actions.GitHubSourceAction({
          actionName: 'GitHub',
          output: sourceArtifact,
          oauthToken: cdk.SecretValue.secretsManager('CODEPIPELINE_TOKEN'),
          trigger: codepipeline_actions.GitHubTrigger.POLL,
          owner: 'dannyburke1',
          repo: 'go-cdk-pipeline-app',
          branch: 'master'
        }),
        synthAction: new SimpleSynthAction({
            sourceArtifact,
            cloudAssemblyArtifact,
            installCommand: 'npm install -g aws-cdk',
            synthCommand: 'ls -l',
            buildCommand: 'cdk synth'
          }),
      });

      pipeline.addApplicationStage(new AppStage(this, 'SandBox-Infra', {env: { account: '683322829308', region: 'eu-west-1'}}))
    }
}
  
const app = new cdk.App();
// Deploy into this account into this region from my machine
new PipelinesStack(app, 'PipelineStack', {
    env: {
      account: '777435212579',
      region: 'eu-west-1',
    }
  });
 
app.synth();


