const express = require('express')
const router = express.Router()
const EventInfo = require('../dataBase/eventsinfo')

router.get('/get-events', async (req, res, next) => {
    var dt = new Date()
    // let query = {approved:true , date: { $gte: dt }}
    let query = {}
    console.log('query:', req.query)

    if (req.query.category) {
        query["category"] = req.query.category
    }
    if (req.query.game) {
        query["game"] = req.query.game
    }
    if (req.query.shareWithCommunity) {
        query["shareWithCommunity"] = req.query.shareWithCommunity
    }

    EventInfo.find(query).then(data => {
        res.json(data)
    })
        .catch((err) => {
            return res.send({ "error": "user not found" });
        })

})


router.post('/create-event', async (req, res, next) => {
    const { title, description, teamOneAddress, teamTwoAddress, teamOneName, teamTwoName,
        shareWithCommunity, date, game, category, teamOneIcon, teamTwoIcon, banner } = req.body;

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
            console.log("err ", err);
            return res.send(err);
        });
});
router.get('/wallet-connect/', async (req, res, next) => {
    console.log("wallet connect")
    const { title, description, teamOneAddress, teamTwoAddress, teamOneName, teamTwoName,
        shareWithCommunity, date, game, category, teamOneIcon, teamTwoIcon, banner } = req.params;

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
            console.log("err ", err);
            return res.send(err);
        });
});

module.exports = router;