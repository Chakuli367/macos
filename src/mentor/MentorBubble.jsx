import { useMentorStore } from 'src/store/useMentorStore';

export default function MentorBubble() {
  const { active, script, stepIndex, nextStep } = useMentorStore();

  if (!active) return null;

  const step = script[stepIndex];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 120,
        right: 24,
        zIndex: 10000,
      }}
      className="bg-white text-black p-4 rounded-xl shadow-xl max-w-xs"
    >
      <p className="mb-2">{step.text}</p>
      <button onClick={nextStep} className="font-bold text-purple-600">
        Got it →
      </button>
    </div>
  );
}
