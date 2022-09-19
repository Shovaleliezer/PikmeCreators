const express = require('express')
const router = express.Router()
const AccountsInfo = require('../dataBase/accountinfo')



const namelist = ["fred","marco", "nick", "bob", "steve", "alvert", "seo", "kim", "user51321", "user" ]

router.post('/wallet-connect/:walletAddress', async (req, res, next ) => {

    var createNewAccount = false;
    const walletAddress = req.params.walletAddress

    await AccountsInfo.find({walletAddress}).then( data => {

        if (data.length>0){
            return res.send(data[0]);
        }
        else{
            createNewAccount = true;
        }
        
    })
    .catch((err) => {
        return res.send({"error":"user not found"});
    });

    if(createNewAccount){

        var dt = new Date();   
        const {nickName, image, about, moneyWon, matchHistory, creationDate} = {nickName:namelist[Math.floor(Math.random() * namelist.length)], image:"none", about:"about", moneyWon:0, matchHistory:[], creationDate:dt};

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
            console.log("err " , err);
            return res.send(err);
            });
    }
});
   


router.post('/update-address-info/:walletAddress', async (req, res, next ) => {

    const walletAddress = req.params.walletAddress.toLowerCase();
    
    let query = {}

    if(req.body.nickName) 
        {
            query["nickName"] = req.body.nickName
        }
    if(req.body.about) 
        {
            query["about"] = req.body.about
        }
    if(req.body.image) 
        {
            query["image"] = req.body.image
        }

    console.log(query)
    await AccountsInfo.findOneAndUpdate({walletAddress:String(walletAddress)}, query, {new: true}).then( data => {
        console.log(data)
        if(data) {return res.send(data)} 
        else {return res.send({error: "address not found"})}


    })
    .catch((err) => {
        return res.send({"error":"user ys found"});
    });

});

module.exports = router;