import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';

export class CdkPipelinesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  const topic = new sns.Topic(this, 'Topic', {
    displayName: 'Customer subscription topic'
  });

  }
}