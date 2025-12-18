// Helper function to replace AWS SES email sending pattern
// Usage: Replace AWS SES code blocks with this function call

const emailService = require('./emailService');

async function sendEmailWithMock(params) {
    try {
        const result = await emailService.sendEmail(params);
        return Promise.resolve(result);
    } catch (err) {
        return Promise.reject(err);
    }
}

module.exports = sendEmailWithMock;

