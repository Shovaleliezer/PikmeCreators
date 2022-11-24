
import "../style/main.scss";
import { userService } from '../services/userService'
import {useRef} from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
 // import user selector from redux
import { useSelector } from "react-redux"
import { useEffect } from "react";


let options =
{
    // Pass your App ID here.
    appId: 'f4e41c5975dd4a86a326e4c426420ca4',
    // Set the channel name.
    channel: 'teamOne636b79ecaa9a2464787e48a9',
    channel2: 'teamOne636cf202090bc65af885478b',
    // Pass your temp token here.
    token: "007eJxTYJj0Nn8W686+hj/tdzzsvlscqjTxZDpe+mR1bGGPusbMkKcKDGkmqSaGyaaW5qYpKSaJFmaJxkZmqSbJJkZmJkYGyYkmrQ3VyQ2BjAzy+U6sjAwQCOYzlKQm5vrnpZoZmyWZW6YmJyZaJhqZmJmYW5inmlgkWjIwAABQWib1",
    // Set the user ID.
    token2: "007eJxTYBCLfHj9bsScb/08O+3fyn5X+nvnTOOmJv6j589L/Xov3tuuwJBmkmpimGxqaW6akmKSaGGWaGxklmqSbGJkZmJkkJxo8rSpOrkhkJEhqGIqAyMUgvjyDCWpibn+ealmxmbJaUYGRgaWBknJZqaJaRYWpibmFkkMDABfRynX",
    uid: String(Math.floor(Math.random() * 10000)),
    // Set the user role
    role: 'host',
    type: "sports"
};

let channelParameters =
{
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a local video track.
    localVideoTrack: null,
    localCamera: null,
    // A variable to hold a remote audio track.

};


function Creator() {
    const {streamInfo} = useSelector((storeState) => storeState.generalModule)
    const user = useSelector((state) => state.user)
    console.log('creator ',streamInfo)
    let channel = ""
    let type = ""
  let APP_ID = "f4e41c5975dd4a86a326e4c426420ca4"
  //create div element and add it to the DOM
 let viewers =  0;
 const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

 function initStopOne(client) {

    client.unpublish(); 
    channelParameters.localVideoTrack.stop();
    channelParameters.localVideoTrack.close();
    channelParameters.localAudioTrack.stop();  
    channelParameters.localAudioTrack.close(); 
    client.remoteUsers.forEach(user => {
        if (user.hasVideo) {
            console.log("user has video , ", user);
        }
        client.unsubscribe(user); 
    });
    client.removeAllListeners(); 
    client.leave();
}

 
  const joinRoom = async () => {
    try {
      //client l
      if (Object.keys(streamInfo).length !== 0){
        if (streamInfo.category==='sports'){
          channel = String(streamInfo._id)
          console.log("sports channel", channel)
        }
        else{
          if  (user){
            if (user.address === streamInfo.team1.walletAddress){
                channel = "teamOne" + streamInfo._id
            }
            else if (user.address === streamInfo.team2.walletAddress){
                channel = "teamTwo" + streamInfo._id
            }
            else {
                console.log("not a player")
            }
        }
        console.log("gaming channel", channel)
        }
     
        let token = await userService.getStreamTokenClient({ channel:channel, uid:options.uid, role:options.role })
        console.log('token',token)
        options.type = streamInfo.category
        const uid = await client.join(APP_ID, channel,token.rtcToken,  options.uid);
        await client.setClientRole(options.role);
        console.log("join success ", channel);
      } 
      else{
        console.log("no stream info")
      }
    } catch (e) {
        console.log("join failed", e);
    }
};

    
  
    let streamGaming = async () => {
    
      if( options.type === "sports"){
        // create video track
        channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      }
      else if (options.type === "gaming"){
        channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack();
      }
      
   
      channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      
      await client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
   
      channelParameters.localVideoTrack.play("agora_local");
      
      }
      

    



 
  joinRoom();
  return (
    <div   className="stream-container">
             
                
             
            <div className="stream">

                <div  id="agora_local" className="stream-video" >
                </div>
               
           </div>
           <button onClick={streamGaming}>stream</button>
            <button onClick={() => initStopOne(client)}>stop</button>
            
        </div>

);

  }
  


export default Creator;