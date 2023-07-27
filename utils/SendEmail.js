import nodemailer from "nodemailer"
const SendEmail = async (options) => {







  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.MAIL_PW,

      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.SENDER_MAIL, // sender address
      to: process.env.RECIPIENT_Mail, // Replace with the recipient's valid email address
      subject: options.subject, // Subject line
      text: options.text, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Log the preview URL if using the test account

    return info; // Return the result of sending the email
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
export default SendEmail;





