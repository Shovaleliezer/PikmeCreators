const express = require('express')
const router = express.Router()
const EventInfo = require('../dataBase/eventsinfo')
const Web3 = require('web3');
const ERC20TransferABI = [{"inputs":[],"name":"PRICE_PER_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"confirmCodeNumber","type":"uint256"}],"name":"buyTicket","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"confirmCode","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"sendTo","type":"address[]"},{"internalType":"uint256[]","name":"amount","type":"uint256[]"}],"name":"sendMoney","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newPrice","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newState","type":"bool"}],"name":"setSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"}]
var web3 = new Web3(new Web3.providers.HttpProvider('https://bscrpc.com'));
const daiToken = new web3.eth.Contract(ERC20TransferABI, "0xc4e7146C0446D33aBb77Cc0cABfB0689bB68182D")


//get events that are in the futrue  and not approved which both team1 and team2 are not empty objects
router.get('/get-unapproved-events', async (req, res) => {
    try {
        const events = await EventInfo.find({ date: { $gt: new Date() }, approved: false, team1: { $ne: {} }, team2: { $ne: {} } })
        res.json(events)
    } catch (err) {
        res.json({ message: err })
    }
})



router.get('/get-events', async (req, res, next) => {
  var dt = new Date()
  let query = {approved:true , date: { $gte: dt }}
  
  const allLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const possibleMistake = "aeiuock";
  console.log("here")
  try{
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
      query["$text"] = { $search: posWord };
  
      let r = await EventInfo.find(query )
      console.log("r is ", r)
      return res.json(r)
  
  }
  else{
    EventInfo.find(query).then(data => {
      return res.json(data)
  })
  }
  }catch(err){
    console.log(err)
    res.status(404).send('Something went wrong');
  }

})


router.post('/create-event', async (req, res, next) => {
  try{
    const {  team1, shareWithCommunity, date, game, category } = req.body;

    const eventInfo = new EventInfo({

        team1,
        team2:{},
        shareWithCommunity,
        date,
        game,
        category,
        viewers: {},
        likes:{},
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
            res.status(404).send('Something went wrong');
        })
  } catch(err){
    console.log(err)
    res.status(404).send('Something went wrong');
  }
    
})

// update player 2 object inside the event id that was sent from the pharams only if player2 is empty
router.put('/accept-event/:eventId', async (req, res, next) => {
  try {
    const { team2 } = req.body;
    const id = req.params.eventId;
    await EventInfo.findById(id).then((result) => {
        if (Object.keys(result.team2).length === 0) {
            result.team2 = team2;
            result.save().then((result) => {
                return res.send(result);
            })
                .catch((err) => {
                    console.log("err ", err);
                    return res.send(err);
                })
        }
        else {
            return res.status(404).send('Something went wrong');
        }
    })
        .catch((err) => {
            console.log("err ", err);
            res.status(404).send('Something went wrong');
        })
  } catch (error) {
    console.log(error)
    res.status(404).send('Something went wrong');
  } 
})


router.post('/sell-ticket/:eventId', async (req, res, next) => {
  //let client buy ticket and fill it in the db to know what team he choose what address he has and how many tickets he got ( called when payed to the blockchain)
  // confirm it with the block chain
  try{
    const eventId = req.params.eventId
    console.log('id',eventId)
    const { teamChosen, tickets, buyerAddress, confirmNumber} = req.body;
    console.log("confirmNumber: ",confirmNumber)
    let query = {}
    console.log(daiToken.methods)
    const smartConfrim = await daiToken.methods.confirmCode(buyerAddress).call()
    console.log("smartConfrim: ",smartConfrim)
    if (smartConfrim == confirmNumber){
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
        else res.status(400).send('Event not found'); 
    })
        .catch((err) => {
          console.log("her", err)
            return res.status(400).send('Event not found'); 
        });
      })
      .catch((err) => {
        res.status(404).send('Something went wrong');
      });
    }
    else{
      console.log("not the same confirm")
       res.status(404).send('Something went wrong');
    }
  }catch(err){
    console.log(err)
    res.status(404).send('Something went wrong');
  }
  
});



