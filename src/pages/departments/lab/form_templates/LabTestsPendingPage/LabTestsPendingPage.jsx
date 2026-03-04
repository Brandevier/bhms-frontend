import React, { useState, useEffect } from 'react';
import { Card, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestResults, updateTestResult } from '../../../../../redux/slice/labSlice';
import SearchFilters from './components/SearchFilters';
import LabTestsTable from './components/LabTestsTable';
import EnterResultsModal from './components/EnterResultsModal';

const LabTestsPendingPage = () => {
    const { results, loading } = useSelector((state) => state.lab);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] = useState({
        patientName: '',
        folderNumber: '',
        testName: '',
        dateRange: [],
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTest, setCurrentTest] = useState(null);

    useEffect(() => {
        dispatch(fetchTestResults());
    }, [dispatch]);

    // Filter and format pending tests
    const pendingTests = Array.isArray(results)
        ? results
            .filter(result => result?.status === 'pending')
            .map(result => ({
                key: result.id,
                id: result.id,
                patientName: `${result.visit?.patient?.first_name} ${result.visit?.patient?.last_name}` || 'Unknown',
                attendanceNumber: result.visit?.attendance_number || 'N/A',
                testName: result.template?.lab_tariff?.test_description || 'Unknown Test',
                requestedDate: result.createdAt,
                status: result.status,
                nhiaAmount: result.template?.lab_tariff?.tariff_ghc || '0.00',
                patientAmount: result.template?.lab_tariff?.market_price || '0.00',
                originalData: result,
            }))
        : [];

    const handleEnterResults = (record) => {
        setCurrentTest(record.originalData);
        setIsModalVisible(true);
    };

    const handleSubmitResults = async (formData) => {
        try {
            const payload = {
                values: formData.fieldValues,
                notes: formData.notes,
                verifiedBy: user.id,
                claim_id: currentTest.visit?.claims?.[0]?.id,
                lab_investigation_id: currentTest.template?.lab_tarrif_id,
                attachments: formData.attachments,
            };

            await dispatch(updateTestResult({ 
                id: currentTest.id, 
                resultData: payload 
            })).unwrap();
            
            message.success('Results submitted successfully');
            setIsModalVisible(false);
            setCurrentTest(null);
            dispatch(fetchTestResults()); // Refresh the list
        } catch (error) {
            message.error('Failed to submit results');
            console.error('Submission error:', error);
        }
    };

    const handleSearch = (filters) => {
        setSearchParams(filters);
        // Implement actual search logic here
        console.log('Searching with:', filters);
    };

    const handleReset = () => {
        setSearchParams({
            patientName: '',
            folderNumber: '',
            testName: '',
            dateRange: [],
        });
    };

    return (
        <div className="lab-tests-pending">
            <Card 
                title={
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">Pending Laboratory Tests</span>
                        <div className="text-sm text-gray-500">
                            {pendingTests.length} tests pending results
                        </div>
                    </div>
                } 
                bordered={false}
                className="shadow-sm"
            >
                <SearchFilters
                    searchParams={searchParams}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />

                <LabTestsTable
                    data={pendingTests}
                    loading={loading}
                    onEnterResults={handleEnterResults}
                />
            </Card>

            <EnterResultsModal
                visible={isModalVisible}
                currentTest={currentTest}
                onCancel={() => {
                    setIsModalVisible(false);
                    setCurrentTest(null);
                }}
                onSubmit={handleSubmitResults}
            />
        </div>
    );
};

export default LabTestsPendingPage;