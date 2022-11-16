import { useEffect, useState } from "react";
import { useSelector, useDispatch, } from "react-redux";
import { Link } from "react-router-dom";
import { getOnePrivateChatThunk, loadPrivateChatsThunk } from "../../store/privatechat";
import Chat from "../chat";

function PrivateChats() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const liveChats = useSelector((state) => state.privatechat.allPrivateChats);
  const [chatId, setChatId] = useState(liveChats[0].id)
 
  useEffect(() => {
    dispatch(loadPrivateChatsThunk());
  }, [dispatch]);

  if (!liveChats.length) return <h1>Loading...</h1>;
  //Need to filter servers for only servers that the user is a part of

  const getChannel = (id) => {
    setChatId(id)
    dispatch(getOnePrivateChatThunk(chatId))
  }

  return (
    <div className="chat-index-wrapper">
      <ul className="chat-list-wrapper">
        {liveChats?.map((chat) => (
          <li key={chat?.id}
              className="chat-links"
              onClick={() => getChannel(chat.id)}
            >
              {chat.name}
          </li>
        ))}
      </ul>
        < Chat chat={chatId} /> 
    </div>
  );
}

export default PrivateChats;
