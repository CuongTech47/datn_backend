"use strict"

const {s3Client} = require("aws-sdk/clients/s3")

const s3Config = {
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECRET_KEY,
    },
}


const s3 = new s3Client(s3Config)

module.exports = {
    s3
}