import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthCtx } from '../../hooks'
import { BackButton } from '../../components/Common'
import UserForm from './components/UserForm'
import UserProfile from './components/UserProfile'

const Profile = ({ toast, setHasLoaded, renderSr, setSidebarOpen }) => {
    const { dispatch, getUserData, getUserByToken, setUser, state } = useAuthCtx()
    const { pathname } = useLocation()
    const { token }    = state
    const [showCriteria, setShowCriteria] = useState(false)

    const getUser = async () => {
        try {
            const res  = await getUserByToken(token)
            const user = await getUserData(res.data)

            setUser(dispatch, user)
        } catch (err) {
            console.log(err?.message || err)
        }
    }
    
    const handleShowCriteria = () => {
        setShowCriteria(true)
    }

    const handleHideCriteria = () => {
        setShowCriteria(false)
    }

    useEffect(() => {  
        setHasLoaded(true)       
        getUser()        
    }, [])

    return (
        <div className="w-full h-screen overflow-y-auto relative">
            {renderSr()}

            <div className="w-full h-[65px] py-4 px-6.5 bg-white border-b border-gray-500 border-opacity-10 fixed top-0 left-0 z-[2]">
                <BackButton 
                    pathname       = {pathname}
                    setSidebarOpen = {setSidebarOpen}
                />
            </div>

            <div className="mt-14 w-full h-fit flex flex-col justify-center items-center pt-[22.82px] pb-8 md:px-11 sm:px-9 xs:px-7 xxs:px-5 3xs:px-4 bg-white">
                <UserProfile />

                <UserForm 
                    handleHideCriteria = {handleHideCriteria}
                    handleShowCriteria = {handleShowCriteria}
                    showCriteria       = {showCriteria}
                    toast              = {toast} 
                />
            </div>
        </div>
    )
}

export default Profile
