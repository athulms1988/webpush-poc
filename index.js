const express = require('express');
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const emailid = process.env.EMAIL_ID;
// Replace with your email
webpush.setVapidDetails('mailto:'+emailid, publicVapidKey, privateVapidKey);

const app = express();

app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'test' });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).then(response => {
    console.log(response);
  }).catch(error => {
    console.error(error);
  });
});

app.use(require('express-static')('./'));

app.listen(80);
