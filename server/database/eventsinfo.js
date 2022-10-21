const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const EventInfoSchema = new Schema({
    title :{
        type:String,
        index: true ,
        required: true,
    },
    description :{
        type:String,
        required: true
    },
    teamOneAddress :{
        type:String,
        required: true
    },
    teamTwoAddress :{
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
        index: true ,
        required: true
    },
    category  :{
        type:String,
        index: true ,
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
    teamOneTickets :{
        type:Number,
        required: true
    },
    teamTwoTickets :{
        type:Number,
        required: true
    },
    banner:{
        type:String,
        required: true,
    },
    payed:{
        type:Boolean,
        required: true
    },
    approved:{
        type:Boolean,
        required: true
    },
    viewers:{
        type:Object ,
        required: true
    }
    
},{timestamps:true});
//s

EventInfoSchema.index({title: 'text', category:"text", game:"text"});
const EventInfo = mongoose.model('EventsInfo', EventInfoSchema);

module.exports = EventInfo;