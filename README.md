# Serverless Message App

This is a serverless message handling application built with React on the frontend and AWS services (CDK, Lambda, SQS, DynamoDB, S3...) on the backend.

## Technologies

- React
- AWS CDK
- AWS Lambda
- AWS SQS
- AWS DynamoDB
- AWS S3
- AWS API Gateway

## Setup and Run

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yourrepo.git


## Run frontend locally

cd frontend
npm start

## Deploy backend using AWS CDK

cd backend
cdk deploy

## Usage

- Submit messages via the React form on the frontend.
- Messages are sent to an SQS queue and processed asynchronously.
- Processed messages are stored as .txt files in S3 and metadata in DynamoDB.


## Architecture

This project uses a serverless architecture with:

- Frontend React app submitting messages.
- Lambda function sending messages to SQS.
- Lambda function triggered by SQS to create .txt files and upload them to S3.
- DynamoDB for storing message metadata.
  
## Roadmap

- Implementation of file upload functionality allowing users to upload files directly from their computers
- Integration with AWS SNS service for sending notifications about new messages or events
- Other services





   
