const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const EventInfoSchema = new Schema({
    player1:{
        type:Object,
        required: true
    },
    player2:{
        type:Object,
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
        required: true
    },
    likes:{
        type:Object ,
        required: true
    },
    
},{timestamps:true});
//s

EventInfoSchema.index({title: 'text', category:"text", game:"text"});
const EventInfo = mongoose.model('EventsInfo', EventInfoSchema);

module.exports = EventInfo;