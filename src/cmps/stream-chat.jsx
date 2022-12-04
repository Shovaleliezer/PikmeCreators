// create stream div with text input and send button
import React, { useState, useCallback } from "react";
import { useEffect } from "react";

// get redux state
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io.connect('http://localhost:3030')

// list of colors for the text input
const colors = [
    "blue", "cyan", "magenta", "lime", "maroon", "navy", "olive", "teal", "violet", "silver", "gold", "indigo", "coral", "crimson", "fuchsia", "khaki", "lavender", "plum", "turquoise", "wheat", "beige", "azure", "aliceblue", "antiquewhite", "aquamarine", "bisque", "blanchedalmond", "blueviolet", "burlywood", "cadetblue", "chartreuse", "chocolate", "cornflowerblue", "cornsilk", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "honeydew", "hotpink", "indianred", "ivory", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "ol"];
const joinRoom = (username, roomName) => {
    // create socket io connection
    if (socket) {
        socket.emit('joinRoom', { username, roomName });
    }


}

let inRoom = false;
const StreamChat = ({ eventName }) => {
    const [messages, setMessages] = useState([]);
    // get random color from the list   // useeffect that clean the socket io connection
    useEffect(() => {
        return () => {
            // stop listen to message
            socket.off("message");

        }
    }, [socket])



    var randomColor = colors[Math.floor(Math.random() * colors.length)];
    // gives each letter of the alphabet different color based on user name
    const colorize = (username) => {

        for (let i = 0; i < 1; i++) {
            randomColor = colors[username.charCodeAt(i) % colors.length];
        }

    };




    //

    // get the socket io
    // const socket = io.connect('http://localhost:3030');

    // load username from redux state
    const user = useSelector((state) => state.user)
    let nickName = (user.creator && user.creator.nickName) ? user.creator.nickName : 'bug';

    if (!nickName) nickName = "Guest" + Math.floor(Math.random() * 10000);
    colorize(nickName)
    // useeffect that clean the socket io connection
    useEffect(() => {
        return () => {
            // stop listen to message
            socket.off("message");

        }
    }, [socket])

    // on enter key down send the message
    const onEnter = (ev) => {
        if (ev.key === "Enter") {
            sendMessage();
        }
    };
    // function that gets message input and adds it to the chat div
    const addMessage = (message) => {
        // get the body-text div

    }
    joinRoom(nickName, eventName);
    socket.on('message', (message) => {
        if (message.newRoom) {
            setMessages([message])
        }
        else {
            setMessages([...messages, message])
        }


    }
    )


    // get the message and emit it to the server
    const sendMessage = () => {
        //get the value from the dom input
        const message = document.getElementById('input').value;
        if (message !== "") {
            if (socket) {
                socket.emit('chat', { "nickName": nickName, "message": message, "color": randomColor });
            }

            //clear the input
            document.getElementById('input').value = '';
            //focus the input
            document.getElementById('input').focus();
            //scroll down to the bottom of the chat
            document.getElementById('body-text').scrollTop = document.getElementById('body-text').scrollHeight;
        }



    }

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h1>Stream Chat</h1>

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

                        </div>
                    )
                })}
            </div>
            <div className="chat-box-input">
                <input id="input" type="text" onKeyDown={onEnter} placeholder="Type a message" />

            </div>

        </div>
    )
}

export default StreamChat;