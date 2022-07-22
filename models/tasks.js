'use strict'
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // tasks
      Tasks.belongsTo( Users, {
        foreignKey: "users_id",
        as: "tasks"
      })

    }
  }
  Tasks.init({
    tasks_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dateAssigned: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
  }, {
    sequelize,
    modelName: 'Tasks',
    tableName: 'tasks',
    timestamps: false
  })
  return Tasks
}