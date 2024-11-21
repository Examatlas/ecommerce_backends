const emailHeader = `<div style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
                     <h1 style="margin: 0;">Crown Publications</h1>
                     <p style="margin: 10px 0 0 0;">Welcome to our newsletter!</p>
                     </div>`;

const emailFooter = `<div style="background-color: #f2f2f2; padding: 20px; text-align: center;">
                     <p style="margin: 0;">&copy; 2024 crown. All rights reserved.</p>
                     <p style="margin: 5px 0 0 0;">Address: East jail road , Ranchi </p>
                     <p style="margin: 5px 0 0 0;">Owner EMail: crownclassesrnc@gmail.com</p>
                     </div>`;


const BulkOrderEmail = ({ storeName, personName, location, city, state, email, contactNumber , message }) => {
    return {
      subject: "Bulk Order Received",
      html: `
        ${emailHeader}
        <div style="padding: 20px;">
              <p>Hi Crown,</p>
              <p>You got a bulk order request from:</p>
              <ul>
                <li><strong>Store Name:</strong> ${storeName}</li>
                <li><strong>Person Name:</strong> ${personName}</li>
                <li><strong>Location:</strong> ${location}, ${city}, ${state}</li>
                <li><strong>Contact Number:</strong> ${contactNumber}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
        </div>
        ${emailFooter}
      `,
    };
  };
  
module.exports = {
    BulkOrderEmail,
};