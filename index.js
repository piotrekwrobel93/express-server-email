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

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET 
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2( CLIENT_ID, CLIENT_SECRET, REDIRECT_URI )

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const mailTemaplate =  ( name, message, email) => `
    <h1 style="color: #ff3e00">You have new massage from protfolio website</h1> 
    <p>From: <span style="text-transform: uppercase">${name}</span></p>
    <code>
        ${message}
    </code>
    <br />
    <h3>Contact details</h3>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
`

const confirmationTemplate = ( name ) =>  `
    <h1 style="padding: 10px 0">Thank you  <span style="text-transform: uppercase">${name}</span>! I got your message</h1>
    <h4 style="color:  #ff3e00">Peter Sparrow Portfolio</h4>
    I will be back to you as soon as possible <br />
    If you could let me know how did you like my portfolio <a href="#" style="color: #ff3e00;">here.</a>
    <br />
    See you soon!
    <br />
    <br />
    <br />
    <img width="100" height="100" src="https://lh3.googleusercontent.com/proxy/g_FbLSiP10bvXVcdCpX_Zesl9_6Q5QHQw87Q4Ktm7jO3vnXqnj1DCZ2nzrZQWr2cxmRdV8_YxR2fFjvpgGkTJOXVf20gw145G5yEhMhUgMl35JUv-37yO1nAmH6ekQeMEi3ttuYm9TNfGnjHlgGjx6Au1oqHaRQSAqGksZ3W" alt="sparrow" />
    Website: https://peter-sparrow.dev
    <br />

    Email: piotrekwrobel93@gmail.com
    <br />

    Telephone: 07412 290 264
    <br />
    Github: https://github.com/piotrekwrobel93
`

async function sendMail( reciever, template ) {
        const ACCESS_TOKEN = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MYEMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: ACCESS_TOKEN
            }
        })


        const mailOptions = {
            from: `Peter Sparrow <${process.env.MYEMAIL}>`,
            to: reciever,
            subject: "Portfolio Contact Submition",
            text: template,
            html: template
        }

        const mailResult = await transport.sendMail( mailOptions )
        return mailResult
}

app.get('/', (req, res) => res.send("hello there :)"))
app.get('/test', (req,res) => res.send("this is test!"))

app.post("/sendMail", ( req, res) => {
    const { name, email, message } = req.body
    try {
        sendMail(process.env.__EMAIL__, mailTemaplate(name, message, email)).then( res => console.log("EMAIL SENTO TO MYSELF WITH DETAILS --------- [SENT]", res))
        sendMail(email, confirmationTemplate( name )).then( res => console.log("EMAIL SENT TO CONTACT PERSON WITH CONFIRMATION --------- [SENT]", res))
        // 
        res.status(200).send({status:'ok'})
    } catch ( err ) {
        res.status(500).send({status:'error'})
        console.log( err )
    }
})


app.listen( process.env.PORT || 5000, () => console.log("back-end is running on port:", process.env.PORT))