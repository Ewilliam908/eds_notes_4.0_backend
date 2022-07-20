'use strict'
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Tasks }) {
      // tasks
      Users.hasMany(Tasks, {
        foreignKey: "users_id",
        as: "tasks"
      })

    }
  }
  Users.init({
    users_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: false
  })
  return Users
}