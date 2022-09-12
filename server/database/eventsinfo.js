const express = require('express');


const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const EventInfoSchema = new Schema({
    title :{
        type:String,
        required: true,
    },
    description :{
        type:String,
        required: true
    },
    teamOneAdress :{
        type:String,
        required: true
    },
    teamTwoAdress :{
        type:String,
        required: true
    },
    teamOneName :{
        type:String,
        required: true
    },
    teamTwoName :{
        type:String,
        required: true
    },
    shareWithCommunity:{
        type:Boolean,
        required: true
    },
    date:{
        type:Date,
        required: true
    },
    game :{
        type:String,
        required: true
    },
    category  :{
        type:String,
        required: true
    },
    teamOneIcon:{
        type:String,
        required: true,
        
    },
    teamTwoIcon:{
        type:String,
        required: true,
        
    },
    banner:{
        type:String,
        required: true,
        
    },
    
},{timestamps:true});
//s

const EventInfo = mongoose.model('EventsInfo', EventInfoSchema);

module.exports = EventInfo;