import React, { useState } from "react";
import { Input, Row, Col, Tooltip, Typography, Checkbox, message, Select } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import BhmsButton from "../../../heroComponents/BhmsButton";
import { setupInstitutionAccount } from "../../../redux/slice/institutionPayments";
import { useSelector, useDispatch } from "react-redux";

const { Text } = Typography;
const { Option } = Select;

const paystackBanks = [
  { value: "31", label: "Access Bank" },
  { value: "32", label: "ADB Bank Limited" },
  { value: "52", label: "Affinity Ghana Savings and Loans" },
  { value: "76", label: "Absa Bank Ghana Ltd" },
  { value: "182", label: "ARB Apex Bank" },
  { value: "33", label: "Bank of Africa Ghana" },
  { value: "37", label: "CAL Bank Limited" },
  { value: "38", label: "Consolidated Bank Ghana Limited" },
  { value: "39", label: "Ecobank Ghana Limited" },
  { value: "40", label: "FBNBank Ghana Limited" },
  { value: "41", label: "Fidelity Bank Ghana Limited" },
  { value: "42", label: "First Atlantic Bank Limited" },
  { value: "43", label: "First National Bank Ghana Limited" },
  { value: "44", label: "GCB Bank Limited" },
  { value: "45", label: "Guaranty Trust Bank (Ghana) Limited" },
  { value: "46", label: "National Investment Bank Limited" },
  { value: "47", label: "OmniBSIC Bank" },
  { value: "49", label: "Prudential Bank Limited" },
  { value: "50", label: "Republic Bank (GH) Limited" },
  { value: "53", label: "Société Générale Ghana Limited" },
  { value: "54", label: "Stanbic Bank Ghana Limited" },
  { value: "55", label: "Standard Chartered Bank Ghana Limited" },
  { value: "57", label: "Universal Merchant Bank Ghana Limited" },
  { value: "58", label: "Zenith Bank Ghana" },
];

const PaymentIntegration = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.institutionAccounts);

  const [form, setForm] = useState({
    business_name: "",
    settlement_bank: "",
    account_number: "",
    bank_code: "",
    primary_contact_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    administrator_name: "",
  });

  const [policyAccepted, setPolicyAccepted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  // Handle policy checkbox
  const handlePolicyChange = (e) => {
    setPolicyAccepted(e.target.checked);
  };

  // Handle form submission
  const handleInstitutionAccountSetup = () => {
    if (!policyAccepted) {
      message.error("You must accept the policy to proceed.");
      return;
    }

    // Dispatch Redux action
    dispatch(setupInstitutionAccount(form))
      .unwrap()
      .then(() => {
        message.success("Institution account created successfully!");
      })
      .catch((err) => {
        message.error(err || "Failed to create account.");
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <Row gutter={24}>
        {/* Business Name */}
        <Col span={12} className="my-3">
          <Tooltip title="Enter the business name of the institution">
            <Input name="business_name" placeholder="Business Name" onChange={handleChange} />
          </Tooltip>
        </Col>

        {/* Administrator Name */}
        <Col span={12} className="my-3">
          <Tooltip title="Administrator responsible for managing the payment system">
            <Input name="administrator_name" placeholder="Administrator Full Name" onChange={handleChange} />
          </Tooltip>
        </Col>

        {/* Primary Contact Name */}
        <Col span={12} className="my-3">
          <Tooltip title="Primary contact person for financial transactions">
            <Input name="primary_contact_name" placeholder="Primary Contact Name" onChange={handleChange} />
          </Tooltip>
        </Col>

        {/* Primary Contact Email */}
        <Col span={12} className="my-3">
          <Tooltip title="Email address for the primary contact person">
            <Input name="primary_contact_email" placeholder="Primary Email" onChange={handleChange} />
          </Tooltip>
        </Col>

        {/* Primary Contact Phone */}
        <Col span={24} className="my-3">
          <Tooltip title="Phone number of the primary contact person">
            <Input name="primary_contact_phone" placeholder="Primary Contact Phone" onChange={handleChange} />
          </Tooltip>
        </Col>

        {/* Bank Account Details */}
        <Col span={12} className="my-3">
          <Tooltip title="Select a bank from the list">
            <Select
              placeholder="Select Bank"
              onChange={(value) => handleSelectChange("settlement_bank", value)}
              style={{ width: "100%" }}
            >
              {paystackBanks.map((bank) => (
                <Option key={bank.value} value={bank.label}>
                  {bank.label}
                </Option>
              ))}
            </Select>
          </Tooltip>
        </Col>

        <Col span={12} className="my-3">
          <Tooltip title="Enter the corresponding bank code">
            <Select
              placeholder="Select Bank Code"
              onChange={(value) => handleSelectChange("bank_code", value)}
              style={{ width: "100%" }}
            >
              {paystackBanks.map((bank) => (
                <Option key={bank.value} value={bank.value}>
                  {bank.value}
                </Option>
              ))}
            </Select>
          </Tooltip>
        </Col>

        <Col span={24} className="my-3">
          <Tooltip title="Bank account number for receiving payments">
            <Input name="account_number" placeholder="Account Number" onChange={handleChange} />
          </Tooltip>
        </Col>

        <Col span={24} className="my-3">
          <Checkbox checked={policyAccepted} onChange={handlePolicyChange}>
            I accept the Hospital Financial Transactions and Integrity Policy
          </Checkbox>
        </Col>

        <Col span={24} className="my-3">
          <BhmsButton type="primary" disabled={!policyAccepted || loading} onClick={handleInstitutionAccountSetup}>
            {loading ? "Creating Account..." : "Create Payment Account"}
          </BhmsButton>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentIntegration;
