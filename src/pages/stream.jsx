
import "../style/main.scss";
import { userService } from '../services/userService'
import AgoraRTC from "agora-rtc-sdk-ng"
// import user selector from redux
import { useSelector } from "react-redux"
import { useEffect, useState } from "react";
import StreamChat from '../cmps/stream-chat.jsx'
import { makeCommas } from '../services/utils'
import { NavLink } from 'react-router-dom'

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
}


function Creator() {
  const [currentEvent, setCurrentEvent] = useState([])
  const [alreadyStreamed, setAlreadyStreamed] = useState(false)
  const { streamInfo } = useSelector((storeState) => storeState.generalModule)
  let channel = ""
  let APP_ID = "f4e41c5975dd4a86a326e4c426420ca4"
  const [client, setClient] = useState(null)
  const [modal, setModal] = useState(false)
  const isMobile = window.innerWidth < 1100

  useEffect(() => {
    document.documentElement.style.setProperty('--visibility', 'hidden')
    return () => {
      document.documentElement.style.setProperty('--visibility', 'visible')
      initStopOne(client)
    }
  }, [])


  useEffect(() => {
    joinRoom();
  }, [client])

  if (!client) {
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
      channel = String(streamInfo._id)
      console.log("sports channel", channel)
      let token = await userService.getStreamTokenClient({ channel: channel, uid: uid, role: options.role })
      console.log('token', token)
      options.type = streamInfo.category
      uid = await client.join(APP_ID, channel, token.rtcToken, uid);
      // set client role
      await client.setClientRole(options.role);
      console.log("test ", client, " ", options.role)
      setCurrentEvent(streamInfo)
      console.log("join success ", channel);
      streamGaming(client);
    }

    catch (e) {
      console.log("join failed", e);
    }

    // detect if user published
    client.on("user-published", async (user, mediaType) => {
      setAlreadyStreamed(true)
      console.log("user-published", user, mediaType);
    });
    // detect if user unpublish
    client.on("user-unpublished", async (user, mediaType) => {
      setAlreadyStreamed(false)
      console.log("user-unpublished", user, mediaType);
    });
  }

  let streamGaming = async (client, live = false) => {
    console.log("here sports")
    if (options.type === "sports" && channelParameters.localVideoTrack === null) {
      // create video track
      try {
        //create camera video track 
        channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();


      } catch (e) {
        console.log("create video track failed", e);
      }
      try {
        if (!channelParameters.localVideoTrack) {
          // create camera track
          channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack();
        }

        // create audio track
        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        channelParameters.localVideoTrack.play("agora_local");
      }
      catch (e) {
        console.log("create audio track failed", e);
      }
    }

    else if (options.type === "gaming" && channelParameters.localVideoTrack === null) {
      try {
        channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack();


        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        channelParameters.localVideoTrack.play("agora_local");
      }
      catch (e) {
        console.log("create video track failed", e);
      }
    }



    if (channelParameters.localVideoTrack && channelParameters.localAudioTrack && live) {
      console.log("publishing", client)
      if (alreadyStreamed && options.type === "sports") {
        console.log("stream already started by your opponent")
      }
      else {
        await client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
      }


    }
    else {
      if (channelParameters.localVideoTrack && channelParameters.localAudioTrack) {
        console.log("track detected")
      }
      else {
        console.log("no video track")
      }

    }
  }

  let stopStream = async (client) => {
    if (channelParameters.localAudioTrack) {
      client.unpublish();

    }

  }

  const getWidth = (money) => {
    let width = 162
    const str = money.toString()
    for (let i = 0; i < str.length; i++) {
      width += 11.5
    }
    return width
  }

  if (currentEvent.length === 0) return <div className="stream-container" />
  let prizePool = 0
  for (const [key, value] of Object.entries(currentEvent.playersTickets)) {
    prizePool += value
  }
  prizePool = prizePool * 5
  const width = getWidth(prizePool)
  let Modal = modal === 'start' ? 'Start' : 'End'

  return (<>
    {!isMobile && <div className="stream-container">
      <div className="settings">
        <div className="settings-upper">
          <span className="material-symbols-outlined">settings</span>
          <p>Settings</p>
          <span className="material-symbols-outlined hidden">settings</span>
        </div>
      </div>
      <div className="stream">
        <div id="agora_local" className="stream-video" />
        <div className="stream-control">
          <div className="options" style={{ width }}>
            <img src={require('../style/imgs/stream/mute.png')} />
            <img src={require('../style/imgs/stream/home.png')} />
          </div>
          <div className="start">
            {1 === 1 ? <>
              <div className="begin" onClick={() => setModal('start')}>Go Live </div>
              <div className="end" onClick={() => setModal('end')}>End Event</div>
            </> :
              <div className="begin" onClick={() => stopStream(client)}>Stop Live</div>}
          </div>
          <div className="details">
            <div>
              <img src={require('../style/imgs/stream/coins.png')} />
              <p>{makeCommas(prizePool)}$</p>
            </div>
            <div>
              <img src={require('../style/imgs/stream/viewers.png')} />
              <p>5,721</p>
            </div>
          </div>
        </div>
      </div>
      <StreamChat eventName={currentEvent.category == "sports" ? `${currentEvent._id}` : `${currentEvent._id}`} />
    </div>}

    {isMobile && <section className="stream-mobile">
      <div id="agora_local" className="stream-video-mobile" />
      <StreamChat eventName={currentEvent.category == "sports" ? `${currentEvent._id}` : `${currentEvent._id}`} mobile={true} />
      <div className="lower">
        <NavLink to='/'><img className="smaller" src={require('../style/imgs/stream/home.png')} /></NavLink>
        {1 === 1 ? <>
          <img onClick={() => setModal('start')} src={require('../style/imgs/stream/start.png')} />
          <img onClick={() => setModal('end')} src={require('../style/imgs/stream/end-mobile.png')} />
        </> : <img onClick={() => stopStream(client)} src={require('../style/imgs/stream/pause.png')} />}
        <img className="smaller" src={require('../style/imgs/stream/mute.png')} />
      </div>
      <div className="upper">
        <div className="detail-holder">
          <div>
            <img src={require('../style/imgs/stream/viewers.png')} />
            <p>5,721</p>
          </div>
          <div>
            <img src={require('../style/imgs/stream/coins.png')} />
            <p>{makeCommas(prizePool)}$</p>
          </div>
        </div>
        <span className="material-symbols-outlined">settings</span>
      </div>
    </section>}

    {modal && <>
      <div className="screen blur" onClick={() => setModal(false)} />
      <div className="confirm-exit">
        <img src={require(`../style/imgs/stream/${modal}.png`)} />
        <h1>{Modal} Live Stream?</h1>
        <p>This Action cannot be undone. Are you sure you want to {modal} the stream?</p>
        <div>
          <div className="cancel" onClick={() => setModal(false)}>Cancel</div>
          <div onClick={() => {
            if (modal === 'end') initStopOne(client)
            else {
              streamGaming(client, true)
              setModal(false)
            }
          }}>{Modal}</div>
        </div>
      </div>
    </>}
  </>)
}

export default Creator;