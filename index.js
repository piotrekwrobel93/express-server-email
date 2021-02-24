import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'
dotenv.config()
// 
// 
const app = express()

app.use(cors())
app.use(express.json())



const templateToClient = (name) => `
    <div>
        <h1>Thank you ${name}</h1>
        <br />
        <h4>I recieved your message and will get back to you ASAP.</h4>
        <h4>Please review my website so i know what other thinks about it and how to improve it</h4>
        <h4>https://sparrow-test/review</h4>
        <br />
        <h5>Details:</h5>
        <p>Name: Piotr Wrobel (Peter Sparrow)</p>
        <p>Contact Number: 07521 220 446</p>
        <p>Email: <span>${process.env.MYEMAIL}</span></p>
        <p>GitHub: https://github.com/piotrekwrobel93</p>
        <p>Website: https://sparrow-test.netlify.app</p>
    </div>
    `
const templateToMe = (name, email, message) => `
    <div>
        <h1>You have new message from ${name}</h1>
        <br />
        <pre style="background-color: #ccc; color: #000;padding: 10px;">
            ${message}
        </pre>
        <br />
        <h5>Details:</h5>
        <p>Name: ${name}</p>
        <p>Email: <span>${email}</span></p>
    </div>
    `
function sendMail( client, template ) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MYEMAIL,
            pass: 'konradek2'
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
    sendMail(req.body.email, templateToClient(name))
    sendMail(process.env.MYEMAIL, templateToMe(name,email,message))
    res.send({isOK: true, reciever: req.body.email}).status(200)
})


app.listen( process.env.PORT || 5000, () => console.log("back-end is running on port:", process.env.PORT))