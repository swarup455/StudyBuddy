import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from "react-router-dom"
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

const Layout = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(checkAuth());
    }, [])
   useEffect(() => {
        dispatch(getChannels());
    }, []) 

    const { authUser } = useSelector((state) => state.auth);
    return (
        <div className='flex flex-row bg-zinc-100 dark:bg-zinc-900'>
            <Toaster />
            {authUser && <Sidebar />}
            <Routes>
                <Route path='/' element={authUser ? <Homepage /> : <Navigate to="/login" />} />
                <Route path='/chat/:id' element={authUser ? <Homepage /> : <Navigate to="/login" />} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
                <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path='/settings' element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
                <Route path='/settings/:setting' element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
                <Route path='/study/:channelId' element={authUser ? <StudyRoom /> : <Navigate to="/login" />} />
            </Routes>
        </div>
    )
}

export default Layout