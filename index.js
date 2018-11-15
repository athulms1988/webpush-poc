const express = require('express');
const webpush = require('web-push');
const cors = require('cors')
const AWS = require('aws-sdk');
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const emailid = process.env.EMAIL_ID;
const accessKeyID = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;
const accountSid = 'ACf330804c8b7d0b3e1247499b7e1bd23e';
const authToken = '9fa4d1a423c180b8be00c5e5ae56af15';
const client = require('twilio')(accountSid, authToken);
console.log("PUBLIC_VAPID_KEY "+process.env.PUBLIC_VAPID_KEY);
console.log("PRIVATE_VAPID_KEY "+process.env.PRIVATE_VAPID_KEY);
console.log("EMAIL_ID "+process.env.EMAIL_ID);
console.log("ACCESS_KEY_ID "+process.env.ACCESS_KEY_ID);
console.log("SECRET_ACCESS_KEY "+process.env.SECRET_ACCESS_KEY);
console.log("REGION "+process.env.REGION);
var documentClient = new AWS.DynamoDB.DocumentClient({accessKeyId: accessKeyID, secretAccessKey: secretAccessKey, region: region, apiVersion: '2012-10-08'});
// Replace with your email
webpush.setVapidDetails('mailto:'+emailid, publicVapidKey, privateVapidKey);

const app = express();
app.use(cors())
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

app.post('/sendpush', (req,res) => {
  var pushData = req.body;
  const payload = JSON.stringify({ title: pushData.title, body: pushData.body });
  var params = {
      TableName: "webpushpoc"
  };
  documentClient.scan(params, onScan);
  function onScan(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {        
          data.Items.forEach(function(itemdata) {
            

client.messages
      .create({
        body: 'Hello there!',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+919496328220'
      })
      .then(message => console.log(message.sid))
      .done();
            webpush.sendNotification(itemdata, payload).then(response => {
              console.log(response);
              res.status(201).json({});
            }).catch(error => {
              console.error(error);
              res.status(201).json({});
            });
          });

          // continue scanning if we have more items
          if (typeof data.LastEvaluatedKey != "undefined") {
              params.ExclusiveStartKey = data.LastEvaluatedKey;
              documentClient.scan(params, onScan);
          }
      }
  }
});

app.use(require('express-static')('./'));

app.listen(process.env.PORT || 3000);
