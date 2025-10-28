import React from "react";
import { Card, Avatar, Typography, Tooltip, Badge, Space, Tag, Divider } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
import moment from "moment";
import ProcedureActions from "./ProcedureActions";

const { Text } = Typography;

const statusColors = {
  pending: "orange",
  scheduled: "blue",
  ongoing: "cyan",
  completed: "green",
  canceled: "red",
};

const ProcedureCard = ({ procedure, onStatusChange, onStaffChange }) => {
  const daysLeft = procedure.procedure_datetime 
    ? moment(procedure.procedure_datetime).diff(moment(), 'days')
    : null;

  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Procedure Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Tag color="blue" style={{ fontSize: 16 }}>
              {procedure.procedure_code?.description || 'No procedure name'}
            </Tag>
            <Tag color="gold" style={{ marginLeft: 8 }}>
              {procedure.procedure_code?.code || 'No code'}
            </Tag>
          </div>
          
          {daysLeft !== null && (
            <Tag color={daysLeft <= 0 ? "red" : daysLeft <= 3 ? "orange" : "green"}>
              {daysLeft <= 0 ? "Today" : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
            </Tag>
          )}
        </div>

        {/* Status and Dates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge
            color={statusColors[procedure.status]}
            text={
              <Text style={{ textTransform: 'capitalize' }}>
                {procedure.status}
              </Text>
            }
          />
          <Text type="secondary">
            Created: {moment(procedure.createdAt).format('MMM D, YYYY')}
          </Text>
          {procedure.procedure_datetime && (
            <Text strong>
              Scheduled: {moment(procedure.procedure_datetime).format('MMM D, YYYY h:mm A')}
            </Text>
          )}
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Doctor and Staff */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Text strong>Primary Doctor:</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <Avatar
                size="small"
                src={procedure.primary_doctor?.profile_pic}
                icon={<UserOutlined />}
              />
              <Text>
                Dr. {procedure.primary_doctor?.firstName} {procedure.primary_doctor?.lastName}
              </Text>
            </div>
          </div>

          <div>
            <Text strong>Assisting Staff:</Text>
            {procedure.assisting_staff?.length > 0 ? (
              <Avatar.Group maxCount={3} size="small" style={{ marginTop: 4 }}>
                {procedure.assisting_staff.map(staff => (
                  <Tooltip
                    key={staff.id}
                    title={`${staff.firstName} ${staff.lastName} (${staff.staffID})`}
                  >
                    <Avatar src={staff.profile_pic}>{staff.firstName.charAt(0)}</Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            ) : (
              <Text type="secondary" style={{ marginTop: 4 }}>No assisting staff</Text>
            )}
          </div>
        </div>

        {/* Description */}
        {procedure.description && (
          <div>
            <Text strong>Notes:</Text>
            <div style={{ background: '#f9f9f9', padding: 12, borderRadius: 6, marginTop: 4 }}>
              <Text>{procedure.description}</Text>
            </div>
          </div>
        )}
        {/* display the amount to of nhia and market_price */}
        <div>
          <Text strong>Market Price:</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {procedure.procedure_code?.market_price ? `$${procedure.procedure_code.market_price.toFixed(2)}` : 'N/A'}
          </Text>
          <br />
          <Text strong>NHIA Price:</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {procedure.procedure_code?.nhia_price ? `$${procedure.procedure_code.nhia_price.toFixed(2)}` : 'N/A'}
          </Text>
          <br />  
          <Text strong>NHIA Covered:</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {procedure.procedure_code?.is_nhia_covered ? 'Yes' : 'No'}
          </Text>
        </div>

        {/* Actions */}
        <ProcedureActions 
          procedure={procedure}
          onStatusChange={onStatusChange}
          onStaffChange={onStaffChange}
        />
      </div>
    </Card>
  );
};

export default ProcedureCard;