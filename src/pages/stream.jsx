
import "../style/main.scss"
import { userService } from '../services/userService'
import AgoraRTC from "agora-rtc-sdk-ng"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { setStreamPhase } from "../store/actions/tutorial.actions"
import StreamChat from '../cmps/stream-chat.jsx'
import { Error } from "./error";
import { makeCommas, getTimeUntil } from '../services/utils'
import { NavLink } from 'react-router-dom'
import { eventService } from "../services/event.service"
import { setUpperPopup, setResized } from "../store/actions/general.actions"

let options =
{
  appId: 'f4e41c5975dd4a86a326e4c426420ca4',
  channel: 'teamOne636b79ecaa9a2464787e48a9',
  channel2: 'teamOne636cf202090bc65af885478b',
  token: "007eJxTYJj0Nn8W686+hj/tdzzsvlscqjTxZDpe+mR1bGGPusbMkKcKDGkmqSaGyaaW5qYpKSaJFmaJxkZmqSbJJkZmJkYGyYkmrQ3VyQ2BjAzy+U6sjAwQCOYzlKQm5vrnpZoZmyWZW6YmJyZaJhqZmJmYW5inmlgkWjIwAABQWib1",
  token2: "007eJxTYBCLfHj9bsScb/08O+3fyn5X+nvnTOOmJv6j589L/Xov3tuuwJBmkmpimGxqaW6akmKSaGGWaGxklmqSbGJkZmJkkJxo8rSpOrkhkJEhqGIqAyMUgvjyDCWpibn+ealmxmbJaUYGRgaWBknJZqaJaRYWpibmFkkMDABfRynX",
  uid: String(Math.floor(Math.random() * 10000)),
  role: 'host',
  type: "sports"
}

