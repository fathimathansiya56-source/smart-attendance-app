import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbyg88lOW0i1Dfm2O6G3Fqsk3w-HGEl6QO-qEDSLaAWlB3ocUEHaPHGWTmz4KMGQM13o/exec";

async function exportAttendanceToSheets() {
  try {
    console.log("Fetching attendance records...");
    const snapshot = await getDocs(collection(db, "attendance"));
    const rows = [];

    snapshot.forEach((doc) => {
      const d = doc.data();
      rows.push([
        d.date || "",
        d.studentId || "",
        d.studentName || "",
        d.classId || "",
        d.status || "",
        d.markedBy || "",
      ]);
    });

    console.log(`Found ${rows.length} records. Exporting...`);

    const response = await fetch(SHEET_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        sheetName: "Attendance Export",
        headers: ["Date", "Student ID", "Name", "Class", "Status", "Marked By"],
        rows: rows
      })
    });

    const text = await response.text();
    console.log("Raw response:", text);

    const result = JSON.parse(text);
    console.log("✅ Export successful:", result);

  } catch (error) {
    console.error("❌ Export failed:", error.message);
  }
}

exportAttendanceToSheets();