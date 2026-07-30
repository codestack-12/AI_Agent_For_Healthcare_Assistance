// Returns the current user's health snapshot.
// Replace this mock with real HealthRecords/Vitals collections once devices/inputs are wired up.
export const getHealthSnapshot = async (req, res) => {
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });

  res.json({
    vitals: {
      heartRate: { value: 76, unit: "bpm", status: "normal" },
      bloodPressure: { value: "122/80", unit: "mmHg", status: "normal" },
      oxygenLevel: { value: 97, unit: "%", status: "normal" },
      temperature: { value: 98.4, unit: "°F", status: "normal" },
    },
    todayActivity: {
      waterIntake: { value: 5, goal: 8, unit: "glasses" },
      sleepDuration: { value: 6.5, goal: 8, unit: "hrs" },
      dailySteps: { value: 3200, goal: 6000, unit: "steps" },
      mood: "Calm",
      bmi: 23.4,
      weight: { value: 68, unit: "kg" },
      calories: { value: 1450, goal: 1800, unit: "kcal" },
    },
    medicineReminder: [
      { name: "Metformin", time: "8:00 AM", taken: true },
      { name: "Amlodipine", time: "1:00 PM", taken: false },
      { name: "Vitamin D3", time: "8:00 PM", taken: false },
    ],
    upcomingAppointment: {
      doctor: "Dr. Anjali Rao",
      specialty: "Cardiologist",
      date: "Aug 2, 2026",
      time: "10:30 AM",
    },
    weeklyTrend: {
      labels: days,
      heartRate: [74, 78, 75, 80, 76, 79, 76],
      steps: [2800, 3400, 4100, 2600, 3900, 5200, 3200],
      sleep: [6, 6.5, 7, 5.5, 6, 7.5, 6.5],
    },
  });
};
