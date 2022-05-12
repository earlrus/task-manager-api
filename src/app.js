const express=require('express')
require('./db/mongoose')
const path=require('path')
const cors=require('cors')

const UserRouter=require('./router/user')
const TaskRouter=require('./router/task')


console.log(path.join(__dirname,'../public'));
const app=express();
const publicDirectory=path.join(__dirname,'../public')

app.use(express.static(publicDirectory))
app.use(express.json());


app.use(UserRouter);
app.use(TaskRouter);
app.use(cors())









module.exports=app;

