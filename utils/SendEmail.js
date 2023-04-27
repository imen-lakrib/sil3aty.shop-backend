import nodemailer from "nodemailer"

const SendEmail = async (options) => {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'sil3aty@outlook.com',
        pass: '15hhhNemi7@@@@',
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });
  
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'sil3aty@outlook.com', // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
    });
  
    console.log('Message sent: %s', info.messageId);
  };
  
  export default SendEmail;
  




