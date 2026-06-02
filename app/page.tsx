"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Dumbbell, Flame, LineChart, Plus, RotateCcw, Save, Trophy, Target, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const split = {
  Monday: {
    focus: "Chest, Biceps & Triceps",
    exercises: ["Bench Press", "Incline Dumbbell Press", "Chest Flys", "Barbell Curls", "Hammer Curls", "Tricep Pushdowns", "Overhead Tricep Extensions"],
  },
  Tuesday: {
    focus: "Legs",
    exercises: ["Squats", "Romanian Deadlifts", "Leg Press", "Walking Lunges", "Leg Curls", "Calf Raises"],
  },
  Wednesday: {
    focus: "Shoulders & Back",
    exercises: ["Overhead Press", "Lateral Raises", "Rear Delt Flys", "Lat Pulldowns", "Barbell Rows", "Seated Cable Rows", "Shrugs"],
  },
  Thursday: {
    focus: "Chest, Biceps & Triceps",
    exercises: ["Incline Bench Press", "Dumbbell Bench Press", "Cable Flys", "Preacher Curls", "Rope Hammer Curls", "Close-Grip Bench", "Tricep Dips"],
  },
  Friday: {
    focus: "Legs",
    exercises: ["Front Squats", "Bulgarian Split Squats", "Leg Extensions", "Hamstring Curls", "Glute Bridges", "Seated Calf Raises"],
  },
  Saturday: {
    focus: "Shoulders & Back",
    exercises: ["Arnold Press", "Face Pulls", "Dumbbell Rows", "Pull-Ups", "Cable Rows", "Upright Rows", "Rear Delt Raises"],
  },
  Sunday: {
    focus: "Rest / Recovery",
    exercises: ["Stretching", "Walking", "Mobility", "Recovery Notes"],
  },
};

const days = Object.keys(split);

const starterLogs = Array.from({ length: 13 }, (_, i) => ({
  week: `Week ${i + 1}`,
  workouts: Math.min(6, Math.max(3, 4 + (i % 3))),
  bodyWeight: 185 - i,
  volume: 42000 + i * 1800,
}));

const motivationMessages = [
  "Discipline beats motivation. Show up today.",
  "Small progress every week becomes a big transformation.",
  "Train with purpose. Track with honesty. Improve with consistency.",
  "You do not need a perfect week. You need a committed one.",
  "Strong habits build strong results."
];

