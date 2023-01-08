import React, { useState } from "react"
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { io } from "socket.io-client"
import { setViewers } from '../store/actions/general.actions'
const socket = io.connect('https://pikmeserver.herokuapp.com')
const colors = [
    "blue", "cyan", "magenta", "lime", "maroon", "navy", "olive", "teal", "violet", "silver", "gold", "indigo", "coral", "crimson", "fuchsia", "khaki", "lavender", "plum", "turquoise", "wheat", "beige", "azure", "aliceblue", "antiquewhite", "aquamarine", "bisque", "blanchedalmond", "blueviolet", "burlywood", "cadetblue", "chartreuse", "chocolate", "cornflowerblue", "cornsilk", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "honeydew", "hotpink", "indianred", "ivory", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "ol"];
const joinRoom = (username, roomName) => {
    if (socket) {
        socket.emit('joinRoom', { username, roomName });
    }
}

const StreamChat = ({ eventName, mobile, zIndex, end }) => {
    const [messages, setMessages] = useState([])
    const [showChat, setShowChat] = useState(true)
    const dispatch = useDispatch()
   
    if(end) {
      
        socket.emit('end-event')
    }
    useEffect(() => {
 
        return () => {
            socket.off("message");
        }
    }, [socket])

    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    const colorize = (username) => {

        for (let i = 0; i < 1; i++) {
            randomColor = colors[username.charCodeAt(i) % colors.length];
        }
    }

    const user = useSelector((state) => state.user)
    let nickName = (user.creator && user.creator.nickName) ? user.creator.nickName : 'bug';

    if (!nickName) nickName = "Guest" + Math.floor(Math.random() * 10000);
    colorize(nickName)

    useEffect(() => {
        return () => {
            socket.off("message");
        }
    }, [socket])

    const onEnter = (ev) => {
        if (ev.key === "Enter") {
            sendMessage();
        }
    }

    joinRoom(nickName, eventName);
    socket.on('message', (message) => {
        dispatch(setViewers(message.viewers))
        if (message.newRoom) {
            setMessages([message])
        }
        else {
            setMessages([...messages, message])
        }
    }
    )

    const sendMessage = () => {
        const message = document.getElementById('input').value;
        if (message !== "") {
            if (socket) {
                socket.emit('chat', { "nickName": nickName, "message": message, "color": randomColor })
            }
            document.getElementById('input').value = ''
            document.getElementById('input').focus()
            document.getElementById('body-text').scrollTop = document.getElementById('body-text').scrollHeight
        }
    }

    return (<>
        {(mobile && !showChat) ?
            <div className="chat-bar-mobile" style={{ zIndex }}>
                <span className="material-symbols-outlined">settings</span>
                <p>Live chat</p>
                <span onClick={() => setShowChat(true)} className="material-symbols-outlined">expand_less</span>
            </div> :
            <div className="chat-box" style={{ zIndex }}>
                <div className="chat-header">
                    <h1>Live chat</h1>
                </div>

                <div id="body-text" className="body-text">
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

                <div className="chat-box-input">
                    <input id="input" type="text" onKeyDown={onEnter} placeholder="Type a message" />
                </div>
            </div>}
    </>)
}

export default StreamChat;