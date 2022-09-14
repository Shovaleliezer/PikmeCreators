const express = require('express')
const router = express.Router()
const EventInfo = require('../dataBase/eventsinfo')


router.get('/blah', async (req, res, next ) => {
    console.log("here")
    return res.send("hello")
}); 

router.get('/get-events', async (req, res, next ) => {
    var dt = new Date();
    let query = {approved:true , date: { $gte: dt }}

    if(req.body.game) 
        {
            query["game"] = req.body.game
        }
    if(req.body.category) 
        {
            query["category"] = req.body.category
        }
    if(req.body.shareWithCommunity) 
        {
            query["shareWithCommunity"] = req.body.shareWithCommunity
        }
    

    EventInfo.find(query).then(data => {
        return res.json(data);
    })
    .catch((err) => {
        return res.send({"error":"user not found"});
    });
    
}); 

router.post('/create-event', async (req, res, next ) => {
    console.log("here")
    const {title, description, teamOneAddress, teamTwoAddress, teamOneName, teamTwoName,
         shareWithCommunity, date, game, category, teamOneIcon, teamTwoIcon, banner} = req.body;

    const eventInfo = new EventInfo({
        title,
        description,
        teamOneAddress,
        teamTwoAddress,
        teamOneName,
        teamTwoName,
        shareWithCommunity,
        date,      
        game,
        category,
        teamOneIcon,
        teamTwoIcon,
        banner,
        approved: false
       
    });
    await eventInfo.save().then((result) => {
        return res.send(result);
    })
    .catch((err) => {
        console.log("err " , err);
        return res.send(err);
        });
    });
    router.get('/wallet-connect/', async (req, res, next ) => {
        console.log("wallet connect")
        const {title, description, teamOneAddress, teamTwoAddress, teamOneName, teamTwoName,
             shareWithCommunity, date, game, category, teamOneIcon, teamTwoIcon, banner} = req.body;
    
        const eventInfo = new EventInfo({
            title,
            description,
            teamOneAddress,
            teamTwoAddress,
            teamOneName,
            teamTwoName,
            shareWithCommunity,
            date,      
            game,
            category,
            teamOneIcon,
            teamTwoIcon,
            banner,
            approved: false
           
        });
        await eventInfo.save().then((result) => {
            return res.send(result);
        })
        .catch((err) => {
            console.log("err " , err);
            return res.send(err);
            });
        });
     
module.exports = router;