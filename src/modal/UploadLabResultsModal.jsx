import React, { useState } from "react";
import { Modal, Upload, Input, message, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import BhmsButton from "../heroComponents/BhmsButton";
const { Dragger } = Upload;

const UploadLabResultsModal = ({ visible, onClose, onUpload,loading }) => {
  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file

  const uploadProps = {
    name: "file",
    multiple: false, // Single file only
    accept: ".jpg,.jpeg,.png,.pdf,.doc,.docx,.xml",
    beforeUpload: (file) => {
      setSelectedFile(file);
      message.success(`File selected: ${file.name}`);
      return false; // Prevent automatic upload
    },
  };

  const handleUpload = () => {
    if (!selectedFile) {
      message.error("Please select a file to upload.");
      return;
    }

    onUpload(selectedFile, comment); // Pass file & comment to parent
  };

  return (
    <Modal
      title="Upload Lab Results"
      open={visible}
      onCancel={onClose}
      footer={[
        <BhmsButton block={false} outline key="cancel" size="medium" onClick={onClose}>
          Cancel
        </BhmsButton>,
        <BhmsButton key="upload" block={false} size="medium" onClick={handleUpload} disabled={loading}>
          {loading?<Spin/> :'Upload'}
        </BhmsButton>,
      ]}
    >
      <Dragger {...uploadProps} style={{ padding: 20 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Supported formats: JPG, PNG, PDF, DOC, DOCX, XML
        </p>
      </Dragger>

      <Input.TextArea
        placeholder="Add a comment (optional)"
        rows={3}
        style={{ marginTop: 20 }}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </Modal>
  );
};

export default UploadLabResultsModal;
