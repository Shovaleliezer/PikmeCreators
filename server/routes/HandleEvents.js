const express = require('express')
const router = express.Router()
const EventInfo = require('../dataBase/eventsinfo')

router.get('/get-events', async (req, res, next) => {
    var dt = new Date()
    // let query = {approved:true , date: { $gte: dt }}
    let query = {}
    console.log('query:', req.query.search)

    if(req.query.search  ){
        let posWord = req.query.search
        for (var i = 0; i < req.query.search.length; i++) {
          let posLetter = req.query.search.replace(req.query.search[i],'');
          posWord += " " + posLetter;
        }
        console.log("end word ",posWord)
        let r = await EventInfo.find({ $text: { $search: posWord, $caseSensitive:false, } } )
        return res.json(r)
    }

    EventInfo.find(query).then(data => {
        return res.json(data)
    })
        .catch((err) => {
            return res.send({ "error": "user not found" });
        })
})
/*
router.get("/get-events", async (req, res) => {
    let query = {}
    try{console.log("test ", req.query.search )}
    catch{console.log("notfound")}
    try {
        
      if (req.query.search) {
        let results;
        if (req.query.search.includes(",") || req.query.search.includes(" ")) {
          results = await EventInfo.aggregate([
              {
                $search: {
                  index: "autocomplete",
                  autocomplete: {
                    query: "fifa",
                    path: "game",
             
                    tokenOrder: "any",
                  },
                },
              },
           
             
            ])
  
          return res.send(results);
        }
  
        results =  await EventInfo.aggregate([
            {
              $search: {
                index: "autocomplete",
                autocomplete: {
                  query: "fifa",
                  path: "game",
                  tokenOrder: "any",
                },
              },
            },
            
     
          ])
          
          console.log("r ", results)
        return res.send(results);
      }

      EventInfo.find(query).then(data => {
        return res.json(data)
    })
        .catch((err) => {
            return res.send({ "error": "user not found" });
        })
    } catch (error) {
      console.error(error);
      res.send([]);
    }
  });

*/
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