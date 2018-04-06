const nodemailer = require('nodemailer');
const PRIVACY = require('./../privacy.json');

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: PRIVACY.MAIL.ID,
      pass: PRIVACY.MAIL.PASSWORD
  }
});

exports.sendEmail = function(data){
  var mailOptions = {
      from: PRIVACY.MAIL.ID ,
      to: 'arnold.yoo@findexchain.com',
      subject: 'mail Send Test',
      text: data
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Message sent: ' + info.response);
      }
  });
};

// usage
/**
  const mailService = require('./ionia_modules/mailService')
  mailService.sendEmail('arnold node mail test data!!')
 */