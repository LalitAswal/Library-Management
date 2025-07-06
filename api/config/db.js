// import { Sequelize } from "sequelize";
// console.log('process.env.DATABASE_URL',process.env.DATABASE_URL)
// const database = "postgresql://neondb_owner:4JrXZ2lmYbaG@ep-royal-heart-a1t9mgz7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
// const sequelize = new Sequelize(process.env.DATABASE_URL ||database, {
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch((error) => {
//     console.error('Unable to connect to the database:', error);
//   });

// export default sequelize;

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const database = "postgresql://neondb_owner:4JrXZ2lmYbaG@ep-royal-heart-a1t9mgz7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"



const sequelizeDB = new Sequelize(process.env.DB_URL || database,  {
  dialect: "mysql", 
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, 
});



sequelizeDB.sync({ alter: true })
  .then(() => {
    console.log("📦 Database models synced");
  })
  .catch((err) => {
    console.error("❌ Error syncing models:", err);
  });


export default sequelizeDB;
