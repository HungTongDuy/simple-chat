const mailgun = require('../config/mailgun');

exports.sendContactForm = (req, res, next) => {
    const fromText = `${req.body.first_name} ${req.body.last_name} ` +
        `<${req.body.email}>`;

    const message = {
        subject: req.body.subject,
        text: req.body.message
    };

    mailgun.contactForm(fromText, message);

    return res.status(200).json({
        message: 'Your email has been sent. We will be in touch with you soon.'
    });
};