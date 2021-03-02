import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
// 
// 
const app = express()

app.use(cors())
app.use(express.json())



const templateToClient = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <title>Peter Sparrow - Email Confirmation</title>
</head>
<body bgcolor="FFFFFF" style="text-align: center; font-family: 'Poppins', sans-serif; color: #222222;">
        <h1 style="font-size: 3em; font-weight: normal; color: #222222 !important;">Thank you!</h1>
        <p style="color: #222222 !important">I will get back to you very soon!</p>
        <a style="color: #ffffff !important; background-color: #ff3e00;padding: 10px 20px; border: none;
            border-radius: 5px;-webkit-border-radius: 5px;-o-border-radius: 5px;-moz-border-radius: 5px;
        " href="https://sparrow-test.netlify.app/">Visit Website</a>
        <p style="margin-top:5rem; font-style: italic; color: #999">Peter Sparrow - Portfolio</p>
</body>
</html>
`
const templateToMe = (name, email, message) => `
    <div>
        <h1>You have new message from ${name}</h1>
        <br />
        <pre style="color: #000 !important;padding: 10px;">
            ${message}
        </pre>
        <br />
        <h3>Details</h3>
        <p>Name: ${name}</p>
        <p>Email: <span>${email}</span></p>
    </div>
    `
function sendMail( client, template ) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MYEMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.MYEMAIL,
        to: client,
        subject: 'Peter Sparrow - Thank you!',
        html: template
    }


    transporter.sendMail( mailOptions, function(err, data) {
        if (err) { return console.log("error occured: ", err) }
        console.log("Email sent!", data)
    })
}



app.post("/sendMail", ( req, res) => {
    const { name, email, message} = req.body
    sendMail(email, templateToClient())
    sendMail(process.env.MYEMAIL, templateToMe(name, email, message))
    res.send({sended: true, reciever: email}).status(200)
})


app.listen( process.env.PORT || 5000, () => console.log("back-end is running on port:", process.env.PORT))