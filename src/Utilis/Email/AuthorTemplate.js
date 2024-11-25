const emailHeader = `<div style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
                     <h1 style="margin: 0;">Crown Publications</h1>
                     <p style="margin: 10px 0 0 0;">Welcome to our newsletter!</p>
                     </div>`;

const emailFooter = `<div style="background-color: #f2f2f2; padding: 20px; text-align: center;">
                     <p style="margin: 0;">&copy; 2024 crown. All rights reserved.</p>
                     <p style="margin: 5px 0 0 0;">Address: East jail road , Ranchi </p>
                     <p style="margin: 5px 0 0 0;">Owner EMail: amitaryacp@gmail.com</p>
                     </div>`;


const AuthorEmail = ({authorName , position , email , contactNumber , topic , title , description , previousWork }) => {
    return {
      subject: "Author Received",
      html: `
        ${emailHeader}
        <div style="padding: 20px;">
              <p>Hi Crown,</p>
              <p>You got a bulk order request from:</p>
              <ul>
                <li><strong>Author Name:</strong> ${authorName}</li>
                <li><strong>Position:</strong> ${position}</li>
                <li><strong>Topic:</strong> ${topic}</li>
                <li><strong>Title:</strong> ${title}</li>
                <li><strong>Description:</strong> ${description}</li>
                <li><strong>PreviousWork:</strong> ${previousWork}</li>
                <li><strong>Contact Number:</strong> ${contactNumber}</li>
                <li><strong>Email:</strong> ${email}</li>
              
              </ul>
        </div>
        ${emailFooter}
      `,
    };
  };
  
module.exports = {
    AuthorEmail,
};