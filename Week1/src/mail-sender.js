const fs = require('fs');
const nodemailer = require('nodemailer');

module.exports = {
    mailSender: function(req, res) {
        fs.readFile('./views/mailer.html', (err, data) => {
            if (err) throw err;
            res.write(data);
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    body = body.split('=')[1];
                    body = decodeURIComponent(body);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'clonevh2@gmail.com',
                            pass: 'vezazfzbanixocaa'
                        }
                    });
    
                    var mailOptions = {
                        from: 'clonevh2@gmail.com',
                        to: `${body}`,
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };
    
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                });
            }

            res.end();
        });
    }
}