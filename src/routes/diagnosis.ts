import express from "express";
import Diagnosis from "../../model/diagnosis";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const diagnosis = await Diagnosis.find({});
    res.json(diagnosis);
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {code, name, latin} = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: "Missing required fields: code and name" });
    }

    const diagnosisEntry = new Diagnosis({
      code,
      name,
      latin,
    });

    const savedDiagnosis = await diagnosisEntry.save();

    res.status(201).json({ message: "Diagnosis created successfully!", diagnosis: savedDiagnosis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  return;
});

export default router;