let channelParameters =
{
  localAudioTrack: null,
  localVideoTrack: null,
  localCamera: null,
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
  const [volume, setVolume] = useState(1000)
  const [openOpt, setOpenOpt] = useState('')
  const { streamInfo } = useSelector((storeState) => storeState.generalModule)
  const { viewers } = useSelector((storeState) => storeState.generalModule)
  const { streamPhase } = useSelector((storeState) => storeState.tutorialModule)
  const { resized } = useSelector((storeState) => storeState.generalModule)
  const isMobile = window.innerWidth < 1100
  let time
  let debounce = useRef(false)
  let volumeRef = useRef()
  let channel = ""
  let APP_ID = "f4e41c5975dd4a86a326e4c426420ca4"

  // if (streamPhase === 0) dispatch(setStreamPhase(1))
  if (!client) {
    setClient(AgoraRTC.createClient({ mode: "live", codec: "vp8" }))
  }

  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--visibility', 'hidden')
      // document.body.style.overflow = "hidden"
      if (window.innerWidth < 1100) document.querySelector('.main-layout').classList.add("main-stream")
      loadCameras()
      loadMics()
      window.addEventListener("resize", onRotate)
    }
    catch (err) {
      console.log(err)
    }
    return () => {
      document.documentElement.style.setProperty('--visibility', 'visible')
      // document.body.style.overflow = "auto"
      initStopOne(client, 'no-home')
      try {
        client.unpublish()
      }
      catch {
        console.log('no client')
      }
      if (window.innerWidth < 550) document.querySelector('.main-layout').classList.remove("main-stream")
      window.removeEventListener("resize", onRotate)
      dispatch(setResized(false))
    }
  }, [])

  useEffect(() => {
    joinRoom()
  }, [client])

  useEffect(() => {
    try {
      const agora = document.getElementById('agora_local')
      if (agora) {
        const width = agora.offsetWidth
        document.documentElement.style.setProperty('--video-height', (width * 9 / 16) + 'px')
        console.log('scroll')
      }
    }
    catch (err) {
      console.log(err)
    }

  }, [currentEvent])

  useEffect(() => {
    if (cameras.length) play()
  }, [cameraIdx])

  useEffect(() => {
    if (mics.length) play('mic')
  }, [micIdx])

  useEffect(() => {
    if (!debounce.current) {
      debounce.current = true
      setTimeout(() => {
        channelParameters.localAudioTrack.setVolume(Number(volumeRef.current.value))
        client.unpublish()
        client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
      }, 100)
      if (time) clearTimeout(time)
      time = setTimeout(() => {
        debounce.current = false
      }, 500)
    }
  }, [volume])

  const createVideo = async () => {
    const config = await AgoraRTC.createCameraVideoTrack({
      optimizationMode: 'motion',
      encoderConfig: {
        bitrateMax: 3000,
        frameRate: { min: 25, max: 60 },
      }
    })
    return config
  }

  const switchCamera = async () => {
    setCameraIdx(cameraIdx === cameras.length - 1 ? 0 : cameraIdx + 1)
  }

  const sliderChange = async (e) => {
    setVolume(e.target.value)
  }

  const loadBackCamrea = async () => {
    const cameras = await AgoraRTC.getCameras()
    const backCameraIdx = cameras.findIndex(camera => camera.label.toLowerCase().includes('back'))
    if (backCameraIdx !== -1) setCameraIdx(backCameraIdx)
    else play()
  }

  const play = async (device) => {
    window.scrollTo(0, document.body.scrollHeight)
    const cameras = await AgoraRTC.getCameras()
    const mics = await AgoraRTC.getMicrophones()

    if (device === 'mic') {
      const config = await AgoraRTC.createMicrophoneAudioTrack()
      config.setDevice(mics[micIdx].deviceId)
      config.setVolume(Number(volume))
      channelParameters.localAudioTrack = config
      setIsMuted(false)
    }
    else {
      const config = await createVideo()
      if (!cameras[cameraIdx]) {
        setCameraIdx(0)
        return
      }
      if (channelParameters.localVideoTrack) channelParameters.localVideoTrack.stop()
      config.setDevice(cameras[cameraIdx].deviceId)
      channelParameters.localVideoTrack = config
      channelParameters.localVideoTrack.play("agora_local")
    }
    if (status === 'live') {
      client.unpublish()
      client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
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
    const config = await AgoraRTC.createMicrophoneAudioTrack()
    config.setMuted(true)
    channelParameters.localAudioTrack = config
    await client.unpublish()
    await client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
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
  }

  const onRotate = () => {
    if (!resized) {
      dispatch(setResized(true))
      window.location.reload()
    }
    else if (window.innerWidth < 550) {
      dispatch(setResized(false))
      window.location.reload()
    }
  }

  function initStopOne(client, path) {
    try {
      if (channelParameters.localAudioTrack) {
        client.unpublish()
        channelParameters.localVideoTrack.stop()
        channelParameters.localVideoTrack.close()
        channelParameters.localAudioTrack.stop()
        channelParameters.localAudioTrack.close()
        channelParameters.localAudioTrack = null
        channelParameters.localVideoTrack = null
      }

      client.remoteUsers.forEach(user => {
        client.unsubscribe(user)
      })
      client.removeAllListeners()
      client.leave()
      if (!path) window.location = '/'
    }
    catch (err) {
      console.log('init' + err)
    }
  }

  const joinRoom = async () => {
    try {
      let uid = String(Math.floor(Math.random() * 10000))
      channel = String(streamInfo._id)
      let token = await userService.getStreamTokenClient({ channel: channel, uid: uid, role: options.role })
      options.type = streamInfo.category
      uid = await client.join(APP_ID, channel, token.rtcToken, uid)
      await client.setClientRole(options.role)
      setCurrentEvent(streamInfo)
      streamGaming(client);
    }

    catch (e) {
      console.log("join failed", e)
    }

    client.on("user-published", async (user, mediaType) => {
      setAlreadyStreamed(true)
      console.log("user-published", user, mediaType)
    });
    client.on("user-unpublished", async (user, mediaType) => {
      setAlreadyStreamed(false)
      console.log("user-unpublished", user, mediaType)
    });
  }

  let streamGaming = async (client, live = false) => {
    if (options.type === "sports" && channelParameters.localVideoTrack === null) {
      try {
        channelParameters.localVideoTrack = await createVideo();
      } catch (e) {
        console.log("create video track failed", e);
      }
      try {
        if (!channelParameters.localVideoTrack) {
          channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack();
        }
        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        loadBackCamrea()
      }
      catch (e) {
        console.log("create audio track failed", e)
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

  if (currentEvent.length === 0) return <div className="center-fixed"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div></div></div></div>

  let prizePool = 0
  for (const [key, value] of Object.entries(currentEvent.playersTickets)) {
    prizePool += value
  }
  prizePool = prizePool * 5
  const width = getWidth(prizePool)
  let Modal = modal === 'start' ? 'Start' : 'End'
  const timeUntilEvent = getTimeUntil(currentEvent.date)

  if (window.innerWidth < 550) return <div className="center-fixed rotate-phone">
    <svg width="100" height="100" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 0H2.5C1.83703 0 1.20114 0.263394 0.732114 0.732114C0.263366 1.20109 0 1.83703 0 2.5V27.5C0 28.163 0.263394 28.7989 0.732114 29.2679C1.20109 29.7366 1.83703 30 2.5 30H13.5C14.163 30 14.7989 29.7366 15.2679 29.2679C15.7366 28.7989 16 28.163 16 27.5V2.5C16 1.83703 15.7366 1.20114 15.2679 0.732114C14.7989 0.263366 14.163 0 13.5 0ZM15 27.5C15 27.8978 14.842 28.2795 14.5607 28.5607C14.2795 28.8419 13.8977 29 13.5 29H2.50003C2.10226 29 1.72054 28.8419 1.43934 28.5607C1.15814 28.2794 1.00006 27.8977 1.00006 27.5V2.5C1.00006 2.10223 1.15809 1.72051 1.43934 1.43931C1.72059 1.15811 2.10231 1.00003 2.50003 1.00003H4.00003V1.50003C4.00003 1.63262 4.05271 1.75985 4.14646 1.8536C4.24021 1.94735 4.36744 2.00003 4.50003 2.00003H11.5C11.6326 2.00003 11.7599 1.94735 11.8536 1.8536C11.9473 1.75985 12 1.63262 12 1.50003V1.00003H13.5C13.8978 1.00003 14.2795 1.15806 14.5607 1.43931C14.8419 1.72057 15 2.10229 15 2.5V27.5Z" fill="white" />
      <path d="M27.5 14.0001H18C17.7239 14.0001 17.5 14.2239 17.5 14.5001C17.5 14.7762 17.7239 15.0001 18 15.0001H27.5C27.8978 15.0001 28.2795 15.1581 28.5607 15.4393C28.8419 15.7206 29 16.1023 29 16.5V18H28.5C28.2239 18 28 18.2239 28 18.5V25.5C28 25.6326 28.0527 25.7599 28.1464 25.8536C28.2402 25.9473 28.3674 26 28.5 26H29V27.5C29 27.8978 28.8419 28.2795 28.5607 28.5607C28.2794 28.8419 27.8977 29 27.5 29H17C16.7239 29 16.5 29.2239 16.5 29.5C16.5 29.7761 16.7239 30 17 30H27.5C28.163 30 28.7989 29.7366 29.2679 29.2679C29.7366 28.7989 30 28.163 30 27.5V16.5C30 15.837 29.7366 15.2011 29.2679 14.7321C28.7989 14.2634 28.163 14 27.5 14V14.0001Z" fill="white" />
      <path d="M19.1002 5.79994C19.1957 5.92471 19.3433 5.99838 19.5002 5.99994C19.6084 6.00061 19.714 5.96556 19.8002 5.89994C20.0212 5.73431 20.0658 5.42092 19.9002 5.19994L19.1102 4.13988C20.8678 4.43988 22.5049 5.23097 23.8321 6.42182C25.1592 7.61268 26.1223 9.15485 26.6102 10.8701L25.2502 10.0701C25.1357 9.9868 24.9915 9.95599 24.8531 9.98501C24.7145 10.0142 24.5951 10.1006 24.5239 10.223C24.4526 10.3453 24.4368 10.4921 24.4799 10.6267C24.523 10.7616 24.6212 10.8716 24.7502 10.9299L26.9002 12.2C26.9752 12.2464 27.062 12.2705 27.1502 12.2701H27.2801C27.4098 12.2424 27.5198 12.1578 27.5801 12.0399L28.8502 9.88995C28.9895 9.65178 28.9143 9.3462 28.6801 9.20001C28.4395 9.06251 28.133 9.14242 27.9902 9.37991L27.4801 10.25C26.8922 8.43529 25.8176 6.81654 24.3737 5.57014C22.9297 4.32351 21.1714 3.49694 19.2902 3.17997L20.2902 2.41992V2.42014C20.5112 2.25429 20.5558 1.9409 20.3902 1.72014C20.2246 1.49916 19.9112 1.45429 19.6902 1.62014L17.6902 3.12014C17.4694 3.28576 17.4246 3.59916 17.5902 3.82014L19.1002 5.79994Z" fill="white" />
    </svg>

    <h1>Please rotate your phone.</h1>
  </div>

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
            <div key={idx} className={cameraIdx === idx ? 'sub sec-color back-stream' : 'sub'} onClick={() => setCameraIdx(idx)}><p >{idx + 1}.{camera.label}</p></div>)}
          <div className="option main-color" onClick={() => openOpt === 'mic' ? setOpenOpt('') : setOpenOpt('mic')}>
            <p>Microphone</p><span class="material-symbols-outlined">{openOpt === 'mic' ? 'expand_less' : 'expand_more'}</span></div>
          {openOpt === 'mic' && mics.map((mic, idx) =>
            <div key={idx} onClick={() => setMicIdx(idx)} className={micIdx === idx ? 'sub sec-color back-stream' : 'sub'}>
              <p>{idx + 1}. {mic.label.substring(0, mic.label.indexOf('('))}</p></div>)}
          <div className="option main-color" onClick={() => openOpt === 'volume' ? setOpenOpt('') : setOpenOpt('volume')}>
            <p>Volume</p><span class="material-symbols-outlined">{openOpt === 'volume' ? 'expand_less' : 'expand_more'}</span></div>
          {openOpt === 'volume' && <div className="range-wrapper">
            -
            <input type="range" min="0" max="1000" onChange={sliderChange} value={volume} ref={volumeRef} />
            +
          </div>}
        </div>
        <div className="stream">
          <div id="agora_local" className="stream-video">
            {cameras.length === 0 && <div className="no-camera">
              <svg width="141" height="120" viewBox="0 0 141 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1126_3578)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M96.3827 92.7377C98.8906 90.4582 100.496 87.5647 100.973 84.4652L128.32 94.8302C129.658 95.3389 131.125 95.5542 132.586 95.4566C134.047 95.3589 135.456 94.9514 136.685 94.271C137.914 93.5906 138.925 92.659 139.625 91.5608C140.324 90.4626 140.691 89.2326 140.692 87.9827V32.0177C140.691 30.7688 140.324 29.5399 139.624 28.4426C138.925 27.3453 137.916 26.4143 136.687 25.7341C135.459 25.0539 134.052 24.6461 132.592 24.5476C131.132 24.4491 129.667 24.6631 128.328 25.1702L100.973 35.5352C100.414 31.9284 98.3373 28.6177 95.1294 26.2197C91.9216 23.8216 87.8013 22.4998 83.5358 22.5002H37.5647L43.8431 30.0002H83.5358C85.8679 30.0002 88.1045 30.7904 89.7535 32.1969C91.4026 33.6034 92.329 35.5111 92.329 37.5002V82.5002C92.3306 83.8695 91.8927 85.2131 91.0628 86.3852L96.3827 92.7377ZM12.5567 31.3502C11.3947 32.0406 10.4455 32.9605 9.7902 34.0313C9.1349 35.1021 8.79286 36.2923 8.79324 37.5002V82.5002C8.79324 84.4893 9.71966 86.397 11.3687 87.8035C13.0178 89.21 15.2544 90.0002 17.5865 90.0002H61.6758L67.9541 97.5002H17.5865C12.9223 97.5002 8.44906 95.9198 5.15096 93.1068C1.85286 90.2938 0 86.4784 0 82.5002V37.5002C0 32.4377 2.93694 27.9602 7.44787 25.2452L12.5479 31.3502H12.5567ZM131.899 87.9752L101.122 76.3127V43.6877L131.899 32.0177V87.9827V87.9752ZM93.1468 114.675L5.21439 9.6752L12.3721 5.3252L100.304 110.325L93.1468 114.675Z" fill="#F3F3F3" fillOpacity="0.9" />
                </g>
                <defs>
                  <clipPath id="clip0_1126_3578">
                    <rect width="140.692" height="120" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h1>Could not detect any camera</h1>
            </div>}
          </div>
          <div className="stream-control" style={{ zIndex: streamPhase === 3 ? '1001' : 0 }}>
            <div className="options" style={{ width }}>
              <svg className={`clickable ${isMuted ? 'sec-svg' : ''}`} onClick={() => isMuted ? play('mic') : mute()} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path d="M22.7439 14.4978C22.7439 15.3792 22.597 16.2278 22.3282 17.0186L21.0561 15.7465C21.1394 15.3355 21.1813 14.9172 21.1812 14.4978V12.935C21.1812 12.7278 21.2635 12.5291 21.41 12.3825C21.5566 12.236 21.7553 12.1537 21.9626 12.1537C22.1698 12.1537 22.3685 12.236 22.5151 12.3825C22.6616 12.5291 22.7439 12.7278 22.7439 12.935V14.4978ZM14.9301 20.7489C16.2084 20.7489 17.3961 20.366 18.3869 19.7065L19.509 20.8302C18.3934 21.6392 17.0828 22.137 15.7115 22.2726V25.4372H20.3998C20.607 25.4372 20.8058 25.5196 20.9523 25.6661C21.0988 25.8126 21.1812 26.0114 21.1812 26.2186C21.1812 26.4258 21.0988 26.6246 20.9523 26.7711C20.8058 26.9177 20.607 27 20.3998 27H9.46037C9.25313 27 9.05439 26.9177 8.90785 26.7711C8.76131 26.6246 8.67898 26.4258 8.67898 26.2186C8.67898 26.0114 8.76131 25.8126 8.90785 25.6661C9.05439 25.5196 9.25313 25.4372 9.46037 25.4372H14.1487V22.2726C12.2213 22.0789 10.4346 21.1762 9.13513 19.7396C7.83569 18.303 7.11619 16.4349 7.11621 14.4978V12.935C7.11621 12.7278 7.19854 12.5291 7.34507 12.3825C7.49161 12.236 7.69036 12.1537 7.8976 12.1537C8.10483 12.1537 8.30358 12.236 8.45012 12.3825C8.59666 12.5291 8.67898 12.7278 8.67898 12.935V14.4978C8.67898 16.1557 9.33758 17.7457 10.5099 18.918C11.6822 20.0903 13.2722 20.7489 14.9301 20.7489ZM19.6184 6.68395V14.3087L18.0556 12.7459V6.68395C18.0592 5.86859 17.7441 5.08409 17.1774 4.49784C16.6107 3.91159 15.8374 3.56999 15.0223 3.54593C14.2073 3.52187 13.4152 3.81725 12.8149 4.36905C12.2146 4.92085 11.8537 5.68539 11.8092 6.49954L10.4887 5.179C10.8465 4.12763 11.5657 3.23734 12.5185 2.66663C13.4712 2.09592 14.5955 1.88183 15.6913 2.06246C16.7871 2.24309 17.7832 2.80673 18.5024 3.65303C19.2215 4.49933 19.617 5.57337 19.6184 6.68395Z"
                  fill='white' fillOpacity="0.9" />
                <path d="M17.2521 18.5722L16.0832 17.4032C15.6091 17.5914 15.0961 17.6608 14.589 17.6051C14.0819 17.5495 13.5962 17.3706 13.1742 17.0841C12.7521 16.7975 12.4067 16.412 12.1679 15.9613C11.9291 15.5105 11.8043 15.0081 11.8043 14.498V13.1259L10.2415 11.5631V14.498C10.2413 15.319 10.4566 16.1256 10.866 16.8372C11.2753 17.5488 11.8644 18.1404 12.5742 18.5529C13.284 18.9654 14.0896 19.1843 14.9106 19.1877C15.7315 19.191 16.539 18.9788 17.2521 18.5722ZM5 4.11181L23.7533 22.8651L24.8597 21.7586L6.10644 3.00537L5 4.11181Z"
                  fill='white' fillOpacity="0.9" />
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
        <StreamChat eventName={currentEvent.category == "sports" ? `${currentEvent._id}` : `${currentEvent._id}`}
          zIndex={streamPhase === 2 ? '1001' : '0'} end={isEnd} cameraIdx={cameraIdx} cameras={cameras} />
      </div>}

      {isMobile && <section className="stream-mobile" >
        <section className="left-wrapper">
          <div className="upper">
            <div onClick={() => { hasStarted() ? setModal('end-event') : dispatch(setUpperPopup(timeUntilEvent)) }} className="end-event-mobile">End Event</div>
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

          <div id="agora_local" className="stream-video-mobile">
            {cameras.length === 0 && <div className="no-camera">
              <svg width="141" height="120" viewBox="0 0 141 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1126_3578)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M96.3827 92.7377C98.8906 90.4582 100.496 87.5647 100.973 84.4652L128.32 94.8302C129.658 95.3389 131.125 95.5542 132.586 95.4566C134.047 95.3589 135.456 94.9514 136.685 94.271C137.914 93.5906 138.925 92.659 139.625 91.5608C140.324 90.4626 140.691 89.2326 140.692 87.9827V32.0177C140.691 30.7688 140.324 29.5399 139.624 28.4426C138.925 27.3453 137.916 26.4143 136.687 25.7341C135.459 25.0539 134.052 24.6461 132.592 24.5476C131.132 24.4491 129.667 24.6631 128.328 25.1702L100.973 35.5352C100.414 31.9284 98.3373 28.6177 95.1294 26.2197C91.9216 23.8216 87.8013 22.4998 83.5358 22.5002H37.5647L43.8431 30.0002H83.5358C85.8679 30.0002 88.1045 30.7904 89.7535 32.1969C91.4026 33.6034 92.329 35.5111 92.329 37.5002V82.5002C92.3306 83.8695 91.8927 85.2131 91.0628 86.3852L96.3827 92.7377ZM12.5567 31.3502C11.3947 32.0406 10.4455 32.9605 9.7902 34.0313C9.1349 35.1021 8.79286 36.2923 8.79324 37.5002V82.5002C8.79324 84.4893 9.71966 86.397 11.3687 87.8035C13.0178 89.21 15.2544 90.0002 17.5865 90.0002H61.6758L67.9541 97.5002H17.5865C12.9223 97.5002 8.44906 95.9198 5.15096 93.1068C1.85286 90.2938 0 86.4784 0 82.5002V37.5002C0 32.4377 2.93694 27.9602 7.44787 25.2452L12.5479 31.3502H12.5567ZM131.899 87.9752L101.122 76.3127V43.6877L131.899 32.0177V87.9827V87.9752ZM93.1468 114.675L5.21439 9.6752L12.3721 5.3252L100.304 110.325L93.1468 114.675Z" fill="#F3F3F3" fillOpacity="0.9" />
                </g>
                <defs>
                  <clipPath id="clip0_1126_3578">
                    <rect width="140.692" height="120" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <h1>Could not detect any camera</h1>
            </div>}
          </div>
          <div className="lower" style={{ zIndex: streamPhase === 3 ? '1001' : 0 }}>
            <NavLink to='/'><img className="smaller" src={require('../style/imgs/stream/home.png')} /></NavLink>
            {status != "live" ? <img onClick={() => { hasStarted() ? setModal('start') : dispatch(setUpperPopup(timeUntilEvent)) }} src={require('../style/imgs/stream/start.png')} />
              : <img onClick={() => setModal('end')} src={require('../style/imgs/stream/pause.png')} />}
            <svg className={`clickable ${isMuted ? 'sec-svg' : ''}`} onClick={() => isMuted ? play('mic') : mute()} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <path d="M22.7439 14.4978C22.7439 15.3792 22.597 16.2278 22.3282 17.0186L21.0561 15.7465C21.1394 15.3355 21.1813 14.9172 21.1812 14.4978V12.935C21.1812 12.7278 21.2635 12.5291 21.41 12.3825C21.5566 12.236 21.7553 12.1537 21.9626 12.1537C22.1698 12.1537 22.3685 12.236 22.5151 12.3825C22.6616 12.5291 22.7439 12.7278 22.7439 12.935V14.4978ZM14.9301 20.7489C16.2084 20.7489 17.3961 20.366 18.3869 19.7065L19.509 20.8302C18.3934 21.6392 17.0828 22.137 15.7115 22.2726V25.4372H20.3998C20.607 25.4372 20.8058 25.5196 20.9523 25.6661C21.0988 25.8126 21.1812 26.0114 21.1812 26.2186C21.1812 26.4258 21.0988 26.6246 20.9523 26.7711C20.8058 26.9177 20.607 27 20.3998 27H9.46037C9.25313 27 9.05439 26.9177 8.90785 26.7711C8.76131 26.6246 8.67898 26.4258 8.67898 26.2186C8.67898 26.0114 8.76131 25.8126 8.90785 25.6661C9.05439 25.5196 9.25313 25.4372 9.46037 25.4372H14.1487V22.2726C12.2213 22.0789 10.4346 21.1762 9.13513 19.7396C7.83569 18.303 7.11619 16.4349 7.11621 14.4978V12.935C7.11621 12.7278 7.19854 12.5291 7.34507 12.3825C7.49161 12.236 7.69036 12.1537 7.8976 12.1537C8.10483 12.1537 8.30358 12.236 8.45012 12.3825C8.59666 12.5291 8.67898 12.7278 8.67898 12.935V14.4978C8.67898 16.1557 9.33758 17.7457 10.5099 18.918C11.6822 20.0903 13.2722 20.7489 14.9301 20.7489ZM19.6184 6.68395V14.3087L18.0556 12.7459V6.68395C18.0592 5.86859 17.7441 5.08409 17.1774 4.49784C16.6107 3.91159 15.8374 3.56999 15.0223 3.54593C14.2073 3.52187 13.4152 3.81725 12.8149 4.36905C12.2146 4.92085 11.8537 5.68539 11.8092 6.49954L10.4887 5.179C10.8465 4.12763 11.5657 3.23734 12.5185 2.66663C13.4712 2.09592 14.5955 1.88183 15.6913 2.06246C16.7871 2.24309 17.7832 2.80673 18.5024 3.65303C19.2215 4.49933 19.617 5.57337 19.6184 6.68395Z"
                fill='white' fillOpacity="0.9" />
              <path d="M17.2521 18.5722L16.0832 17.4032C15.6091 17.5914 15.0961 17.6608 14.589 17.6051C14.0819 17.5495 13.5962 17.3706 13.1742 17.0841C12.7521 16.7975 12.4067 16.412 12.1679 15.9613C11.9291 15.5105 11.8043 15.0081 11.8043 14.498V13.1259L10.2415 11.5631V14.498C10.2413 15.319 10.4566 16.1256 10.866 16.8372C11.2753 17.5488 11.8644 18.1404 12.5742 18.5529C13.284 18.9654 14.0896 19.1843 14.9106 19.1877C15.7315 19.191 16.539 18.9788 17.2521 18.5722ZM5 4.11181L23.7533 22.8651L24.8597 21.7586L6.10644 3.00537L5 4.11181Z"
                fill='white' fillOpacity="0.9" />
            </svg>
          </div>
        </section>
        <StreamChat eventName={currentEvent.category == "sports" ? `${currentEvent._id}` : `${currentEvent._id}`}
          mobile={true} zIndex={streamPhase === 2 ? '1001' : '0'} end={isEnd} cameraIdx={cameraIdx} cameras={cameras} />
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
                if (!alreadyStreamed) streamGaming(client, true)
                else dispatch(setUpperPopup('otherStream'))
                setModal(false)
              }
            }}>{Modal}</div>
          </div>
        </div>
      </>}
    </>)
  }
  catch (err) {
    return <Error />
  }
}
export default Creator;