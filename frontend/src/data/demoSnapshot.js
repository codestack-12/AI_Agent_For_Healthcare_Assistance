// Sample data shown on the Dashboard for visitors who aren't logged in.
// Same shape as GET /api/dashboard/snapshot so the Dashboard component doesn't
// need separate rendering logic for demo vs. real data.
const demoSnapshot = {
  vitals: {
    heartRate: { value: 72, unit: "bpm", status: "normal" },
    bloodPressure: { value: "118/76", unit: "mmHg", status: "normal" },
    oxygenLevel: { value: 98, unit: "%", status: "normal" },
    temperature: { value: 98.2, unit: "°F", status: "normal" },
  },
  todayActivity: {
    waterIntake: { value: 6, goal: 8, unit: "glasses" },
    sleepDuration: { value: 7, goal: 8, unit: "hrs" },
    dailySteps: { value: 4100, goal: 6000, unit: "steps" },
    mood: "Content",
    bmi: 22.8,
    weight: { value: 65, unit: "kg" },
    calories: { value: 1600, goal: 1800, unit: "kcal" },
  },
  medicineReminder: [
    { name: "Metformin", time: "8:00 AM", taken: true },
    { name: "Amlodipine", time: "1:00 PM", taken: true },
    { name: "Vitamin D3", time: "8:00 PM", taken: false },
  ],
  upcomingAppointment: {
    doctor: "Dr. Anjali Rao",
    specialty: "Cardiologist",
    date: "Aug 2, 2026",
    time: "10:30 AM",
  },
  weeklyTrend: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    heartRate: [70, 73, 71, 75, 72, 74, 72],
    steps: [3800, 4500, 5100, 3200, 4800, 6100, 4100],
    sleep: [7, 6.5, 7.5, 6, 7, 8, 7],
  },
};

export default demoSnapshot;
