import React, { useState } from 'react';
import { Card, InputNumber, Button, Row, Col, Progress, Typography } from 'antd';
import { 
  DropboxOutlined as DropOutlined,
  CalculatorOutlined,
  SyncOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const BloodLossCalculator = () => {
  const [suctionVolume, setSuctionVolume] = useState(0);
  const [laparotomyPads, setLaparotomyPads] = useState(0);
  const [gauzePads, setGauzePads] = useState(0);
  const [irrigationVolume, setIrrigationVolume] = useState(0);
  const [totalEBL, setTotalEBL] = useState(0);

  const calculateEBL = () => {
    // Standard calculations:
    // - Lap pad = ~100 mL blood
    // - Gauze pad = ~10 mL blood
    const calculatedEBL = suctionVolume + (laparotomyPads * 100) + (gauzePads * 10) - irrigationVolume;
    setTotalEBL(Math.max(0, calculatedEBL)); // Prevent negative values
  };

  const resetCalculator = () => {
    setSuctionVolume(0);
    setLaparotomyPads(0);
    setGauzePads(0);
    setIrrigationVolume(0);
    setTotalEBL(0);
  };

  return (
    <Card
      title={
        <span>
          <DropOutlined className="mr-2" />
          Blood Loss Calculator
        </span>
      }
      bordered={false}
      className="shadow-sm"
      extra={
        <Button 
          icon={<SyncOutlined />} 
          onClick={resetCalculator}
        >
          Reset
        </Button>
      }
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <div className="mb-4">
            <Text strong>Suction Volume (mL)</Text>
            <InputNumber
              min={0}
              max={5000}
              value={suctionVolume}
              onChange={setSuctionVolume}
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <Text strong>Laparotomy Pads Used</Text>
            <InputNumber
              min={0}
              max={50}
              value={laparotomyPads}
              onChange={setLaparotomyPads}
              className="w-full"
            />
          </div>
        </Col>
        
        <Col xs={24} md={12}>
          <div className="mb-4">
            <Text strong>Gauze Pads Used</Text>
            <InputNumber
              min={0}
              max={100}
              value={gauzePads}
              onChange={setGauzePads}
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <Text strong>Irrigation Volume (mL)</Text>
            <InputNumber
              min={0}
              max={5000}
              value={irrigationVolume}
              onChange={setIrrigationVolume}
              className="w-full"
            />
          </div>
        </Col>
      </Row>
      
      <div className="mt-4 text-center">
        <Button 
          type="primary" 
          icon={<CalculatorOutlined />}
          onClick={calculateEBL}
          className="mb-4"
        >
          Calculate EBL
        </Button>
        
        {totalEBL > 0 && (
          <div>
            <Text strong className="text-lg">Estimated Blood Loss: </Text>
            <Text strong className="text-red-500 text-xl">{totalEBL} mL</Text>
            
            <Progress
              percent={Math.min(100, (totalEBL / 1500) * 100)}
              status={totalEBL > 1000 ? 'exception' : 'normal'}
              strokeColor={totalEBL > 1000 ? '#ff4d4f' : '#52c41a'}
              className="mt-2"
            />
            
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Minimal Loss</span>
              <span>Significant Loss</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BloodLossCalculator;