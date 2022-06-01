const express=require('express')
require('./db/mongoose')
const path=require('path')
const cors=require('cors')

const UserRouter=require('./router/user')
const OrderRouter=require('./router/order')





console.log(path.join(__dirname,'../public'));
const app=express();
const publicDirectory=path.join(__dirname,'../public')

app.use(cors({
    origin:'*'
})) 

app.use(express.static(publicDirectory))
app.use(express.json());


app.use(UserRouter);
app.use(OrderRouter);













module.exports=app;

