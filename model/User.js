const mongoose = require('mongoose');
const express = require('express');

const {Schema} = mongoose;


const userSchema = new Schema({
    email : {type: String,required:true,unique:true},
    password : {type: String,required:true},
    role : {type: String,required:true,default:'user'},
    addresses : {type: [Schema.Types.Mixed]},
    name : {type:String },
    orders : {type: [Schema.Types.Mixed] },
})
const virtual = userSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,res){
        delete res._id
    }
})

module.exports = mongoose.model('User', userSchema);
 