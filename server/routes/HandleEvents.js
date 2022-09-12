const express = require('express')
const router = express.Router()
const EventInfo = require('../dataBase/eventsinfo')


router.get('/blah', async (req, res, next ) => {
    console.log("here")
    return res.send("hello")
}); 

router.post('/create-event', async (req, res, next ) => {
    console.log("here")
    const title = req.body.title
    const description = req.body.description
    const teamOneAddress = req.body.teamOneAddress;
    const teamTwoAddress = req.body.teamTwoAddress;
    const teamOneName = req.body.teamOneName;
    const teamTwoName = req.body.teamTwoName;
    const shareWithCommunity = req.body.shareWithCommunity;
    const date = req.body.date;
    const game = req.body.game;
    const category = req.body.category;
    const teamOneIcon = req.body.teamOneIcon;
    const teamTwoIcon = req.body.teamTwoIcon;
    const banner = req.body.banner;

    const eventInfo = new EventInfo({
        title: title,
        description: description,
        teamOneAddress: teamOneAddress,
        teamTwoAddress: teamTwoAddress,
        teamOneName: teamOneName,
        teamTwoName:teamTwoName,
        shareWithCommunity:shareWithCommunity,
        date:date,      
        game: game,
        category: category,
        teamOneIcon: teamOneIcon,
        teamTwoIcon:teamTwoIcon,
        banner:banner
       
    });
    eventInfo.save().then((result) => {
        return res.send(result);
    })
    .catch((err) => {
        console.log("err " , err);
        return res.send(err);
        });
    });
 
module.exports = router;