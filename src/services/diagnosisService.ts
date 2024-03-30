import diagnosisData from "../../data/diagnoses";
import { DiagnosisEntry } from "../types/Diagnosis/types";

const getDiagnosisData = (): DiagnosisEntry[] => {
  return diagnosisData;
};

const addDiagnosis = () => {
  return null;
};

export default {
  getDiagnosisData,
  addDiagnosis
};