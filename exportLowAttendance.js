import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbyg88lOW0i1Dfm2O6G3Fqsk3w-HGEl6QO-qEDSLaAWlB3ocUEHaPHGWTmz4KMGQM13o/exec";

async function exportLowAttendance() {
  try {
    console.log("Calculating attendance percentages...");
    const snapshot = await getDocs(collection(db, "attendance"));

    const studentMap = {};
    snapshot.forEach((doc) => {
      const d = doc.data();
      if (!studentMap[d.studentId]) {
        studentMap[d.studentId] = {
          name: d.studentName,
          classId: d.classId,
          total: 0,
          present: 0
        };
      }
      studentMap[d.studentId].total++;
      if (d.status === "present") studentMap[d.studentId].present++;
    });

    const lowAttendance = Object.entries(studentMap)
      .map(([id, s]) => ({
        id, ...s,
        percentage: ((s.present / s.total) * 100).toFixed(1)
      }))
      .filter(s => parseFloat(s.percentage) < 75);

    const rows = lowAttendance.map(s => [
      s.id, s.name, s.classId, s.present, s.total, s.percentage + "%"
    ]);

    console.log(`${lowAttendance.length} students below 75%. Exporting...`);

    const response = await fetch(SHEET_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        sheetName: "Low Attendance Alert",
        headers: ["Student ID", "Name", "Class", "Present Days", "Total Days", "Attendance %"],
        rows: rows
      })
    });

    const text = await response.text();
    console.log("Raw response:", text);

    const result = JSON.parse(text);
    console.log("✅ Low attendance export successful:", result);

  } catch (error) {
    console.error("❌ Export failed:", error.message);
  }
}

exportLowAttendance();