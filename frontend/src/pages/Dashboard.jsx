import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Activity, Droplets, Thermometer, Pill, CalendarClock } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import demoSnapshot from "../data/demoSnapshot";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import HealthCard from "../components/HealthCard";
import VitalsRing from "../components/VitalsRing";
import TrendChart from "../components/TrendChart";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      // Guest view: no account yet, show sample data so the dashboard is explorable.
      setData(demoSnapshot);
      setError("");
      return;
    }
    // Logged in: fetch the real snapshot.
    setData(null);
    api
      .get("/dashboard/snapshot")
      .then((res) => setData(res.data))
      .catch(() => {
        setError("Couldn't load your health data. Is the backend running?");
        setData(demoSnapshot); // fall back to demo data rather than a blank page
      });
  }, [user]);

  const trendData =
    data?.weeklyTrend.labels.map((day, i) => ({
      day,
      heartRate: data.weeklyTrend.heartRate[i],
      steps: data.weeklyTrend.steps[i],
      sleep: data.weeklyTrend.sleep[i],
    })) || [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="px-6 md:px-10 pb-12 flex flex-col gap-8">
          {!user && (
            <div className="glass rounded-card p-4 text-sm flex items-center justify-between gap-4 flex-wrap">
              <span className="opacity-80">
                You're viewing <strong>sample data</strong>. Log in to see your own vitals and reminders.
              </span>
              <a
                href="/login"
                className="bg-teal hover:bg-teal-dark text-white text-sm font-medium px-4 py-2 rounded-2xl transition-colors shrink-0"
              >
                Log in
              </a>
            </div>
          )}

          {error && (
            <div className="glass rounded-card p-4 text-coral-dark text-sm">{error}</div>
          )}

          {!data && !error && (
            <p className="opacity-60 text-sm">Loading your vitals…</p>
          )}

          {data && (
            <>
              {/* Vitals */}
              <section>
                <h2 className="text-lg font-display font-semibold mb-4">Today's vitals</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <HealthCard icon={HeartPulse} label="Heart Rate" value={data.vitals.heartRate.value} unit={data.vitals.heartRate.unit} status={data.vitals.heartRate.status} delay={0} />
                  <HealthCard icon={Activity} label="Blood Pressure" value={data.vitals.bloodPressure.value} unit={data.vitals.bloodPressure.unit} status={data.vitals.bloodPressure.status} delay={0.05} />
                  <HealthCard icon={Droplets} label="Oxygen Level" value={data.vitals.oxygenLevel.value} unit={data.vitals.oxygenLevel.unit} status={data.vitals.oxygenLevel.status} delay={0.1} />
                  <HealthCard icon={Thermometer} label="Temperature" value={data.vitals.temperature.value} unit={data.vitals.temperature.unit} status={data.vitals.temperature.status} delay={0.15} />
                </div>
              </section>

              {/* Signature: vitals rings + reminders/appointment */}
              <section className="grid lg:grid-cols-3 gap-4">
                <div className="glass rounded-card p-6 lg:col-span-2 flex flex-wrap justify-around gap-6">
                  <VitalsRing label="Steps" value={data.todayActivity.dailySteps.value} goal={data.todayActivity.dailySteps.goal} unit="" color="#1D6F73" delay={0.1} />
                  <VitalsRing label="Water" value={data.todayActivity.waterIntake.value} goal={data.todayActivity.waterIntake.goal} unit="glasses" color="#4C9A6A" delay={0.2} />
                  <VitalsRing label="Sleep" value={data.todayActivity.sleepDuration.value} goal={data.todayActivity.sleepDuration.goal} unit="hrs" color="#E8927C" delay={0.3} />
                </div>

                <div className="glass rounded-card p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                    <CalendarClock size={16} /> Upcoming appointment
                  </div>
                  <p className="font-display text-lg font-semibold">{data.upcomingAppointment.doctor}</p>
                  <p className="text-sm opacity-60">{data.upcomingAppointment.specialty}</p>
                  <p className="text-sm mt-1">{data.upcomingAppointment.date} · {data.upcomingAppointment.time}</p>
                </div>
              </section>

              {/* Medicine reminder */}
              <section className="glass rounded-card p-6">
                <div className="flex items-center gap-2 text-sm font-semibold opacity-80 mb-4">
                  <Pill size={16} /> Medicine reminder
                </div>
                <div className="flex flex-col divide-y divide-ink/5 dark:divide-white/5">
                  {data.medicineReminder.map((m, i) => (
                    <motion.div
                      key={m.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs opacity-60">{m.time}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          m.taken ? "bg-leaf/15 text-leaf" : "bg-coral/15 text-coral-dark"
                        }`}
                      >
                        {m.taken ? "Taken" : "Pending"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Trends */}
              <section>
                <h2 className="text-lg font-display font-semibold mb-4">Weekly trends</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <TrendChart title="Heart rate" data={trendData} dataKey="heartRate" color="#1D6F73" unit="bpm" />
                  <TrendChart title="Steps" data={trendData} dataKey="steps" color="#4C9A6A" unit="steps" />
                  <TrendChart title="Sleep" data={trendData} dataKey="sleep" color="#E8927C" unit="hrs" />
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
