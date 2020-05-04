import Sequelize , { Model } from 'sequelize';

class file extends Model{
  static init(sequelize){
    super.init({
      name:Sequelize.STRING,
      path:Sequelize.STRING,
      url:{
        type:Sequelize.VIRTUAL,
        get(){
          return `http://localhost:3331/files/${this.path}`;
        }
      }
      
    },
    {
      sequelize,
    }
    );
    return this;
  }

 
}

export default file;