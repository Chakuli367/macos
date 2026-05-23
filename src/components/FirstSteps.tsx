import { useState, useRef, useEffect } from "react";
import { Check, Mic, Camera, Keyboard, ArrowRight, Lock, AlertCircle, X } from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "src/firebase/config";
import { getAuth } from "firebase/auth";

interface FirstStepsProps {
  onComplete: () => void;
  struggle: "starting" | "friends" | "confidence" | "maintaining";
  userName: string;
  planPreview?: any;
}

interface Task {
  id: number;
  type: "voice" | "text" | "camera" | "action";
  question: string;
  placeholder?: string;
  feedback: string;
  completed: boolean;
  proof?: string | Blob;
}

export default function FirstSteps({ onComplete, struggle, userName, planPreview }: FirstStepsProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const auth = getAuth();
  const userId = auth.currentUser?.uid || "user_trial";

  // Task sets based on struggle type
  useEffect(() => {
    const taskSets = {
      starting: [
        {
          id: 1,
          type: "voice" as const,
          question: `${userName}, say "Hey, how's it going?" into your mic RIGHT NOW. Just do it.`,
          feedback: "That's your opener. You just proved you can start a conversation. Tomorrow you'll use it for real.",
          completed: false,
        },
        {
          id: 2,
          type: "camera" as const,
          question: "Smile at your camera for 3 seconds. No overthinking. Go.",
          feedback: "Your smile is your easiest conversation starter. You'll use this tomorrow when approaching someone.",
          completed: false,
        },
        {
          id: 3,
          type: "text" as const,
          question: "Type the FIRST thing you'd say to someone new. Don't edit. First thought.",
          placeholder: "Type here...",
          feedback: "That's your natural instinct. Tomorrow's task will help you trust it more.",
          completed: false,
        },
        {
          id: 4,
          type: "voice" as const,
          question: "Record yourself: 'I'm going to start 3 conversations tomorrow.' Say it like you mean it.",
          feedback: "You just committed. We're holding you to it. Tomorrow, Day 1 unlocks and you'll do exactly this.",
          completed: false,
        },
        {
          id: 5,
          type: "text" as const,
          question: "Where will you try this tomorrow? Name ONE specific place.",
          placeholder: "Coffee shop, gym, class...",
          feedback: `Perfect. Tomorrow at ${new Date(Date.now() + 86400000).toLocaleDateString()}, you'll go there and use what you just practiced.`,
          completed: false,
        },
      ],
      friends: [
        {
          id: 1,
          type: "voice" as const,
          question: `${userName}, voice note: Name 3 places where people like you hang out. Right now.`,
          feedback: "Those are your hunting grounds. Tomorrow you'll pick one and actually go there.",
          completed: false,
        },
        {
          id: 2,
          type: "text" as const,
          question: "Text ONE person right now: 'Hey, how are you?' Then screenshot it. (Or type what you'd send)",
          placeholder: "Type the message...",
          feedback: "Reaching out is step one. Tomorrow you'll turn these check-ins into actual plans.",
          completed: false,
        },
        {
          id: 3,
          type: "voice" as const,
          question: "Record: 'I want friends who [describe them in 5 words]'",
          feedback: "Now you know who you're looking for. Tomorrow's task helps you find them.",
          completed: false,
        },
        {
          id: 4,
          type: "text" as const,
          question: "When's the next time you could grab coffee/lunch with someone? Type a specific day/time.",
          placeholder: "Friday 2pm, Saturday morning...",
          feedback: "You just scheduled it. Tomorrow you'll learn how to actually ask someone.",
          completed: false,
        },
        {
          id: 5,
          type: "voice" as const,
          question: "Say out loud: 'I'm going to make one new friend this month.' Commit to it.",
          feedback: "That's your contract with yourself. Day 1 starts tomorrow and we're tracking this.",
          completed: false,
        },
      ],
      confidence: [
        {
          id: 1,
          type: "voice" as const,
          question: `${userName}, record yourself saying: 'I'm working on myself.' No apologies. No 'trying to'. Just say it.`,
          feedback: "You just owned it. That's confidence. Tomorrow you'll practice owning your opinions too.",
          completed: false,
        },
        {
          id: 2,
          type: "camera" as const,
          question: "Take a selfie. No filter. No retake. First shot. Do it now.",
          feedback: "That's you. Real you. Tomorrow's lesson: why being real is more magnetic than being perfect.",
          completed: false,
        },
        {
          id: 3,
          type: "voice" as const,
          question: "Voice note: Say one thing you did well today. Anything. Own it.",
          feedback: "You just practiced self-acknowledgment. Tomorrow you'll learn to do this in front of others.",
          completed: false,
        },
        {
          id: 4,
          type: "text" as const,
          question: "Finish this sentence: 'People would like me more if I stopped...'",
          placeholder: "stopped hiding, stopped apologizing...",
          feedback: "That's what we're fixing. Tomorrow's Day 1 task directly attacks this.",
          completed: false,
        },
        {
          id: 5,
          type: "voice" as const,
          question: "Record: 'Tomorrow I'm going to speak up once without second-guessing myself.' Say it.",
          feedback: "You committed. Tomorrow you'll do it. We'll check in.",
          completed: false,
        },
      ],
      maintaining: [
        {
          id: 1,
          type: "text" as const,
          question: `${userName}, who haven't you talked to in over a week? Type their name.`,
          placeholder: "First name that comes to mind...",
          feedback: "Tomorrow you're reaching out to them. Day 1 will show you exactly what to say.",
          completed: false,
        },
        {
          id: 2,
          type: "voice" as const,
          question: "Record a 10-second voice message you could send to a friend. Just checking in. Go.",
          feedback: "That's how easy it is. Tomorrow you'll actually send messages like this.",
          completed: false,
        },
        {
          id: 3,
          type: "text" as const,
          question: "When could you schedule a call/hangout this week? Type a specific time.",
          placeholder: "Wednesday 7pm, Saturday afternoon...",
          feedback: "You just made time for connection. Tomorrow's task: how to make the ask without it being weird.",
          completed: false,
        },
        {
          id: 4,
          type: "voice" as const,
          question: "Say out loud: Why does [that friend] matter to you? 10 seconds. Be honest.",
          feedback: "That's your 'why'. Tomorrow you'll learn to show people they matter without being awkward.",
          completed: false,
        },
        {
          id: 5,
          type: "voice" as const,
          question: "Record: 'I'm going to reach out to 3 people this week.' Commit.",
          feedback: "That's your contract. Tomorrow Day 1 unlocks and gives you the exact playbook.",
          completed: false,
        },
      ],
    };

    setTasks(taskSets[struggle] || taskSets.starting);
  }, [struggle, userName]);

  const currentTask = tasks[currentTaskIndex];
  const progress = ((currentTaskIndex + (showFeedback ? 1 : 0)) / tasks.length) * 100;

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTaskComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access denied:", error);
      alert("We need microphone access for this task. Please allow it and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("We need camera access for this task. Please allow it and try again.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Stop camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        handleTaskComplete(imageData);
      }
    }
  };

  // Handle task completion
  const handleTaskComplete = async (proof: string | Blob) => {
    const updatedTasks = [...tasks];
    updatedTasks[currentTaskIndex].completed = true;
    updatedTasks[currentTaskIndex].proof = proof;
    setTasks(updatedTasks);
    setShowFeedback(true);

    // Save to Firebase
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        [`firstSteps.task${currentTaskIndex + 1}`]: {
          completed: true,
          timestamp: serverTimestamp(),
          type: currentTask.type,
        }
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Handle text submission
  const handleTextSubmit = () => {
    if (textInput.trim().length < 3) {
      alert("Come on, give us more than that. Be specific.");
      return;
    }
    handleTaskComplete(textInput);
  };

  // Handle next
  const handleNext = () => {
    setShowFeedback(false);
    setTextInput("");
    setCapturedImage(null);
    
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    } else {
      // Final completion
      saveCompletionToFirebase();
      onComplete();
    }
  };

  const saveCompletionToFirebase = async () => {
    try {
      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        firstStepsCompleted: true,
        firstStepsCompletedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving completion:", error);
    }
  };

  // Render task input based on type
  const renderTaskInput = () => {
  if (!currentTask) return null;
  
  if (currentTask.type === "voice") {
      return (
        <div className="space-y-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`group w-full flex items-center justify-center gap-3 p-8 rounded-2xl transition-all duration-300 ${
              isRecording 
                ? "bg-red-600 hover:bg-red-700 animate-pulse" 
                : "bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 hover:from-purple-600 hover:to-fuchsia-600"
            } border border-purple-400/30 hover:scale-[1.02]`}
          >
            <Mic className={`w-8 h-8 text-white ${isRecording ? 'animate-bounce' : ''}`} />
            <div className="text-left">
              <span className="text-white font-semibold text-lg block">
                {isRecording ? "Recording..." : "Tap to Record"}
              </span>
              {isRecording && (
                <span className="text-red-200 text-sm">{recordingTime}s - Tap again to stop</span>
              )}
            </div>
          </button>
          
          {!isRecording && (
            <p className="text-purple-300 text-sm text-center">
              Press and hold while you speak. Minimum 3 seconds.
            </p>
          )}
        </div>
      );
    }

    if (currentTask.type === "camera") {
      return (
        <div className="space-y-4">
          {!capturedImage ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-2xl border-2 border-purple-400/30"
                onLoadedMetadata={startCamera}
              />
              <button
                onClick={capturePhoto}
                className="group w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 hover:from-purple-600 hover:to-fuchsia-600 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-purple-400/30"
              >
                <Camera className="w-6 h-6 text-white" />
                <span className="text-white font-semibold text-lg">Capture Photo</span>
              </button>
            </>
          ) : (
            <div className="relative">
              <img src={capturedImage} alt="Captured" className="w-full rounded-2xl border-2 border-green-400/50" />
              <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (currentTask.type === "text") {
      return (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={currentTask.placeholder}
            className="w-full bg-white/10 border-2 border-purple-400/30 text-white placeholder:text-purple-300/50 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 min-h-[120px] resize-none"
            autoFocus
          />
          <button
            onClick={handleTextSubmit}
            disabled={textInput.trim().length < 3}
            className="group w-full flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 hover:from-purple-600 hover:to-fuchsia-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-purple-400/30"
          >
            <Keyboard className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg">Submit</span>
          </button>
          <p className="text-purple-300 text-sm text-center">
            Be specific. No generic answers.
          </p>
        </div>
      );
    }

    return null;
  };

  // Exit warning modal
  const ExitWarning = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-md w-full">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white text-center mb-4">
          Leave now and restart from Task 1
        </h3>
        <p className="text-purple-200 text-center mb-6">
          You'll lose all progress. These 5 tasks take 3 minutes total. Finish them.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExitWarning(false)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold py-3 rounded-xl"
          >
            Stay & Finish
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-white/10 text-red-300 font-semibold py-3 rounded-xl border border-red-500/30"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center z-50 p-4 overflow-hidden">
      {showExitWarning && <ExitWarning />}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse-slower"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Complete these to unlock Day 1
          </h2>
          <p className="text-purple-300 text-lg">
            No skipping. No "I'll do it later." Do it now or don't start.
          </p>
        </div>

        {/* Main Task Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 mb-6 animate-slide-up">
          {/* Task Number Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-400/30">
              <span className="text-sm font-medium text-purple-300">
                Task {currentTaskIndex + 1} of {tasks.length}
              </span>
            </div>
            {currentTaskIndex > 0 && (
              <button
                onClick={() => setShowExitWarning(true)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Task Question */}
          {/* Task Question */}
{currentTask && (
  <div className="mb-8">
    <p className="text-white text-xl md:text-2xl leading-relaxed font-medium">
      {currentTask.question}
    </p>
  </div>
)}

          {/* Action Section */}
          {!showFeedback ? (
            renderTaskInput()
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Feedback Box */}
              <div className="p-6 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-400/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-green-100 text-base md:text-lg leading-relaxed flex-1">
                    {currentTask?.feedback}
                  </p>
                </div>
              </div>

              {/* Day 1 Preview */}
              {currentTaskIndex === tasks.length - 1 && planPreview && (
                <div className="p-6 bg-blue-900/30 border border-blue-400/30 rounded-2xl backdrop-blur-sm">
                  <h4 className="text-blue-200 font-semibold text-lg mb-3">Your Day 1 unlocks after this:</h4>
                  <p className="text-blue-100 text-base">
                    {planPreview.days?.[0]?.title}: {planPreview.days?.[0]?.task}
                  </p>
                  <p className="text-blue-300 text-sm mt-2">
                    Starts {new Date(Date.now() + 86400000).toLocaleDateString()} at 9:00 AM
                  </p>
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="group w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <span>{currentTaskIndex < tasks.length - 1 ? "Next Task" : "Unlock Day 1"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-3 animate-fade-in">
          <div className="h-2 bg-purple-950/50 rounded-full overflow-hidden backdrop-blur-sm border border-purple-500/20">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 transition-all duration-700 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Task Dots */}
          <div className="flex justify-center gap-2">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index < currentTaskIndex || (index === currentTaskIndex && showFeedback)
                    ? "bg-green-400 w-8"
                    : index === currentTaskIndex
                    ? "bg-purple-500 w-3 h-3"
                    : "bg-purple-800 w-2"
                }`}
              />
            ))}
          </div>
          
          <p className="text-center text-purple-300 text-sm">
            {currentTaskIndex === tasks.length - 1 && showFeedback
              ? "One click away from starting your journey"
              : `${tasks.length - currentTaskIndex - (showFeedback ? 1 : 0)} tasks left to unlock Day 1`}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}