function todayName() {
  return days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

export default function WorkoutDashboard() {
  const [selectedDay, setSelectedDay] = useState(todayName());
  const [workoutPlan, setWorkoutPlan] = useState(split);
  const [completed, setCompleted] = useState({});
  const [entries, setEntries] = useState({});
  const [bodyWeight, setBodyWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [startingWeight, setStartingWeight] = useState("185");
  const [weeklyCheckIns, setWeeklyCheckIns] = useState(
    Array.from({ length: 13 }, (_, i) => ({
      week: `Week ${i + 1}`,
      weight: `${185 - i}`,
      notes:
        i === 0
          ? "Starting point"
          : i < 5
          ? "Building consistency"
          : i < 9
          ? "Strength improving"
          : "Finishing strong",
    }))
  );
  const [notes, setNotes] = useState("");

const current = workoutPlan[selectedDay as keyof typeof workoutPlan];

  const stats = useMemo(() => {
    const completedCount = Object.values(completed).filter(Boolean).length;
const totalVolume = Object.values(entries).reduce((sum: number, entry: any) => {
      const sets = Number(entry.sets || 0);
      const reps = Number(entry.reps || 0);
      const weight = Number(entry.weight || 0);
      return sum + sets * reps * weight;
    }, 0);
   const prs = Object.values(entries).filter((e: any) => e.pr).length;
    return { completedCount, totalVolume, prs };
  }, [completed, entries]);

  const motivation = motivationMessages[stats.completedCount % motivationMessages.length];

  const updateEntry = (exerciseId: string, field: string, value: any) => {
    setEntries((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value },
    }));
  };

  const updateExerciseName = (day, index, newName) => {
    setWorkoutPlan((prev) => {
      const updatedExercises = [...prev[day].exercises];
      updatedExercises[index] = newName;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          exercises: updatedExercises,
        },
      };
    });
  };

  const resetWeek = () => {
    setCompleted({});
    setEntries({});
    setBodyWeight("");
    setNotes("");
  };

  const addWeeklyCheckIn = () => {
    if (!bodyWeight) return;
    setWeeklyCheckIns((prev) => [
      ...prev,
      { week: `Week ${prev.length + 1}`, weight: bodyWeight, notes: notes || "No notes" },
    ]);
    setBodyWeight("");
    setNotes("");
  };

  const latestCheckInWeight = weeklyCheckIns.length ? weeklyCheckIns[weeklyCheckIns.length - 1].weight : startingWeight;
  const currentWeightForChart = Number(bodyWeight || latestCheckInWeight || starterLogs[starterLogs.length - 1].bodyWeight);
  const weightChange = Number(latestCheckInWeight || 0) - Number(startingWeight || 0);
  const goalDifference = goalWeight ? Number(latestCheckInWeight || 0) - Number(goalWeight) : null;

  const chartData = [...starterLogs, {
    week: "This Week",
    workouts: stats.completedCount,
    bodyWeight: currentWeightForChart,
    volume: stats.totalVolume,
  }];

  const checkInChartData = weeklyCheckIns.map((item) => ({
    week: item.week,
    bodyWeight: Number(item.weight || 0),
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-400">13-Week Transformation Tracker</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Interactive Fitness Dashboard</h1>
            <p className="text-zinc-400 mt-2">Track workouts, volume, PRs, body weight, and weekly consistency through your full 13-week program.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={resetWeek} variant="secondary" className="rounded-2xl"><RotateCcw className="w-4 h-4 mr-2" />Reset Week</Button>
            <Button className="rounded-2xl"><Save className="w-4 h-4 mr-2" />Save</Button>
          </div>
        </motion.div>

        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 rounded-2xl shadow-xl overflow-hidden">
          <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
            <div className="lg:col-span-2">
              <p className="text-sm text-zinc-400 flex items-center gap-2"><Target className="w-4 h-4" /> Motivation Screen</p>
              <h2 className="text-2xl md:text-4xl font-bold mt-2">{motivation}</h2>
              <p className="text-zinc-400 mt-3">Today is {selectedDay}: {current.focus}. Complete the session, log your numbers, and keep stacking wins.</p>
            </div>
            <div className="bg-zinc-950/70 border border-zinc-700 rounded-2xl p-4">
              <p className="text-sm text-zinc-400">This Week</p>
              <p className="text-4xl font-bold mt-1">{stats.completedCount}/6</p>
              <p className="text-zinc-400 mt-2">workouts completed this week</p>
              <div className="w-full h-3 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: `${Math.min((stats.completedCount / 6) * 100, 100)}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<CalendarDays />} label="Workouts Completed" value={`${stats.completedCount}/6`} />
          <StatCard icon={<Dumbbell />} label="Total Volume" value={stats.totalVolume.toLocaleString()} />
          <StatCard icon={<Trophy />} label="PRs Hit" value={stats.prs} />
          <StatCard icon={<Flame />} label="Weekly Goal" value={stats.completedCount >= 6 ? "Complete" : "In Progress"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl">
            <CardContent className="p-5 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDay}</h2>
                  <p className="text-zinc-400">{current.focus}</p>
                </div>
                <Button onClick={() => setCompleted((p) => ({ ...p, [selectedDay]: !p[selectedDay] }))} className="rounded-2xl">
                  {completed[selectedDay] ? "Marked Complete" : "Mark Workout Complete"}
                </Button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {days.map((day) => (
                  <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 rounded-2xl whitespace-nowrap text-sm border ${selectedDay === day ? "bg-white text-zinc-950 border-white" : "bg-zinc-950 border-zinc-800 text-zinc-300"}`}>
                    {day}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {current.exercises.map((exercise, index) => {
                  const exerciseId = `${selectedDay}-${index}`;
                  const e = entries[exerciseId] || {};
                  return (
                    <div key={exerciseId} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-3">
                      <div className="md:col-span-4">
                        <label className="text-xs text-zinc-500">Workout Name</label>
                        <input
                          value={exercise}
                          onChange={(ev) => updateExerciseName(selectedDay, index, ev.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 outline-none font-medium"
                        />
                      </div>
                      <Input label="Sets" value={e.sets || ""} onChange={(v) => updateEntry(exerciseId, "sets", v)} />
                      <Input label="Reps" value={e.reps || ""} onChange={(v) => updateEntry(exerciseId, "reps", v)} />
                      <Input label="Weight" value={e.weight || ""} onChange={(v) => updateEntry(exerciseId, "weight", v)} />
                      <label className="md:col-span-2 flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" checked={!!e.pr} onChange={(ev) => updateEntry(exerciseId, "pr", ev.target.checked)} /> PR
                      </label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl">
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-sm text-zinc-400">Progress Tracker</p>
                  <h3 className="text-xl font-bold">Weekly Weight Check-In</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-zinc-400">Starting Weight</label>
                    <input value={startingWeight} onChange={(e) => setStartingWeight(e.target.value)} placeholder="185" className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">Goal Weight</label>
                    <input value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)} placeholder="Example: 175" className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-zinc-400">This Week's Weight</label>
                  <input value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} placeholder="Example: 183" className="w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Check-In Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Energy, soreness, sleep, motivation..." className="w-full mt-1 h-24 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 outline-none" />
                </div>
                <Button onClick={addWeeklyCheckIn} className="w-full rounded-2xl"><Plus className="w-4 h-4 mr-2" />Add Weekly Check-In</Button>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 flex items-center gap-1">{weightChange <= 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />} Change</p>
                    <p className="text-xl font-bold">{weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)} lbs</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400">Goal Gap</p>
                    <p className="text-xl font-bold">{goalDifference === null ? "Set goal" : `${Math.abs(goalDifference).toFixed(1)} lbs`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl">
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><LineChart className="w-5 h-5" /> Workout Consistency</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="week" stroke="#a1a1aa" fontSize={12} />
                      <YAxis stroke="#a1a1aa" fontSize={12} />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12 }} />
                      <Bar dataKey="workouts" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Training Volume Progress" data={chartData} dataKey="volume" />
          <ChartCard title="Weekly Weight Check-Ins" data={checkInChartData.length ? checkInChartData : chartData} dataKey="bodyWeight" />
        </div>

        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-zinc-400">13-Week Progress</p>
                <h3 className="text-xl font-bold">Check-In History</h3>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm">
                {weeklyCheckIns.length}/13 Weeks Logged
              </div>
            </div>
            <div className="space-y-2">
              {weeklyCheckIns.map((item) => (
                <div key={item.week} className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                  <p className="font-semibold">{item.week}</p>
                  <p className="font-medium">{item.weight} lbs</p>
                  <p className="text-zinc-400">{item.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-zinc-800 text-zinc-100">{icon}</div>
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="md:col-span-2">
      <label className="text-xs text-zinc-500">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 outline-none" />
    </div>
  );
}

function ChartCard({ title, data, dataKey }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 rounded-2xl shadow-xl">
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height={300}>
            <ReLineChart data={data}>
              <XAxis dataKey="week" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12 }} />
              <Line type="monotone" dataKey={dataKey} strokeWidth={3} dot={{ r: 5 }} />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
