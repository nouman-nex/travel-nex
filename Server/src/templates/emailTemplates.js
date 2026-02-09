const layout = (content) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e4; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">CFD Travels</h1>
    </div>
    <div style="padding: 30px; color: #333; line-height: 1.6;">
      ${content}
    </div>
    <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
      © ${new Date().getFullYear()} CFD Travels. All rights reserved.
    </div>
  </div>
`;

exports.contactAdminTemplate = (name, email, message) =>
  layout(`
  <h2 style="color: #1f2937;">New Inquiry Received</h2>
  <p><strong>From:</strong> ${name} (${email})</p>
  <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 10px;">
    ${message}
  </div>
`);

exports.contactUserTemplate = (name) =>
  layout(`
  <h2 style="color: #1f2937;">Hi ${name},</h2>
  <p>Thanks for reaching out! We've received your message and our team will get back to you shortly.</p>
  <p>In the meantime, feel free to check out our FAQ page for quick answers.</p>
`);

exports.partnerAdminTemplate = (data) =>
  layout(`
  <h2 style="color: #1f2937;">New Partner Application</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Agency:</strong></td><td>${data.company}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Contact:</strong></td><td>${data.name}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Region:</strong></td><td>${data.primaryRegion}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td>${data.phone}</td></tr>
  </table>
`);
