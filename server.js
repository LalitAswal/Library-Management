import express, { urlencoded } from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// routes list start
import user from "./routes/user.routes.js";
// routes end

dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("welcome to server")
    console.log(req.ip)
})

// middle for routes
app.use('/', user)


// await connect(DB_NAME);


const PORT = process.env.PORT || 8000


sequelize.sync({force:false}).then(()=>{
    console.log('Database & table created!')
}).catch(err =>{
    console.error('unable to create table, shutting down ...')
})


app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`)
})