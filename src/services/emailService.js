const nodemailer = require("nodemailer");

const sendSimpleEmail = async (data) => {
    // console.log(email)
    // return
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    });
    let info = await transporter.sendMail({
        from: '"Khoa" <anhhaido28@gmail.com>', // sender address
        to: data.receiveEmail, // list of receivers
        subject: data.language == 'vi' ? "Thông tin đặt lịch khám bệnh" : "Booking appointment information", // Subject line
        html: buildHTMLBodyEmail(data)

    });

}

const sendAttachment = async (data) => {
    // console.log(email)
    // return
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    });
    let info = await transporter.sendMail({
        from: '"Khoa" <anhhaido28@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: data.language == 'vi' ? "Thông tin đặt lịch khám bệnh" : "Booking appointment information", // Subject line
        html: getBodyHTMLEmailSendAttachment(data),
        attachments: [
            {
                filename: 'Result',
                content: data.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    });

}

const buildHTMLBodyEmail = (input) => {
    let result = ''
    if (input.language == 'vi') {
        result = `
        <h3>Xin chào ${input.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên web của chúng tôi.</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${input.time}</b></div>
        <div><b>Bác sĩ: ${input.doctorName}</b></div>

        <p>Nếu thông tin trên là đúng sự thật, vui lòng click vào link dưới đây để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
        <a href=${input.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Xin chân thành cảm ơn</div>
        `
    } else {
        result = `
        <h3>Dear ${input.patientName}!</h3>
        <p>You receive this email because you booked an online medical appointment.</p>
        <p>Appoinment booking information :</p>
        <div><b>Time: ${input.time}</b></div>
        <div><b>Doctor: ${input.doctorName}</b></div>

        <p>If that was you booking it, please click the link below to confirm and complete the booking.</p>
        <div>
        <a href=${input.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Thank you</div>
        `
    }
    return result
}

const getBodyHTMLEmailSendAttachment = (input) => {
    let result = ''
    if (input.language == 'vi') {
        result = `
        <h3>Xin chào ${input.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên web của chúng tôi.</p>
        <p>Thông tin đơn thuốc, hóa đơn được gửi trong file đính kèm</p>

        <div>Xin chân thành cảm ơn</div>
        `
    } else {
        result = `
        <h3>Dear ${input.patientName}!</h3>
        <p>You receive this email because you booked an online medical appointment.</p>
        <p>Information about prescription, bill is in the attached file</p>

        <div>Thank you</div>
        `
    }
    return result
}

module.exports = {
    sendSimpleEmail, sendAttachment
}