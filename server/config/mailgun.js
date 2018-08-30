const config = require('./main');
const mailgun = require('mailgun-js')({
    apiKey: config.mailgun_priv_key,
    domain: config.mailgun_domain
});

exports.sendEmail = (recipient, message) => {
    const data = {
        from: 'tongduyhung9x@gmail.com',
        to: recipient,
        subject: message.subject,
        text: message.text
    }

    mailgun.messages().send(data, (err, body) => {
        console.log(body);
    })
};

exports.contactForm = function (sender, message) {
    const data = {
        from: sender,
        to: 'you@yourdomain.com',
        subject: message.subject,
        text: message.text
    };

    mailgun.messages().send(data, (error, body) => {
        //  console.log(body);
    });
};