router.post('/announce-winner/:eventId', async (req, res, next) => {
  //announce the winner ( make sure to check if the sender is admin)
  try{
    const eventId = req.params.eventId;
    const { teamWon, ownerAddress} = req.body;
    let query = {}
    let ticketCost = 20000000000000000;
    let moneyPerTicket = 0;
    let creatorOne = {}
    let creatorTwo = {}
    let owner = {}
    await EventInfo.findById( eventId).then( async data => {
      let newViewers = data.viewers
      if (teamWon == "teamOne"){
        if(data.teamOneTickets>0 && data.teamTwoTickets >0){
          moneyPerTicket = ((data.teamTwoTickets )*ticketCost*0.9 +  data.teamOneTickets*ticketCost)/data.teamOneTickets
        }
        creatorOne = {teamChosen:"teamOne", moneyWon:(data.teamTwoTickets )*ticketCost*0.04 }
        creatorTwo = {teamChosen:"teamOne", moneyWon:(data.teamTwoTickets )*ticketCost*0.01}
        owner = {teamChosen:"teamOne", moneyWon:(data.teamTwoTickets )*ticketCost*0.05}
      }
      else if (teamWon == "teamTwo"){
        if(data.teamOneTickets>0 && data.teamTwoTickets >0){
          moneyPerTicket = (data.teamTwoTickets*ticketCost +( data.teamOneTickets)*ticketCost*0.9)/data.teamTwoTickets
        }
        creatorOne = {teamChosen:"teamTwo", moneyWon:(data.teamOneTickets)*ticketCost*0.04 }
        creatorTwo = {teamChosen:"teamTwo", moneyWon:( data.teamOneTickets)*ticketCost*0.01}
        owner = {teamChosen:"teamTwo", moneyWon:( data.teamOneTickets)*ticketCost*0.05}
      }
      else if (teamWon == "draw"){
        moneyPerTicket = ticketCost
      }
      for (var key in newViewers) {
        if(newViewers[key].teamChosen == teamWon){
          newViewers[key] = {teamChosen:newViewers[key].teamChosen, tickets:newViewers[key].tickets, moneyWon:newViewers[key].tickets*moneyPerTicket }
        }
        else if(teamWon=="draw"){
          newViewers[key] = {teamChosen:newViewers[key].teamChosen, tickets:newViewers[key].tickets, moneyWon:newViewers[key].tickets*moneyPerTicket }
        }
        else{
          newViewers[key] = {teamChosen:newViewers[key].teamChosen, tickets:newViewers[key].tickets, moneyWon:0 }
        }
      }
   
      newViewers[data.team1.walletAddress] = creatorOne
      newViewers[data.team2.walletAddress] = creatorTwo
      newViewers["0xae8B9A0e3759F32D36CDD80d998Bb18fB9Ccf53d"] = owner
      query["viewers"] = newViewers
      
      await EventInfo.findByIdAndUpdate(eventId, query, { new: true }).then(newData => {
        if (newData) {
          res.send(newData)
        }
        else res.status(400).send('Event not found');
    })
        .catch((err) => {
          console.log("her", err)
          res.status(400).send('Event not found');
        });
      })
      .catch((err) => {
        res.status(404).send('Something went wrong');
      });
  }catch(err){
    console.log(err)
    res.status(404).send('Something went wrong');
  }
  
});


// return spesific event viewers address into one list and money won into another list
router.get('/get-viewers/:eventId', async (req, res, next) => {
  try{
    const eventId = req.params.eventId;
    let viewers = []
    let moneyWon = []
    await EventInfo.findById( eventId).then( async data => {
      for (var key in data.viewers) {
        if(data.viewers[key].moneyWon > 0){
          viewers.push(key)
          moneyWon.push(data.viewers[key].moneyWon)
        }

      }
      res.send({viewers:viewers, moneyWon:moneyWon})
    })
    .catch((err) => {
      res.status(404).send('Something went wrong');
    });
  }catch(err){
    console.log(err)
    res.status(404).send('Something went wrong');
  }
});


