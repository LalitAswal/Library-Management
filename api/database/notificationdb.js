import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userdb.js';

const Notification = sequelize.define(
  'firebase',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    firebaseToken: {
      type: DataTypes.STRING,
    },
    device_id: {
      type: DataTypes.STRING,
    },
    platform: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('member', 'librarian'),
      defaultValue: 'member',
      allowNull: false,
    },
  },
  {
    tableName: 'Notification',
    timestamps: true,
  }
);

export default Notification;
