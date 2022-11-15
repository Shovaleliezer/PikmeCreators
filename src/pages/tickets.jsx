// import react and agora sdk
import React, { useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng"

// creates opitons object to pass to AgoraRTC.createClient
let options = {
    // Pass your App ID here.
    appId: "f4e41c5975dd4a86a326e4c426420ca4",
    // Set the channel name.
    channel: "test",
    // Pass your temp token here.
    token: "007eJxTYDA+e/XPPJF/LxY8nL/y7uS4Y1zND7LqDgf391VMPvjsbsc6BYY0k1QTw2RTS3PTlBSTRAuzRGMjs1STZBMjMxMjg+REkxsZxckNgYwMt9eeYGJkgEAQn4WhJLW4hIEBANFEJLY=",
    // Set the user ID.
    uid: String(Math.floor(Math.random() * 10000)),
    // Set the user role
    role: "audience",

    type:"sports"
};

function Tickets() {
  const [connected, setConnected] = useState(false);
  const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
  const streamRef = useRef(null);
  let APP_ID = "f4e41c5975dd4a86a326e4c426420ca4"
  //create div element and add it to the DOM

  let init = async () => {
    saf
 
    try {
      const uid = await client.join(APP_ID, options.channel,options.token,  options.uid);
      // set host role
      await client.setClientRole(options.role);

      console.log("join success ", uid);
    } catch (e) {
      console.log("join failed", e);
    }
    // load the stream into the div element
    client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);


        if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            remoteVideoTrack.play("agora_remote");
            setConnected(true)

        }
        if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.play();
        }
    });

    client.on("user-unpublished", async (user, mediaType) => {
        // unsbscribe the stream
        console.log("user-unpublished");
        await client.unsubscribe(user, mediaType);

        if (mediaType === "video") {
            const remoteVideoTrack = user.videoTrack;
            remoteVideoTrack.stop();
            remoteVideoTrack.close();
        }
        if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack.stop();
            remoteAudioTrack.close();
        }

        
    });
    
  
        
   
};
   
       

    const leave = async () => {
  
      
        await client.leave();
        // tell the host that client leaves
    
        // unsbscribe from the stream
        // clear the div stream
        document.getElementById("agora_remote").innerHTML = "";
        setConnected(false)
        console.log("client leaves channel");
    }
    // return div which is full screen andasd his items csenters
    //return div puts 
    init()
    return (
        <div className="stream-container">
           
           <div id="agora_remote" className="stream"></div>
          
            <div className="chat-box"> 
                <div className="chat-box-header">
                    <h3>Chat</h3>
                </div>
                </div>
        
        </div>

    );

  
 
}

export default Tickets;


