import React, { useEffect } from 'react'
import { fetchStoreStatistics } from '../../../redux/slice/inventorySlice'
import { useDispatch,useSelector } from 'react-redux'

const StoreStatistics = () => {
  const dispatch = useDispatch()
  const { statistics,loading } = useSelector((state)=>state.warehouse)


  useEffect(()=>{
    dispatch(fetchStoreStatistics())
  },[])
  
  return (
    <div>
      
    </div>
  )
}

export default StoreStatistics
