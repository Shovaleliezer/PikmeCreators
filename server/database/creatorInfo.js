const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema



const CreatorsInfoSchema = new Schema({
    nickName :{
        type:String,
        required: true,
    },
    image :{
        type:String,
        required: true
    },
    creatorEvents :{
        type:Object,
        required: true
    },
    creationDate:{
        type:Date,
        required: true
    },
    walletAddress:{
        type:String,
        required: true
    },
    approvedCreator:{
        type:Boolean,
        required: true
    },
    socialLink: {
        type:String,
        required: true
    },
    proficiencyGame: {
        type:String,
        required: true
    },
    topAchievement: {
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    region:{
        type:String,
        required: true
    },
    experience:{
        //this is the starting year of the creator
        type:Date,
        required: true
    }


    
},{timestamps:true});
//s

const CreatorsInfo = mongoose.model('CreatorsInfo', CreatorsInfoSchema);

module.exports = CreatorsInfo;
