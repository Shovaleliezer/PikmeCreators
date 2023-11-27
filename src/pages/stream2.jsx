import { useEffect, useRef } from 'react'
import io from 'socket.io-client'
const socket = process.env.NODE_ENV === 'production' ? io.connect('https://pikme-server-7vdz.onrender.com') : io.connect('http://localhost:3030')

export function Stream2() {
  const localVideoRef = useRef()
  const remoteVideoRef = useRef()

  useEffect(() => {
    // Set up local video
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream
        const peerConnection = new RTCPeerConnection()

        peerConnection.addStream(stream)

        peerConnection.createOffer()
          .then((offer) => peerConnection.setLocalDescription(offer))
          .then(() => socket.emit('signal', { description: peerConnection.localDescription }))

        socket.on('signal', (data) => {
          if (data.description) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.description))
          } else if (data.candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
          }
        })
      })

    // Set up remote video
    socket.on('signal', (data) => {
      if (data.description) {
        const peerConnection = new RTCPeerConnection()
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.description))

        peerConnection.createAnswer()
          .then((answer) => peerConnection.setLocalDescription(answer))
          .then(() => socket.emit('signal', { description: peerConnection.localDescription }))

        peerConnection.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      } else if (data.candidate) {
        // Handle ICE candidate if needed
      }
    })

    return () => {
      // Clean up resources when the component unmounts
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  )
}
