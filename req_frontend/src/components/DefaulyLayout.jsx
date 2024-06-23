import React, { useEffect } from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { useStateContext } from '../context/contextprovider'
import axiosClient from '../axiosClient'

const DefaulyLayout = () => {

  const { token, setUser } = useStateContext()

  if (!token) {
    return <Navigate to='/login'></Navigate>
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, []);


  return (
    <div>

      <Outlet></Outlet>
    </div>
  )
}

export default DefaulyLayout
