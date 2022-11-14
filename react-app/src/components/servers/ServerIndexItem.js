import { useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getServerThunk, loadServersThunk } from '../../store/server';
import ServerSettingsModal from './ServerSettingsModal';
import { loadServerChannelsThunk, getChannelThunk } from '../../store/channel';
import ChannelFormModal from '../channels/ChannelFormModal';
import ChannelSettingsModal from '../channels/ChannelSettingsModal';

const ServerIndexItem = () => {
   const dispatch = useDispatch();
   const {serverId} = useParams();
   const servers = useSelector(state => Object.values(state.server.allServers))
   const singleServer = useSelector(state => state.server.currentServer.server)
   const allChannels = useSelector(state => Object.values(state.channel.allChannels))
   const singleChannel = useSelector(state => state.channel?.currentChannel)
   let content;

   useEffect(()=> {
      dispatch(getServerThunk(serverId))
      dispatch(loadServerChannelsThunk(serverId))
   }, [dispatch, serverId])

   useEffect(() => {
      dispatch(loadServersThunk())
   }, [dispatch])

   const showChannel = (channel) => {
      dispatch(getChannelThunk(channel.id))
   }
   singleChannel && singleChannel?.channel?.serverId == serverId ?
   content = (<div>Single Channel: {singleChannel.channel.name}</div>): content=(<div></div>)

   if(!singleServer) {
      return null;
   }

   return(
      <div className='server-index-item-wrapper'>
         <h1>Hello from Server {singleServer?.name}</h1>
         <ul className='servers-list-wrapper'>
            {servers?.map(server => (
               <li key={server?.id}>
                  {/* {server?.name} */}
                  {/* <ServerIndexItem key={server.id} /> */}
                  <Link className='server-links' to={`/servers/${server.id}`} onClick={() => dispatch(getServerThunk(server.id))}>{server.name}</Link>
               </li>
            ))}
         </ul>
         <ServerSettingsModal />
         <h2>TEXT CHANNELS
            <ChannelFormModal/>
         </h2>
         <ul>{allChannels?.map(ele => (
            <li key={ele.id} onClick={() => showChannel(ele)}>{ele.name}<ChannelSettingsModal channelId={ele?.id}/></li>
         ))}</ul>
         {content}

      </div>
   )
}

export default ServerIndexItem;