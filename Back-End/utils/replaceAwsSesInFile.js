// Utility script to replace AWS SES email sending with mock service
// This shows the pattern to replace in handler files

/*
REPLACE THIS PATTERN:

        var AWS = require('aws-sdk');
        AWS.config.update({
            accessKeyId: process.env.EC2_ACCESS_KEY,
            secretAccessKey: process.env.EC2_SECRET_KEY,
            region: 'eu-west-3',
          })

        // Create sendEmail params 
        var params = {
        Destination: { 
            ToAddresses: [...]
        },
        Message: { 
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: mail_body
                }
            },
            Subject: {
            Charset: 'UTF-8',
            Data: 'Subject here'
            }
        },
        Source: 'source@baylit.store'
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
        });

WITH THIS:

        const emailService = require('../utils/emailService');
        
        var params = {
        Destination: { 
            ToAddresses: [...]
        },
        Message: { 
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: mail_body
                }
            },
            Subject: {
            Charset: 'UTF-8',
            Data: 'Subject here'
            }
        },
        Source: 'source@baylit.store'
        };

        try {
            const result = await emailService.sendEmail(params);
            console.log('Email sent (mock):', result.MessageId);
        } catch (err) {
            console.error('Error sending email:', err);
        }
*/

module.exports = {};

