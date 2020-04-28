import Sequelize , { Model } from 'sequelize';

class file extends Model{
  static init(sequelize){
    super.init({
      name:Sequelize.STRING,
      path:Sequelize.STRING,
      
    },
    {
      sequelize,
    }
    );
    return this;
  }

 
}

export default file;