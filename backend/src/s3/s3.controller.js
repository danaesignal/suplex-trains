import aws from "aws-sdk";
import Dotenv from 'dotenv';
import path from 'path';

Dotenv.config({ path: path.resolve(__dirname, `../../config/${process.env.ENVIRONMENT}.env`)});
aws.config.update({
  region: 'us-west-2',
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

const S3_BUCKET = process.env.Bucket;
console.log(S3_BUCKET);
const S3Controller = {};

// Generates and returns a signed link for Amazon s3
S3Controller.sign = (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;

  // Creating the payload to send to s3 API
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read'
  };

  // Send the request to the s3 API
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err) {
      console.log(err);
      res.json({success: false, error: err});
    }

    // Response data predicated on successful API call
    // Contains the signedRequest and location file will be found upon transmission
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    // Send it
    res.json({success: true, data: returnData});
  })
}

export default S3Controller;