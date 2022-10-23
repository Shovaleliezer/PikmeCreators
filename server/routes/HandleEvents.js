const express = require('express')
const router = express.Router()
const EventInfo = require('../dataBase/eventsinfo')

router.get('/get-events', async (req, res, next) => {
  var dt = new Date()
  // let query = {approved:true , date: { $gte: dt }}
  let query = {}
  const allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const possibleMistake = "aeiuock";
  if(req.query.search  ){
      let posWord = req.query.search
      let posLetter;
      let posLetter2;
      let posLetter3;
      for (var i = 0; i < req.query.search.length; i++) {
        for (var j = 0; j < allLetters.length; j++) {
          if(i==0){
            posLetter2 = req.query.search.replace(req.query.search[i],  allLetters[j] + req.query.search[i] );
            posLetter = req.query.search.replace(req.query.search[i], req.query.search[i] + allLetters[j]);
            posWord += " " + posLetter + " " + posLetter2;
          }
          else{
            posLetter = req.query.search.replace(req.query.search[i], req.query.search[i] + allLetters[j]);
            posWord += " " + posLetter 
          }
        }
        if (possibleMistake.includes(req.query.search[i]) ){
          for (var k = 0; k < possibleMistake.length; k++) {
          posLetter3 = req.query.search.replace(req.query.search[i],  possibleMistake[k]);
          posWord += " " + posLetter3;
        }
        }
        else{
          console.log("false")
        }
        posLetter = req.query.search.replace(req.query.search[i],'');
        posWord += " " + posLetter;
    }
    let r = await EventInfo.find({ $text: { $search: posWord, $caseSensitive:false, } } )
    return res.json(r)

}
  EventInfo.find(query).then(data => {
      return res.json(data)
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
        viewers: {},
        teamOneTickets:0,
        payed:false,
        teamTwoTickets:0,
        approved: false

    })
    await eventInfo.save().then((result) => {
        return res.send(result);
    })
        .catch((err) => {
            console.log("err ", err);
            return res.send(err);
        })
})

router.post('/sell-ticket/:eventId', async (req, res, next) => {
  //let client buy ticket and fill it in the db to know what team he choose what address he has and how many tickets he got ( called when payed to the blockchain)
  // confirm it with the block chain
  const eventId = req.params.eventId
  console.log('id',eventId)
  const { teamChosen, tickets, buyerAddress} = req.body;
  let query = {}
  await EventInfo.findById( eventId).then( async data => {
    console.log(data)
  
    let newViewers = data.viewers
    if(teamChosen=="teamOne"){
      const teamOneTickets = tickets + data.teamOneTickets
      query["teamOneTickets"] = teamOneTickets
    }
    else{
      const teamTwoTickets = tickets + data.teamTwoTickets
      query["teamTwoTickets"] = teamTwoTickets
    }
    
    if(data.viewers[buyerAddress]){
      if(data.viewers[buyerAddress].teamChosen!=teamChosen){
        if(teamChosen=="teamOne"){
          const teamOneTickets = tickets + data.teamOneTickets + data.viewers[buyerAddress].tickets
          query["teamOneTickets"] = teamOneTickets
          query["teamTwoTickets"] = data.teamTwoTickets -  data.viewers[buyerAddress].tickets
         
        }
        else{
          const teamTwoTickets = tickets + data.teamTwoTickets+ data.viewers[buyerAddress].tickets
          query["teamTwoTickets"] = teamTwoTickets
          query["teamOneTickets"] = data.teamOneTickets -  data.viewers[buyerAddress].tickets
        }
      }
      newViewers[buyerAddress] = {teamChosen:teamChosen, tickets:tickets + data.viewers[buyerAddress].tickets }
    }
    else{
      newViewers[buyerAddress] = {teamChosen:teamChosen, tickets:tickets }
    }
    
    query["viewers"] = newViewers
    await EventInfo.findByIdAndUpdate(eventId, query, { new: true }).then(newData => {
      if (newData) res.send(newData)
      else res.send({ error: "event not found" }) 
  })
      .catch((err) => {
        console.log("her", err)
          return res.send({ "error": "user yss found" });
      });
    })
    .catch((err) => {
        return res.send({ "error": "user ys found" });
    });
});



router.post('/announce-winner/:eventId', async (req, res, next) => {
  //announce the winner ( make sure to check if the sender is admin)
  const eventId = req.params.eventId
  const { teamWon, ownerAddress} = req.body;
  let query = {}
  let moneyPerTicket = 0;
  let creatorOne = {}
  let creatorTwo = {}
  let owner = {}
  await EventInfo.findById( eventId).then( async data => {
    let newViewers = data.viewers
    if (teamWon == "teamOne"){
      if(data.teamOneTickets>0 && data.teamTwoTickets >0){
        moneyPerTicket = ((data.teamTwoTickets )*5*0.9 +  data.teamOneTickets*5)/data.teamOneTickets
      }
      creatorOne = {teamChosen:"teamOne", moneyWon:(data.teamTwoTickets + data.teamOneTickets)*5*0.04 }
      creatorTwo = {teamChosen:"teamOne", moneyWon:(data.teamTwoTickets + data.teamOneTickets)*5*0.01}
      owner = {teamChosen:"teamOne", moneyWon:(data.teamTwoTickets + data.teamOneTickets)*5*0.049}
    }
    else if (teamWon == "teamTwo"){
      if(data.teamOneTickets>0 && data.teamTwoTickets >0){
        moneyPerTicket = (data.teamTwoTickets*5 +( data.teamOneTickets)*5*0.9)/data.teamTwoTickets
      }
      creatorOne = {teamChosen:"teamTwo", moneyWon:(data.teamTwoTickets + data.teamOneTickets)*5*0.04 }
      creatorTwo = {teamChosen:"teamTwo", moneyWon:(data.teamTwoTickets + data.teamOneTickets)*5*0.01}
      owner = {teamChosen:"teamTwo", moneyWon:(data.teamTwoTickets + data.teamOneTickets)*5*0.049}
    }
    for (var key in newViewers) {
      if(newViewers[key].teamChosen == teamWon){
        newViewers[key] = {teamChosen:newViewers[key].teamChosen, tickets:newViewers[key].tickets, moneyWon:newViewers[key].tickets*moneyPerTicket }
      }
      else{
        newViewers[key] = {teamChosen:newViewers[key].teamChosen, tickets:newViewers[key].tickets, moneyWon:0 }
      }
    }
    newViewers[data.teamOneAddress] = creatorOne
    newViewers[data.teamTwoAddress] = creatorTwo
    newViewers[ownerAddress] = owner
    query["viewers"] = newViewers
    
    await EventInfo.findByIdAndUpdate(eventId, query, { new: true }).then(newData => {
      if (newData) res.send(newData)
      else res.send({ error: "event not found" }) 
  })
      .catch((err) => {
        console.log("her", err)
          return res.send({ "error": "user yss found" });
      });
    })
    .catch((err) => {
        return res.send({ "error": "user ys found" });
    });
});

router.get('/wallet-connect/', async (req, res, next) => {
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
router.get('/get-event/:eventId', async (req, res, next) => {
  const id = req.params.eventId
  EventInfo.find({_id:String(id)}).then(data => {
      return res.json(data[0])
})
      .catch((err) => {
          return res.send({ "error": "event not found" });
      })
})
module.exports = router;