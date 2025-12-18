// Mock email service for Docker setup
// Replaces AWS SES with console logging

class EmailService {
  async sendEmail(params) {
    return new Promise((resolve, reject) => {
      try {
        const recipients = params.Destination.ToAddresses.join(', ');
        const subject = params.Message.Subject.Data;
        const body = params.Message.Body.Html ? params.Message.Body.Html.Data : params.Message.Body.Text.Data;
        
        console.log('='.repeat(80));
        console.log('EMAIL SENT (Mock Service)');
        console.log('='.repeat(80));
        console.log('From:', params.Source);
        console.log('To:', recipients);
        console.log('Subject:', subject);
        console.log('Body:', body.substring(0, 200) + '...');
        console.log('='.repeat(80));
        
        // Simulate successful email send
        resolve({
          MessageId: `mock-${Date.now()}@baylit.local`
        });
      } catch (err) {
        console.error('Email service error:', err);
        reject(err);
      }
    });
  }
}

module.exports = new EmailService();

