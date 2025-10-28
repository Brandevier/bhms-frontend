import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Space, Divider, message } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { fetchPrescriptionsByVisit } from '../../../../redux/slice/prescriptionSlice';

// Import sub-components
import PrescriptionCard from './components/PrescriptionCard';
import IssueMedicationModal from './components/IssueMedicationModal';
import ClinicalInterventionModal from './components/ClinicalInterventionModal';
import ViewInterventionsModal from './components/ViewInterventionsModal';
import DoseCalculatorButton from './components/DoseCalculatorButton';

const { Title } = Typography;

const PrescriptionDetails = () => {
    const dispatch = useDispatch();
    const { visit_id } = useParams();
    
    // State management
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [issueModalVisible, setIssueModalVisible] = useState(false);
    const [interventionModalVisible, setInterventionModalVisible] = useState(false);
    const [viewInterventionsModalVisible, setViewInterventionsModalVisible] = useState(false);
    
    // Redux selectors
    const { prescriptions, loading } = useSelector((state) => ({
        prescriptions: state.prescription.prescriptions,
        loading: state.prescription.loading
    }));

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (visit_id) {
            dispatch(fetchPrescriptionsByVisit(visit_id));
        }
    }, [visit_id, dispatch]);

    // Handler functions
    const handleIssueMedication = (prescription) => {
        setSelectedPrescription(prescription);
        setIssueModalVisible(true);
    };

    const handleInterventionClick = (prescription) => {
        setSelectedPrescription(prescription);
        if (prescription.clinicalInterventions?.length > 0) {
            setViewInterventionsModalVisible(true);
        } else {
            setInterventionModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setIssueModalVisible(false);
        setInterventionModalVisible(false);
        setViewInterventionsModalVisible(false);
        setSelectedPrescription(null);
    };

    const handleSuccess = () => {
        message.success('Operation completed successfully');
        dispatch(fetchPrescriptionsByVisit(visit_id));
        handleModalClose();
    };

    return (
        <div style={{ padding: '24px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>
                    <MedicineBoxOutlined /> Prescription Details
                </Title>
                <DoseCalculatorButton />
            </div>

            {loading && <div>Loading prescriptions...</div>}

            {prescriptions?.map((prescription, index) => (
                <React.Fragment key={prescription.id}>
                    <PrescriptionCard
                        prescription={prescription}
                        index={index}
                        onIssueMedication={handleIssueMedication}
                        onInterventionClick={handleInterventionClick}
                    />
                    
                    {index < prescriptions.length - 1 && <Divider />}
                </React.Fragment>
            ))}

            {/* Modals */}
            <IssueMedicationModal
                visible={issueModalVisible}
                prescription={selectedPrescription}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
            />

            <ClinicalInterventionModal
                visible={interventionModalVisible}
                prescription={selectedPrescription}
                user={user}
                visitId={visit_id}
                onClose={handleModalClose}
                onSuccess={handleSuccess}
            />

            <ViewInterventionsModal
                visible={viewInterventionsModalVisible}
                prescription={selectedPrescription}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default PrescriptionDetails;