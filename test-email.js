require('dotenv').config({ path: '.env.local' }); // Or '.env' depending on where your variables are
require('dotenv').config({ path: '.env' });

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  console.log("Connecting to SMTP server at:", process.env.SMTP_HOST || 'smtp.ethereal.email');
  
  try {
    // Replace the 'to' address with your own email to test
    const targetEmail = "nuraacademyid@gmail.com"; 
    
    console.log(`Sending test email to ${targetEmail}...`);

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Nuraacademy Test',
      to: targetEmail,
      subject: "Test Email from Nuraacademy",
      html: "<p>If you are reading this, your SMTP configuration is working perfectly!</p>",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    
    // If you are testing with ethereal.email, this provides a link to view the email
    if (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('ethereal')) {
      console.log("Ethereal Preview URL: ", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    if (error.response) {
      console.error(error.response);
    }
  }
}

main();
