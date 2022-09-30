const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema



const AccountsInfoSchema = new Schema({
    nickName :{
        type:String,
        required: true,
    },
    about :{
        type:String,
        required: true
    },
    image :{
        type:String,
        required: true
    },
    moneyWon :{
        type:Number,
        required: true
    },
    matchHistory :{
        type:Array,
        required: true
    },
    creationDate:{
        type:Date,
        required: true
    },
    walletAddress:{
        type:String,
        required: true
    }
    
    
},{timestamps:true});
//s

const AccountsInfo = mongoose.model('AccountsInfo', AccountsInfoSchema);

module.exports = AccountsInfo;