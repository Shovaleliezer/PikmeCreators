import React, { useState } from "react"
import { useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { io } from "socket.io-client"
import { setViewers } from '../store/actions/general.actions'
const socket = process.env.NODE_ENV === 'production' ? io.connect('https://pikme-server-7vdz.onrender.com') : io.connect('http://localhost:3030')
const colors = [
    "blue", "cyan", "magenta", "lime", "maroon", "navy", "olive", "teal", "violet", "silver", "gold", "indigo", "coral", "crimson", "fuchsia", "khaki", "lavender", "plum", "turquoise", "wheat", "beige", "azure", "aliceblue", "antiquewhite", "aquamarine", "bisque", "blanchedalmond", "blueviolet", "burlywood", "cadetblue", "chartreuse", "chocolate", "cornflowerblue", "cornsilk", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "honeydew", "hotpink", "indianred", "ivory", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "ol"]

const StreamChat = ({ eventName, mobile, zIndex, end, cameraIdx, cameras, start }) => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const [messages, setMessages] = useState([])
    const [showChat, setShowChat] = useState(true)

    let nickName = (user.creator && user.creator.nickName) ? user.creator.nickName : "Guest" + Math.floor(Math.random() * 10000)
    let randomColor = colors[nickName.charCodeAt(0) % colors.length] || 'white'

    useEffect(() => {
        if (socket && user.creator) socket.emit('joinRoom', { username: user.creator.nickName, roomName: eventName, userId: String(user.creator.phone) })
        return () => socket.off("message")
    }, [])

    useEffect(() => {
        document.getElementById('body-text').scrollTop = document.getElementById('body-text').scrollHeight
    }, [messages])

    useEffect(() => {
        if (start) socket.emit('start-event', eventName)
    }, [start])

    const onEnter = (ev) => {
        if (ev.key === "Enter") sendMessage()
    }

    socket.on('message', (message) => {
        if (message.viewers) dispatch(setViewers(message.viewers))
        if (message.newRoom) setMessages([message])
        else setMessages([...messages, message])
    })

    const sendMessage = () => {
        const message = document.getElementById('input').value
        if (message === "") return
        if (socket) socket.emit('chat', { "nickName": nickName, "message": message, "color": randomColor, roomId: eventName })
        document.getElementById('input').value = ''
        document.getElementById('input').focus()
        document.getElementById('body-text').scrollTop = document.getElementById('body-text').scrollHeight
    }

    const prevent = (e) => {
        e.preventDefault()
    }

    if (cameras && cameras.length > 0) {
        let type = 'normal'
        if (cameras[cameraIdx].label.toLowerCase().includes('back')) type = 'back'
        if (cameras[cameraIdx].label.toLowerCase().includes('front')) type = 'front'
        socket.emit('change-camera', { type, roomId: eventName })
    }

    if (end) socket.emit('end-event', eventName)

    return (<>
        {(mobile && !showChat) ?
            <div className="chat-bar-mobile" style={{ zIndex }}>
                <span className="material-symbols-outlined" >settings</span>
                <p>Live chat</p>
                <span onClick={() => setShowChat(true)} className="material-symbols-outlined">expand_less</span>
            </div> :
            <div className="chat-box" style={{ zIndex }}>
                <div className="chat-header">
                    <h1>Live chat</h1>
                </div>

                <div id="body-text" className="body-text" >
                    {messages.map((message, index) => {
                        return (
                            <div key={index} className="message-div">
                                <div >
                                    <span style={{ color: message.color }}>{message.nickName}</span>
                                    <span style={{ marginLeft: "1px" }} >:</span>
                                    <span style={{ marginLeft: "5px", fontWeight: "lighter" }} >{message.message}</span>
                                </div>
                            </div>)
                    })}
                </div>

                <form className="chat-box-input" onSubmit={prevent}>
                    <input id="input" type="text" onKeyDown={onEnter} placeholder="Type a message" />
                    <input type='submit' style={{ width: '0', padding: '0', borderWidth: '0', visibility: 'hidden' }} />
                    <button style={{ width: '0', padding: '0', borderWidth: '0', visibility: 'hidden' }}></button>
                </form>
            </div>}
    </>)
}

export default StreamChat