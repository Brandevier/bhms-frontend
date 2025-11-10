import React from 'react';
import { Space, Card } from 'antd';

const QuickActions = () => {
    return (
        <div className="p-4 bg-blue-50 rounded-lg h-full">
            <h4 className="font-semibold text-blue-800 mb-3">
                Quick Actions
            </h4>
            <Space direction="vertical" className="w-full">
                <a className="text-blue-600 hover:text-blue-800 text-sm block p-2 hover:bg-blue-100 rounded cursor-pointer">
                    📋 Generate Comprehensive Claims Report
                </a>
                <a className="text-blue-600 hover:text-blue-800 text-sm block p-2 hover:bg-blue-100 rounded cursor-pointer">
                    📧 Submit Bulk Claims to NHIA
                </a>
                <a className="text-blue-600 hover:text-blue-800 text-sm block p-2 hover:bg-blue-100 rounded cursor-pointer">
                    💰 Process NHIA Reimbursements
                </a>
                <a className="text-blue-600 hover:text-blue-800 text-sm block p-2 hover:bg-blue-100 rounded cursor-pointer">
                    📊 View Claims Analytics & Trends
                </a>
                <a className="text-blue-600 hover:text-blue-800 text-sm block p-2 hover:bg-blue-100 rounded cursor-pointer">
                    🔍 Audit Claims History
                </a>
            </Space>
        </div>
    );
};

export default QuickActions;