const nodemailer = require("nodemailer");

async function sendHostNotification({ hostEmail, hostName, listingTitle, customerName, customerEmail }) {

   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});


    await transporter.sendMail({
        from: process.env.MY_GMAIL,
        to: hostEmail,
        subject: `New reservation request for "${listingTitle}"`,
        text: `
Hello ${hostName},

${customerName} is interested in your listing: "${listingTitle}".

Customer Email: ${customerEmail}

Please contact them soon.

– Team StayZly
        `
    });
}

module.exports = sendHostNotification;

