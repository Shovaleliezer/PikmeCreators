const express = require('express')
const router = express.Router()
const AccountsInfo = require('../dataBase/accountinfo')



const namelist = ["fred", "marco", "nick", "bob", "steve", "alvert", "seo", "kim", "user51321", "user"]

router.post('/wallet-connect/:walletAddress', async (req, res, next) => {

    var createNewAccount = false;
    const walletAddress = req.params.walletAddress

    await AccountsInfo.find({ walletAddress }).then(data => {

        if (data.length > 0) {
            return res.send(data[0]);
        }
        else {
            createNewAccount = true;
        }

    })
        .catch((err) => {
            return res.send({ "error": "user not found" });
        });

    if (createNewAccount) {

        var dt = new Date();
        const { nickName, image, about, moneyWon, matchHistory, creationDate } = {
            nickName: namelist[Math.floor(Math.random() * namelist.length)],
            image: "https://images.unsplash.com/photo-1561211919-1947abbbb35b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YWJzdHJhY3QlMjBibHVlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
            about: "about", moneyWon: 0, matchHistory: {}, creationDate: dt
        }
        const accountInfo = new AccountsInfo({
            nickName,
            about,
            image,
            moneyWon,
            matchHistory,
            creationDate,
            walletAddress,
        })

        await accountInfo.save().then((result) => {
            return res.send(result);
        })
            .catch((err) => {
                console.log("err ", err);
                return res.send(err);
            });
    }
});



router.post('/update-address-info/:walletAddress', async (req, res, next) => {
    const walletAddress = req.params.walletAddress.toLowerCase()
    let query = {}
    if (req.body.nickName) {
        query["nickName"] = req.body.nickName
    }
    if (req.body.about) {
        query["about"] = req.body.about
    }
    if (req.body.image) {
        query["image"] = req.body.image
    }

    await AccountsInfo.findOneAndUpdate({ walletAddress: String(walletAddress) }, query, { new: true }).then(data => {
        if (data) res.send(data)
        else res.send({ error: "address not found" }) 
    })
        .catch((err) => {
            return res.send({ "error": "user ys found" });
        });

});
router.post('/update-address-history/:walletAddress', async (req, res, next) => {
    console.log("test " , req.body)

    const walletAddress = req.params.walletAddress.toLowerCase()
    console.log("here " ,walletAddress)
    let newQuery = req.body
    newQuery.date = new Date(newQuery.date);
    console.log("new data to add ", newQuery)
    await AccountsInfo.findOne({walletAddress}).then(async (data) => {
        console.log("test data is ", data.matchHistory)
            data.matchHistory[newQuery.eventID] = newQuery
        

            await AccountsInfo.findOneAndUpdate({ walletAddress }, {matchHistory:data.matchHistory}, { new: true }).then(newData => {
                if (newData) res.send(newData.matchHistory)
                else res.send({ error: "address not found" }) 
            })
                .catch((err) => {
                    return res.send({ "error": "user ys found" });
                });
            })  
            .catch((err) => {
                return res.send({ "error": "user ys found" });
        });
     
});

router.get('/get-tickets/:walletAddress', async (req, res, next) => {
    const cDate = new Date();
    const pastList = []
    const upcomingList = []
    const walletAddress = req.params.walletAddress.toLowerCase()
    await AccountsInfo.findOne({walletAddress}).then(data => {
        const history = data.matchHistory
        console.log(history)
        
        for (const key in history) {
            if(history[key].date <  cDate){
                console.log("before ", history[key] )
                pastList.push(history[key])
                pastList.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                  });
            }
            else{
                upcomingList.push(history[key])
                upcomingList.sort(function(a,b){
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.date) - new Date(a.date);
                  });
                console.log("after " , history[key])
            }
            
        }
        return res.json({"past":pastList,"future":upcomingList})
    })
        .catch((err) => {
            return res.send({ "past": "user not found" });
        })
  })
  
module.exports = router;