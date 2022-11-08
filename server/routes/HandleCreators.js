const express = require('express')
const router = express.Router()
const CreatorsInfo = require('../dataBase/creatorInfo')

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

router.post('/wallet-connect/:walletAddress', async (req, res, next) => {

    var createNewAccount = false;
    const walletAddress = req.params.walletAddress

    await CreatorsInfo.find({ walletAddress }).then(data => {

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
        //create new creator account
        /*
        example of creator account
        {
            nickName : "nick",
            image : "https://images.unsplash.com/photo-1561211919-1947abbbb35b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YWJzdHJhY3QlMjBibHVlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
            creatorEvents : {},
            walletAddress : "0x1234567890",
            socialLinks : "https://www.youtube.com/channel/UCJ5v_MCY6GNUBTO8-D3XoAg",
            proficiencyGame : "Fortnite",
            topAchievement : "top 10 in the world",
            status: "pro player",
            region: "NA",
            experience: "2021",

        }
        */
        const { nickName, image, creatorEvents, creationDate, walletAddress, socialLink, proficiencyGame,topAchievement, status, region,  experience, approvedCreator} = {
            nickName: req.body.nickName,
            image: req.body.image,
            creatorEvents: req.body.creatorEvents,
            creationDate: dt,
            walletAddress: req.params.walletAddress,
            socialLink: req.body.socialLink,
            proficiencyGame: req.body.proficiencyGame,
            topAchievement: req.body.topAchievement,
            status: req.body.status,
            region: req.body.region,
            experience: req.body.experience,
            approvedCreator:false
    }
        const creatorInfo = new CreatorsInfo({
            nickName,
            image,
            creatorEvents,
            creationDate,
            walletAddress,
            socialLink,
            proficiencyGame,
            topAchievement,
            status,
            region,
            experience,
            approvedCreator
        })
        await creatorInfo.save().then((result) => {
            return res.send(result);
            }).catch((err) => {
                console.log("err ", err);
                return res.send(err);
            });
    }
});



router.post('/update-info/:walletAddress', async (req, res, next) => {
    const walletAddress = req.params.walletAddress.toLowerCase()
    let query = {}
    if (req.body.nickName) {
        query["nickName"] = req.body.nickName
    }
    if (req.body.status) {
        query["status"] = req.body.status
    }
    if (req.body.image) {
        query["image"] = req.body.image
    }
    if (req.body.socialLink) {
        query["socialLink"] = req.body.socialLink
    }
    if (req.body.proficiencyGame) {
        query["proficiencyGame"] = req.body.proficiencyGame
    }
    if (req.body.topAchievement) {
        query["topAchievement"] = req.body.topAchievement
    }
    //experience is the starting year of the creator
    if (req.body.experience) {
        query["experience"] = req.body.experience
    }
    if (req.body.region) {
        query["region"] = req.body.region
    }

    await CreatorsInfo.findOneAndUpdate({ walletAddress: String(walletAddress) }, query, { new: true }).then(data => {
        if (data) res.send(data)
        else res.send({ error: "address not found" }) 
    })
        .catch((err) => {
            return res.send({ "error": "user ys found" });
        });

});

module.exports = router;