const emailHeader = `<div style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
                     <h1 style="margin: 0;">EXAMATLAS</h1>
                     <p style="margin: 10px 0 0 0;">Welcome to our newsletter!</p>
                     </div>`;

const emailFooter = `<div style="background-color: #f2f2f2; padding: 20px; text-align: center;">
                     <p style="margin: 0;">&copy; 2024 Your Company. All rights reserved.</p>
                     <p style="margin: 5px 0 0 0;">Address: 123 Main Street, City, Country</p>
                     <p style="margin: 5px 0 0 0;">Owner EMail: crownclassesrnc@gmail.com</p>
                     </div>`;

const forgotPasswordEmail = ({ resetURL }) => {
  return {
    subject: "Password Reset Request",
    html: `
                          ${emailHeader}
                          <div style="padding: 20px;">
                            <p>Hi,</p>
                            <p>You have requested to reset your password. Click the link below to reset your password:</p>
                            <a href="${resetURL}" style="color: #6720FF; text-decoration: underline;">
                              Reset Password
                            </a>
                            <p>This link is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
                          </div>
                          ${emailFooter}
                        `,
  };
};

const congratulationEmail = ({ email }) => {
  return {
    subject: "Welcome to EXAMATLAS!",
    html: `
      ${emailHeader}
      <div style="padding: 20px;">
            <p>Welcome, ${email}!</p>
            <p>Thank you for signing up with EXAMATLAS . We're excited to have you on board.</p>
            <p>Feel free to explore our platform and reach out to us if you have any questions.</p>
      </div>
      ${emailFooter}
   `,
  };
};




const passwordResetConfirmation = () => {
  return {
    subject: "Your Password Has Been Reset",
    html: `
      ${emailHeader}
      <div style="padding: 20px;">
            <p>Hi,</p>
            <p>Your password has been successfully reset.</p>
            <p>If you did not initiate this change, please contact support immediately.</p>
      </div>
      ${emailFooter}
   `,
  };
};
module.exports = {
  forgotPasswordEmail,
  congratulationEmail,
  passwordResetConfirmation,
};