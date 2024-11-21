const { sendEmail } = require("./email");
const AuthorTemplate = require("./AuthorTemplate")

module.exports.mailPayload = (template_id, payload) => {
    let template;
  
    switch (template_id) {
      case "Author_Request":
        console.log("Matching Author_Request template"); 
        template = AuthorTemplate.AuthorEmail(payload);
        break;
  
      default:
        console.log("Default Case: No matching template");
        return; 
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
  