import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

interface DayData {
  title?: string;
  plan?: any[];
  completed?: boolean;
}

interface TaskMarkerProps {
  size?: number;
}

// --- SVG Components ---
function GreenStar({ size = 50 }: TaskMarkerProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <circle cx="60" cy="60" r="50" fill="#6af27e" />
      <path
        fill="white"
        transform="translate(60,60) scale(1.2)"
        d="M0,-20 L5.88,-6.18 L19.02,-6.18 L8.57,2.36 L12.36,16.18 L0,9.55 L-12.36,16.18 L-8.57,2.36 L-19.02,-6.18 L-5.88,-6.18 Z"
      />
    </motion.svg>
  );
}

function RedCheck({ size = 50 }: TaskMarkerProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <circle cx="60" cy="60" r="50" fill="#ff8080" />
      <path
        fill="white"
        transform="translate(60,60) scale(1.5)"
        d="M-12,0 L-3,9 L12,-9 L9,-12 L-3,6 L-12,0 Z"
      />
    </motion.svg>
  );
}

function OrangeCircle({ size = 50 }: TaskMarkerProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <circle cx="60" cy="60" r="50" fill="#ffcc99" />
      <circle cx="60" cy="60" r="15" fill="white" />
    </motion.svg>
  );
}

function PurpleDiamond({ size = 50 }: TaskMarkerProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <circle cx="60" cy="60" r="50" fill="#d1b3ff" />
      <polygon
        fill="white"
        transform="translate(60,60) scale(1.2)"
        points="0,-18 12,0 0,18 -12,0"
      />
    </motion.svg>
  );
}

function BlueHeart({ size = 50 }: TaskMarkerProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
    >
      <circle cx="60" cy="60" r="50" fill="#99ccff" />
      <path
        fill="white"
        transform="translate(60,60) scale(1.5)"
        d="M0,-12 C6,-28 28,-12 0,14 C-28,-12 -6,-28 0,-12 Z"
      />
    </motion.svg>
  );
}

function TaskSVG({ idx }: { idx: number }) {
  const group = idx % 5;
  switch (group) {
    case 0:
      return <GreenStar />;
    case 1:
      return <RedCheck />;
    case 2:
      return <OrangeCircle />;
    case 3:
      return <PurpleDiamond />;
    default:
      return <BlueHeart />;
  }
}

// --- Main Page ---
export default function PlanDisplay(): JSX.Element {
  const { userId } = useParams<{ userId: string }>();
  const [dayContent, setDayContent] = useState<Record<string, DayData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showTrailer, setShowTrailer] = useState(true);

  // Soft colors for the 5 day cards
  const cardColors = ["#f2f2f2", "#e6f2ff", "#fff2e6", "#f9e6ff", "#e6ffe6"];

  useEffect(() => {
    if (!userId) {
      setError("Missing userId in URL");
      setLoading(false);
      return;
    }

    async function fetchPlan() {
      setLoading(true);
      setError(null);
      try {
        const daysCollectionRef = collection(db, "plans", userId, "days");
        const qSnapshot = await getDocs(daysCollectionRef);
        if (qSnapshot.empty) {
          setError("No days found for this plan");
          setDayContent({});
          return;
        }
        const days: Record<string, DayData> = {};
        qSnapshot.forEach((docSnap) => {
          days[docSnap.id] = docSnap.data() as DayData;
        });
        setDayContent(days);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch plan");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [userId]);

  // Trailer disappears after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTrailer(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <h2 className="text-2xl font-bold mb-2">No Plan Found</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6 px-2">
      {/* Trailer Overlay */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-center max-w-lg text-white space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl font-bold">
                Your Plan is Ready!
              </h1>
              <p className="text-lg sm:text-xl">
                Now that your plan is generated, go through it to decide if you
                want to change anything.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-3xl font-bold mb-6 text-center">
        Your Learning Path
      </h2>

      {/* MAIN CONTAINER WITH TRANSPARENT BACKGROUND */}
      <div className="w-full max-w-6xl bg-transparent p-4 rounded-xl flex flex-wrap gap-6 justify-center">
        {Object.entries(dayContent)
          .sort()
          .map(([dayId, day], dayIdx) => (
            <motion.div
              key={dayId}
              className="rounded-xl p-4 flex flex-col border border-gray-300 shadow-sm w-full sm:w-[300px] md:w-[45%] lg:w-[30%]"
              style={{ backgroundColor: cardColors[dayIdx % 5] }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * dayIdx }}
            >
              <h3 className="text-xl font-semibold mb-2 text-black">
                {day.title || `Day ${dayIdx + 1}`}
              </h3>

              <div className="flex flex-col gap-3 mt-2">
                {day.plan?.map((p, taskIdx) => {
                  const tasksArray = Array.isArray(p.task) ? p.task : [p.task];
                  return tasksArray.map((task: any, idx: number) => (
                    <motion.div
                      key={`${taskIdx}-${idx}`}
                      className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                      onClick={() =>
                        setSelectedTask({ task, dayTitle: day.title || "" })
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <TaskSVG idx={idx} />
                      <span className="text-black">{task.task}</span>
                    </motion.div>
                  ));
                })}
              </div>
            </motion.div>
          ))}
      </div>

      {/* ACCEPT PLAN AND CHANGE PLAN BUTTONS */}
      <div className="mt-8 mb-12 flex gap-4">
        <Button
          className="px-6 py-3 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          onClick={() => alert("Plan Accepted!")}
        >
          Accept This Plan
        </Button>
        <Button
          className="px-6 py-3 text-lg font-semibold bg-gray-400 hover:bg-gray-500 text-white rounded-xl"
          onClick={() => alert("Change your plan clicked!")}
        >
          Change Your Plan
        </Button>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl text-black relative"
            >
              <button
                aria-label="Close"
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                onClick={() => setSelectedTask(null)}
              >
                <X />
              </button>

              <h3 className="text-xl font-bold mb-2">
                {selectedTask?.task?.task || "Task"}
              </h3>
              {selectedTask?.task?.description && (
                <p className="text-gray-700">{selectedTask.task.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
