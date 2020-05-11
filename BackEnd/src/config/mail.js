export default{
  service: process.env.MAIL_HOST,
  auth: {
      user:process.env.MAIL_USER,
      pass:process.env.MAIL_PASS,
  },
  default:{
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  }
}