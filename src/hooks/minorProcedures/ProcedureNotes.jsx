import React from 'react';
import { List, Input, Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ProcedureNotes = ({ notes, newNote, onNoteChange, onAddNote }) => (
  <div className="procedure-notes">
    <Divider orientation="left">Procedure Notes</Divider>
    <List
      size="small"
      dataSource={notes}
      renderItem={item => (
        <List.Item>
          <div className="note-item">
            <span className="note-time">{item.time}</span>
            <span className="note-content">{item.action}</span>
          </div>
        </List.Item>
      )}
    />
    <div className="add-note">
      <Input.TextArea
        rows={2}
        value={newNote}
        onChange={onNoteChange}
        placeholder="Document procedure steps..."
      />
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={onAddNote}
        disabled={!newNote}
      >
        Add Note
      </Button>
    </div>
  </div>
);

export default ProcedureNotes;