// src/redux/hooks/useDiagnosisAnalysis.js
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDiagnosisAnalysis } from "../slice/diagnosisAnalysisSlice";


export const useDiagnosisAnalysis = () => {
  const dispatch = useDispatch();
  const { topDiseases, genderDistribution, statusSummary, loading, error } =
    useSelector((state) => state.diagnosisAnalysis);

  useEffect(() => {
    dispatch(fetchDiagnosisAnalysis());
  }, [dispatch]);

  return { topDiseases, genderDistribution, statusSummary, loading, error };
};
