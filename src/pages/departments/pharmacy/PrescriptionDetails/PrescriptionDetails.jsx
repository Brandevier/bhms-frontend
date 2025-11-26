import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Space, Divider, message, Row, Col } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { fetchPrescriptionsByVisit } from '../../../../redux/slice/prescriptionSlice';

// Import sub-components
import PrescriptionCard from './components/PrescriptionCard';
import IssueMedicationModal from './components/IssueMedicationModal';
import ClinicalInterventionModal from './components/ClinicalInterventionModal';
import ViewInterventionsModal from './components/ViewInterventionsModal';
import DoseCalculatorButton from './components/DoseCalculatorButton';
import PatientDiagnosisPanel from './components/PatientDiagnosisPanel';
import CompactDiagnosisView from './components/CompactDiagnosisView';
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

    // Extract diagnosis data from prescriptions
    const patientDiagnosis = prescriptions?.[0]?.visit?.diagnosis || [];

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
            {/* Header Section */}
            <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
                <Col>
                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                        <MedicineBoxOutlined /> Pharmacy Management
                    </Title>
                    <Typography.Text type="secondary">
                        Patient medication and prescription details
                    </Typography.Text>
                </Col>
                <Col>
                    <DoseCalculatorButton />
                </Col>
            </Row>

            {/* Patient Diagnosis Section */}
            <CompactDiagnosisView diagnosis={patientDiagnosis} />

            <Divider style={{ margin: '32px 0' }} />

            {/* Prescriptions Section */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={3} style={{ marginBottom: '16px' }}>
                    Prescriptions ({prescriptions?.length || 0})
                </Title>
                
                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Typography.Text type="secondary">
                            Loading prescriptions...
                        </Typography.Text>
                    </div>
                )}

                {prescriptions?.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <Typography.Text type="secondary">
                            No prescriptions found for this visit.
                        </Typography.Text>
                    </div>
                )}

                {prescriptions?.map((prescription, index) => (
                    <React.Fragment key={prescription.id}>
                        <PrescriptionCard
                            prescription={prescription}
                            index={index}
                            onIssueMedication={handleIssueMedication}
                            onInterventionClick={handleInterventionClick}
                        />
                        
                        {index < prescriptions.length - 1 && (
                            <Divider style={{ margin: '24px 0' }} />
                        )}
                    </React.Fragment>
                ))}
            </div>

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