import React from 'react';
import { InsuranceOutlined } from '@ant-design/icons';

const ClaimsHeader = () => {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <InsuranceOutlined className="mr-3 text-green-500" />
                NHIA Claims Management
            </h1>
            <p className="text-gray-600">
                Manage and track all National Health Insurance Authority claims and reimbursements
            </p>
        </div>
    );
};

export default ClaimsHeader;