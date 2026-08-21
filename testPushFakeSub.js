require('dotenv').config({ path: '.env' });
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:soporte@loyalpass.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Completely fake endpoint
const sub = {"endpoint":"https://web.push.apple.com/fakesubscription","keys":{"p256dh":"BNG2WqaaNrDsqwomvRs75ajoHXPScQYvwFLTeMRCJ38PIoDtgJVUqRzFfQN9zn37_IzGyq0yA9GVK9ri1yDWz94","auth":"dubPdsyzoLsaIMrI3i6yXg"}};

webpush.sendNotification(sub, JSON.stringify({ title: 'Test' }))
  .then(res => console.log('Success:', res.statusCode))
  .catch(err => {
    console.log('Error message:', err.message);
    console.log('Error body:', err.body);
    console.log('Error statusCode:', err.statusCode);
  });
