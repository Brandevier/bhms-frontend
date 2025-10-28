import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Row,
    Col,
    Spin,
    Alert,
    Empty,
    Typography,
    Space,
    message
} from 'antd';
import {
    FileAddOutlined,
    TeamOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    createNurseHandover,
    getAllNurseHandovers,
    deleteNurseHandover,
    updateNurseHandover,
    acknowledgeHandover,
    clearError
} from '../../../redux/slice/nurseHandoverSlice';
import { fetchActiveVisits } from '../../../redux/slice/recordSlice';
import { getAllStaff } from '../../../redux/slice/staff_admin_managment_slice';
// Components
import HandoverCard from './components/HandoverCard';
import HandoverFilters from './components/HandoverFilters';
import HandoverStats from './components/HandoverStats';
import CreateHandoverModal from './components/CreateHandoverModal';
import EmptyState from './components/EmptyState';

const { Title } = Typography;

const HandOverNote = () => {
    const dispatch = useDispatch();
    const {
        handovers,
        loading,
        error,
        success
    } = useSelector((state) => state.nurseHandover);
    const { activeVisits, loading: ActiveVisitLoading } = useSelector((state) => state.records);
    const { allStaffs } = useSelector((state) => state.adminStaffManagement);
    const user = useSelector((state)=>state.auth.user)


    const [filters, setFilters] = useState({
        search: '',
        shift: null,
        status: null,
        dateRange: null
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHandover, setSelectedHandover] = useState(null);

    // Fetch handovers on component mount
    useEffect(() => {
        fetchHandovers();
    }, []);

    // Handle success messages
    useEffect(() => {
        if (success) {
            message.success('Operation completed successfully');
        }
    }, [success]);

    // Handle errors
    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const fetchHandovers = () => {
        const department_id = localStorage.getItem('department_id');
        if (department_id) {
            dispatch(getAllStaff({ department_id }));
            dispatch(fetchActiveVisits({ department_id })); // Fetch active visits for patient selection
            dispatch(getAllNurseHandovers({ department_id }));
        } else {
            message.error("No department ID found. Please ensure you're logged in correctly.");
        }

    };

    const handleCreateHandover = async (handoverData) => {
        try {
            await dispatch(createNurseHandover({
                ...handoverData,
                department_id: localStorage.getItem('department_id'),
                from_nurse_id : user.id
            })).unwrap();
            setModalVisible(false);
            message.success('Handover created successfully');
        } catch (error) {
            message.error('Failed to create handover');
        }
    };

    const handleEditHandover = (handover) => {
        setSelectedHandover(handover);
        setModalVisible(true);
    };

    const handleUpdateHandover = async (updateData) => {
        try {
            await dispatch(updateNurseHandover({
                id: selectedHandover.id,
                updateData
            })).unwrap();
            setModalVisible(false);
            setSelectedHandover(null);
            message.success('Handover updated successfully');
        } catch (error) {
            message.error('Failed to update handover');
        }
    };

    const handleDeleteHandover = async (handover) => {
        try {
            await dispatch(deleteNurseHandover(handover.id)).unwrap();
            message.success('Handover deleted successfully');
        } catch (error) {
            message.error('Failed to delete handover');
        }
    };

    const handleAcknowledgeHandover = async (handover) => {
        try {
            await dispatch(acknowledgeHandover({
                handoverId: handover.id
            })).unwrap();
            message.success('Handover acknowledged successfully');
        } catch (error) {
            message.error('Failed to acknowledge handover');
        }
    };

    const handleFiltersChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            shift: null,
            status: null,
            dateRange: null
        });
    };

    // Filter handovers based on current filters
    const filteredHandovers = handovers.filter(handover => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const patientName = `${handover.visit?.patient?.firstName || ''} ${handover.visit?.patient?.lastName || ''}`.toLowerCase();
            const notes = handover.notes?.toLowerCase() || '';
            const treatments = handover.ongoing_treatments?.toLowerCase() || '';

            if (!patientName.includes(searchLower) &&
                !notes.includes(searchLower) &&
                !treatments.includes(searchLower)) {
                return false;
            }
        }

        if (filters.shift && handover.shift !== filters.shift) return false;
        if (filters.status && handover.status !== filters.status) return false;

        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="mx-auto">
                {/* Header */}
                <Card className="mb-6 border-0 rounded-2xl shadow-sm bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="text-white">
                            <Title level={2} className="text-white m-0 flex items-center">
                                <TeamOutlined className="mr-3" />
                                Nurse Handover Notes
                            </Title>
                            <p className="text-blue-100 m-0 text-lg" onClick={()=>console.log(activeVisits)}>
                                Manage patient care transitions between shifts
                            </p>
                        </div>

                        <Space className="mt-4 lg:mt-0">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={fetchHandovers}
                                loading={loading}
                                size="large"
                                className="bg-white text-blue-600 border-0 hover:bg-blue-50"
                            >
                                Refresh
                            </Button>
                            <Button
                                type="primary"
                                icon={<FileAddOutlined />}
                                onClick={() => setModalVisible(true)}
                                size="large"
                                className="bg-white text-blue-600 border-0 hover:bg-blue-50 font-semibold"
                            >
                                New Handover
                            </Button>
                        </Space>
                    </div>
                </Card>

                {/* Stats */}
                <HandoverStats handovers={handovers} />

                {/* Filters */}
                <HandoverFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onReset={handleResetFilters}
                    loading={loading}
                />

                {/* Content */}
                <Spin spinning={loading} size="large">
                    {filteredHandovers.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {filteredHandovers.map(handover => (
                                <Col xs={24} lg={12} xl={8} key={handover.id}>
                                    <HandoverCard
                                        handover={handover}
                                        onEdit={handleEditHandover}
                                        onDelete={handleDeleteHandover}
                                        onAcknowledge={handleAcknowledgeHandover}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <EmptyState onAddHandover={() => setModalVisible(true)} />
                    )}
                </Spin>

                {/* Create/Edit Modal */}
                <CreateHandoverModal
                    visible={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setSelectedHandover(null);
                    }}
                    onSave={selectedHandover ? handleUpdateHandover : handleCreateHandover}
                    loading={loading}
                    staffList={allStaffs || []} // You'll need to fetch this from your staff slice
                    patientsList={activeVisits.data || []} // You'll need to fetch this from your patients slice
                    initialData={selectedHandover}
                />
            </div>

            {/* Global Styles */}
            <style>{`
        .handover-card {
          transition: all 0.3s ease;
        }
        
        .handover-card:hover {
          transform: translateY(-2px);
        }
        
        .handover-modal .ant-modal-header {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .handover-modal .ant-modal-body {
          padding-top: 8px;
        }
      `}</style>
        </div>
    );
};

export default HandOverNote;