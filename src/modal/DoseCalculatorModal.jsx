import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
import DoseCalculatorComponent from '../pages/departments/shared/DoseCalculatorComponent';



const DoseCalculatorModal = ({ medications }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button 
        type="primary" 
        icon={<MedicineBoxOutlined />}
        onClick={() => setVisible(true)}
      >
        Open Dose Calculator
      </Button>

      <Modal
        title={
          <div className="flex items-center">
            <MedicineBoxOutlined className="text-xl mr-2 text-blue-600" />
            <span>Medication Dose Calculator</span>
          </div>
        }
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        <div className="p-2">
          <DoseCalculatorComponent medications={medications} />
        </div>
      </Modal>
    </>
  );
};

export default DoseCalculatorModal;