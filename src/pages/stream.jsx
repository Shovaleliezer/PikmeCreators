
import "../style/main.scss"
import { userService } from '../services/userService'
import AgoraRTC from "agora-rtc-sdk-ng"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { setStreamPhase } from "../store/actions/tutorial.actions"
import StreamChat from '../cmps/stream-chat.jsx'
import { Error } from "./error";
import { makeCommas, getTimeUntil } from '../services/utils'
import { NavLink } from 'react-router-dom'
import { StreamPopup } from "../cmps/stream-popup"
import { eventService } from "../services/event.service"
import { setUpperPopup, setStreamPopup } from "../store/actions/general.actions"

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
}

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
  const dispatch = useDispatch()
  const [currentEvent, setCurrentEvent] = useState([])
  const [alreadyStreamed, setAlreadyStreamed] = useState(false)
  const [client, setClient] = useState(null)
  const [modal, setModal] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const [status, setStatus] = useState("not-live")
  const [cameras, setCameras] = useState([])
  const [cameraIdx, setCameraIdx] = useState(0)
  const [mics, setMics] = useState([])
  const [micIdx, setMicIdx] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [openOpt, setOpenOpt] = useState('')
  const { streamInfo } = useSelector((storeState) => storeState.generalModule)
  const { viewers } = useSelector((storeState) => storeState.generalModule)
  const { streamPhase } = useSelector((storeState) => storeState.tutorialModule)
  const isMobile = window.innerWidth < 1100
  let channel = ""
  let APP_ID = "f4e41c5975dd4a86a326e4c426420ca4"

  if (streamPhase === 0) dispatch(setStreamPhase(1))
  if (!client) {
    setClient(AgoraRTC.createClient({ mode: "live", codec: "vp8" }))
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--visibility', 'hidden')
    document.body.style.overflow = "hidden"
    if (window.innerWidth < 550) document.querySelector('.main-layout').classList.add("main-stream")
    loadCameras()
    loadMics()
    window.screen.orientation.lock('landscape-primary')

    return () => {
      document.documentElement.style.setProperty('--visibility', 'visible')
      document.body.style.overflow = "auto"
      initStopOne(client, 'no-home')
      if (window.innerWidth < 550) document.querySelector('.main-layout').classList.remove("main-stream")
      window.screen.orientation.unlock()
    }
  }, [])

  useEffect(() => {
    joinRoom()
  }, [client])

  useEffect(() => {
    const agora = document.getElementById('agora_local')
    if (agora) {
      const width = agora.offsetWidth
      const height = agora.offsetHeight
      document.documentElement.style.setProperty('--video-height', height + 'px')
      document.documentElement.style.setProperty('--video-width', width + 'px')
    }
  }, [currentEvent])

  useEffect(() => {
    play()
  }, [cameraIdx])

  useEffect(() => {
    play('mic')
  }, [micIdx])

  const switchCamera = async () => {
    const cameras = await AgoraRTC.getCameras()
    setCameraIdx(cameraIdx === cameras.length - 1 ? 0 : cameraIdx + 1)
  }

  const loadBackCamrea = async () => {
    const cameras = await AgoraRTC.getCameras()
    const backCameraIdx = cameras.findIndex(camera => camera.label.toLowerCase().includes('back'))
    if (backCameraIdx !== -1) setCameraIdx(backCameraIdx)
    else play()
  }

  const play = async (device) => {
    if (device === 'mic') {
      const config = await AgoraRTC.createMicrophoneAudioTrack()
      config.setDevice(mics[micIdx].deviceId)
      channelParameters.localAudioTrack = config
      client.unpublish()
      client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
      setIsMuted(false)
    }
    else {
      const cameras = await AgoraRTC.getCameras()
      channelParameters.localVideoTrack.stop()
      const config = await AgoraRTC.createCameraVideoTrack()
      if (!cameras[cameraIdx]) {
        setCameraIdx(0)
        return
      }
      if (cameras[cameraIdx].label.toLowerCase().includes('back')) {
        document.documentElement.style.setProperty('--video-rotate', '90deg')
        document.documentElement.style.setProperty('--video-scale', '-1')
      }
      else {
        document.documentElement.style.setProperty('--video-rotate', '-90deg')
        document.documentElement.style.setProperty('--video-scale', '1')
      }
      config.setDevice(cameras[cameraIdx].deviceId)
      channelParameters.localVideoTrack = config
      client.unpublish()
      client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
      channelParameters.localVideoTrack.play("agora_local")
    }
  }

  const loadCameras = async () => {
    const cameras = await AgoraRTC.getCameras()
    setCameras(cameras)
  }

  const loadMics = async () => {
    const mics = await AgoraRTC.getPlaybackDevices()
    setMics(mics)
  }

  const mute = async () => {
    channelParameters.localAudioTrack = null
    client.unpublish()
    client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
    setIsMuted(true)
  }

  const endEvent = async () => {
    try {
      await eventService.endEvent(currentEvent._id)
      setIsEnd(true)
    }
    catch {
      console.log('something went wrong')
    }
    return () => dispatch(setStreamPhase(0))
  }

  function initStopOne(client, path) {
    if (channelParameters.localAudioTrack) {
      client.unpublish();
      channelParameters.localVideoTrack.stop()
      channelParameters.localVideoTrack.close()
      channelParameters.localAudioTrack.stop()
      channelParameters.localAudioTrack.close()
      channelParameters.localAudioTrack = null
      channelParameters.localVideoTrack = null
    }

    client.remoteUsers.forEach(user => {
      if (user.hasVideo) {
        console.log("user has video , ", user);
      }
      client.unsubscribe(user);
    })
    client.removeAllListeners();
    client.leave();
    if (!path) window.location = '/';
  }

  const joinRoom = async () => {
    try {
      let uid = String(Math.floor(Math.random() * 10000))
      channel = String(streamInfo._id)
      let token = await userService.getStreamTokenClient({ channel: channel, uid: uid, role: options.role })
      options.type = streamInfo.category
      uid = await client.join(APP_ID, channel, token.rtcToken, uid);
      await client.setClientRole(options.role);
      setCurrentEvent(streamInfo)
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
    if (options.type === "sports" && channelParameters.localVideoTrack === null) {
      try {
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
        loadBackCamrea()
        // channelParameters.localVideoTrack.play("agora_local");
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
        setStatus("live")
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
      client.unpublish()
      setStatus("not-live")
    }
  }

  const hasStarted = () => {
    return (new Date(currentEvent.date).getTime() - Date.now() <= 0)
  }

  const getWidth = (money) => {
    let width = 162
    const str = money.toString()
    for (let i = 0; i < str.length; i++) {
      width += 11.5
    }
    return width
  }

  if (currentEvent.length === 0) return <div className="home"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div></div></div></div>

  let prizePool = 0
  for (const [key, value] of Object.entries(currentEvent.playersTickets)) {
    prizePool += value
  }
  prizePool = prizePool * 5
  const width = getWidth(prizePool)
  let Modal = modal === 'start' ? 'Start' : 'End'
  const timeUntilEvent = getTimeUntil(currentEvent.date)

  try {
    return (<>
      {!isMobile && <div className="stream-container">
        <div className="settings noselect">
          <div className="settings-upper">
            <span className="material-symbols-outlined">settings</span><p>Settings</p>
          </div>
          <div className="option main-color" onClick={() => openOpt === 'camera' ? setOpenOpt('') : setOpenOpt('camera')}>
            <p>Camera</p><span class="material-symbols-outlined">{openOpt === 'camera' ? 'expand_less' : 'expand_more'}</span></div>
          {openOpt === 'camera' && cameras.map((camera, idx) =>
           <div className={cameraIdx === idx ? 'sub sec-color back-stream' : 'sub'} onClick={() => setCameraIdx(idx)}><p >{idx + 1}.{camera.label}</p></div>)}
         
          <div className="option main-color" onClick={() => openOpt === 'mic' ? setOpenOpt('') : setOpenOpt('mic')}>
            <p>Microphone</p><span class="material-symbols-outlined">{openOpt === 'mic' ? 'expand_less' : 'expand_more'}</span></div>
          {openOpt === 'mic' && mics.map((mic, idx) => 
            <div onClick={() => setMicIdx(idx)} className={micIdx === idx ? 'sub sec-color back-stream' : 'sub'}>
              <p >{idx + 1}. {mic.label.substring(0,mic.label.indexOf('('))}</p></div>)}
          
        </div>
        <div className="stream">
          <div id="agora_local" className="stream-video"></div>
          <div className="stream-control" style={{ zIndex: streamPhase === 3 ? '1001' : 0 }}>
            <div className="options" style={{ width }}>
              <svg className={`clickable ${isMuted ? 'sec-svg' : ''}`} onClick={() => isMuted ? play('mic') : mute()} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M22.7439 14.4978C22.7439 15.3792 22.597 16.2278 22.3282 17.0186L21.0561 15.7465C21.1394 15.3355 21.1813 14.9172 21.1812 14.4978V12.935C21.1812 12.7278 21.2635 12.5291 21.41 12.3825C21.5566 12.236 21.7553 12.1537 21.9626 12.1537C22.1698 12.1537 22.3685 12.236 22.5151 12.3825C22.6616 12.5291 22.7439 12.7278 22.7439 12.935V14.4978ZM14.9301 20.7489C16.2084 20.7489 17.3961 20.366 18.3869 19.7065L19.509 20.8302C18.3934 21.6392 17.0828 22.137 15.7115 22.2726V25.4372H20.3998C20.607 25.4372 20.8058 25.5196 20.9523 25.6661C21.0988 25.8126 21.1812 26.0114 21.1812 26.2186C21.1812 26.4258 21.0988 26.6246 20.9523 26.7711C20.8058 26.9177 20.607 27 20.3998 27H9.46037C9.25313 27 9.05439 26.9177 8.90785 26.7711C8.76131 26.6246 8.67898 26.4258 8.67898 26.2186C8.67898 26.0114 8.76131 25.8126 8.90785 25.6661C9.05439 25.5196 9.25313 25.4372 9.46037 25.4372H14.1487V22.2726C12.2213 22.0789 10.4346 21.1762 9.13513 19.7396C7.83569 18.303 7.11619 16.4349 7.11621 14.4978V12.935C7.11621 12.7278 7.19854 12.5291 7.34507 12.3825C7.49161 12.236 7.69036 12.1537 7.8976 12.1537C8.10483 12.1537 8.30358 12.236 8.45012 12.3825C8.59666 12.5291 8.67898 12.7278 8.67898 12.935V14.4978C8.67898 16.1557 9.33758 17.7457 10.5099 18.918C11.6822 20.0903 13.2722 20.7489 14.9301 20.7489ZM19.6184 6.68395V14.3087L18.0556 12.7459V6.68395C18.0592 5.86859 17.7441 5.08409 17.1774 4.49784C16.6107 3.91159 15.8374 3.56999 15.0223 3.54593C14.2073 3.52187 13.4152 3.81725 12.8149 4.36905C12.2146 4.92085 11.8537 5.68539 11.8092 6.49954L10.4887 5.179C10.8465 4.12763 11.5657 3.23734 12.5185 2.66663C13.4712 2.09592 14.5955 1.88183 15.6913 2.06246C16.7871 2.24309 17.7832 2.80673 18.5024 3.65303C19.2215 4.49933 19.617 5.57337 19.6184 6.68395Z"
                  fill='white' fill-opacity="0.9" />
                <path d="M17.2521 18.5722L16.0832 17.4032C15.6091 17.5914 15.0961 17.6608 14.589 17.6051C14.0819 17.5495 13.5962 17.3706 13.1742 17.0841C12.7521 16.7975 12.4067 16.412 12.1679 15.9613C11.9291 15.5105 11.8043 15.0081 11.8043 14.498V13.1259L10.2415 11.5631V14.498C10.2413 15.319 10.4566 16.1256 10.866 16.8372C11.2753 17.5488 11.8644 18.1404 12.5742 18.5529C13.284 18.9654 14.0896 19.1843 14.9106 19.1877C15.7315 19.191 16.539 18.9788 17.2521 18.5722ZM5 4.11181L23.7533 22.8651L24.8597 21.7586L6.10644 3.00537L5 4.11181Z"
                  fill='white' fill-opacity="0.9" />
              </svg>
              <img onClick={() => { (status == "live") ? setModal('exit') : initStopOne(client) }} src={require('../style/imgs/stream/home.png')} />
            </div>
            <div className="start">
              {status != "live" ? <>
                <div className="begin" onClick={() => { hasStarted() ? setModal('start') : dispatch(setUpperPopup(timeUntilEvent)) }}>Go Live </div>
                <div className="end" onClick={() => { hasStarted() ? setModal('end-event') : dispatch(setUpperPopup(timeUntilEvent)) }}>End Event</div>
              </> :
                <div className="begin" onClick={() => setModal('end')}>Stop Live</div>}
            </div>
            <div className="details">
              <div>
                <img src={require('../style/imgs/stream/coins.png')} />
                <p>{makeCommas(prizePool)}$</p>
              </div>
              <div>
                <img src={require('../style/imgs/stream/viewers.png')} />
                <p>{viewers - 1}</p>
              </div>
            </div>
          </div>
        </div>
        <StreamChat eventName={currentEvent.category == "sports" ? `${currentEvent._id}` : `${currentEvent._id}`} zIndex={streamPhase === 2 ? '1001' : '0'} end={isEnd} />
      </div>}

      {isMobile && <section className="stream-mobile" style={{ width: window.innerWidth < 551 ? window.innerHeight + 'px' : '' }} >

        <StreamPopup />
        <section className="left-wrapper">
          <div className="upper">
            <div onClick={() => { hasStarted() ? setModal('end-event') : dispatch(setStreamPopup(timeUntilEvent)) }} className="end-event-mobile">End Event</div>
            <div className="detail-holder">
              <div>
                <img src={require('../style/imgs/stream/viewers.png')} />
                <p>{viewers - 1}</p>
              </div>
              <div>
                <img src={require('../style/imgs/stream/coins.png')} />
                <p>{makeCommas(prizePool)}$</p>
              </div>
            </div>
            <img src={require('../style/imgs/stream/full-screen.png')} onClick={switchCamera} />
          </div>

          <div id="agora_local" className="stream-video-mobile" />
          <div className="lower" style={{ zIndex: streamPhase === 3 ? '1001' : 0 }}>
            <NavLink to='/'><img className="smaller" src={require('../style/imgs/stream/home.png')} /></NavLink>
            {status != "live" ? <img onClick={() => { hasStarted() ? setModal('start') : dispatch(setStreamPopup(timeUntilEvent)) }} src={require('../style/imgs/stream/start.png')} />
              : <img onClick={() => setModal('end')} src={require('../style/imgs/stream/pause.png')} />}
            <svg className={`clickable ${isMuted ? 'sec-svg' : ''}`} onClick={() => isMuted ? play('mic') : mute()} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <path d="M22.7439 14.4978C22.7439 15.3792 22.597 16.2278 22.3282 17.0186L21.0561 15.7465C21.1394 15.3355 21.1813 14.9172 21.1812 14.4978V12.935C21.1812 12.7278 21.2635 12.5291 21.41 12.3825C21.5566 12.236 21.7553 12.1537 21.9626 12.1537C22.1698 12.1537 22.3685 12.236 22.5151 12.3825C22.6616 12.5291 22.7439 12.7278 22.7439 12.935V14.4978ZM14.9301 20.7489C16.2084 20.7489 17.3961 20.366 18.3869 19.7065L19.509 20.8302C18.3934 21.6392 17.0828 22.137 15.7115 22.2726V25.4372H20.3998C20.607 25.4372 20.8058 25.5196 20.9523 25.6661C21.0988 25.8126 21.1812 26.0114 21.1812 26.2186C21.1812 26.4258 21.0988 26.6246 20.9523 26.7711C20.8058 26.9177 20.607 27 20.3998 27H9.46037C9.25313 27 9.05439 26.9177 8.90785 26.7711C8.76131 26.6246 8.67898 26.4258 8.67898 26.2186C8.67898 26.0114 8.76131 25.8126 8.90785 25.6661C9.05439 25.5196 9.25313 25.4372 9.46037 25.4372H14.1487V22.2726C12.2213 22.0789 10.4346 21.1762 9.13513 19.7396C7.83569 18.303 7.11619 16.4349 7.11621 14.4978V12.935C7.11621 12.7278 7.19854 12.5291 7.34507 12.3825C7.49161 12.236 7.69036 12.1537 7.8976 12.1537C8.10483 12.1537 8.30358 12.236 8.45012 12.3825C8.59666 12.5291 8.67898 12.7278 8.67898 12.935V14.4978C8.67898 16.1557 9.33758 17.7457 10.5099 18.918C11.6822 20.0903 13.2722 20.7489 14.9301 20.7489ZM19.6184 6.68395V14.3087L18.0556 12.7459V6.68395C18.0592 5.86859 17.7441 5.08409 17.1774 4.49784C16.6107 3.91159 15.8374 3.56999 15.0223 3.54593C14.2073 3.52187 13.4152 3.81725 12.8149 4.36905C12.2146 4.92085 11.8537 5.68539 11.8092 6.49954L10.4887 5.179C10.8465 4.12763 11.5657 3.23734 12.5185 2.66663C13.4712 2.09592 14.5955 1.88183 15.6913 2.06246C16.7871 2.24309 17.7832 2.80673 18.5024 3.65303C19.2215 4.49933 19.617 5.57337 19.6184 6.68395Z"
                fill='white' fill-opacity="0.9" />
              <path d="M17.2521 18.5722L16.0832 17.4032C15.6091 17.5914 15.0961 17.6608 14.589 17.6051C14.0819 17.5495 13.5962 17.3706 13.1742 17.0841C12.7521 16.7975 12.4067 16.412 12.1679 15.9613C11.9291 15.5105 11.8043 15.0081 11.8043 14.498V13.1259L10.2415 11.5631V14.498C10.2413 15.319 10.4566 16.1256 10.866 16.8372C11.2753 17.5488 11.8644 18.1404 12.5742 18.5529C13.284 18.9654 14.0896 19.1843 14.9106 19.1877C15.7315 19.191 16.539 18.9788 17.2521 18.5722ZM5 4.11181L23.7533 22.8651L24.8597 21.7586L6.10644 3.00537L5 4.11181Z"
                fill='white' fill-opacity="0.9" />
            </svg>
            <img className="smaller" src={require('../style/imgs/stream/settings.png')} />
          </div>
        </section>
        <StreamChat eventName={currentEvent.category == "sports" ? `${currentEvent._id}` : `${currentEvent._id}`} mobile={true} zIndex={streamPhase === 2 ? '1001' : '0'} end={isEnd} />
      </section>
      }

      {modal && <>
        <div className="screen blur" onClick={() => setModal(false)} />
        <div className="confirm-exit">
          <img src={require(`../style/imgs/stream/${(modal == "exit" || modal == "end-event") ? "end" : modal}.png`)} />
          <h1>{Modal} {modal == "end-event" ? "Event?" : "Live Stream?"}</h1>
          <p>This Action cannot be undone. Are you sure you want to {Modal} the {modal == "end-event" ? "Event?" : "Stream?"}</p>
          <div>
            <div className="cancel" onClick={() => setModal(false)}>Cancel</div>
            <div onClick={() => {
              if (modal === 'end') {
                stopStream(client)
                setModal(false)
              }
              else if (modal == "exit") {
                initStopOne(client)
              }
              else if (modal == "end-event") {
                setModal(false)
                endEvent()
              }
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
  catch {
    return <Error />
  }
}
export default Creator;