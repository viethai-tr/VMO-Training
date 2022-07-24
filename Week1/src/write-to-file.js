const fs = require('fs');
const http = require('http');
const { parse } = require('querystring');
const formidable = require('formidable');
const mv = require('mv');

module.exports = {
    write: function (req, res, src, des) {
        fs.readFile(src, (err, data) => {
            if (err) throw err;
            res.write(data);
            if (req.method === 'POST') {
                console.log(`${res.statusCode}`);
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let bodyString = parse(body);
                    fs.appendFile(des, JSON.stringify(bodyString), err => {
                        if (err) console.log(err);
                        else {
                            console.log('wrote!');
                        }
                    })
                });

                // var form = new formidable.IncomingForm();
                // form.keepExtensions = true;
                // form.parse(req, function (err, fields, files) {
                //     var oldPath = files.uploadImage.filepath;
                //     var newPath = './img/' + files.uploadImage.originalFilename;
                //     mv(oldPath, newPath, function (err) {
                //         if (err) throw err;
                //         res.write('File uploaded and moved!');
                //         res.end();
                //     });
                // });

            }
            res.end();
        });
    }
}