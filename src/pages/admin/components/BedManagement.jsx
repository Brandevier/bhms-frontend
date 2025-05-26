import React,{useEffect} from 'react'
import { getDepartment } from '../../../redux/slice/departmentSlice'
import { useSelector,useDispatch } from 'react-redux'
import { fetchBedsByDepartment,addBedsToDepartment,deleteBed,updateBedStatus } from '../../../redux/slice/bedSlice'

const BedManagement = () => {
    const { departments,loading } = useSelector((state)=>state.departments)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getDepartment())
    },[])


  return (
    <div>BedManagement</div>
  )
}

export default BedManagement