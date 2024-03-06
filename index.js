const express = require('express');
const server = express();
const mongoose = require('mongoose');

main().catch(error=>console.log(error))

async function main(){
    await mongoose.connect('mongodb://localhost:27017/test');
    console.log('database connected')
}

server.get('/',(req,res)=>{
res.json({status:'runnig'})
})
 server.listen(8080,()=>{
    console.log('app started')
})