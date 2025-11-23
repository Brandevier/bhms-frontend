import React from "react";
import { Typography, Card } from "antd";

const { Title, Text } = Typography;

const Step5Review = ({ formData }) => {
  // Combine all form data
  const allData = {
    ...formData.personalInfo,
    ...formData.contactDetails,
    ...formData.insurance,
    ...formData.emergencyContacts
  };

  const ReviewSection = ({ title, children }) => (
    <div className="mb-6">
      <Title level={5} className="!mb-3">{title}</Title>
      <Card className="bg-gray-50 border-0">
        {children}
      </Card>
    </div>
  );

  const ReviewItem = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
      <Text strong>{label}:</Text>
      <Text>{value || "Not provided"}</Text>
    </div>
  );

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "" || value === false) {
      return "Not provided";
    }
    
    // Handle date objects
    if (value && typeof value.format === 'function') {
      return value.format('MMMM DD, YYYY');
    }
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value;
  };

  const getFullName = () => {
    const firstName = formatValue(allData.first_name);
    const middleName = formatValue(allData.middle_name);
    const lastName = formatValue(allData.last_name);
    
    const nameParts = [firstName, middleName, lastName].filter(part => part !== "Not provided");
    return nameParts.join(' ').trim() || "Not provided";
  };

  const getGenderDisplay = () => {
    const gender = allData.gender;
    if (gender === 'M') return 'Male';
    if (gender === 'F') return 'Female';
    if (gender === 'O') return 'Other';
    return formatValue(gender);
  };

  return (
    <div className="space-y-6">
      <div>
        <Title level={4} className="!mb-2">Review Information</Title>
        <Text type="secondary">Please review all information before submitting</Text>
      </div>

      <ReviewSection title="Personal Information">
        <ReviewItem label="Full Name" value={getFullName()} />
        <ReviewItem label="Gender" value={getGenderDisplay()} />
        <ReviewItem label="Date of Birth" value={formatValue(allData.date_of_birth)} />
        <ReviewItem label="Religion" value={formatValue(allData.religion)} />
      </ReviewSection>

      <ReviewSection title="Contact Information">
        <ReviewItem label="Phone" value={formatValue(allData.phone_number)} />
        <ReviewItem label="Email" value={formatValue(allData.email)} />
        <ReviewItem label="Address" value={formatValue(allData.address)} />
        <ReviewItem label="City" value={formatValue(allData.city)} />
        <ReviewItem label="Country" value={formatValue(allData.country)} />
      </ReviewSection>

      <ReviewSection title="Insurance Information">
        <ReviewItem label="Insurance Status" value={allData.has_insurance ? "Yes" : "No"} />
        {allData.has_insurance && (
          <>
            <ReviewItem label="NHIS Number" value={formatValue(allData.nhis_number)} />
            <ReviewItem label="Insurance Provider" value={formatValue(allData.insurance_provider)} />
            <ReviewItem label="Expiry Date" value={formatValue(allData.insurance_expiry_date)} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title="Emergency Contacts">
        <ReviewItem label="Next of Kin" value={formatValue(allData.next_of_kin_name)} />
        <ReviewItem label="Next of Kin Phone" value={formatValue(allData.next_of_kin_phone)} />
        <ReviewItem label="Relationship" value={formatValue(allData.next_of_kin_relationship)} />
        <ReviewItem label="Emergency Contact" value={formatValue(allData.emergency_contact_name)} />
        <ReviewItem label="Emergency Phone" value={formatValue(allData.emergency_contact_phone)} />
        <ReviewItem label="Relationship" value={formatValue(allData.emergency_contact_relationship)} />
      </ReviewSection>
    </div>
  );
};

export default Step5Review;