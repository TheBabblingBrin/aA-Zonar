import { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getServerThunk, loadServersThunk } from '../../../store/server';
import ServerFormModal from '../ServerFormModal';
import { Link, useHistory } from 'react-router-dom';
import ExploreServersModal from '../ExploreServersModal';
import ServerIndexItem from './ServerIndexItem';
import './index.css'

function ServerIndex() {
   const dispatch = useDispatch();
   const history = useHistory()
   const user = useSelector(state => state.session.user)
   let servers = useSelector(state => state.server.allServers);
   servers = Object.values(servers).filter(server => server.users?.filter(person => person.id == user.id).length >= 1)
   useEffect(() => {
      dispatch(loadServersThunk())
   }, [dispatch])

   if(!servers.length) return(<ExploreServersModal />);
   //Need to filter servers for only servers that the user is a part of
   return(
      <div className='server-index-wrapper'>
         <ul className='servers-list-wrapper'>
            <li>
               <input
                  id='home-button'
                  className='server-index-item'
                  type='image'
                  src='https://res.cloudinary.com/degkakjou/image/upload/v1668658495/Zonar/pngfind.com-discord-icon-small_sjbpuo.png'
                  onClick={()=> history.push(`/@me`)}
               >
               </input>
            </li>
            <div className='bar-split'></div>
            {servers?.map(server => (
               <li key={server?.id}>
                  <ServerIndexItem server={server}/>
               </li>
            ))}
         <div className='bar-split'></div>

         <li>
            <ServerFormModal />
         </li>
         <li>
         <ExploreServersModal />
         </li>
         </ul>


      </div>
   );
}

export default ServerIndex
