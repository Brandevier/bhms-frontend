import React, { useState, useMemo } from 'react';
import { Card, Collapse, Button, Space, Typography, Tag, Badge } from 'antd';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import MedicationGroup from '../groups/MedicationGroup';
import ProcedureGroup from '../groups/ProcedureGroup';
import LabTestGroup from '../groups/LabTestGroup';
import DiagnosisGroup from '../groups/DiagnosisGroup';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ClaimItemsGroupedView = ({ items, onItemUpdate, readOnly = false }) => {
  const [activePanels, setActivePanels] = useState([]);

  // Group items by type
  const groupedItems = useMemo(() => {
    const groups = {
      Medication: [],
      Procedure: [],
      LabTest: [],
      Diagnosis: []
    };

    items?.forEach(item => {
      const type = item.item_type || 'Medication'; // Default to Medication
      if (groups[type]) {
        groups[type].push(item);
      } else {
        groups.Medication.push(item); // Fallback
      }
    });

    return groups;
  }, [items]);

// Get group statistics
  const getItemAmount = (item) => {
    const unitPrice = item.unit_price || item.nhia_amount || item.amount || 0;
    const quantity = item.quantity || 1;
    return unitPrice * quantity;
  };

  const groupStats = useMemo(() => {
    const stats = {};
    Object.keys(groupedItems).forEach(type => {
      const groupItems = groupedItems[type];
      stats[type] = {
        count: groupItems.length,
        totalAmount: groupItems.reduce((sum, item) => sum + getItemAmount(item), 0)
      };
    });
    return stats;
  }, [groupedItems]);

  const handlePanelChange = (keys) => {
    setActivePanels(keys);
  };

  const getGroupColor = (type) => {
    const colors = {
      Medication: 'blue',
      Procedure: 'green',
      LabTest: 'orange',
      Diagnosis: 'purple'
    };
    return colors[type] || 'default';
  };

  const groupComponents = {
    Medication: MedicationGroup,
    Procedure: ProcedureGroup,
    LabTest: LabTestGroup,
    Diagnosis: DiagnosisGroup
  };

  return (
    <div className="claim-items-grouped-view">
      <Title level={4} className="mb-4">Claim Items by Category</Title>
      
      <Collapse 
        activeKey={activePanels}
        onChange={handlePanelChange}
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
        accordion={false}
      >
        {Object.keys(groupedItems).map(type => {
          const GroupComponent = groupComponents[type];
          const itemsInGroup = groupedItems[type];
          const stats = groupStats[type];

          if (itemsInGroup.length === 0) return null;

          return (
            <Panel
              key={type}
              header={
                <Space className="w-full justify-between">
                  <Space>
                    <Tag color={getGroupColor(type)}>{type}</Tag>
                    <Text strong>{type} Items</Text>
                    <Badge 
                      count={stats.count} 
                      showZero 
                      style={{ backgroundColor: getGroupColor(type) }}
                    />
                  </Space>
                  <Space>
                    <Text strong>Total: GHC {stats.totalAmount.toFixed(2)}</Text>
                    {!readOnly && (
                      <Button 
                        type="link" 
                        icon={<EditOutlined />}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle bulk edit for this group
                          console.log(`Edit all ${type} items`);
                        }}
                      >
                        Edit All
                      </Button>
                    )}
                  </Space>
                </Space>
              }
            >
              <GroupComponent 
                items={itemsInGroup}
                onItemUpdate={onItemUpdate}
                readOnly={readOnly}
              />
            </Panel>
          );
        })}
      </Collapse>

      {Object.values(groupedItems).every(group => group.length === 0) && (
        <Card className="text-center py-8">
          <Text type="secondary">No claim items found</Text>
        </Card>
      )}
    </div>
  );
};

export default ClaimItemsGroupedView;