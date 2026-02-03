import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { USER_ROLE, DEFAULT_USER_ROLE } from '../../constants.js';

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
    },

    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DEFAULT_USER_ROLE,
      validate: {
        isIn: [Object.values(USER_ROLE)],
      },
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'user',
    timestamps: true,
  }
);

export default User;
