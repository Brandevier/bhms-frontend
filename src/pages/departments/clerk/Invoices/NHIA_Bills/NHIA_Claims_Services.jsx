import React, { useState } from 'react';
import { Card, Row, Col, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getNHIAClaims } from '../../../../../redux/slice/invoiceSlice.jsx';

// Import Components
import ClaimsHeader from './components/ClaimsHeader';
import StatisticsCards from './components/StatisticsCards';
import ClaimsOverview from './components/ClaimsOverview';
import ClaimsTable from './components/ClaimsTable';
import PatientDetailsModal from './components/PatientDetailsModal';

const NHIA_Claims_Services = () => {
    const dispatch = useDispatch();
    const { loading, nhiaClaims, error } = useSelector((state) => state.invoices);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    React.useEffect(() => {
        dispatch(getNHIAClaims());
    }, [dispatch]);

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedPatient(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading NHIA Claims..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error Loading NHIA Claims"
                description={error}
                type="error"
                showIcon
                className="m-4"
            />
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ClaimsHeader />
            
            <StatisticsCards nhiaClaims={nhiaClaims} />
            
            <ClaimsOverview nhiaClaims={nhiaClaims} />
            
            <ClaimsTable 
                nhiaClaims={nhiaClaims} 
                onViewDetails={handleViewDetails}
                loading={loading}
            />

            <PatientDetailsModal
                visible={modalVisible}
                patient={selectedPatient}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default NHIA_Claims_Services;