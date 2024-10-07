import { Sequelize } from "sequelize";
console.log('process.env.DATABASE_URL',process.env.DATABASE_URL)
const database = "postgresql://lalitaswal:B76CLP6S-HX5FRA0GZK-wg@day-dragon-3587.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
const sequelize = new Sequelize(process.env.DATABASE_URL ||database, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
