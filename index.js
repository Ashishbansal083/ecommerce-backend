const express = require('express');
const server = express();
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');

//middlewares
server.use(express.json());// to parse req.body  

main().catch(error=>console.log(error))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected')
}

server.get('/',(req,res)=>{
res.json({status:'runnig'})
})
server.post('/products',createProduct);

 server.listen(8080,()=>{
    console.log('app started')
})