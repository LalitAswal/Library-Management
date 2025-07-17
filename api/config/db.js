import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const database =
  'postgresql://neondb_owner:4JrXZ2lmYbaG@ep-royal-heart-a1t9mgz7.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const sequelizeDB = new Sequelize(process.env.DB_URL || database, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

sequelizeDB
  .sync({ alter: true })
  .then(() => {
    console.log('📦 Database models synced');
  })
  .catch((err) => {
    console.error('❌ Error syncing models:', err);
  });

export default sequelizeDB;
