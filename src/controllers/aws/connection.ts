import * as AWS from 'aws-sdk'

AWS.config.update({
  region: process.env.AWS_REGION,
})

export { AWS }
