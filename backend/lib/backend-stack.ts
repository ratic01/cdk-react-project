import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import *as path from 'path'
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const bucket = new Bucket(this, 'UploadBucket2');

     const table=new Table(this,'FilesTable2',{
       partitionKey: { name: 'id', type: AttributeType.STRING },
       tableName: 'FilesTable2',
    })

   // SQS red
    const queue = new Queue(this, "GuestbookQueue");

    //  Lambda funkciju za slanje poruke i stavljanje u red
    const submitMessageLambda = new NodejsFunction(this, "SubmitMessageFunction", {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../lambda/submitMessageHandler/submitMessage.ts"), // putanja do Lambda koda
      handler: "handler",
      environment: {
        SQS_QUEUE_URL: queue.queueUrl,
      },
     
      
    });

    // Dozvoli Lambda funkciji da šalje poruke u SQS red
    queue.grantSendMessages(submitMessageLambda);



    // Lambda za obradu poruka iz SQS-a i kreiranje .txt u S3
    const processMessageLambda = new NodejsFunction(this, 'ProcessMessageLambda', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, '../lambda/processMessageHandler/processMessage.ts'), // putanja do fajla
      handler: 'handler',
      environment: {
        BUCKET_NAME: bucket.bucketName,
        FILES_TABLE: table.tableName,
      },
    });

    bucket.grantPut(processMessageLambda);
    table.grantWriteData(processMessageLambda);
    //dozvola za preuzimanje poruke iz sqs-a
    processMessageLambda.addEventSource(new SqsEventSource(queue));


     const api = new RestApi(this, 'UploadApi', {
      restApiName: 'Upload Service',
    });

    const uploadmessage=api.root.addResource('upload');

    //cors
    uploadmessage.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    });
    uploadmessage.addMethod('POST',new LambdaIntegration(submitMessageLambda));
  }
}
