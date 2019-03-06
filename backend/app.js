'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
const router = express.Router()
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'})
const tableName = 'Twitch_Questions';


if (process.env.NODE_ENV === 'test') {
  // NOTE: aws-serverless-express uses this app for its integration tests
  // and only applies compression to the /sam endpoint during testing.
  router.use('/sam', compression())
} else {
  router.use(compression())
}

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())

router.get('/questions', async (req, res) =>{
  
  let questions = await getQuestionsByUser(req.query.user_id);
  res.json(questions);
})

router.get('/channelquestions', async (req, res) => {
  let questions = await getQuestionsByChannel(req.query.channel_id);
  res.json(questions);
})


const getQuestionsByUser = async (userid) => {
 
  var params = {
    ExpressionAttributeValues: { ":userId":  userid}, 
    KeyConditionExpression: "user_id = :userId", 
    ProjectionExpression: "user_id, channel_id, question, answer", 
    TableName: tableName
   };
   
   try{
    let data = await dynamodb.query(params).promise();
    console.log(data);
    return data.Items;
    
   }
   catch(err) {
     console.log(err);
   }


}
const getQuestionsByChannel = async(channelid) => {
  var params = {
    ExpressionAttributeValues: { ":channelId":  channelid}, 
    KeyConditionExpression: "channel_id = :channelId", 
    IndexName: "channel_id-index",
    TableName: tableName
   };
   
   try{
    let data = await dynamodb.query(params).promise();
    console.log(data);
    return data.Items;
    
   }
   catch(err) {
     console.log(err);
   }
}


// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)

// Export your express server so you can import it in the lambda function.
module.exports = app
