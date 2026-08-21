require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:soporte@loyalpass.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const subs = [
  {
    "endpoint": "https://web.push.apple.com/QLWIFeTI12rD90l_NMTXXhC9cbS9XvdEtiAdezWb27IgYKAsMNXyxecTTzII5YbIYzDZ4fCUiILMD_WgDqQsTzL8jljMPdBvZqHq7cNwoGYH2OpVNtuaSWnXl0W0_dNvTBzgd58OyGFyW5GaYxOA-dqC4uIUf4ny2Q2ceH0jwRQ",
    "keys": {
      "p256dh": "BNG2WqaaNrDsqwomvRs75ajoHXPScQYvwFLTeMRCJ38PIoDtgJVUqRzFfQN9zn37_IzGyq0yA9GVK9ri1yDWz94",
      "auth": "dubPdsyzoLsaIMrI3i6yXg"
    }
  }
];

subs.forEach((sub, i) => {
  webpush.sendNotification(sub, JSON.stringify({
    title: 'Test',
    body: 'This is a test',
    icon: '/logo/cafe-happy-logo.png',
    data: { url: '/' }
  })).then(res => {
    console.log('Success for sub ' + i + ':', res.statusCode);
  }).catch(err => {
    console.error('Error for sub ' + i + ':', err);
  });
});
