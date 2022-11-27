
import "../style/main.scss";
import { userService } from '../services/userService'
import {useRef} from "react"
import AgoraRTC from "agora-rtc-sdk-ng"
 // import user selector from redux
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import StreamChat from '../cmps/stream-chat.jsx'


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
  const [currentEvent, setCurrentEvent] = useState([])
  const {streamInfo} = useSelector((storeState) => storeState.generalModule)
  const user = useSelector((state) => state.user)
  let channel = ""
  let APP_ID = "f4e41c5975dd4a86a326e4c426420ca4"
  const [client, setClient] = useState(null)

  useEffect(() => {

    return () => {
      initStopOne(client)
    }
}, [])
  
useEffect( () => {
  console.log('streamInfo', client)
  joinRoom();
 
}, [client])

  if(!client){
    setClient(AgoraRTC.createClient({ mode: "live", codec: "vp8" }))
  }


 function initStopOne(client) {
    if (channelParameters.localAudioTrack) {
      client.unpublish(); 
      channelParameters.localVideoTrack.stop();
      channelParameters.localVideoTrack.close();
      channelParameters.localAudioTrack.stop();  
      channelParameters.localAudioTrack.close(); 
      channelParameters.localAudioTrack = null;
      channelParameters.localVideoTrack = null;
    }

    client.remoteUsers.forEach(user => {
        if (user.hasVideo) {
            console.log("user has video , ", user);
        }
        client.unsubscribe(user); 
    });
    client.removeAllListeners(); 
    client.leave();
    window.location = '/';
}

 
  const joinRoom = async () => {
    try {
      //client l
      let uid = String(Math.floor(Math.random() * 10000))
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
     
        let token = await userService.getStreamTokenClient({ channel:channel, uid:uid, role:  options.role })
        console.log('token',token)
        options.type = streamInfo.category
        uid = await client.join(APP_ID, channel,token.rtcToken,  uid);
        // set client role
        await client.setClientRole(options.role);
        console.log("test ", client, " ", options.role)
        setCurrentEvent(streamInfo)
        console.log("join success ", channel);
        streamGaming(client);
      } 
      else{
        console.log("no stream info")
      }
    } catch (e) {
        console.log("join failed", e);
    }
};

    
  
    let streamGaming = async ( client, live=false) => {
      console.log("here sports")
      if( options.type === "sports" && channelParameters.localVideoTrack === null){
        // create video track
        try{
          console.log("streaming sports")
          channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack();
          console.log("video track created12313123")
        }catch(e){
          console.log("create video track failed", e);
        }
        try{
         
          channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          console.log("aaaa track created12313123")
          channelParameters.localVideoTrack.play("agora_local");
        }
        catch(e){
          console.log("create audio track failed", e);
        }
      }
   
      else if (options.type === "gaming"  && channelParameters.localVideoTrack === null){
        try{
          channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack();
          channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          channelParameters.localVideoTrack.play("agora_local");
        }
        catch(e){
          console.log("create video track failed", e);
        }
      }
      
   
      
      if ( channelParameters.localVideoTrack && channelParameters.localAudioTrack && live) {
        console.log("publishing" , client)
        await client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
        
      }
      else {
        if(channelParameters.localVideoTrack && channelParameters.localAudioTrack){
          console.log("track detected")
        }
        else{
          console.log("no video track")
        }
        
      }  
  }

      let stopStream = async (client) => {
        if (channelParameters.localAudioTrack) {
          client.unpublish(); 
       
        }
      
      }
      

    

      
     
 
 
  
  return (
    <div   className="stream-container">
             
             <button onClick={() =>streamGaming( client, true)}>stream</button>
             <button onClick={() => stopStream(client)}>stop</button>
            <button onClick={() => initStopOne(client)}>leave</button>
             
            <div className="stream">

                <div  id="agora_local" className="stream-video" >
                </div>
               
           </div>
           <StreamChat eventName={currentEvent.category=="sports"?`${currentEvent._id}`:`${currentEvent.chosen}-${currentEvent._id}`}/>
          

        </div>

);

  }
  


export default Creator;