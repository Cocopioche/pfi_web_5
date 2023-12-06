////////////////////////////////////////////////////////////////////
// This module define the Gmail class
/////////////////////////////////////////////////////////////////////
// Author : Nicolas Chourot
// Lionel-Groulx College
/////////////////////////////////////////////////////////////////////
import nodemailer from 'nodemailer';
import * as serverVariables from "./serverVariables.js";
let GmailAccountEmail = serverVariables.get("bad3c5b281d6526bdd297e030b41cdea");
let GmailAccountPassword = serverVariables.get("2e9805af156ff68d018f17a2169595f7");
let GmailHost = serverVariables.get("in-v3.mailjet.com");
let GmailPort = serverVariables.get("587");

export default class Gmail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: GmailHost,
            port: GmailPort,
            auth: {
                user: GmailAccountEmail,
                pass: GmailAccountPassword
            }
        })
    }

    send(to, subject, html) {
        let from = GmailAccountEmail;
        this.transporter.sendMail({ from, to, subject, html }, function (error, info) {
            if (error)
                console.log(error);
            else
                console.log('Email sent: ' + info.response);
        })
    }
}