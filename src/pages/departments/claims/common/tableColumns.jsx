import { Badge, Input, InputNumber, Tag, Typography, Form } from "antd";
const { Text } = Typography;

export const baseColumns = (isEditing, Form) => [
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text, record) => {
            return text;
        }
    },
    {
        title: 'NHIA Amount',
        dataIndex: 'nhia_amount',
        key: 'nhia_amount',
        render: (value, record) => {
            return <Badge count={`GHC ${value?.toFixed(2)}`} style={{ backgroundColor: '#52c41a' }} />;
        }
    }
];

export const typeSpecificColumns = (diagnoses = []) => ({
    LabTest: [
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value, record) => {
                return value;
            }
        },
        {
            title: 'Test Code',
            dataIndex: 'gdrg_code',
            key: 'gdrg_code',
            render: (code) => <Tag color="purple">{code || 'N/A'}</Tag>
        },
        {
            title: 'Total Amount',
            key: 'amount',
            render: (_, record) => (
                <Text strong>
                    {`GHC ${((record.unit_price || record.nhia_amount) * (record.quantity || 1)).toFixed(2)}`}
                </Text>
            ),
        }
    ],
    Diagnosis: [
        {
            title: 'Diagnosis Code',
            dataIndex: 'gdrg_code',
            key: 'gdrg_code',
            render: (code) => <Tag color="blue">{code || 'N/A'}</Tag>
        }
    ],
    Medication: [
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value) => value
        },
        {
            title: 'Medication Code',
            dataIndex: 'gdrg_code',
            key: 'gdrg_code',
            render: (code) => <Tag color="orange">{code || 'N/A'}</Tag>
        },
        {
            title: 'Total Amount',
            key: 'amount',
            render: (_, record) => (
                <Text strong>
                    {`GHC ${(record?.unit_price || record?.nhia_amount || 0).toFixed(2)}`}
                </Text>
            ),
        }
    ],
    Procedure: [
        {
            title: 'Procedure Code',
            dataIndex: 'gdrg_code',
            key: 'gdrg_code',
            render: (code) => <Tag color="green">{code || 'N/A'}</Tag>
        },
        {
            title: 'Corresponding Diagnosis',
            dataIndex: 'corresponding_diagnosis',
            key: 'corresponding_diagnosis',
            render: (diagnosis) => diagnosis ? <Tag color="blue">{diagnosis}</Tag> : 'N/A'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value) => value || 'N/A'
        },
        {
            title: 'Total Amount',
            key: 'amount',
            render: (_, record) => (
                <Text strong>
                    {record.quantity
                        ? `GHC ${((record.unit_price || record.nhia_amount) * record.quantity).toFixed(2)}`
                        : `GHC ${(record.unit_price || record.nhia_amount || 0).toFixed(2)}`
                    }
                </Text>
            ),
        }
    ]
});