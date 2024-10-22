const { sendEmail } = require("./email");
const EmailTemplate = require("./emailTemplate");

module.exports.mailPayload = (template_id, payload) => {
  let template;
  switch (template_id) {
    case "create_account":
      console.log("hiiiiiiiii create account");
      template = EmailTemplate.congratulationEmail(payload);
      break;
    case "forgot_password_link":
      template = EmailTemplate.forgotPasswordEmail(payload);
      break;
    case "password_reset_confirmation":
      template = EmailTemplate.passwordResetConfirmation(payload);
      break;

    default:
      console.log("default Case");
      break;
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