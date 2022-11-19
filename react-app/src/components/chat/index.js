import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from 'socket.io-client';
import { getChannelMessagesThunk, createChannelMessagesThunk, getPrivateChatMessagesThunk, createPrivateChatMessagesThunk } from '../../store/message';
import MessageSettingOptions from '../menus/messageMenu/messageSettings';
import { store } from '../../index';
import './chat.css'

let socket;

const Chat = ({channel}) => {
    const dispatch = useDispatch();
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [currRoom, setCurrRoom] = useState("")
    const [users, setUsers] = useState([])
    const user = useSelector(state => state.session.user)
    const currentChat = useSelector(state => state.privatechat.currentPrivateChat)
    console.log(currentChat)
    useEffect(() => {
        socket = io();
        // open socket connection
        // create websocket

        socket.on("currRoom", (currRoomName) => {
            setCurrRoom(currRoomName.room)
        })


        socket.on("chat", (chat) => {
            setMessages((message) => [...message, chat.message])
        })
        // when component unmounts, disconnect
        return (() => {
            socket.disconnect()
        })
    }, []) // if browser gets angry put chat and channel inside dependency

    useEffect(() =>{
        setMessages([])
        if (channel != null)  {
            dispatch(getChannelMessagesThunk(channel.id))
            socket.emit('join', {channel: channel})
            socket.emit('fetch', {channel: channel} )
            let selected = document.getElementById(`${channel.id}${channel.name}`)
            let nodes = document.getElementsByClassName('channel-links')
            for(let node of nodes){
              if(node.id == `${channel.id}${channel.name}` ){
                node.classList.add('selected-link')
              }else{
                node.classList.remove('selected-link')
              }
            }
          } else {
            dispatch(getPrivateChatMessagesThunk(currentChat.id))
            socket.emit('join', {chat: currentChat.id} )
            socket.emit('fetch', {chat: currentChat.id} )

        }
        async function fetchData() {
            const response = await fetch('/api/users/');
            const responseData = await response.json();
            setUsers(responseData.users);
          }
          fetchData();

    }, [channel, currentChat])

    useEffect(() => {
        socket.on('last_100_messages', (data) => {
        const history = data.messages
            setMessages((state) => [...history.slice(-10)]);
        });
        }, []);



    const populateSocket = () => {
         if (channel != null) {
             socket.emit('fetch', {channel: channel} )
         } else {
             socket.emit("fetch", { chat: currentChat.id });
         }
    }

    const updateChatInput = (e) => {
        setChatInput(e.target.value)
    };

    const sendChat = async (e) => {
        e.preventDefault()
        if (channel == null) {
            socket.emit("fetch", { chat: currentChat.id });

            let payload = {
                userId: user.id,
                privateChatId: currentChat.id,
                message: chatInput,
            };
            let new_message = await dispatch(
                createPrivateChatMessagesThunk(payload)
            );
            socket.emit("chat", {
                msg: { ...new_message },
                room: currRoom,
            });
        } else {

            socket.emit('fetch', {channel: channel})

            let payload = {
                userId: user.id,
                channelId: channel.id,
                message: chatInput
            }
            let new_message = await dispatch(createChannelMessagesThunk(payload))
            socket.emit("chat", { msg: {...new_message}, room: currRoom});
        }
        setChatInput("")
    }


    return (
      user && (
        <div className="chat-div">
          <div className="chat-message-div">
            <div className="all-messages-div">
              {messages?.map((message, ind) => (
                <MessageSettingOptions
                  populateSocket={populateSocket}
                  key={message?.id}
                  message={message}
                  user={user}
                  users={users}
                  chat={currentChat.id}
                />
              ))}
            </div>
          </div>
          <div className='message-form'>
            <form className="message-bar-div" onSubmit={sendChat}>
              <input
                className="message-bar"
                value={chatInput}
                // placeholder={channel.name}
                onChange={updateChatInput}
                // type='submit'
              />
              <button className="message-submit-btn" type="submit"></button>
            </form>
          </div>
        </div>
      )
    );
};


export default Chat;
