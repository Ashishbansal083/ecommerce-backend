const mongoose = require('mongoose');
const express = require('express');

const {Schema} = mongoose;

const cartSchema = new Schema({
    quantity : {type: Number,required:true},
    product :{type:Schema.Types.ObjectId,ref:'Product',required:true},  
    user :{type:Schema.Types.ObjectId,ref:'User',required:true}  
})

const virtual = cartSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
cartSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,res){
        delete res._id
    }
})

module.exports = mongoose.model('Cart', cartSchema);
 