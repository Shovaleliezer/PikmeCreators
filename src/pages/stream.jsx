import "../style/main.scss"
import { userService } from '../services/user.service'
import AgoraRTC from "agora-rtc-sdk-ng"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState, useRef } from "react"
import { setStreamPhase } from "../store/actions/tutorial.actions"
import StreamChat from '../cmps/stream-chat.jsx'
import { StreamTimer } from "../cmps/stream-timer"
import { Error } from "./error"
import { Timer } from "../cmps/timer"
import { getTimeUntil, putKandM } from '../services/utils'
import { useNavigate } from 'react-router-dom'
import { eventService } from "../services/event.service"
import { setPopup, setUpperPopup } from "../store/actions/general.actions"

let options = {
  cname: 'bbb',
  appId: '2148ba0fc4934b56b78fc915f29945f1',
  channel: 'teamOne636b79ecaa9a2464787e48a9',
  uid: String(Math.floor(Math.random() * (2 ** 32 - 1)) + 1),
  role: 'host',
  type: "sports"
}

let channelParameters = {
  localAudioTrack: null,
  localVideoTrack: null,
  localCamera: null,
}

function Creator() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
  const [isScreen, setIsScreen] = useState(false)
  const [showTimer, setShowTimer] = useState(true)
  const [prizePool, setPrizePool] = useState(0)
  const [volume, setVolume] = useState(500)
  const [openOpt, setOpenOpt] = useState('')
  const [isShare, setIsShare] = useState(true)
  const { streamInfo } = useSelector((storeState) => storeState.generalModule)
  const { viewers } = useSelector((storeState) => storeState.generalModule)
  const { streamPhase } = useSelector((storeState) => storeState.tutorialModule)
  const isMobile = window.innerWidth < 1100
  let time
  let debounce = useRef(false)
  let volumeRef = useRef()
  const tutorialDone = useRef(streamPhase > 3)
  let channel = ""

  if (!client) {
    setClient(AgoraRTC.createClient({ mode: "live", codec: "vp8", role: options.role }))
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--visibility', 'hidden')
    if (window.innerWidth < 1100) document.querySelector('.main-layout').classList.add("main-stream")
    loadCameras()
    loadMics()
    return () => {
      document.documentElement.style.setProperty('--visibility', 'visible')
      initStopOne(client, 'no-home')
      window.removeEventListener('scroll', startTutorialMobile)
      try {
        client.unpublish()
      }
      catch {
        console.log('no client')
      }
      const main = document.querySelector('.main-layout')
      if (main) main.classList.remove("main-stream")
    }
  }, [])

  useEffect(() => {
    if (streamPhase > 3) tutorialDone.current = true
  }, [streamPhase])

  useEffect(() => {
    joinRoom()
  }, [client])

  useEffect(() => {
    try {
      const agora = document.getElementById('agora_local')
      if (agora) {
        const width = agora.offsetWidth
        document.documentElement.style.setProperty('--video-height', (width * 9 / 16) + 'px')
      }

      if (currentEvent.fund) setPrizePool(Number(currentEvent.fund.prize))
      else if (currentEvent.playersTickets) {
        let p = 0
        for (const [key, value] of Object.entries(currentEvent.playersTickets)) p += value
        setPrizePool(p * 0.01)
      }
    }
    catch (err) {
      console.log(err)
    }
  }, [currentEvent])

  useEffect(() => {
    if (isScreen) setIsScreen(false)
    if (cameras.length) play()
  }, [cameraIdx])

  useEffect(() => {
    if (mics.length) play('mic')
  }, [micIdx])

  useEffect(() => {
    if (mics.length) {
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
    }
  }, [volume])

  const createVideo = async () => {
    try {
      const config = await AgoraRTC.createCameraVideoTrack({
        optimizationMode: 'motion',
        encoderConfig: {
          bitrateMax: 3000,
          width: 1280,
          height: 720,
          frameRate: { min: 25, max: 45 },
        }
      })
      return config
    }
    catch (err) {
      console.log('111', err)
    }
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
      await eventService.endEvent(currentEvent._id, currentEvent.fund ? true : isShare)
      setIsEnd(true)
      setModal(false)
      setTimeout(() => { navigate('/') }, 500)
    }
    catch {
      console.log('something went wrong')
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
      let uid = options.uid
      channel = String(streamInfo._id)
      let token = await userService.getStreamTokenClient({ channel: channel, uid, role: options.role })
      options.type = streamInfo.category
      await client.join(options.appId, channel, token.rtcToken, uid)
      await client.setClientRole(options.role)
      setCurrentEvent(streamInfo)
      streamGaming(client)
    }

    catch (e) {
      console.log("join failed", e)
    }

    client.on("user-published", async () => {
      setAlreadyStreamed(true)
    })
    client.on("user-unpublished", async () => {
      setAlreadyStreamed(false)
    })
  }

  const shareScreen = async () => {
    options.type = 'gaming'
    if (channelParameters.localVideoTrack) channelParameters.localVideoTrack.stop()
    channelParameters.localVideoTrack = null
    setIsScreen(true)
    streamGaming(client, status === 'live')
  }

  const streamGaming = async (client, live = false) => {
    if (options.type === "sports" && channelParameters.localVideoTrack === null) {
      try {
        channelParameters.localVideoTrack = await createVideo()
      } catch (e) {
        console.log("create video track failed", e)
      }
      try {
        if (channelParameters.localVideoTrack) {
          channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
          loadBackCamrea()
        }
      }
      catch (e) {
        console.log("create audio track failed", e)
      }
    }

    else if (options.type === "gaming" && channelParameters.localVideoTrack === null) {
      try {
        channelParameters.localVideoTrack = await AgoraRTC.createScreenVideoTrack()
        channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        channelParameters.localVideoTrack.play("agora_local")
      }
      catch (e) {
        console.log("create video track failed", e)
      }
    }
    if (channelParameters.localVideoTrack && channelParameters.localAudioTrack && live) {
      if (!alreadyStreamed) {
        await client.unpublish()
        await client.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack])
        setStatus("live")
      }
    }
  }

  const stopStream = async (client) => {
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

  const startTutorialMobile = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !tutorialDone.current) dispatch(setStreamPhase(1))
  }

  const onCameraClick = (idx) => {
    if (cameraIdx === idx) {
      setIsScreen(false)
      play()
    }
    else setCameraIdx(idx)
  }

  const handleModal = async () => {
    if (modal === 'end') {
      stopStream(client)
      setModal(false)
    }
    else if (modal === "end-event") {
      endEvent()
    }
    else {
      if (!alreadyStreamed) {
        try {
          const confirm = await eventService.startEvent(currentEvent._id)
          if (confirm) streamGaming(client, true)
          else dispatch(setUpperPopup('event-ended-error'))
        }
        catch {
          dispatch(setUpperPopup('errorServer'))
        }
      }
      else dispatch(setUpperPopup('otherStream'))
      setModal(false)
    }
  }

  const recordStream = async () => {
    const videoFrame = document.querySelector('.agora_video_player')
    const stream = videoFrame.captureStream()
    const recorder = new MediaRecorder(stream)
    const chunks = []
    recorder.ondataavailable = e => chunks.push(e.data)
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'video.webm'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    }
    recorder.start()
    setTimeout(() => recorder.stop(), 60_000)
  }

  if (currentEvent.length === 0) return <div className="center-fixed"><div className="home"><div className="loader"><div></div><div></div><div></div><div></div>
    <div></div><div></div><div></div><div></div></div></div></div>

  const width = getWidth(prizePool.toFixed(2))
  const timeUntilEvent = getTimeUntil(currentEvent.date)

  if (streamPhase === 0) {
    if (isMobile) window.addEventListener('scroll', startTutorialMobile)
    else dispatch(setStreamPhase(1))
  }

  try {
    return (<>
      {!isMobile && <div className="stream-container">
        <div className="settings noselect">
          <div className="settings-upper">
            <span className="material-symbols-outlined" onClick={recordStream}>settings</span><p>Options</p>
          </div>
          <div className="option main-color" onClick={() => openOpt === 'camera' ? setOpenOpt('') : setOpenOpt('camera')}>
            <p>Stream source</p><span className="material-symbols-outlined">{openOpt === 'camera' ? 'expand_less' : 'expand_more'}</span>
          </div>
          {openOpt === 'camera' && <>
            <div className={isScreen ? 'sub sec-color back-stream' : 'sub'} onClick={shareScreen}><span class="material-symbols-outlined">desktop_mac</span><p> Screen</p></div>
            {cameras.map((camera, idx) =>
              <div key={idx} className={(!isScreen && cameraIdx === idx) ? 'sub sec-color back-stream' : 'sub'} onClick={() => onCameraClick(idx)}><p>{camera.label}</p></div>)}
          </>}
          <div className="option main-color" onClick={() => openOpt === 'mic' ? setOpenOpt('') : setOpenOpt('mic')}>
            <p>Microphone</p><span className="material-symbols-outlined">{openOpt === 'mic' ? 'expand_less' : 'expand_more'}</span></div>
          {openOpt === 'mic' && mics.map((mic, idx) =>
            <div key={idx} onClick={() => setMicIdx(idx)} className={micIdx === idx ? 'sub sec-color back-stream' : 'sub'}>
              <p>{idx + 1}. {mic.label.substring(0, mic.label.indexOf('('))}</p></div>)}
          <div className="option main-color" onClick={() => openOpt === 'volume' ? setOpenOpt('') : setOpenOpt('volume')}>
            <p>Volume</p><span className="material-symbols-outlined">{openOpt === 'volume' ? 'expand_less' : 'expand_more'}</span></div>
          {openOpt === 'volume' && <div className="range-wrapper">
            -
            <input type="range" min="0" max="1000" onChange={sliderChange} value={volume} ref={volumeRef} />
            +
          </div>}
        </div>
        <div className="stream">
          <div id="agora_local" className="stream-video">
            {(cameras.length === 0 && !isScreen) && <div className="no-camera">
              <svg width="141" height="120" viewBox="0 0 141 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1126_3578)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M96.3827 92.7377C98.8906 90.4582 100.496 87.5647 100.973 84.4652L128.32 94.8302C129.658 95.3389 131.125 95.5542 132.586 95.4566C134.047 95.3589 135.456 94.9514 136.685 94.271C137.914 93.5906 138.925 92.659 139.625 91.5608C140.324 90.4626 140.691 89.2326 140.692 87.9827V32.0177C140.691 30.7688 140.324 29.5399 139.624 28.4426C138.925 27.3453 137.916 26.4143 136.687 25.7341C135.459 25.0539 134.052 24.6461 132.592 24.5476C131.132 24.4491 129.667 24.6631 128.328 25.1702L100.973 35.5352C100.414 31.9284 98.3373 28.6177 95.1294 26.2197C91.9216 23.8216 87.8013 22.4998 83.5358 22.5002H37.5647L43.8431 30.0002H83.5358C85.8679 30.0002 88.1045 30.7904 89.7535 32.1969C91.4026 33.6034 92.329 35.5111 92.329 37.5002V82.5002C92.3306 83.8695 91.8927 85.2131 91.0628 86.3852L96.3827 92.7377ZM12.5567 31.3502C11.3947 32.0406 10.4455 32.9605 9.7902 34.0313C9.1349 35.1021 8.79286 36.2923 8.79324 37.5002V82.5002C8.79324 84.4893 9.71966 86.397 11.3687 87.8035C13.0178 89.21 15.2544 90.0002 17.5865 90.0002H61.6758L67.9541 97.5002H17.5865C12.9223 97.5002 8.44906 95.9198 5.15096 93.1068C1.85286 90.2938 0 86.4784 0 82.5002V37.5002C0 32.4377 2.93694 27.9602 7.44787 25.2452L12.5479 31.3502H12.5567ZM131.899 87.9752L101.122 76.3127V43.6877L131.899 32.0177V87.9827V87.9752ZM93.1468 114.675L5.21439 9.6752L12.3721 5.3252L100.304 110.325L93.1468 114.675Z" fill="#F3F3F3" fillOpacity="0.9" />
                </g>
                <defs>
                  <clipPath id="clip0_1126_3578">
                    <rect width="140.692" height="120" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <p>Could not detect any camera</p>
              <p>You may need to grant access to your camera manually in
                <a target="_blank" href='https://support.google.com/chrome/answer/2693767?hl=en&co=GENIE.Platform%3DDesktop' className="main-color"> Chrome </a> or
                <a target="_blank" href='https://support.apple.com/en-il/guide/mac-help/mchlf6d108da/mac' className="main-color"> Safari</a>, then <span onClick={() => window.location.reload()}>reload the page.</span>
              </p>
              <p>Alternatively, you can <span className="main-color clickable" onClick={shareScreen}>Share your screen</span>.</p>
            </div>}
          </div>
          <div className="stream-control noselect" style={{ zIndex: streamPhase === 3 ? '1001' : 0 }}>
            <div className="options" style={{ width }}>
              {
                isMuted ? <svg className='clickable sec-svg' onClick={() => play('mic')} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M22.7439 14.4978C22.7439 15.3792 22.597 16.2278 22.3282 17.0186L21.0561 15.7465C21.1394 15.3355 21.1813 14.9172 21.1812 14.4978V12.935C21.1812 12.7278 21.2635 12.5291 21.41 12.3825C21.5566 12.236 21.7553 12.1537 21.9626 12.1537C22.1698 12.1537 22.3685 12.236 22.5151 12.3825C22.6616 12.5291 22.7439 12.7278 22.7439 12.935V14.4978ZM14.9301 20.7489C16.2084 20.7489 17.3961 20.366 18.3869 19.7065L19.509 20.8302C18.3934 21.6392 17.0828 22.137 15.7115 22.2726V25.4372H20.3998C20.607 25.4372 20.8058 25.5196 20.9523 25.6661C21.0988 25.8126 21.1812 26.0114 21.1812 26.2186C21.1812 26.4258 21.0988 26.6246 20.9523 26.7711C20.8058 26.9177 20.607 27 20.3998 27H9.46037C9.25313 27 9.05439 26.9177 8.90785 26.7711C8.76131 26.6246 8.67898 26.4258 8.67898 26.2186C8.67898 26.0114 8.76131 25.8126 8.90785 25.6661C9.05439 25.5196 9.25313 25.4372 9.46037 25.4372H14.1487V22.2726C12.2213 22.0789 10.4346 21.1762 9.13513 19.7396C7.83569 18.303 7.11619 16.4349 7.11621 14.4978V12.935C7.11621 12.7278 7.19854 12.5291 7.34507 12.3825C7.49161 12.236 7.69036 12.1537 7.8976 12.1537C8.10483 12.1537 8.30358 12.236 8.45012 12.3825C8.59666 12.5291 8.67898 12.7278 8.67898 12.935V14.4978C8.67898 16.1557 9.33758 17.7457 10.5099 18.918C11.6822 20.0903 13.2722 20.7489 14.9301 20.7489ZM19.6184 6.68395V14.3087L18.0556 12.7459V6.68395C18.0592 5.86859 17.7441 5.08409 17.1774 4.49784C16.6107 3.91159 15.8374 3.56999 15.0223 3.54593C14.2073 3.52187 13.4152 3.81725 12.8149 4.36905C12.2146 4.92085 11.8537 5.68539 11.8092 6.49954L10.4887 5.179C10.8465 4.12763 11.5657 3.23734 12.5185 2.66663C13.4712 2.09592 14.5955 1.88183 15.6913 2.06246C16.7871 2.24309 17.7832 2.80673 18.5024 3.65303C19.2215 4.49933 19.617 5.57337 19.6184 6.68395Z"
                    fill='white' fillOpacity="0.9" />
                  <path d="M17.2521 18.5722L16.0832 17.4032C15.6091 17.5914 15.0961 17.6608 14.589 17.6051C14.0819 17.5495 13.5962 17.3706 13.1742 17.0841C12.7521 16.7975 12.4067 16.412 12.1679 15.9613C11.9291 15.5105 11.8043 15.0081 11.8043 14.498V13.1259L10.2415 11.5631V14.498C10.2413 15.319 10.4566 16.1256 10.866 16.8372C11.2753 17.5488 11.8644 18.1404 12.5742 18.5529C13.284 18.9654 14.0896 19.1843 14.9106 19.1877C15.7315 19.191 16.539 18.9788 17.2521 18.5722ZM5 4.11181L23.7533 22.8651L24.8597 21.7586L6.10644 3.00537L5 4.11181Z"
                    fill='white' fillOpacity="0.9" />
                </svg> :
                  <svg className='clickable' onClick={() => mute()} width="30" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.8 11.1001C1.01217 11.1001 1.21566 11.1844 1.36569 11.3344C1.51571 11.4844 1.6 11.6879 1.6 11.9001V13.5001C1.6 15.1975 2.27428 16.8253 3.47452 18.0256C4.67475 19.2258 6.30261 19.9001 8 19.9001C9.69739 19.9001 11.3253 19.2258 12.5255 18.0256C13.7257 16.8253 14.4 15.1975 14.4 13.5001V11.9001C14.4 11.6879 14.4843 11.4844 14.6343 11.3344C14.7843 11.1844 14.9878 11.1001 15.2 11.1001C15.4122 11.1001 15.6157 11.1844 15.7657 11.3344C15.9157 11.4844 16 11.6879 16 11.9001V13.5001C16 15.4833 15.2634 17.3959 13.933 18.8667C12.6026 20.3375 10.7733 21.2618 8.8 21.4601V24.7001H13.6C13.8122 24.7001 14.0157 24.7844 14.1657 24.9344C14.3157 25.0844 14.4 25.2879 14.4 25.5001C14.4 25.7123 14.3157 25.9158 14.1657 26.0658C14.0157 26.2158 13.8122 26.3001 13.6 26.3001H2.4C2.18783 26.3001 1.98434 26.2158 1.83431 26.0658C1.68429 25.9158 1.6 25.7123 1.6 25.5001C1.6 25.2879 1.68429 25.0844 1.83431 24.9344C1.98434 24.7844 2.18783 24.7001 2.4 24.7001H7.2V21.4601C5.2267 21.2618 3.3974 20.3375 2.06701 18.8667C0.736615 17.3959 -2.49147e-05 15.4833 6.3201e-10 13.5001V11.9001C6.3201e-10 11.6879 0.0842856 11.4844 0.234315 11.3344C0.384344 11.1844 0.587827 11.1001 0.8 11.1001Z" fill="#F3F3FF" />
                    <path d="M11.2002 13.5002C11.2002 14.3489 10.8631 15.1628 10.2629 15.7629C9.66282 16.3631 8.84889 16.7002 8.0002 16.7002C7.1515 16.7002 6.33757 16.3631 5.73745 15.7629C5.13734 15.1628 4.8002 14.3489 4.8002 13.5002V5.5002C4.8002 4.6515 5.13734 3.83757 5.73745 3.23745C6.33757 2.63734 7.1515 2.3002 8.0002 2.3002C8.84889 2.3002 9.66282 2.63734 10.2629 3.23745C10.8631 3.83757 11.2002 4.6515 11.2002 5.5002V13.5002ZM8.0002 0.700195C6.72716 0.700195 5.50626 1.20591 4.60608 2.10608C3.70591 3.00626 3.2002 4.22716 3.2002 5.5002V13.5002C3.2002 14.7732 3.70591 15.9941 4.60608 16.8943C5.50626 17.7945 6.72716 18.3002 8.0002 18.3002C9.27323 18.3002 10.4941 17.7945 11.3943 16.8943C12.2945 15.9941 12.8002 14.7732 12.8002 13.5002V5.5002C12.8002 4.22716 12.2945 3.00626 11.3943 2.10608C10.4941 1.20591 9.27323 0.700195 8.0002 0.700195Z" fill="#F3F3FF" />
                  </svg>}
              <img onClick={() => { hasStarted() ? dispatch(setPopup('/')) : navigate('/') }} src={require('../style/imgs/stream/home.png')} />
            </div>
            <div className="start">
              <StreamTimer status={status} />
              {status != "live" ? <>
                {showTimer ? <Timer eventDate={new Date(currentEvent.date)} setShowTimer={setShowTimer} />
                  : <div className="begin" onClick={() => { hasStarted() ? setModal('start') : dispatch(setUpperPopup(timeUntilEvent)) }}>Go Live </div>}
                <div className="end" onClick={() => { hasStarted() ? setModal('end-event') : dispatch(setUpperPopup(timeUntilEvent)) }}>End Event</div>
              </> :
                <div className="begin" onClick={() => setModal('end')}>Stop Live</div>}
            </div>
            <div className="details">
              <div>
                <img src={currentEvent.fund ? require('../style/imgs/stream/prize.png') : require('../style/imgs/binance-logo.png')} />
                <p>{prizePool.toFixed(2)}</p>
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
            <Timer eventDate={new Date(currentEvent.date)} setShowTimer={setShowTimer} />
            <StreamTimer status={status} />
            <div className="detail-holder">
              <div>
                <img src={require('../style/imgs/stream/viewers.png')} />
                <p>{putKandM(viewers - 1)}</p>
              </div>
              <div>
                <img src={currentEvent.fund ? require('../style/imgs/stream/prize.png') : require('../style/imgs/binance-logo.png')} />
                <p>{prizePool.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div id="agora_local" className="stream-video-mobile">
            {cameras.length === 0 && <div className="no-camera">
              <svg width="141" height="120" viewBox="0 0 141 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1126_3578)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M96.3827 92.7377C98.8906 90.4582 100.496 87.5647 100.973 84.4652L128.32 94.8302C129.658 95.3389 131.125 95.5542 132.586 95.4566C134.047 95.3589 135.456 94.9514 136.685 94.271C137.914 93.5906 138.925 92.659 139.625 91.5608C140.324 90.4626 140.691 89.2326 140.692 87.9827V32.0177C140.691 30.7688 140.324 29.5399 139.624 28.4426C138.925 27.3453 137.916 26.4143 136.687 25.7341C135.459 25.0539 134.052 24.6461 132.592 24.5476C131.132 24.4491 129.667 24.6631 128.328 25.1702L100.973 35.5352C100.414 31.9284 98.3373 28.6177 95.1294 26.2197C91.9216 23.8216 87.8013 22.4998 83.5358 22.5002H37.5647L43.8431 30.0002H83.5358C85.8679 30.0002 88.1045 30.7904 89.7535 32.1969C91.4026 33.6034 92.329 35.5111 92.329 37.5002V82.5002C92.3306 83.8695 91.8927 85.2131 91.0628 86.3852L96.3827 92.7377ZM12.5567 31.3502C11.3947 32.0406 10.4455 32.9605 9.7902 34.0313C9.1349 35.1021 8.79286 36.2923 8.79324 37.5002V82.5002C8.79324 84.4893 9.71966 86.397 11.3687 87.8035C13.0178 89.21 15.2544 90.0002 17.5865 90.0002H61.6758L67.9541 97.5002H17.5865C12.9223 97.5002 8.44906 95.9198 5.15096 93.1068C1.85286 90.2938 0 86.4784 0 82.5002V37.5002C0 32.4377 2.93694 27.9602 7.44787 25.2452L12.5479 31.3502H12.5567ZM131.899 87.9752L101.122 76.3127V43.6877L131.899 32.0177V87.9827V87.9752ZM93.1468 114.675L5.21439 9.6752L12.3721 5.3252L100.304 110.325L93.1468 114.675Z" fill="#F3F3F3" fillOpacity="0.9" />
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
            <img onClick={() => { hasStarted() ? dispatch(setPopup('/')) : navigate('/') }} className="smaller" src={require('../style/imgs/stream/home.png')} />
            {status != "live" ? <img onClick={() => { hasStarted() ? setModal('start') : dispatch(setUpperPopup(timeUntilEvent)) }} src={require('../style/imgs/stream/start.png')} />
              : <img onClick={() => setModal('end')} src={require('../style/imgs/stream/pause.png')} />}
            {isMuted ? <svg className='clickable sec-svg' onClick={() => play('mic')} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" >
              <path d="M22.7439 14.4978C22.7439 15.3792 22.597 16.2278 22.3282 17.0186L21.0561 15.7465C21.1394 15.3355 21.1813 14.9172 21.1812 14.4978V12.935C21.1812 12.7278 21.2635 12.5291 21.41 12.3825C21.5566 12.236 21.7553 12.1537 21.9626 12.1537C22.1698 12.1537 22.3685 12.236 22.5151 12.3825C22.6616 12.5291 22.7439 12.7278 22.7439 12.935V14.4978ZM14.9301 20.7489C16.2084 20.7489 17.3961 20.366 18.3869 19.7065L19.509 20.8302C18.3934 21.6392 17.0828 22.137 15.7115 22.2726V25.4372H20.3998C20.607 25.4372 20.8058 25.5196 20.9523 25.6661C21.0988 25.8126 21.1812 26.0114 21.1812 26.2186C21.1812 26.4258 21.0988 26.6246 20.9523 26.7711C20.8058 26.9177 20.607 27 20.3998 27H9.46037C9.25313 27 9.05439 26.9177 8.90785 26.7711C8.76131 26.6246 8.67898 26.4258 8.67898 26.2186C8.67898 26.0114 8.76131 25.8126 8.90785 25.6661C9.05439 25.5196 9.25313 25.4372 9.46037 25.4372H14.1487V22.2726C12.2213 22.0789 10.4346 21.1762 9.13513 19.7396C7.83569 18.303 7.11619 16.4349 7.11621 14.4978V12.935C7.11621 12.7278 7.19854 12.5291 7.34507 12.3825C7.49161 12.236 7.69036 12.1537 7.8976 12.1537C8.10483 12.1537 8.30358 12.236 8.45012 12.3825C8.59666 12.5291 8.67898 12.7278 8.67898 12.935V14.4978C8.67898 16.1557 9.33758 17.7457 10.5099 18.918C11.6822 20.0903 13.2722 20.7489 14.9301 20.7489ZM19.6184 6.68395V14.3087L18.0556 12.7459V6.68395C18.0592 5.86859 17.7441 5.08409 17.1774 4.49784C16.6107 3.91159 15.8374 3.56999 15.0223 3.54593C14.2073 3.52187 13.4152 3.81725 12.8149 4.36905C12.2146 4.92085 11.8537 5.68539 11.8092 6.49954L10.4887 5.179C10.8465 4.12763 11.5657 3.23734 12.5185 2.66663C13.4712 2.09592 14.5955 1.88183 15.6913 2.06246C16.7871 2.24309 17.7832 2.80673 18.5024 3.65303C19.2215 4.49933 19.617 5.57337 19.6184 6.68395Z"
                fill='white' fillOpacity="0.9" />
              <path d="M17.2521 18.5722L16.0832 17.4032C15.6091 17.5914 15.0961 17.6608 14.589 17.6051C14.0819 17.5495 13.5962 17.3706 13.1742 17.0841C12.7521 16.7975 12.4067 16.412 12.1679 15.9613C11.9291 15.5105 11.8043 15.0081 11.8043 14.498V13.1259L10.2415 11.5631V14.498C10.2413 15.319 10.4566 16.1256 10.866 16.8372C11.2753 17.5488 11.8644 18.1404 12.5742 18.5529C13.284 18.9654 14.0896 19.1843 14.9106 19.1877C15.7315 19.191 16.539 18.9788 17.2521 18.5722ZM5 4.11181L23.7533 22.8651L24.8597 21.7586L6.10644 3.00537L5 4.11181Z"
                fill='white' fillOpacity="0.9" />
            </svg> :
              <svg className='clickable' onClick={() => mute()} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.8 11.1001C1.01217 11.1001 1.21566 11.1844 1.36569 11.3344C1.51571 11.4844 1.6 11.6879 1.6 11.9001V13.5001C1.6 15.1975 2.27428 16.8253 3.47452 18.0256C4.67475 19.2258 6.30261 19.9001 8 19.9001C9.69739 19.9001 11.3253 19.2258 12.5255 18.0256C13.7257 16.8253 14.4 15.1975 14.4 13.5001V11.9001C14.4 11.6879 14.4843 11.4844 14.6343 11.3344C14.7843 11.1844 14.9878 11.1001 15.2 11.1001C15.4122 11.1001 15.6157 11.1844 15.7657 11.3344C15.9157 11.4844 16 11.6879 16 11.9001V13.5001C16 15.4833 15.2634 17.3959 13.933 18.8667C12.6026 20.3375 10.7733 21.2618 8.8 21.4601V24.7001H13.6C13.8122 24.7001 14.0157 24.7844 14.1657 24.9344C14.3157 25.0844 14.4 25.2879 14.4 25.5001C14.4 25.7123 14.3157 25.9158 14.1657 26.0658C14.0157 26.2158 13.8122 26.3001 13.6 26.3001H2.4C2.18783 26.3001 1.98434 26.2158 1.83431 26.0658C1.68429 25.9158 1.6 25.7123 1.6 25.5001C1.6 25.2879 1.68429 25.0844 1.83431 24.9344C1.98434 24.7844 2.18783 24.7001 2.4 24.7001H7.2V21.4601C5.2267 21.2618 3.3974 20.3375 2.06701 18.8667C0.736615 17.3959 -2.49147e-05 15.4833 6.3201e-10 13.5001V11.9001C6.3201e-10 11.6879 0.0842856 11.4844 0.234315 11.3344C0.384344 11.1844 0.587827 11.1001 0.8 11.1001Z" fill="#F3F3FF" />
                <path d="M11.2002 13.5002C11.2002 14.3489 10.8631 15.1628 10.2629 15.7629C9.66282 16.3631 8.84889 16.7002 8.0002 16.7002C7.1515 16.7002 6.33757 16.3631 5.73745 15.7629C5.13734 15.1628 4.8002 14.3489 4.8002 13.5002V5.5002C4.8002 4.6515 5.13734 3.83757 5.73745 3.23745C6.33757 2.63734 7.1515 2.3002 8.0002 2.3002C8.84889 2.3002 9.66282 2.63734 10.2629 3.23745C10.8631 3.83757 11.2002 4.6515 11.2002 5.5002V13.5002ZM8.0002 0.700195C6.72716 0.700195 5.50626 1.20591 4.60608 2.10608C3.70591 3.00626 3.2002 4.22716 3.2002 5.5002V13.5002C3.2002 14.7732 3.70591 15.9941 4.60608 16.8943C5.50626 17.7945 6.72716 18.3002 8.0002 18.3002C9.27323 18.3002 10.4941 17.7945 11.3943 16.8943C12.2945 15.9941 12.8002 14.7732 12.8002 13.5002V5.5002C12.8002 4.22716 12.2945 3.00626 11.3943 2.10608C10.4941 1.20591 9.27323 0.700195 8.0002 0.700195Z" fill="#F3F3FF" />
              </svg>}
            <img src={require('../style/imgs/stream/switch-camera.png')} onClick={switchCamera} />
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
          <h1>{modal.charAt(0).toUpperCase() + modal.slice(1)} {modal == "end-event" ? "?" : "Live Stream?"}</h1>
          <p>This Action cannot be undone. </p>
          {(modal == "end-event" && !currentEvent.fund) && <div className='checkbox-wrapper'>
            <div className='checkbox' onClick={() => setIsShare(!isShare)}>
              {isShare && <span className="main-color noselect material-symbols-outlined">done</span>}
            </div>
            <p>Share rewards with community </p>
          </div>}
          {(modal == "end-event" && currentEvent.fund) && <div className="percent-wrapper">
            <p>Don't forget to share your prize with your investors:</p>
            <img src={require(window.innerHeight < 900 ? '../style/imgs/stream/pay-mobile.jpeg' : '../style/imgs/stream/pay.jpeg')} className={window.innerHeight < 1000 ? 'pay-img-mobile' : 'pay-img'} />
          </div>}
          <div>
            <div className="cancel" onClick={() => setModal(false)}>Cancel</div>
            <div onClick={handleModal}>{modal.charAt(0).toUpperCase() + modal.slice(1)}
            </div>
          </div>
        </div>
      </>}
    </>)
  }
  catch (err) {
    return <Error />
  }
}
export default Creator