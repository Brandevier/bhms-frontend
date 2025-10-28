import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions } from '../../redux/slice/admissionSlice';



const NurseStationPage = () => {
    const admissions = useSelector((state) => state.admission.admissions);
    const status = useSelector((state) => state.admission.status);
    const error = useSelector((state) => state.admission.error);

    return (
        <div>NurseStationPage</div>
    )
}

export default NurseStationPage