router.post('/make-like/:eventId', async (req, res, next) => {
  //let client buy ticket and fill it in the db to know what team he choose what address he has and how many tickets he got ( called when payed to the blockchain)
  // confirm it with the block chain
  try{
    const eventId = req.params.eventId
    console.log('id',eventId)
    const { buyerAddress, didLike} = req.body;
    let query = {}
    await EventInfo.findById( eventId).then( async data => {
      console.log(data.likes)
    
      let newLikes = data.likes
    
      newLikes[buyerAddress] = didLike;
    
      query["likes"] = newLikes
      
      
      await EventInfo.findByIdAndUpdate(eventId, query, { new: true }).then(newData => {
        let countLikes = 0;
        let didLikeUser = false;
        
        if (newData) {
          for (var key in newData.likes) {
            if(newData.likes[key]){
              countLikes += 1;
            }
          }
          if(newData.likes[buyerAddress]){
            didLikeUser = true;
          }
      
          res.send({"didLike":didLikeUser, "numberOfLikes":countLikes })
        } 
        else res.status(400).send('not found')
    })
        .catch((err) => {
          console.log("her", err)
          res.status(404).send('Something went wrong')
        });
      })
      .catch((err) => {
        res.status(404).send('Something went wrong')
      });
  }
  catch(err){
    console.log(err)
    res.status(404).send('Something went wrong')
  }
  
});

router.get('/wallet-connect/', async (req, res, next) => {
    const {  team1, team2, shareWithCommunity, date, game, category} = req.params

    const eventInfo = new EventInfo({
        team1,
        team2,
        shareWithCommunity,
        date,
        game,
        category,
        approved: false

    });
    await eventInfo.save().then((result) => {
        return res.send(result);
    })
        .catch((err) => {
            console.log("err ", err)
            return res.send(err);
        });
});

router.get('/get-event/:eventId', async (req, res, next) => {
  try{
    const id = req.params.eventId
    EventInfo.find({_id:String(id)}).then(data => {
        return res.json(data[0])
  })
        .catch((err) => {
        
          res.status(404).send('Something went wrong')
        })
  }catch(err){

    res.status(404).send('Something went wrong')
  }
  
})



router.get('/get-event-stats/:eventId', async (req, res, next) => {
  //let client buy ticket and fill it in the db to know what team he choose what address he has and how many tickets he got ( called when payed to the blockchain)
  // confirm it with the block chain
  console.log('hereeee')
  try{
    const eventId = req.params.eventId
    console.log("test")
    await EventInfo.find({_id:String(eventId)}).then( async newData => {
        let ticketsSold = 0;
        let countLikes = 0;
        let teamOneSold = 0;
        let teamTwoSold = 0;
        let teamOneDistribution = 0;
        let teamOneRatio = 1;
        let teamTwoRatio = 1;
        console.log("test")
        if (newData && newData.length > 0) {
          console.log("newData views", newData)
          for (var key in newData.viewers) {
            ticketsSold += newData.viewers[key].tickets
            if(newData.viewers[key].teamChosen == "teamOne"){
              teamOneSold += newData.viewers[key].tickets
            }
            else if(newData.viewers[key].teamChosen == "teamTwo"){
              teamTwoSold += newData.viewers[key].tickets
            }
          }
          for (var key in newData.likes) {
            if(newData.likes[key]){
              countLikes += 1;
            }
          }
        
          if(teamOneSold==0 && teamTwoSold==0){
            teamOneDistribution = 50;
          }
          else if(teamOneSold==0){
            teamOneDistribution = 0;
          }
          else if(teamTwoSold==0){
            teamOneDistribution = 100;
          }
          else{
            teamOneRatio = (teamTwoSold / teamOneSold)*0.9 + teamOneSold
            teamTwoRatio = (teamOneSold / teamTwoSold)*0.9 + teamTwoSold
            teamOneDistribution = Math.round((teamOneSold/(teamOneSold+teamTwoSold))*100)
          }
          res.send({"numberOfLikes":countLikes, "prizePool": 0.02*ticketsSold, teamOneDistribution, "teamTwoDistribution": (100-teamOneDistribution), teamOneRatio, teamTwoRatio })
        } 
        else res.status(400).send('Event not found')
    })
  
      .catch((err) => {
          res.status(400).send('Event not found')
      });
  }
  catch(e){
    console.log(e)
    res.status(404).send('Something went wrong')
  }

  
});

module.exports = router