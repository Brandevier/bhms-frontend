import React from 'react';
import { Input, InputNumber, Select, DatePicker } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

export const renderFormField = (field) => {
    const commonProps = {
        placeholder: `Enter ${field.label.toLowerCase()}...`,
        size: 'middle',
    };

    switch (field.fieldType) {
        case 'number':
            return (
                <InputNumber 
                    {...commonProps}
                    style={{ width: '100%' }}
                    min={field.minValue}
                    max={field.maxValue}
                    step={field.step || 1}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
            );
        case 'textarea':
            return (
                <TextArea 
                    {...commonProps}
                    rows={4}
                    maxLength={field.maxLength || 500}
                    showCount
                />
            );
        case 'select':
            return (
                <Select 
                    {...commonProps}
                    style={{ width: '100%' }}
                    allowClear
                >
                    {field.options?.map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            );
        case 'date':
            return (
                <DatePicker 
                    {...commonProps}
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                />
            );
        default:
            return (
                <Input 
                    {...commonProps}
                    maxLength={field.maxLength || 255}
                />
            );
    }
};