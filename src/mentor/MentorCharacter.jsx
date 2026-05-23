import { useMentorStore } from 'src/store/useMentorStore';

export default function MentorCharacter() {
  const active = useMentorStore((s) => s.active);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div className="w-20 h-20 rounded-full bg-purple-600" />
    </div>
  );
}
