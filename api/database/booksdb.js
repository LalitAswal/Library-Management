import { DataTypes } from "sequelize";
import  sequelize from "../config/db.js";

const Book = sequelize.define(
  "book",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("AVAILABLE", "BORROWED"),
      defaultValue: "AVAILABLE",
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "book",
    timestamps: true,
  }
);

export default Book;
