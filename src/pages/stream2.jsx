import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { httpService } from '../services/http.service'
import IVSBroadcastClient from 'amazon-ivs-web-broadcast'
let client = null

export function Stream2() {
  const [cameras, setCameras] = useState([])
  const [mics, setMics] = useState([])
  const localVideoRef = useRef()
  const event = useSelector((storeState) => storeState.generalModule.streamInfo)

  useEffect(() => {
    loadEssentials()
  }, [])

  const loadEssentials = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      const devices = await navigator.mediaDevices.enumerateDevices()
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      const lcameras = devices.filter((d) => d.kind === 'videoinput')
      const lmics = devices.filter((d) => d.kind === 'audioinput')
      setCameras(lcameras)
      setMics(lmics)
    }
    catch (err) {
      console.log(err)
    }
  }

  const startStream = async () => {
    try {
      const StreamData = await httpService.post('handle-stream/get-stream-data', { eventId: event._id })
      console.log(StreamData)
      client = IVSBroadcastClient.create({
        streamConfig: IVSBroadcastClient.BASIC_LANDSCAPE,
        ingestEndpoint: StreamData.ingestEndpoint,
      })
      let c = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: cameras[0].deviceId,
          width: {
            ideal: '1280',
          },
          height: {
            ideal: '720',
          },
        },
      })
      let m = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: mics[0].deviceId },
      })
      client.addVideoInputDevice(c, 'camera1', { index: 0 })
      client.addAudioInputDevice(m, 'mic1')
      client.startBroadcast('sk_eu-central-1_Ew6zKfSpFuax_XG0Fom6mGckKkNyOrcGmkqXSZAypBp')
    }
    catch (err) {
      console.log(err)
    }
  }

  const stopStream = () => {
    client.stopBroadcast()
  }



  return (
    <div>
      <video style={{ transform: 'scaleX(-1)' }} ref={localVideoRef} autoPlay />
      <button onClick={startStream}>BROADCAST</button>
      <button onClick={stopStream}>STOP</button>
    </div>
  )
}
