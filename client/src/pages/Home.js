import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:8081' : 'http://192.168.49.2:30157';
  // const backendUrl = 'http://192.168.49.2:30157'

  
  const fetchUserDetails = async()=>{
    console.log("fetchUserDetails called")
    const l=localStorage.getItem('token')
    console.log("tokencheckf",l)
    try {
        const URL = `${backendUrl}/api/user-details`
        const response = await axios({
          url: URL,
          method: 'GET',  // Specify the HTTP method if needed (GET, POST, etc.)
          headers: {
            'Authorization': `Bearer ${l}`, // Add the Authorization header
          },
          withCredentials: true,  // If needed, include cookies
        });

        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/email")
        }
        // console.log("current user Details",response)
    } catch (error) {
        console.log("error",error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])
  

  /***socket connection */
  useEffect(()=>{
    const socketConnection = io(backendUrl,{
      auth : {
        token : localStorage.getItem('token')
      },
    })

    socketConnection.on('onlineUser',(data)=>{
      // console.log(data)
      dispatch(setOnlineUser(data)) 
    })

    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])


  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`} >
            <Outlet/>
        </section>


        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
    </div>
  )
}

export default Home