import React, { useState } from "react";
import StoreStatistics from "./StoreStatistics"; // Import statistics component
import { useParams } from "react-router-dom";






const Store = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const { id } = useParams();


  return (
    <>
      <StoreStatistics />
    </>
  );
};

export default Store;
