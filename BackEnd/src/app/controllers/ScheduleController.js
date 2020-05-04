import {startOfDay , endOfDay , parseISO } from 'date-fns'
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController{
  async index(request,response){

    const checkUserProvider = await User.findOne({
      where:{ id: request.userId , provider:true }
    });

    if(!checkUserProvider){
      return response.status(401).json({error:''});
    }

    const { date } = request.query;
    const parseDate = parseISO(date);

    const appointment = await Appointment.findAll({
      where:{
        provider_id:request.userId,
        canceled_at:null,
        date:{
          [Op.between]:[startOfDay(parseDate),endOfDay(parseDate)],
        },
      },
      order:['date'],
    });
    return response.json(appointment);
  }
}
export default new ScheduleController();