const  $usuario = 'gobarberbr@gmail.com';
const  $senha = '#x2020x#'; 
export default{
  service: 'gmail',
  auth: {
      user: $usuario,
      pass: $senha
  },
  default:{
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  }
}