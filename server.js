import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import cors from 'cors';

// routes list start
import user from "./routes/user.routes.js";
import book from "./routes/books.routes.js";
// routes end

dotenv.config()

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("welcome to server")
    console.log(req.ip)
})

// middleware for routes
app.use('/user', user)
app.use('/book', book)



const PORT = process.env.PORT || 8000


sequelize.sync({force:false}).then(()=>{
    console.log('Database & table created!')
}).catch(err =>{
    console.error('unable to create table, shutting down ...', err)
})


app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`)
})