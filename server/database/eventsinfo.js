const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const EventInfoSchema = new Schema({
    team1:{
        type:Object,
        required: true,
        minimize: false
    },
    team2:{
        type:Object,
        required: true,
        minimize: false
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
    teamOneTickets :{
        type:Number,
        required: true
    },
    teamTwoTickets :{
        type:Number,
        required: true
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
        required: true,
        minimize: false
    },
    likes:{
        type:Object ,
        required: true,
        minimize: false
    },
    
},{timestamps:true, minimize: false});
//s

EventInfoSchema.index({title: 'text', category:"text", game:"text"});
const EventInfo = mongoose.model('EventsInfo', EventInfoSchema);

module.exports = EventInfo;