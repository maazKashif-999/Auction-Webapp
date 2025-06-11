import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { authContext } from '../App';

const PrivateRoute = () => {
    const {auth} = useContext(authContext)
    console.log(auth)
    return(
        auth ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoute