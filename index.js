const express = require('express');
const webpush = require('web-push');
const AWS = require('aws-sdk');
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const emailid = process.env.EMAIL_ID;
const accessKeyID = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;
var documentClient = new AWS.DynamoDB.DocumentClient({accessKeyId: accessKeyID, secretAccessKey: secretAccessKey, region: region, apiVersion: '2012-10-08'});
// Replace with your email
webpush.setVapidDetails('mailto:'+emailid, publicVapidKey, privateVapidKey);

const app = express();

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  var params = {
    TableName: 'webpushpoc',
    Item: subscription
  };

  documentClient.put(params, function(err, data) {
    if (err) console.log(err);
    else console.log(data);
    res.status(201).json({});
  });
  
});

app.use(require('express-static')('./'));

app.listen(process.env.PORT || 3000);
