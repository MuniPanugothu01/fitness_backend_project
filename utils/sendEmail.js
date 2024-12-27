import { text } from 'express';
import nodeMailer from 'nodemailer';



export const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST, // SMPT -- simple mail transfer protocal
        port: process.env.SMPT_PORT,  
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: `${options.message} \n\nEmail of user Who sent The Message: ${options.userEmail}`
    };
    await transporter.sendMail(mailOptions);
}