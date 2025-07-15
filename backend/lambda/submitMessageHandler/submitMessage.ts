import { SQS } from "aws-sdk";

const sqs = new SQS();
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL!;

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    const { name, message } = body;

    if (!name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ime i poruka su obavezni" }),
      };
    }

    await sqs
      .sendMessage({
        QueueUrl: SQS_QUEUE_URL,
        MessageBody: JSON.stringify({
          name,
          message,
          timestamp: new Date().toISOString(),
        }),
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
      "Access-Control-Allow-Origin": "*",      
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
      body: JSON.stringify({ message: "Poruka uspešno poslata" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Došlo je do greške" }),
    };
  }
};
