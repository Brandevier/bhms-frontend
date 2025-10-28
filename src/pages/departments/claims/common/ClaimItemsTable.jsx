import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { selectAllMedications } from '../../../../redux/slice/nhia_medicationsSlice';
import ItemTypeSection from './ItemTypeSection';
import DiagnosisEditModalWrapper from './DiagnosisEditModalWrapper';
import PrescriptionEditModalWrapper from './PrescriptionEditModalWrapper';
import EditProcedureModal from './EditProcedureModal';
// import EditLabTestModal from './EditLabTestModal';
import AddItemModal from './AddItemModal';
import { useClaimItem } from '../../../../redux/hooks/useClaimItem';
import { fetchActiveVisits } from '../../../../redux/slice/recordSlice';


const ClaimItemsTable = ({ items, onItemUpdate, record, handleGeneralSubmit }) => {
    const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showProcedureModal, setShowProcedureModal] = useState(false);
    const [showLabTestModal, setShowLabTestModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentItemType, setCurrentItemType] = useState('');
    const dispatch = useDispatch()
    const [deleteLoading, setDeleteLoading] = useState(false);
    const medications = useSelector(selectAllMedications);
    const { searchResults: diagnoses = [] } = useSelector((state) => state.icd10);

    // Use the claim item hook for edit operations
    const { updateExistingClaimItem, loading: updateLoading, deleteExistingClaimItem } = useClaimItem();

    // Safely extract data from the record with fallbacks
    const visitId = record?.id || '';
    const claimId = record?.claims?.[0]?.id || '';
    const patientGender = record?.patient?.gender || '';
    const patientId = record?.patient?.id || '';
    const institutionId = record?.institution_id || '';
    const departmentId = record?.department_id || '';

    const handleEditItem = (item) => {
        setCurrentItem(item);
        setCurrentItemType(item.item_type);

        switch (item.item_type) {
            case 'Diagnosis':
                setShowDiagnosisModal(true);
                break;
            case 'Medication':
                setShowPrescriptionModal(true);
                break;
            case 'Procedure':
                setShowProcedureModal(true);
                break;
            case 'LabTest':
                setShowLabTestModal(true);
                break;
            default:
                console.warn(`Edit not implemented for item type: ${item.item_type}`);
                break;
        }
    };

    const handleAddItem = (itemType) => {
        setCurrentItemType(itemType);
        setCurrentItem(null);
        setShowAddItemModal(true);
    };

    // Diagnosis Save Handler using hook
    const handleDiagnosisSave = async (values) => {
        try {
            updateExistingClaimItem({
                id: currentItem.id,
                data: {
                    ...values,
                    item_type: 'Diagnosis'
                }
            });
            message.success('Diagnosis updated successfully');
            handleGeneralSubmit()
            setShowDiagnosisModal(false);

            // Notify parent component if needed
            if (onItemUpdate) {
                onItemUpdate();
            }
        } catch (error) {
            message.error(`Failed to update diagnosis: ${error.message}`);
        }
    };

    // Prescription Save Handler using hook
    const handlePrescriptionSave = async (values) => {
        try {
            updateExistingClaimItem({
                id: currentItem.id,
                data: {
                    ...values,
                    item_type: 'Medication'
                }
            });
            message.success('Prescription updated successfully');
            handleGeneralSubmit()
            setShowPrescriptionModal(false);

            if (onItemUpdate) {
                onItemUpdate();
            }
        } catch (error) {
            message.error(`Failed to update prescription: ${error.message}`);
        }
    };

    // Procedure Save Handler using hook
    const handleProcedureSave = async (values) => {
        console.log('FRONTEND VALUES', values)
        try {
            updateExistingClaimItem({
                id: currentItem.id,
                data: {
                    ...values,
                    item_type: 'Procedure'
                }
            });
            message.success('Procedure updated successfully');
            handleGeneralSubmit()
            setShowProcedureModal(false);

            if (onItemUpdate) {
                onItemUpdate();
            }
        } catch (error) {
            message.error(`Failed to update procedure: ${error.message}`);
        }
    };

    // Lab Test Save Handler using hook
    const handleLabTestSave = async (values) => {
        try {
            await updateExistingClaimItem({
                id: currentItem.id,
                data: {
                    ...values,
                    item_type: 'LabTest'
                }
            });
            message.success('Lab test updated successfully');
            dispatch(fetchActiveVisits())
            setShowLabTestModal(false);

            if (onItemUpdate) {
                onItemUpdate();
            }
        } catch (error) {
            message.error(`Failed to update lab test: ${error.message}`);
        }
    };

    // In ClaimItemsTable component, add this function and pass it down
    const handleDeleteItem = async (item) => {
        try {
            deleteExistingClaimItem(item.id)
            message.success(`${item.item_type} item deleted successfully`);
            handleGeneralSubmit();

        } catch (error) {
            message.error(`Failed to delete ${item.item_type.toLowerCase()} item: ${error.message}`);
            throw error; // Re-throw to handle in ItemTypeSection
        }
    };


    // Group items by type
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.item_type]) {
            acc[item.item_type] = [];
        }
        acc[item.item_type].push(item);
        return acc;
    }, {});

    const handleOnSave = async () => {
        handleGeneralSubmit()
    }

    return (
        <div>
            {/* Add Item Button Section */}
            <div className="mb-4 flex space-x-2">
                <button
                    onClick={() => handleAddItem('Diagnosis')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    + Add Diagnosis
                </button>
                <button
                    onClick={() => handleAddItem('Medication')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    + Add Medication
                </button>
                <button
                    onClick={() => handleAddItem('Procedure')}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    + Add Procedure
                </button>
                <button
                    onClick={() => handleAddItem('LabTest')}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                    + Add Lab Test
                </button>
            </div>

            {/* Items List */}
            {Object.entries(groupedItems).map(([type, items]) => (
                <ItemTypeSection
                    key={type}
                    type={type}
                    items={items}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem} // Pass delete handler
                    onAddItem={handleAddItem}
                    diagnoses={diagnoses}
                    loading={updateLoading}
                    deleteLoading={deleteLoading} // Pass delete loading state
                />
            ))}

            {/* Edit Modals with loading state */}
            <DiagnosisEditModalWrapper
                visible={showDiagnosisModal}
                onCancel={() => setShowDiagnosisModal(false)}
                onSave={handleDiagnosisSave}
                currentDiagnosis={currentItem}
                loading={updateLoading}
            />

            <PrescriptionEditModalWrapper
                visible={showPrescriptionModal}
                onCancel={() => setShowPrescriptionModal(false)}
                onSave={handlePrescriptionSave}
                currentPrescription={currentItem}
                loading={updateLoading}
            />

            <EditProcedureModal
                visible={showProcedureModal}
                onCancel={() => setShowProcedureModal(false)}
                onSave={handleProcedureSave}
                currentProcedure={currentItem}
                diagnoses={diagnoses}
                loading={updateLoading}
            />

            {/* <EditLabTestModal
                visible={showLabTestModal}
                onCancel={() => setShowLabTestModal(false)}
                onSave={handleLabTestSave}
                currentLabTest={currentItem}
                loading={updateLoading}
            /> */}

            {/* Add Item Modal */}
            <AddItemModal
                visible={showAddItemModal}
                onCancel={() => setShowAddItemModal(false)}
                itemType={currentItemType}
                visit_id={visitId}
                claim_id={claimId}
                patient_id={patientId}
                institution_id={institutionId}
                department_id={departmentId}
                gender={patientGender}
                currentRecord={record}
                onSave={handleOnSave}
            />
        </div>
    );
};

export default ClaimItemsTable;