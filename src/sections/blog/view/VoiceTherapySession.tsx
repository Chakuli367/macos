
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, MicOff, Loader2, CheckCircle, Volume2, VolumeX,
  Keyboard, Send, X, Wind, Brain, Heart, Zap, ChevronRight,
  RotateCcw, ArrowRight,
} from 'lucide-react';

const BACKEND = 'https://theraplyendpoint.onrender.com';
const PHASE_LABELS = ['', 'Understanding', 'Challenging', 'Planning', 'Committing'];
const MIN_RECORDING_MS = 400;

const T = {
  bg:            '#0a0612',
  surface:       '#110d1f',
  elevated:      '#1a1530',
  border:        'rgba(139,92,246,0.12)',
  borderHov:     'rgba(139,92,246,0.28)',
  accent:        '#7c3aed',
  accentSoft:    'rgba(124,58,237,0.15)',
  teal:          '#0ea5e9',
  tealSoft:      'rgba(14,165,233,0.12)',
  green:         '#10b981',
  greenSoft:     'rgba(16,185,129,0.1)',
  red:           '#f87171',
  amber:         '#f59e0b',
  textPrimary:   '#f0ecff',
  textSecondary: 'rgba(196,181,253,0.65)',
  textMuted:     'rgba(139,116,240,0.4)',
};

type Mode = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

// ─── Exercise types ────────────────────────────────────────────────────────

interface BreathingPhase { label: string; duration: number; color: string; }
interface GroundingStep  { count: number; sense: string; icon: string; prompt: string; }
interface ThoughtField   { id: string; label: string; type: string; placeholder?: string; rows?: number; min?: number; max?: number; step?: number; unit?: string; }
interface BodyZone       { id: string; label: string; prompt: string; }
interface FearStep       { situation: string; anxiety: number; }
interface ValuesDomain   { importance: number; living_it: number; }

interface ExerciseConfig {
  phases?:        BreathingPhase[];
  cycles?:        number;
  steps?:         GroundingStep[];
  fields?:        ThoughtField[];
  zones?:         BodyZone[];
  tension_scale?: { min: number; max: number; label: string };
  domains?:       string[];
  fields_per_domain?: { id: string; label: string; type: string }[];
  prompts?:       string[];
  message?:       string;
}

interface Exercise {
  name:       string;
  description:string;
  config:     ExerciseConfig;
  inputs:     string[];
  duration_s: number;
}

