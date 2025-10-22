import React, { useEffect } from 'react'
import { Navigate, Route, useParams, Routes } from "react-router-dom"
import Homepage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import StudyRoom from './pages/StudyRoom'
import Sidebar from './components/Sidebar/Sidebar'
import { Toaster } from "react-hot-toast"
import { checkAuth } from './reduxToolkit/auth/authSlice'
import { getChannels } from './reduxToolkit/channel/channelSlice'
import { useSelector, useDispatch } from "react-redux"
import Header from './components/Header/Header'
import { connectSocket as initSocket, disconnectSocket as closeSocket } from '../utils/socket'
import { setOnlineUsers } from './reduxToolkit/auth/authSlice'

const Layout = () => {
    const { channelId } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch])

    const { authUser } = useSelector((state) => state.auth);
    useEffect(() => {
        if (authUser) {
            dispatch(getChannels());
        }
    }, [channelId, authUser, dispatch])

    useEffect(() => {
        if (authUser?._id) {
            initSocket(authUser._id, (users) => {
                dispatch(setOnlineUsers(users));
            });

            return () => closeSocket();
        }
    }, [authUser, dispatch]);

    return (
        <div className='h-screen w-full flex flex-row bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'>
            <Toaster />
            {authUser && <Sidebar />}
            <div className='flex flex-col flex-1 overflow-hidden'>
                {authUser && <Header />}
                <div className='flex-1 overflow-y-auto'>
                    <Routes>
                        <Route path='/' element={authUser ? <Homepage /> : <Navigate to="/login" />} />
                        <Route path='/chat/:userId' element={authUser ? <Homepage /> : <Navigate to="/login" />} />
                        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
                        <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
                        <Route path='/settings/:setting' element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
                        <Route path='/study/:channelId' element={authUser ? <StudyRoom /> : <Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Layout