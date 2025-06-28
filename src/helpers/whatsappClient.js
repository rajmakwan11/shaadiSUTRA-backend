const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log("⚡ Initializing WhatsApp client...");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, // or false if you want to see browser
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('📱 Scan this QR code with your WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ WhatsApp client is ready!');
});

client.on('authenticated', () => {
  console.log('🔐 WhatsApp client authenticated.');
});

client.on('auth_failure', msg => {
  console.error('❌ AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
  console.log('❌ Client disconnected:', reason);
});

client.initialize();

module.exports = client;
