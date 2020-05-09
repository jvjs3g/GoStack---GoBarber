import nodemailer from 'nodemailer';
import { resolve } from 'path'
import mailConfig from '../config/mail';
import exphbs from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'
class Mail{
  constructor(){
    const { service , auth } =  mailConfig;
    this.transporter = nodemailer.createTransport({
     service,
     auth,
    });
    this.configureTemplates();
  }

  configureTemplates(){
    const viewPath = resolve(__dirname, '..' ,'app','views','emails'); 

    this.transporter.use('compile',nodemailerhbs({
      viewEngine:exphbs.create({
        layoutsDir: resolve(viewPath , 'layouts'),
        partialsDir: resolve(viewPath , 'partials'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extName: '.hbs',
    }));
  }

  sendMail(message){
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}
export default new Mail();

