// src/redux/hooks/usePatientAnalysis.js
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalVisits,
  fetchVisitsByType,
  fetchAdmissionStats,
  fetchAverageLengthOfStay,
  fetchDischargeStats,
  fetchMonthlyVisits,
  fetchVisitsByDepartment,
  resetPatientAnalysis,
} from "../slice/patientAnalysisSlice";

export const usePatientAnalysis = () => {
  const dispatch = useDispatch();
  const {
    totalVisits,
    visitsByType,
    admissionStats,
    averageStay,
    dischargeStats,
    monthlyVisits,
    visitsByDepartment,
    loading,
    error,
  } = useSelector((state) => state.patientAnalysis);

  return {
    // state
    totalVisits,
    visitsByType,
    admissionStats,
    averageStay,
    dischargeStats,
    monthlyVisits,
    visitsByDepartment,
    loading,
    error,

    // actions
    getTotalVisits: () => dispatch(fetchTotalVisits()),
    getVisitsByType: () => dispatch(fetchVisitsByType()),
    getAdmissionStats: () => dispatch(fetchAdmissionStats()),
    getAverageLengthOfStay: () => dispatch(fetchAverageLengthOfStay()),
    getDischargeStats: () => dispatch(fetchDischargeStats()),
    getMonthlyVisits: () => dispatch(fetchMonthlyVisits()),
    getVisitsByDepartment: () => dispatch(fetchVisitsByDepartment()),
    reset: () => dispatch(resetPatientAnalysis()),
  };
};
