// Museum of Lobby Art Upload Token API Endpoint
//
// Required parameters (as headers or query args):
//   - session_id
//   - origin (to restrict API requests to pre-authorized domains)
//
// Successful Response:
//   200 OK
//   `{"upload_token": <TOKEN_STRING>}`
//
// Missing credentials:
//   401 Unauthorized
//   `{"error": "missing required <PARAMETER_NAME>"}`


const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const S3_KEY = ""
const S3_SECRET = ""

exports.handler = async function(event, context) {

	console.log("EVENT: \n" + JSON.stringify(event, null, 2))
	return context.logStreamName
}