interface PrescribeResponse {
  success:       boolean;
  exercise_type: string;
  exercise:      Exercise;
  intro_speech:  string;
  anxiety_pre:   number;
  audio_b64?:    string;
  session_id?:   string;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════

export default function VoiceTherapySession({ user, onPlanCreated, showNotification }: any) {
  const [mode, setMode]                       = useState<Mode>('idle');
  const [sessionId, setSessionId]             = useState<string | null>(null);
  const [phase, setPhase]                     = useState(1);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [extractedData, setExtractedData]     = useState<any>(null);
  const [messages, setMessages]               = useState<Message[]>([]);
  const [isMuted, setIsMuted]                 = useState(false);
  const [creatingPlan, setCreatingPlan]       = useState(false);
  const [planCreated, setPlanCreated]         = useState(false);
  const [error, setError]                     = useState('');
  const [orbLevel, setOrbLevel]               = useState(1);
  const [showTextInput, setShowTextInput]     = useState(false);
  const [textDraft, setTextDraft]             = useState('');
  const [autoStarted, setAutoStarted]         = useState(false);
  const [lastBlob, setLastBlob]               = useState<Blob | null>(null);

  // ── Exercise state ─────────────────────────────────────────
  const [exerciseMode, setExerciseMode]       = useState(false);
  const [exerciseData, setExerciseData]       = useState<PrescribeResponse | null>(null);
  const [exAnxietyPre, setExAnxietyPre]       = useState(5);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const streamRef        = useRef<MediaStream | null>(null);
  const audioRef         = useRef<HTMLAudioElement | null>(null);
  const analyserRef      = useRef<AnalyserNode | null>(null);
  const animFrameRef     = useRef<number>(0);
  const recordStartRef   = useRef<number>(0);
  const scrollAnchorRef  = useRef<HTMLDivElement | null>(null);
  const textInputRef     = useRef<HTMLInputElement | null>(null);
  const sessionIdRef     = useRef<string | null>(null);
  const modeRef          = useRef<Mode>('idle');

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showTextInput) setTimeout(() => textInputRef.current?.focus(), 100);
  }, [showTextInput]);

  useEffect(() => {
    if (autoStarted) return;
    setAutoStarted(true);
    setTimeout(() => triggerAIGreeting(), 800);
  }, []); // eslint-disable-line

  useEffect(() => {
    return () => {
      stopAudio();
      stopAnalyser();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Greeting ───────────────────────────────────────────────
  const triggerAIGreeting = async () => {
    const greeting = "Hi, I'm really glad you're here. I want you to know this is a safe space — just us. So... what's been sitting heaviest on your mind lately?";
    appendMessage('ai', greeting);
    await speakText(greeting, 0);
  };

  // ── AnalyserNode ───────────────────────────────────────────
  const startAnalyser = (stream: MediaStream) => {
    try {
      const ctx      = new AudioContext();
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(buf);
        const avg   = buf.reduce((a, b) => a + b, 0) / buf.length;
        const level = 1 + Math.min(avg / 128, 1) * 0.28;
        setOrbLevel(level);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      animFrameRef.current = requestAnimationFrame(tick);
    } catch { /* no analyser, orb still works */ }
  };

  const stopAnalyser = () => {
    cancelAnimationFrame(animFrameRef.current);
    analyserRef.current = null;
    setOrbLevel(1);
  };

  // ── Audio ──────────────────────────────────────────────────
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const playAudioB64 = (b64: string): Promise<void> => {
    return new Promise((resolve) => {
      stopAudio();
      const binary = atob(b64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
      audio.play().catch(() => resolve());
    });
  };

  const appendMessage = (role: 'user' | 'ai', text: string) => {
    setMessages(prev => [...prev, { role, text, timestamp: Date.now() }]);
  };

  // ── TTS ────────────────────────────────────────────────────
  const speakText = async (text: string, pauseMs = 0): Promise<void> => {
    if (isMuted || !text) return;
    if (pauseMs > 0) await new Promise(r => setTimeout(r, pauseMs));
    setMode('speaking');
    try {
      await speakSentences(text);
    } catch {
      const clean = text.replace(/\*\*?(.*?)\*\*?/g, '$1').replace(/\n/g, ' ').trim();
      await browserSpeak(clean);
    } finally {
      setMode('idle');
    }
  };

  const speakSentences = async (text: string): Promise<void> => {
    const res = await fetch(`${BACKEND}/speak-sentences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('speak-sentences failed');
    const data = await res.json();
    const sentences: { index: number; audio: string }[] = data.sentences || [];
    if (!sentences.length) return;

    const urls = sentences.map(s => {
      const binary = atob(s.audio);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
    });

    for (let i = 0; i < urls.length; i++) {
      if (modeRef.current === 'listening' || modeRef.current === 'thinking') {
        urls.slice(i).forEach(u => URL.revokeObjectURL(u));
        break;
      }
      await new Promise<void>((resolve) => {
        stopAudio();
        const audio = new Audio(urls[i]);
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(urls[i]); audioRef.current = null; resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(urls[i]); audioRef.current = null; resolve(); };
        audio.play().catch(() => resolve());
      });
    }
  };

  const browserSpeak = (text: string): Promise<void> =>
    new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.95; u.pitch = 1.0; u.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
          v.name.includes('Samantha') || v.name.includes('Karen') ||
          v.name.includes('Google UK English Female')
        );
        if (preferred) u.voice = preferred;
        u.onend = () => resolve(); u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
      } catch { resolve(); }
    });

  // ── Mic ────────────────────────────────────────────────────
  const requestMic = async (): Promise<MediaStream | null> => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 }
      });
    } catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setError('Microphone permission denied. Please allow access in device settings.');
      } else if (err?.name === 'NotFoundError') {
        setError('No microphone found on this device.');
      } else {
        setError('Microphone access failed. Please try again.');
      }
      return null;
    }
  };

  // ── Orb tap ────────────────────────────────────────────────
  const handleOrbTap = async () => {
    if (mode === 'thinking') return;
    if (mode === 'speaking') {
      stopAudio();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setMode('idle');
      await startListening();
      return;
    }
    if (mode === 'listening') { stopListening(); return; }
    await startListening();
  };

  const startListening = async () => {
    setError('');
    const stream = await requestMic();
    if (!stream) return;
    streamRef.current = stream;
    audioChunksRef.current = [];
    recordStartRef.current = Date.now();
    startAnalyser(stream);

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
                   : MediaRecorder.isTypeSupported('audio/webm')             ? 'audio/webm'
                   : MediaRecorder.isTypeSupported('audio/mp4')              ? 'audio/mp4'
                   : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')  ? 'audio/ogg;codecs=opus'
                   : '';

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    recorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      stopAnalyser();
      const duration = Date.now() - recordStartRef.current;
      if (duration < MIN_RECORDING_MS) { setMode('idle'); return; }
      const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
      setLastBlob(blob);
      setMode('thinking');
      await handleAudioBlob(blob);
    };
    recorder.start();
    setMode('listening');
  };

  const stopListening = () => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
  };

  // ── Core pipeline: STT → LLM → TTS ────────────────────────
  const handleAudioBlob = async (blob: Blob, isRetry = false) => {
    const formData = new FormData();
    const audioExt = blob.type.includes('mp4') ? 'audio.mp4'
                   : blob.type.includes('ogg') ? 'audio.ogg'
                   : 'audio.webm';
    formData.append('audio', blob, audioExt);

    let transcript = '';
    try {
      const sttRes  = await fetch(`${BACKEND}/transcribe`, { method: 'POST', body: formData });
      if (!sttRes.ok) throw new Error(`STT ${sttRes.status}`);
      const sttData = await sttRes.json();

      if (!sttData.success) {
        const type = sttData.error_type;
        setError(
          type === 'low_confidence' ? (sttData.user_message || "Couldn't hear that clearly — try again.") :
          type === 'hallucination'  ? "Didn't catch that — tap to try again." :
          sttData.user_message      || "Transcription failed. Tap ↩ to retry."
        );
        setMode('idle');
        return;
      }
      transcript = sttData.transcript?.trim();
      if (!transcript) { setError("Nothing captured. Tap to try again."); setMode('idle'); return; }
    } catch {
      setError(isRetry ? 'Still having trouble. Check your connection.' : "Transcription failed. Tap ↩ to retry.");
      setMode('idle');
      return;
    }

    appendMessage('user', transcript);
    await sendToTherapySession(transcript);
  };

  // ── Send message to /therapy-session ──────────────────────
  const sendToTherapySession = async (text: string) => {
    try {
      const res = await fetch(`${BACKEND}/therapy-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:         user.uid,
          message:         text,
          session_id:      sessionIdRef.current,
          start_new:       !sessionIdRef.current,
          response_length: 'long',
        }),
      });
      if (!res.ok) throw new Error(`Therapy ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSessionId(data.session_id);
      setPhase(data.phase || 1);
      setExtractedData(data.extracted || null);
      if (data.session_complete) setSessionComplete(true);

      const replyText = data.reply || '';
      appendMessage('ai', replyText);

      // ── Check if the AI wants to prescribe an exercise ─────
      // The LLM adds "PRESCRIBE_EXERCISE" as a signal in phase 2–3
      // OR you can call /exercise/prescribe explicitly after certain phases.
      // We trigger on phase transition 2→3 (Planning phase entry).
      const justEnteredPlanning = data.phase === 3 && phase !== 3;
      if (justEnteredPlanning && !exerciseMode) {
        // Speak the reply first, then offer exercise
        if (data.audio_b64) {
          setMode('speaking');
          try { await playAudioB64Array(data.audio_b64); } finally { setMode('idle'); }
        } else {
          await speakText(replyText, data.pause_ms || 0);
        }
        // Small pause then prescribe
        await new Promise(r => setTimeout(r, 800));
        await prescribeExercise(data.session_id, data.extracted);
        return;
      }

      // Normal audio playback
      if (data.audio_b64) {
        setMode('speaking');
        try { await playAudioB64Array(data.audio_b64); } finally { setMode('idle'); }
      } else {
        await speakText(replyText, data.pause_ms || 0);
      }
    } catch (err: any) {
      setError(`Something went wrong: ${err?.message || err}`);
      setMode('idle');
    }
  };

  // ── Play array of b64 chunks (from therapy-session) ───────
  const playAudioB64Array = async (chunks: string | string[]): Promise<void> => {
    const arr = Array.isArray(chunks) ? chunks : [chunks];
    for (const b64 of arr) {
      if (modeRef.current === 'listening' || modeRef.current === 'thinking') break;
      await playAudioB64(b64);
    }
  };

  // ── Prescribe exercise ─────────────────────────────────────
  const prescribeExercise = async (sid: string, extracted: any) => {
    try {
      const res = await fetch(`${BACKEND}/exercise/prescribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:    user.uid,
          session_id: sid,
          anxiety:    extracted?.proposed_task?.anxiety_pre || 5,
        }),
      });
      const data: PrescribeResponse = await res.json();
      if (!data.success) return;

      setExAnxietyPre(data.anxiety_pre || 5);
      setExerciseData(data);

      if (data.intro_speech) {
        appendMessage('ai', data.intro_speech);
        if (data.audio_b64 && !isMuted) {
          setMode('speaking');
          try { await playAudioB64(data.audio_b64); } finally { setMode('idle'); }
        } else {
          await speakText(data.intro_speech, 0);
        }
      }

      await new Promise(r => setTimeout(r, 400));
      setExerciseMode(true);
    } catch (e) {
      console.error('[prescribeExercise]', e);
    }
  };

  // ── Exercise complete callback ─────────────────────────────
  const handleExerciseComplete = async (results: any) => {
    setExerciseMode(false);
    setExerciseData(null);

    const sid = sessionIdRef.current;
    if (!sid) return;

    setMode('thinking');
    try {
      const res = await fetch(`${BACKEND}/exercise/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:          user.uid,
          session_id:       sid,
          exercise_type:    results.exercise_type,
          anxiety_pre:      exAnxietyPre,
          anxiety_post:     results.anxiety_post || exAnxietyPre,
          responses:        results.responses || {},
          notes:            results.notes || '',
          duration_s:       results.duration_s || 0,
          continue_session: true,
        }),
      });
      const data = await res.json();

      if (data.therapist_reply) {
        appendMessage('ai', data.therapist_reply);
        if (data.audio_b64 && !isMuted) {
          setMode('speaking');
          try { await playAudioB64Array(data.audio_b64); } finally { setMode('idle'); }
        } else {
          await speakText(data.therapist_reply, 0);
        }
      } else {
        setMode('idle');
      }
    } catch (e) {
      console.error('[exercise complete]', e);
      setMode('idle');
    }
  };

  const handleExerciseSkip = () => {
    setExerciseMode(false);
    setExerciseData(null);
  };

  // ── Text submit ────────────────────────────────────────────
  const handleTextSubmit = async () => {
    const text = textDraft.trim();
    if (!text || mode === 'thinking' || mode === 'speaking') return;
    setTextDraft('');
    setShowTextInput(false);
    appendMessage('user', text);
    setMode('thinking');
    await sendToTherapySession(text);
  };

  // ── Convert to plan ────────────────────────────────────────
  const convertToPlan = async () => {
    if (!sessionId) return;
    setCreatingPlan(true);
    try {
      const res  = await fetch(`${BACKEND}/session-to-plan`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, session_id: sessionId }),
      });
      const data = await res.json();
      if (data.error) { showNotification?.('Could not create plan.'); return; }
      setPlanCreated(true);
      onPlanCreated?.(data.plan);
      showNotification?.('🎯 Plan saved to your activities!');
    } catch { showNotification?.('Error creating plan.'); }
    finally { setCreatingPlan(false); }
  };

  const resetSession = () => {
    stopAudio();
    stopAnalyser();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
    setSessionId(null); setPhase(1); setSessionComplete(false);
    setExtractedData(null); setMessages([]); setPlanCreated(false);
    setError(''); setMode('idle'); setLastBlob(null); setShowTextInput(false);
    setExerciseMode(false); setExerciseData(null);
    setTimeout(() => triggerAIGreeting(), 600);
  };

  // ── Orb config ─────────────────────────────────────────────
  const orbConfig: Record<Mode, { bg: string; glow: string }> = {
    idle:      { bg: 'radial-gradient(circle at 38% 32%, #9f7aea, #5b21b6 60%, #3b0764)',  glow: '0 0 48px rgba(124,58,237,0.35), 0 0 96px rgba(91,33,182,0.15)' },
    listening: { bg: 'radial-gradient(circle at 38% 32%, #c084fc, #7c3aed 55%, #4c1d95)',  glow: '0 0 64px rgba(192,132,252,0.5), 0 0 128px rgba(124,58,237,0.25)' },
    thinking:  { bg: 'radial-gradient(circle at 38% 32%, #fde68a, #f59e0b 55%, #92400e)',  glow: '0 0 56px rgba(245,158,11,0.45)' },
    speaking:  { bg: 'radial-gradient(circle at 38% 32%, #6ee7b7, #10b981 55%, #065f46)',  glow: '0 0 64px rgba(16,185,129,0.45), 0 0 120px rgba(16,185,129,0.15)' },
  };
  const orbLabel: Record<Mode, string> = {
    idle:      sessionId ? 'Tap to reply' : 'Tap to begin',
    listening: 'Tap to send',
    thinking:  'Thinking…',
    speaking:  'Tap to interrupt',
  };
  const orbScale = mode === 'listening' ? orbLevel : 1;

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════

  // Show exercise UI fullscreen over the session
  if (exerciseMode && exerciseData) {
    return (
      <ExerciseScreen
        data={exerciseData}
        anxietyPre={exAnxietyPre}
        onComplete={handleExerciseComplete}
        onSkip={handleExerciseSkip}
      />
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '0', padding: '12px 0 24px', height: '100%', minHeight: 0,
    }}>
      {/* Phase strip */}
      {sessionId && !sessionComplete && (
        <div style={{
          display: 'flex', alignItems: 'center',
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: '100px', padding: '4px', marginBottom: '16px', flexShrink: 0,
        }}>
          {[1,2,3,4].map(p => (
            <div key={p} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '100px',
              background: p === phase ? T.accentSoft : 'transparent',
              border: p === phase ? `1px solid ${T.borderHov}` : '1px solid transparent',
              transition: 'all 0.3s ease',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: p < phase ? T.green : p === phase ? '#a78bfa' : T.textMuted,
              }} />
              {p === phase && (
                <span style={{ fontSize: '11px', fontWeight: '700', color: T.textPrimary, letterSpacing: '0.02em' }}>
                  {PHASE_LABELS[p]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Conversation history */}
      {messages.length > 0 && !sessionComplete && (
        <div style={{
          width: '100%', maxHeight: '260px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '8px',
          paddingBottom: '8px', marginBottom: '4px', scrollbarWidth: 'none',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.role === 'user' ? '78%' : '88%',
              padding: msg.role === 'user' ? '10px 16px' : '14px 18px',
              borderRadius: msg.role === 'user' ? '18px 18px 5px 18px' : '5px 18px 18px 18px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #6d28d9, #4c1d95)'
                : T.elevated,
              border: `1px solid ${msg.role === 'user' ? 'rgba(167,139,250,0.2)' : T.border}`,
              color: T.textPrimary, fontSize: '14px', lineHeight: 1.6,
              boxShadow: msg.role === 'user' ? '0 2px 16px rgba(109,40,217,0.25)' : '0 2px 20px rgba(0,0,0,0.3)',
            }}>
              {msg.role === 'ai' && (
                <p style={{ color: T.textMuted, fontSize: '10px', fontWeight: '700', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Therapist
                </p>
              )}
              {msg.text}
            </div>
          ))}
          <div ref={scrollAnchorRef} />
        </div>
      )}

      {/* ORB */}
      {!sessionComplete && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '240px', height: '240px', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: '-20px', borderRadius: '50%',
            background: mode === 'listening' ? 'radial-gradient(circle, rgba(192,132,252,0.14) 0%, transparent 70%)'
              : mode === 'speaking' ? 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)'
              : mode === 'thinking' ? 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
            transition: 'background 0.5s ease', pointerEvents: 'none',
          }} />
          {mode === 'listening' && [1,2,3].map((_,i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${(160 + i * 28) * orbScale}px`, height: `${(160 + i * 28) * orbScale}px`,
              borderRadius: '50%', border: `1px solid rgba(167,139,250,${0.22 - i * 0.06})`,
              transition: 'all 0.04s ease', pointerEvents: 'none',
            }} />
          ))}
          {mode === 'speaking' && [1,2].map((_,i) => (
            <div key={i} style={{
              position: 'absolute', width: `${170 + i * 32}px`, height: `${170 + i * 32}px`,
              borderRadius: '50%', border: `1px solid rgba(16,185,129,${0.2 - i * 0.07})`,
              animation: `speakRing ${1.2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`, pointerEvents: 'none',
            }} />
          ))}
          {mode === 'thinking' && (
            <div style={{
              position: 'absolute', width: '180px', height: '180px', borderRadius: '50%',
              border: '1.5px solid transparent', borderTopColor: T.amber,
              animation: 'spin 1s linear infinite', pointerEvents: 'none',
            }} />
          )}
          <button
            onClick={handleOrbTap}
            disabled={mode === 'thinking'}
            style={{
              width: '156px', height: '156px', borderRadius: '50%',
              border: `1.5px solid rgba(255,255,255,${mode === 'idle' ? 0.08 : 0.12})`,
              cursor: mode === 'thinking' ? 'default' : 'pointer',
              background: orbConfig[mode].bg, boxShadow: orbConfig[mode].glow,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transform: `scale(${orbScale})`,
              transition: 'background 0.5s ease, box-shadow 0.5s ease, border-color 0.3s ease',
              WebkitTapHighlightColor: 'transparent', userSelect: 'none',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: '12%', left: '20%', width: '35%', height: '28%',
              borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            {mode === 'thinking' ? (
              <Loader2 style={{ width: 38, height: 38, color: 'rgba(255,255,255,0.9)', animation: 'spin 0.85s linear infinite', position: 'relative', zIndex: 1 }} />
            ) : mode === 'listening' ? (
              <MicOff style={{ width: 38, height: 38, color: 'rgba(255,255,255,0.9)', position: 'relative', zIndex: 1 }} />
            ) : mode === 'speaking' ? (
              <Volume2 style={{ width: 38, height: 38, color: 'rgba(255,255,255,0.9)', position: 'relative', zIndex: 1 }} />
            ) : (
              <Mic style={{ width: 38, height: 38, color: 'rgba(255,255,255,0.88)', position: 'relative', zIndex: 1 }} />
            )}
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
              {orbLabel[mode]}
            </span>
          </button>
        </div>
      )}

      {/* Error + retry */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 16px', borderRadius: '10px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
          flexShrink: 0, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '13px', color: T.red, flex: 1 }}>⚠ {error}</span>
          {lastBlob && (
            <button
              onClick={() => { setError(''); setMode('thinking'); handleAudioBlob(lastBlob, true); }}
              style={{
                padding: '4px 10px', borderRadius: '8px', fontSize: '12px',
                background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
                color: T.red, cursor: 'pointer',
              }}
            >↩ Retry</button>
          )}
        </div>
      )}

      {/* Controls */}
      {!sessionComplete && (
        <div style={{ width: '100%', flexShrink: 0 }}>
          {showTextInput ? (
            <div style={{
              display: 'flex', gap: '8px', alignItems: 'center',
              padding: '10px', borderRadius: '16px',
              background: T.surface, border: `1px solid ${T.borderHov}`,
            }}>
              <input
                ref={textInputRef}
                value={textDraft}
                onChange={e => setTextDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit(); } }}
                placeholder="Type your reply…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: T.textPrimary, fontSize: '14px', lineHeight: 1.5, fontFamily: 'inherit',
                }}
              />
              <button onClick={handleTextSubmit} disabled={!textDraft.trim() || mode === 'thinking'}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                  background: textDraft.trim() ? T.accent : 'rgba(124,58,237,0.2)',
                  cursor: textDraft.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s', flexShrink: 0,
                }}>
                <Send style={{ width: 15, height: 15, color: '#fff' }} />
              </button>
              <button onClick={() => { setShowTextInput(false); setTextDraft(''); }}
                style={{
                  width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <X style={{ width: 15, height: 15, color: T.textMuted }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setIsMuted(m => !m); if (!isMuted) { stopAudio(); if (window.speechSynthesis) window.speechSynthesis.cancel(); } }}
                style={{
                  padding: '8px 16px', borderRadius: '100px',
                  background: isMuted ? 'rgba(248,113,113,0.08)' : T.surface,
                  border: `1px solid ${isMuted ? 'rgba(248,113,113,0.3)' : T.border}`,
                  color: isMuted ? T.red : T.textSecondary,
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                {isMuted ? <><VolumeX style={{ width: 13, height: 13 }} /> Unmute</> : <><Volume2 style={{ width: 13, height: 13 }} /> Mute</>}
              </button>
              <button onClick={() => setShowTextInput(true)}
                style={{
                  padding: '8px 16px', borderRadius: '100px',
                  background: T.surface, border: `1px solid ${T.border}`,
                  color: T.textSecondary, fontSize: '12px', fontWeight: '600',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                <Keyboard style={{ width: 13, height: 13 }} /> Type instead
              </button>
              {sessionId && (
                <button onClick={resetSession} style={{
                  padding: '8px 16px', borderRadius: '100px',
                  background: 'none', border: `1px solid ${T.border}`,
                  color: T.textMuted, fontSize: '12px', cursor: 'pointer',
                }}>New session</button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Session complete */}
      {sessionComplete && (
        <div style={{
          width: '100%', background: T.elevated, border: `1px solid ${T.border}`,
          borderRadius: '24px', padding: '28px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: T.greenSoft, border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0,
            }}>✓</div>
            <div>
              <p style={{ color: T.green, fontWeight: '700', fontSize: '16px', margin: 0 }}>Session complete</p>
              <p style={{ color: T.textMuted, fontSize: '12px', margin: '3px 0 0' }}>Here's what you worked through today</p>
            </div>
          </div>
          {extractedData?.situation && <SummaryCard label="What was going on" value={extractedData.situation} color={T.teal} colorSoft={T.tealSoft} icon="🌀" />}
          {extractedData?.anxious_thought && <SummaryCard label="The thought that was weighing on you" value={extractedData.anxious_thought} color={T.red} colorSoft="rgba(248,113,113,0.08)" icon="💭" />}
          {extractedData?.reframe && <SummaryCard label="A different way to see it" value={extractedData.reframe} color={T.amber} colorSoft="rgba(245,158,11,0.08)" icon="✨" italic />}
          {extractedData?.proposed_task?.name && (
            <div style={{
              padding: '16px 18px', borderRadius: '14px',
              background: T.accentSoft, border: `1px solid ${T.borderHov}`, marginBottom: '20px',
            }}>
              <p style={{ color: T.textMuted, fontSize: '10px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>🎯 Your commitment</p>
              <p style={{ color: T.textPrimary, fontWeight: '700', fontSize: '17px', margin: 0, lineHeight: 1.35 }}>{extractedData.proposed_task.name}</p>
              {extractedData.proposed_task.why && <p style={{ color: T.textSecondary, fontSize: '13px', margin: '6px 0 0', lineHeight: 1.5 }}>{extractedData.proposed_task.why}</p>}
            </div>
          )}
          {planCreated ? (
            <div style={{ padding: '14px', borderRadius: '12px', textAlign: 'center', background: T.greenSoft, border: '1px solid rgba(16,185,129,0.2)', marginBottom: '10px' }}>
              <p style={{ color: T.green, fontWeight: '700', fontSize: '14px', margin: 0 }}>🎯 Saved to your activities</p>
            </div>
          ) : (
            <button onClick={convertToPlan} disabled={creatingPlan} style={{
              width: '100%', padding: '15px', marginBottom: '10px',
              background: creatingPlan ? T.tealSoft : 'linear-gradient(135deg, #0ea5e9, #0891b2)',
              border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '700', fontSize: '15px',
              cursor: creatingPlan ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: creatingPlan ? 'none' : '0 4px 24px rgba(14,165,233,0.3)',
              transition: 'all 0.2s ease',
            }}>
              {creatingPlan
                ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Saving plan…</>
                : <><CheckCircle style={{ width: 16, height: 16 }} /> Save as my plan</>}
            </button>
          )}
          <button onClick={resetSession} style={{
            width: '100%', padding: '11px', background: 'none',
            border: `1px solid ${T.border}`, borderRadius: '12px',
            color: T.textMuted, fontSize: '13px', cursor: 'pointer',
          }}>Start new session</button>
        </div>
      )}

      <style>{`
        @keyframes spin      { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes speakRing { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.08); opacity: 0.2; } }
        button { -webkit-tap-highlight-color: transparent; }
        * { touch-action: manipulation; }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// EXERCISE SCREEN — routes to correct exercise renderer
// ══════════════════════════════════════════════════════════════════════════

function ExerciseScreen({ data, anxietyPre, onComplete, onSkip }: {
  data: PrescribeResponse;
  anxietyPre: number;
  onComplete: (r: any) => void;
  onSkip: () => void;
}) {
  const { exercise_type, exercise } = data;
  const startTime = useRef(Date.now());

  const finish = (results: any) => {
    onComplete({
      ...results,
      exercise_type,
      duration_s: Math.round((Date.now() - startTime.current) / 1000),
    });
  };

  return (
    <div style={{
      width: '100%', display: 'flex', flexDirection: 'column',
      padding: '8px 0 24px', gap: '0',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px', paddingBottom: '14px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div>
          <p style={{ color: T.textMuted, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 3px', fontWeight: '700' }}>Exercise</p>
          <p style={{ color: T.textPrimary, fontSize: '16px', fontWeight: '700', margin: 0 }}>{exercise.name}</p>
        </div>
        <button onClick={onSkip} style={{
          padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
          background: 'transparent', border: `1px solid ${T.border}`,
          color: T.textMuted, cursor: 'pointer',
        }}>Skip</button>
      </div>

      {/* Route to correct renderer */}
      {(exercise_type === 'breathing_box' || exercise_type === 'breathing_4_7_8') && (
        <BreathingExercise config={exercise.config} onComplete={finish} />
      )}
      {exercise_type === 'grounding_5_4_3_2_1' && (
        <GroundingExercise config={exercise.config} onComplete={finish} />
      )}
      {exercise_type === 'thought_record' && (
        <ThoughtRecordExercise config={exercise.config} onComplete={finish} />
      )}
      {exercise_type === 'body_scan' && (
        <BodyScanExercise config={exercise.config} onComplete={finish} />
      )}
      {exercise_type === 'fear_ladder' && (
        <FearLadderExercise config={exercise.config} onComplete={finish} />
      )}
      {exercise_type === 'values_compass' && (
        <ValuesCompassExercise config={exercise.config} onComplete={finish} />
      )}
      {exercise_type === 'safe_place' && (
        <SafePlaceExercise config={exercise.config} onComplete={finish} />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// BREATHING EXERCISE
// ══════════════════════════════════════════════════════════════════════════

function BreathingExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const phases   = config.phases || [];
  const cycles   = config.cycles || 4;
  const [phaseIdx, setPhaseIdx]       = useState(0);
  const [cycleCount, setCycleCount]   = useState(0);
  const [timeLeft, setTimeLeft]       = useState(phases[0]?.duration || 4);
  const [running, setRunning]         = useState(false);
  const [done, setDone]               = useState(false);
  const [anxietyPost, setAnxietyPost] = useState(5);

  useEffect(() => {
    if (!running || done) return;
    if (timeLeft <= 0) {
      const nextIdx = (phaseIdx + 1) % phases.length;
      const nextCycle = nextIdx === 0 ? cycleCount + 1 : cycleCount;
      if (nextCycle >= cycles && nextIdx === 0) {
        setDone(true); setRunning(false); return;
      }
      setCycleCount(nextCycle);
      setPhaseIdx(nextIdx);
      setTimeLeft(phases[nextIdx].duration);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, timeLeft, phaseIdx, cycleCount]);

  const currentPhase = phases[phaseIdx] || phases[0];
  const progress     = currentPhase ? (1 - timeLeft / currentPhase.duration) : 0;
  const orbSize      = currentPhase?.label === 'Inhale' ? 120 + progress * 40
                     : currentPhase?.label === 'Exhale' ? 160 - progress * 40
                     : 140;

  if (done) {
    return (
      <AnxietyPostSlider
        label="How does your body feel now?"
        initial={anxietyPost}
        onChange={setAnxietyPost}
        onSubmit={() => onComplete({ anxiety_post: anxietyPost, responses: {} })}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      <p style={{ color: T.textSecondary, fontSize: '13px', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
        {config.message}
      </p>

      {/* Animated breathing orb */}
      <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: `${orbSize}px`, height: `${orbSize}px`, borderRadius: '50%',
          background: currentPhase?.color || T.accent,
          opacity: 0.85,
          transition: 'width 1s ease, height 1s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 ${orbSize * 0.4}px ${currentPhase?.color || T.accent}44`,
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: 0 }}>{timeLeft}</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '600', margin: 0, letterSpacing: '0.05em' }}>{currentPhase?.label}</p>
          </div>
        </div>
      </div>

      <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>
        Cycle {cycleCount + 1} of {cycles}
      </p>

      {!running ? (
        <button onClick={() => setRunning(true)} style={{
          padding: '14px 40px', borderRadius: '100px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700',
          cursor: 'pointer', letterSpacing: '0.04em',
        }}>Begin</button>
      ) : (
        <button onClick={() => setRunning(false)} style={{
          padding: '10px 28px', borderRadius: '100px',
          border: `1px solid ${T.border}`, background: 'transparent',
          color: T.textMuted, fontSize: '13px', cursor: 'pointer',
        }}>Pause</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// GROUNDING 5-4-3-2-1
// ══════════════════════════════════════════════════════════════════════════

function GroundingExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const steps     = config.steps || [];
  const [stepIdx, setStepIdx]       = useState(0);
  const [inputs, setInputs]         = useState<Record<string, string[]>>({});
  const [current, setCurrent]       = useState('');
  const [items, setItems]           = useState<string[]>([]);
  const [anxietyPost, setAnxietyPost] = useState(5);
  const [done, setDone]             = useState(false);

  const step = steps[stepIdx];

  const addItem = () => {
    if (!current.trim()) return;
    const next = [...items, current.trim()];
    setItems(next);
    setCurrent('');
    if (next.length >= step.count) {
      const newInputs = { ...inputs, [step.sense]: next };
      setInputs(newInputs);
      if (stepIdx < steps.length - 1) {
        setStepIdx(s => s + 1);
        setItems([]);
      } else {
        setDone(true);
      }
    }
  };

  if (done) {
    return (
      <AnxietyPostSlider
        label="How grounded do you feel now?"
        initial={anxietyPost}
        onChange={setAnxietyPost}
        onSubmit={() => onComplete({ anxiety_post: anxietyPost, responses: inputs })}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            width: i === stepIdx ? '24px' : '8px', height: '8px', borderRadius: '4px',
            background: i < stepIdx ? T.green : i === stepIdx ? T.accent : T.border,
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Sense card */}
      <div style={{
        padding: '20px', borderRadius: '16px',
        background: T.elevated, border: `1px solid ${T.borderHov}`,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '36px', margin: '0 0 8px' }}>{step.icon}</p>
        <p style={{ color: T.textPrimary, fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>
          {step.count - items.length} more to go
        </p>
        <p style={{ color: T.textSecondary, fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{step.prompt}</p>
      </div>

      {/* Items so far */}
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {items.map((item, i) => (
            <span key={i} style={{
              padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
              background: T.accentSoft, border: `1px solid ${T.borderHov}`,
              color: T.textSecondary,
            }}>{item}</span>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={current}
          onChange={e => setCurrent(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addItem(); }}
          placeholder={`Name something you can ${step.sense}…`}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '12px',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit',
          }}
          autoFocus
        />
        <button onClick={addItem} style={{
          width: '44px', height: '44px', borderRadius: '12px', border: 'none',
          background: T.accent, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ArrowRight style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// THOUGHT RECORD
// ══════════════════════════════════════════════════════════════════════════

function ThoughtRecordExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const fields = config.fields || [];
  const [fieldIdx, setFieldIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [current, setCurrent] = useState<any>('');
  const [done, setDone] = useState(false);
  const [anxietyPost, setAnxietyPost] = useState(5);

  const field = fields[fieldIdx];

  const advance = () => {
    const newResponses = { ...responses, [field.id]: current };
    setResponses(newResponses);
    if (fieldIdx < fields.length - 1) {
      setFieldIdx(f => f + 1);
      setCurrent(responses[fields[fieldIdx + 1]?.id] ?? (fields[fieldIdx + 1]?.type === 'slider' ? 50 : ''));
    } else {
      setDone(true);
    }
  };

  useEffect(() => {
    if (field) setCurrent(responses[field.id] ?? (field.type === 'slider' ? 50 : ''));
  }, [fieldIdx]);

  if (done) {
    return (
      <AnxietyPostSlider
        label="How does that thought feel now?"
        initial={anxietyPost}
        onChange={setAnxietyPost}
        onSubmit={() => onComplete({ anxiety_post: anxietyPost, responses })}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{
          flex: 1, height: '3px', borderRadius: '2px',
          background: T.border, overflow: 'hidden',
        }}>
          <div style={{
            width: `${((fieldIdx) / fields.length) * 100}%`,
            height: '100%', background: T.accent, transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ color: T.textMuted, fontSize: '11px' }}>{fieldIdx + 1}/{fields.length}</span>
      </div>

      {/* Field */}
      <div style={{
        padding: '20px', borderRadius: '16px',
        background: T.elevated, border: `1px solid ${T.border}`,
      }}>
        <p style={{ color: T.textSecondary, fontSize: '13px', margin: '0 0 14px', lineHeight: 1.6 }}>{field.label}</p>

        {field.type === 'textarea' ? (
          <textarea
            value={current}
            onChange={e => setCurrent(e.target.value)}
            rows={field.rows || 3}
            placeholder={field.placeholder || ''}
            autoFocus
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.textPrimary, fontSize: '14px', lineHeight: 1.6,
              resize: 'vertical', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        ) : field.type === 'text' ? (
          <input
            value={current}
            onChange={e => setCurrent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') advance(); }}
            placeholder={field.placeholder || ''}
            autoFocus
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.textPrimary, fontSize: '14px', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
        ) : field.type === 'slider' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: T.textMuted, fontSize: '12px' }}>{field.min ?? 0}{field.unit || ''}</span>
              <span style={{ color: T.textPrimary, fontSize: '18px', fontWeight: '700' }}>{current}{field.unit || ''}</span>
              <span style={{ color: T.textMuted, fontSize: '12px' }}>{field.max ?? 100}{field.unit || ''}</span>
            </div>
            <input
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 5}
              value={current}
              onChange={e => setCurrent(Number(e.target.value))}
              style={{ width: '100%', accentColor: T.accent }}
            />
          </div>
        ) : null}
      </div>

      <button onClick={advance} style={{
        padding: '14px', borderRadius: '14px', border: 'none',
        background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        {fieldIdx < fields.length - 1 ? 'Next' : 'Finish'} <ChevronRight style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// BODY SCAN
// ══════════════════════════════════════════════════════════════════════════

function BodyScanExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const zones    = config.zones || [];
  const [zoneIdx, setZoneIdx]         = useState(0);
  const [ratings, setRatings]         = useState<Record<string, number>>({});
  const [currentRating, setCurrentRating] = useState(5);
  const [done, setDone]               = useState(false);
  const [anxietyPost, setAnxietyPost] = useState(5);
  const [notes, setNotes]             = useState('');

  const zone = zones[zoneIdx];

  const advance = () => {
    const newRatings = { ...ratings, [zone.id]: currentRating };
    setRatings(newRatings);
    if (zoneIdx < zones.length - 1) {
      setZoneIdx(z => z + 1);
      setCurrentRating(5);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnxietyPostSlider
          label="How relaxed does your body feel now?"
          initial={anxietyPost}
          onChange={setAnxietyPost}
          onSubmit={() => onComplete({ anxiety_post: anxietyPost, zone_ratings: ratings, notes })}
          showSubmit={false}
        />
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any observations about your body…"
          rows={2}
          style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textPrimary, fontSize: '14px', resize: 'none',
            outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
        <button onClick={() => onComplete({ anxiety_post: anxietyPost, zone_ratings: ratings, notes })} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>Done</button>
      </div>
    );
  }

  // Simple silhouette using emoji as zone indicators
  const zoneEmoji: Record<string, string> = { head: '🧠', neck: '🦒', chest: '❤️', abdomen: '🫁', arms: '💪', legs: '🦵' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Zone dots */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {zones.map((z, i) => (
          <div key={i} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: i < zoneIdx ? T.green : i === zoneIdx ? T.accent : T.border,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', transition: 'all 0.3s',
          }}>
            {i < zoneIdx ? '✓' : i === zoneIdx ? (zoneEmoji[z.id] || '•') : ''}
          </div>
        ))}
      </div>

      <div style={{
        padding: '24px', borderRadius: '16px',
        background: T.elevated, border: `1px solid ${T.borderHov}`,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '32px', margin: '0 0 8px' }}>{zoneEmoji[zone.id] || '•'}</p>
        <p style={{ color: T.textPrimary, fontSize: '18px', fontWeight: '700', margin: '0 0 8px' }}>{zone.label}</p>
        <p style={{ color: T.textSecondary, fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>{zone.prompt}</p>

        <p style={{ color: T.textMuted, fontSize: '12px', margin: '0 0 8px' }}>Tension level</p>
        <p style={{ color: T.textPrimary, fontSize: '28px', fontWeight: '700', margin: '0 0 8px' }}>{currentRating}/10</p>
        <input
          type="range" min={0} max={10} step={1} value={currentRating}
          onChange={e => setCurrentRating(Number(e.target.value))}
          style={{ width: '100%', accentColor: currentRating >= 7 ? T.red : currentRating >= 4 ? T.amber : T.green }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ color: T.green, fontSize: '11px' }}>Relaxed</span>
          <span style={{ color: T.red, fontSize: '11px' }}>Tense</span>
        </div>
      </div>

      <button onClick={advance} style={{
        padding: '14px', borderRadius: '14px', border: 'none',
        background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        {zoneIdx < zones.length - 1 ? 'Next zone' : 'Finish scan'} <ChevronRight style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// FEAR LADDER
// ══════════════════════════════════════════════════════════════════════════

function FearLadderExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const stepCount = config.steps || 5;
  const [steps, setSteps] = useState<FearStep[]>(
    Array.from({ length: stepCount }, () => ({ situation: '', anxiety: 50 }))
  );
  const [notes, setNotes] = useState('');

  const update = (i: number, field: keyof FearStep, value: any) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const sorted = [...steps].sort((a, b) => a.anxiety - b.anxiety);
  const filledCount = steps.filter(s => s.situation.trim()).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <p style={{ color: T.textSecondary, fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
        {config.message}
      </p>

      {steps.map((step, i) => (
        <div key={i} style={{
          padding: '14px', borderRadius: '14px',
          background: T.elevated, border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: step.situation.trim() ? T.accentSoft : T.border,
              border: `1px solid ${step.situation.trim() ? T.borderHov : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.textSecondary, fontSize: '11px', fontWeight: '700',
            }}>{i + 1}</div>
            <input
              value={step.situation}
              onChange={e => update(i, 'situation', e.target.value)}
              placeholder={`Step ${i + 1}…`}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '8px',
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.textPrimary, fontSize: '13px', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <span style={{
              minWidth: '36px', textAlign: 'right', color: T.textPrimary,
              fontSize: '13px', fontWeight: '700',
            }}>{step.anxiety}</span>
          </div>
          <input
            type="range" min={0} max={100} step={5} value={step.anxiety}
            onChange={e => update(i, 'anxiety', Number(e.target.value))}
            style={{ width: '100%', accentColor: T.accent }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ color: T.green, fontSize: '10px' }}>Easy</span>
            <span style={{ color: T.red, fontSize: '10px' }}>Very hard</span>
          </div>
        </div>
      ))}

      <button
        onClick={() => onComplete({ responses: sorted, notes })}
        disabled={filledCount < 2}
        style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: filledCount >= 2 ? T.accent : T.border,
          color: '#fff', fontSize: '15px', fontWeight: '700',
          cursor: filledCount >= 2 ? 'pointer' : 'not-allowed',
        }}>
        Save ladder ({filledCount}/{stepCount} filled)
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// VALUES COMPASS
// ══════════════════════════════════════════════════════════════════════════

function ValuesCompassExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const domains = config.domains || [];
  const [ratings, setRatings] = useState<Record<string, { importance: number; living_it: number }>>(
    Object.fromEntries(domains.map(d => [d, { importance: 5, living_it: 5 }]))
  );
  const [notes, setNotes] = useState('');

  const update = (domain: string, field: 'importance' | 'living_it', value: number) => {
    setRatings(prev => ({ ...prev, [domain]: { ...prev[domain], [field]: value } }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <p style={{ color: T.textSecondary, fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
        {config.message}
      </p>

      {domains.map(domain => {
        const r   = ratings[domain] || { importance: 5, living_it: 5 };
        const gap = r.importance - r.living_it;
        return (
          <div key={domain} style={{
            padding: '14px 16px', borderRadius: '14px',
            background: T.elevated, border: `1px solid ${gap > 3 ? T.borderHov : T.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ color: T.textPrimary, fontSize: '14px', fontWeight: '600', margin: 0 }}>{domain}</p>
              {gap > 3 && <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                background: T.accentSoft, color: '#a78bfa', fontWeight: '700',
              }}>Gap</span>}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {(['importance', 'living_it'] as const).map(field => (
                <div key={field} style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: T.textMuted, fontSize: '10px', textTransform: 'capitalize' }}>
                      {field === 'importance' ? 'Matters' : 'Living it'}
                    </span>
                    <span style={{ color: T.textPrimary, fontSize: '12px', fontWeight: '700' }}>{r[field]}/10</span>
                  </div>
                  <input
                    type="range" min={0} max={10} step={1} value={r[field]}
                    onChange={e => update(domain, field, Number(e.target.value))}
                    style={{ width: '100%', accentColor: field === 'importance' ? T.teal : T.accent }}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button onClick={() => onComplete({ responses: ratings, notes })} style={{
        padding: '14px', borderRadius: '14px', border: 'none',
        background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
      }}>Save compass</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SAFE PLACE VISUALISATION
// ══════════════════════════════════════════════════════════════════════════

function SafePlaceExercise({ config, onComplete }: { config: ExerciseConfig; onComplete: (r: any) => void }) {
  const prompts    = config.prompts || [];
  const [promptIdx, setPromptIdx]       = useState(0);
  const [placeName, setPlaceName]       = useState('');
  const [description, setDescription]  = useState('');
  const [anxietyPost, setAnxietyPost]   = useState(5);
  const [done, setDone]                 = useState(false);

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnxietyPostSlider
          label="How calm do you feel now?"
          initial={anxietyPost}
          onChange={setAnxietyPost}
          onSubmit={() => onComplete({ anxiety_post: anxietyPost, place_name: placeName, description })}
          showSubmit={false}
        />
        <input
          value={placeName}
          onChange={e => setPlaceName(e.target.value)}
          placeholder="Give this place a name…"
          style={{
            padding: '12px', borderRadius: '10px',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe it in a few words…"
          rows={2}
          style={{
            padding: '12px', borderRadius: '10px',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textPrimary, fontSize: '14px', resize: 'none',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button onClick={() => onComplete({ anxiety_post: anxietyPost, place_name: placeName, description })} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>Done</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Soft ambient card */}
      <div style={{
        padding: '28px 24px', borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(14,165,233,0.08))',
        border: `1px solid ${T.borderHov}`, textAlign: 'center',
      }}>
        <p style={{ color: T.textMuted, fontSize: '11px', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Prompt {promptIdx + 1} of {prompts.length}
        </p>
        <p style={{ color: T.textPrimary, fontSize: '16px', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
          "{prompts[promptIdx]}"
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {prompts.map((_, i) => (
          <div key={i} style={{
            width: i === promptIdx ? '20px' : '6px', height: '6px', borderRadius: '3px',
            background: i <= promptIdx ? T.accent : T.border, transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {promptIdx < prompts.length - 1 ? (
        <button onClick={() => setPromptIdx(p => p + 1)} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accentSoft, border_: `1px solid ${T.borderHov}`,
          color: '#a78bfa', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          Next <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      ) : (
        <button onClick={() => setDone(true)} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>
          Name your place
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SHARED: POST-EXERCISE ANXIETY SLIDER
// ══════════════════════════════════════════════════════════════════════════

function AnxietyPostSlider({ label, initial, onChange, onSubmit, showSubmit = true }: {
  label: string; initial: number; onChange: (v: number) => void;
  onSubmit?: () => void; showSubmit?: boolean;
}) {
  const [val, setVal] = useState(initial);
  const color = val <= 3 ? T.green : val <= 6 ? T.amber : T.red;

  return (
    <div style={{
      padding: '20px', borderRadius: '16px',
      background: T.elevated, border: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      <p style={{ color: T.textSecondary, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{label}</p>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color, fontSize: '40px', fontWeight: '700', margin: '0 0 4px' }}>{val}</p>
        <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>out of 10</p>
      </div>
      <input
        type="range" min={0} max={10} step={1} value={val}
        onChange={e => { const n = Number(e.target.value); setVal(n); onChange(n); }}
        style={{ width: '100%', accentColor: color }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: T.green, fontSize: '11px' }}>Calm</span>
        <span style={{ color: T.red, fontSize: '11px' }}>Very anxious</span>
      </div>
      {showSubmit && onSubmit && (
        <button onClick={onSubmit} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>Done</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SHARED: SUMMARY CARD
// ══════════════════════════════════════════════════════════════════════════

function SummaryCard({ label, value, color, colorSoft, icon, italic = false }: {
  label: string; value: string; color: string; colorSoft: string; icon: string; italic?: boolean;
}) {
  return (
    <div style={{
      padding: '14px 16px', borderRadius: '14px', background: colorSoft,
      border: `1px solid ${color}22`, marginBottom: '12px',
    }}>
      <p style={{ color, fontSize: '10px', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
        {icon} {label}
      </p>
      <p style={{
        color: 'rgba(240,236,255,0.85)', fontSize: '14px', margin: 0,
        lineHeight: 1.6, fontStyle: italic ? 'italic' : 'normal',
      }}>
        {italic ? `"${value}"` : value}
      </p>
    </div>
  );
}