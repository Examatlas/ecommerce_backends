const { sendEmail } = require("./email");
const BulkOrderTemplate = require("./BulkOrderTemplate");

module.exports.mailPayload = (template_id, payload) => {
    let template;
  
    switch (template_id) {
      case "Bulk_Order_Request":
        console.log("Matching Bulk_Order_Request template"); 
        template = BulkOrderTemplate.BulkOrderEmail(payload);
        break;
  
      default:
        console.log("Default Case: No matching template");
        return; // Prevent sending email without a valid template
    }
  
    if (!template) {
      console.log("Template generation failed"); // Debugging
      return;
    }
  
    let mailPayload = {
      from: process.env.EMAIL_USERNAME,
      to: payload.email,
      cc: payload?.cc || [],
      subject: template.subject,
      html: template.html,
    };
  
    sendEmail(mailPayload);
  };
  