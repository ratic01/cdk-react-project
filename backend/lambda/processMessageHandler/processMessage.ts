// lambda/processMessage.ts
import { S3, DynamoDB } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3();
const dynamoDb = new DynamoDB.DocumentClient();

const BUCKET_NAME = process.env.BUCKET_NAME!;
const TABLE_NAME = process.env.FILES_TABLE!;

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      // Parsiraj telo poruke iz SQS reda
      const body = JSON.parse(record.body);
      const { name, message } = body;

      const id = uuidv4();
      const timestamp = new Date().toISOString();

      // Sačuvaj u DynamoDB
      await dynamoDb.put({
        TableName: TABLE_NAME,
        Item: {
          id,
          name,
          message,
          timestamp,
        },
      }).promise();

      // Kreiraj .txt fajl sa sadržajem poruke
      const txtContent = `Ime: ${name}\nPoruka: ${message}\nVreme: ${timestamp}`;


      // cuvaj u s3 bucket
      await s3.putObject({
        Bucket: BUCKET_NAME,
        Key: `messages/${id}.txt`,
        Body: txtContent,
        ContentType: 'text/plain',
      }).promise();

      console.log(`Obrađena poruka: ${id}`);

    } catch (err) {
      console.error('Greška u obradi poruke:', err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'Processed' }),
  };
};
