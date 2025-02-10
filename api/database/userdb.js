// models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "user",
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
    // email: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    token: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("member", "librarian"),
      defaultValue: "member",
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

export default User;

