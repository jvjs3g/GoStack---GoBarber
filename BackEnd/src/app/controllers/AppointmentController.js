import * as Yup from 'yup';
import {startOfHour , parseISO , isBefore , format , subHours} from 'date-fns';
import pt from 'date-fns/locale/pt'
import Appointment from '../models/Appointment'; 
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';
class AppointmentController{

  async index(request,response){

    const { page = 1 } = request.query;
    const appointments = await Appointment.findAll({
      where:{ user_id:request.userId, canceled_at:null},
      order:['date'],
      attributes:['id','date','past','cancelable'],
      limit:20,
      offset:(page - 1) * 20,
      include:[
        {
          model:User ,
          as:'provider', 
          attributes:['id','name'],
          include:[
            {
              model:File,
              as:'avatar',
              attributes:['id','path','url'],
            }
          ]
        }
      ]
    });

    return response.json(appointments);
  }

  async store(request,response){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if(!(await schema.isValid(request.body))){
      return response.status(400).json({ error: 'validation fails' });
    }

    const { provider_id , date } = request.body;

    const isProvider = await User.findOne({
      where: { id : provider_id, provider:true },
    });
    
    if(!isProvider){
      return response.status(401).json({error:'You can only create appointment with providers'})
    }

    /**
     * Check for past dates
     */

    const  hourStatrt =  startOfHour(parseISO(date));

    if(isBefore(hourStatrt , new Date())){
      return response.status(400).json({ error:'Past dates are not permitted'});
    }


    /**
     * Check date availability
     */

    const checkAvailability = await Appointment.findOne({
      where:{
        provider_id,
        canceled_at:null,
        date: hourStatrt,
      },
    });

    if(checkAvailability){
      return response.status(400).json({ error:'Appointment date is not available' });
    }

    /**
     * check if user is different
     */

     if(request.userId == provider_id){
       return response.status(401).json({error:'You can not make an appointment with yourself'})
     }
    const appointment = await Appointment.create({
      user_id:request.userId,
      provider_id,
      date,
    });

  /**
   * Notify appointment provider
   */
   const user = await User.findByPk(request.userId);

   const formattedDate = format(
     hourStatrt,
     "'dia' dd 'de' MMMM', ás 'H:mm'h'",
     {locale:pt}
   );

   await Notification.create({
     content:`Novo agendamento de ${user.name} para ${formattedDate}`,
     user:provider_id,
   });
    return response.json(appointment); 
  }

  async delete(request,response){
    const appointment = await Appointment.findByPk(request.params.id , {
      include:[
        {
          model: User , 
          as:'provider',
          attributes:['name','email'],
        },
        {
          model: User,
          as: 'user',
          attributes:['name'],
        },
      ],
    });


    if(appointment.user_id != request.userId){
      return response.status(401).json({
        error:"You don't have permission to cancel this appointment."
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if(isBefore(dateWithSub, new Date())){
      return response.status(401).json({
        error:'You can only cancel appointment 2 hours in advance.'
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return response.json(appointment);
  }
}
export default new AppointmentController();