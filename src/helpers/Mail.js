import nodemailer from 'nodemailer';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';
import hbsConfig from '../config/hbs';

class Mail {
    constructor() {
        const {host, port, secure, auth} = mailConfig;

        this.transporter = nodemailer.createTransport({
            host, port, secure, auth
        });

        this.configureTemplates();
    }

    configureTemplates() {
        this.transporter.use(
            'compile', 
            nodemailerhbs(hbsConfig)
        )
    }

    sendMail(data) {
        this.transporter.sendMail(data);
    }
}

export default new Mail()