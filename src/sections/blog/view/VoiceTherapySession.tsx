import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, MicOff, Loader2, CheckCircle, Volume2, VolumeX,
  Keyboard, Send, X, Wind, Brain, Heart, Zap, ChevronRight,
  RotateCcw, ArrowRight, BookOpen, Dumbbell, MessageSquare,
} from 'lucide-react';
import AvatarCanvas from 'src/components/AvatarCanvas';


const BACKEND = 'https://theraplyendpoint.onrender.com';
const MIN_RECORDING_MS = 400;

// ── 5-part program parts ─────────────────────────────────────
// 1: Check-in  2: Review  3: Psychoeducation  4: Exercise  5: Commit
const PART_LABELS: Record<number, string> = {
  1: 'Check-in',
  2: 'Review',
  3: 'Learn',
  4: 'Exercise',
  5: 'Commit',
};

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


const extractMessage = (text: string): string => {
  if (!text) return '';
  try {
    const parsed = JSON.parse(text);
    return parsed.message || text;
  } catch {
    return text;
  }
};

type Mode = 'idle' | 'listening' | 'thinking' | 'speaking';

// Which part of the 5-part session arc we're in
type SessionPart = 1 | 2 | 3 | 4 | 5;

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
  part?: SessionPart;
}

// ─── Exercise types (unchanged from old frontend) ──────────────────

interface BreathingPhase { label: string; duration: number; color: string; }
interface GroundingStep  { count: number; sense: string; icon: string; prompt: string; }
interface ThoughtField   { id: string; label: string; type: string; placeholder?: string; rows?: number; min?: number; max?: number; step?: number; unit?: string; }
interface BodyZone       { id: string; label: string; prompt: string; }

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
  name:        string;
  description: string;
  config:      ExerciseConfig;
  inputs:      string[];
  duration_s:  number;
}

interface Psychoeducation {
  title:       string;
  body:        string;
  key_insight: string;
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════

export default function VoiceTherapySession({ user, onPlanCreated, showNotification }: any) {
  const [mode, setMode]                         = useState<Mode>('idle');

  // ── Structured session state ─────────────────────────────────
  const [sessionId, setSessionId]               = useState<string | null>(null);
  const [currentPart, setCurrentPart]           = useState<SessionPart>(1);
  const [sessionComplete, setSessionComplete]   = useState(false);
  const [programComplete, setProgramComplete]   = useState(false);
  const [commitment, setCommitment]             = useState('');
  const [weekInfo, setWeekInfo]                 = useState<{ week: number; session_number: number; title?: string; theme?: string } | null>(null);

  // ── Check-in (Part 1) ─────────────────────────────────────────
  const [checkinScore, setCheckinScore]         = useState<number>(5);
  const [checkinNote, setCheckinNote]           = useState('');
  const [checkinSubmitted, setCheckinSubmitted] = useState(false);
  const [openingMessage, setOpeningMessage]     = useState('');

  // ── Psychoeducation (Part 3) ──────────────────────────────────
  const [psychoed, setPsychoed]                 = useState<Psychoeducation | null>(null);

  // ── Exercise (Part 4) ─────────────────────────────────────────
  const [exerciseMode, setExerciseMode]         = useState(false);
  const [exerciseData, setExerciseData]         = useState<{ exercise_type: string; exercise: Exercise; intro_message?: string; audio_b64?: string } | null>(null);
  const [exAnxietyPre, setExAnxietyPre]         = useState(5);

  // ── Shared ────────────────────────────────────────────────────
  const [messages, setMessages]                 = useState<Message[]>([]);
  const [isMuted, setIsMuted]                   = useState(false);
  const [error, setError]                       = useState('');
  const [orbLevel, setOrbLevel]                 = useState(1);
  const [showTextInput, setShowTextInput]       = useState(false);
  const [textDraft, setTextDraft]               = useState('');
  const [autoStarted, setAutoStarted]           = useState(false);
  const [lastBlob, setLastBlob]                 = useState<Blob | null>(null);
  const [sessionLoading, setSessionLoading]     = useState(false);

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
  const currentPartRef   = useRef<SessionPart>(1);
  const modeRef          = useRef<Mode>('idle');

  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { currentPartRef.current = currentPart; }, [currentPart]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (showTextInput) setTimeout(() => textInputRef.current?.focus(), 100);
  }, [showTextInput]);

  // Auto-start: fetch program status then start the session
  useEffect(() => {
    if (autoStarted) return;
    setAutoStarted(true);
    setTimeout(() => startProgramSession(), 800);
  }, []); // eslint-disable-line

  useEffect(() => {
    return () => {
      stopAudio();
      stopAnalyser();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────
  const appendMessage = (role: 'user' | 'ai', text: string, part?: SessionPart) => {
    setMessages(prev => [...prev, { role, text, timestamp: Date.now(), part }]);
  };

  // ── AnalyserNode ─────────────────────────────────────────────
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
    } catch { /* silent */ }
  };

  const stopAnalyser = () => {
    cancelAnimationFrame(animFrameRef.current);
    analyserRef.current = null;
    setOrbLevel(1);
  };

  // ── Audio ────────────────────────────────────────────────────
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const playAudioB64 = (b64: string): Promise<void> =>
    new Promise((resolve) => {
      stopAudio();
      const binary = atob(b64);
      const bytes  = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob  = new Blob([bytes], { type: 'audio/mpeg' });
      const url   = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
      audio.play().catch(() => resolve());
    });

  const playAudioB64Array = async (chunks: string | string[]): Promise<void> => {
    const arr = Array.isArray(chunks) ? chunks : [chunks];
    for (const b64 of arr) {
      if (modeRef.current === 'listening' || modeRef.current === 'thinking') break;
      await playAudioB64(b64);
    }
  };

  // ── TTS fallback ─────────────────────────────────────────────
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

  const speakResponse = async (text: string, audio_b64?: string | string[]): Promise<void> => {
    if (isMuted) return;
    setMode('speaking');
    try {
      if (audio_b64) {
        await playAudioB64Array(audio_b64);
      } else {
        await speakSentences(text);
      }
    } catch {
      await browserSpeak(text.replace(/\*\*?(.*?)\*\*?/g, '$1').replace(/\n/g, ' ').trim());
    } finally {
      setMode('idle');
    }
  };

  // ── Mic ──────────────────────────────────────────────────────
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

  // ── STT pipeline ─────────────────────────────────────────────
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

    appendMessage('user', transcript, currentPartRef.current);
    await routeUserMessage(transcript);
  };

  // ── Message router — directs to correct program endpoint ────
  const routeUserMessage = async (text: string) => {
    const part = currentPartRef.current;
    const sid  = sessionIdRef.current;

    if (!sid) {
      setError('No active session. Please wait…');
      setMode('idle');
      return;
    }

    try {
      if (part === 2) {
        await sendReviewTurn(text, sid);
      } else if (part === 5) {
        await sendCommitTurn(text, sid);
      } else {
        // Parts 1, 3, 4 don't have free-form voice turns (handled by UI)
        setMode('idle');
      }
    } catch (e: any) {
      setError(`Something went wrong: ${e?.message || e}`);
      setMode('idle');
    }
  };

  // ── Text input submit ─────────────────────────────────────────
  const handleTextSubmit = async () => {
    const text = textDraft.trim();
    if (!text || mode === 'thinking' || mode === 'speaking') return;
    setTextDraft('');
    setShowTextInput(false);
    appendMessage('user', text, currentPartRef.current);
    setMode('thinking');
    await routeUserMessage(text);
  };

  // ════════════════════════════════════════════════════════════
  //  PROGRAM ENDPOINTS
  // ════════════════════════════════════════════════════════════

  // ── Part 1: Start session ─────────────────────────────────────
  const startProgramSession = async () => {
    setSessionLoading(true);
    try {
      const res  = await fetch(`${BACKEND}/program/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to start session');

      setSessionId(data.session_id);
      setWeekInfo({
        week:           data.week,
        session_number: data.session_number,
        title:          data.session_definition?.title,
        theme:          data.week_definition?.theme,
      });
      setCurrentPart(1);

      if (data.opening_message) {
        setOpeningMessage(data.opening_message);
        const openingMsg = extractMessage(data.opening_message);
        appendMessage('ai', openingMsg, 1);
        await speakResponse(openingMsg, data.audio_b64);
      }
    } catch (e: any) {
      setError(`Could not start session: ${e?.message}`);
    } finally {
      setSessionLoading(false);
    }
  };

  // ── Part 1 → Part 2: Submit check-in score ────────────────────
  const submitCheckin = async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    setMode('thinking');
    setCheckinSubmitted(true);
    try {
      const res  = await fetch(`${BACKEND}/program/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, session_id: sid, score: checkinScore, note: checkinNote }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCurrentPart(2);
      if (data.review_message) {
        const reviewMsg = extractMessage(data.review_message);
        appendMessage('ai', reviewMsg, 2);
        await speakResponse(reviewMsg, data.audio_b64);
      }
    } catch (e: any) {
      setError(`Check-in failed: ${e?.message}`);
      setCheckinSubmitted(false);
    } finally {
      setMode('idle');
    }
  };

  // ── Part 2: Review conversation turn ─────────────────────────
  const sendReviewTurn = async (text: string, sid: string) => {
    const res  = await fetch(`${BACKEND}/program/review-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.uid, session_id: sid, message: text }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    const reply2 = extractMessage(data.reply);
    appendMessage('ai', reply2, 2);
    await speakResponse(reply2, data.audio_b64);

    if (data.part_complete) {
      // Transition to Part 3 — psychoeducation
      setCurrentPart(3);
      if (data.psychoeducation) {
        setPsychoed(data.psychoeducation);
      }
    }
  };

  // ── Part 3 → Part 4: Mark psychoeducation complete ────────────
  const completePsychoeducation = async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    setMode('thinking');
    try {
      const res  = await fetch(`${BACKEND}/program/psychoeducation-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, session_id: sid }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCurrentPart(4);
      setExAnxietyPre(checkinScore);
      if (data.exercise && data.exercise_type) {
        setExerciseData({
          exercise_type:  data.exercise_type,
          exercise:       data.exercise,
          intro_message:  data.intro_message,
          audio_b64:      data.audio_b64,
        });

        if (data.intro_message) {
          appendMessage('ai', data.intro_message, 4);
          await speakResponse(data.intro_message, data.audio_b64);
        }

        await new Promise(r => setTimeout(r, 400));
        setExerciseMode(true);
      }
    } catch (e: any) {
      setError(`Couldn't load exercise: ${e?.message}`);
    } finally {
      setMode('idle');
    }
  };

  // ── Part 4: Exercise complete ─────────────────────────────────
  const handleExerciseComplete = async (results: any) => {
    setExerciseMode(false);
    setExerciseData(null);

    const sid = sessionIdRef.current;
    if (!sid) return;

    setMode('thinking');
    try {
      const res  = await fetch(`${BACKEND}/program/exercise-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:      user.uid,
          session_id:   sid,
          anxiety_pre:  exAnxietyPre,
          anxiety_post: results.anxiety_post ?? exAnxietyPre,
          responses:    results.responses || {},
          notes:        results.notes     || '',
          duration_s:   results.duration_s || 0,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCurrentPart(5);
      if (data.debrief_message) {
        const debriefMsg = extractMessage(data.debrief_message);
        appendMessage('ai', debriefMsg, 5);
        await speakResponse(debriefMsg, data.audio_b64);
      }
    } catch (e: any) {
      setError(`Exercise submission failed: ${e?.message}`);
    } finally {
      setMode('idle');
    }
  };

  const handleExerciseSkip = () => {
    setExerciseMode(false);
    setExerciseData(null);
    // Jump straight to commit (Part 5) without completing exercise
    completePsychoeducation().catch(() => { setCurrentPart(5); });
  };

  // ── Part 5: Commit conversation turn ─────────────────────────
  const sendCommitTurn = async (text: string, sid: string) => {
    const res  = await fetch(`${BACKEND}/program/commit-turn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.uid, session_id: sid, message: text }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    const reply5 = extractMessage(data.reply);
    appendMessage('ai', reply5, 5);
    await speakResponse(reply5, data.audio_b64);

    if (data.session_complete) {
      setSessionComplete(true);
      if (data.commitment) setCommitment(data.commitment);
      if (data.program_complete) setProgramComplete(true);
    }
  };

  // ── Reset / new session ───────────────────────────────────────
  const resetSession = () => {
    stopAudio();
    stopAnalyser();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());

    setSessionId(null);
    setCurrentPart(1);
    setSessionComplete(false);
    setProgramComplete(false);
    setCommitment('');
    setWeekInfo(null);
    setCheckinScore(5);
    setCheckinNote('');
    setCheckinSubmitted(false);
    setOpeningMessage('');
    setPsychoed(null);
    setExerciseMode(false);
    setExerciseData(null);
    setMessages([]);
    setError('');
    setMode('idle');
    setLastBlob(null);
    setShowTextInput(false);

    setTimeout(() => startProgramSession(), 600);
  };

  // ── Orb config ────────────────────────────────────────────────
  const orbConfig: Record<Mode, { bg: string; glow: string }> = {
    idle:      { bg: 'radial-gradient(circle at 38% 32%, #9f7aea, #5b21b6 60%, #3b0764)',  glow: '0 0 48px rgba(124,58,237,0.35), 0 0 96px rgba(91,33,182,0.15)' },
    listening: { bg: 'radial-gradient(circle at 38% 32%, #c084fc, #7c3aed 55%, #4c1d95)',  glow: '0 0 64px rgba(192,132,252,0.5), 0 0 128px rgba(124,58,237,0.25)' },
    thinking:  { bg: 'radial-gradient(circle at 38% 32%, #fde68a, #f59e0b 55%, #92400e)',  glow: '0 0 56px rgba(245,158,11,0.45)' },
    speaking:  { bg: 'radial-gradient(circle at 38% 32%, #6ee7b7, #10b981 55%, #065f46)',  glow: '0 0 64px rgba(16,185,129,0.45), 0 0 120px rgba(16,185,129,0.15)' },
  };
  const orbLabel: Record<Mode, string> = {
    idle:      sessionId ? 'Tap to speak' : 'Starting…',
    listening: 'Tap to send',
    thinking:  'Thinking…',
    speaking:  'Tap to interrupt',
  };
  const orbScale = mode === 'listening' ? orbLevel : 1;

  // Voice-turn UI is only shown in Parts 2 and 5
  const isVoicePart = currentPart === 2 || currentPart === 5;

  // ══════════════════════════════════════════════════════════
  // RENDER — Exercise screen overrides everything
  // ══════════════════════════════════════════════════════════
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

      {/* ── Week / part strip ────────────────────────────────── */}
      {sessionId && !sessionComplete && weekInfo && (
        <div style={{ width: '100%', marginBottom: '14px', flexShrink: 0 }}>
          {/* Week badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                padding: '3px 10px', borderRadius: '100px',
                background: T.accentSoft, border: `1px solid ${T.borderHov}`,
                color: '#a78bfa', fontSize: '11px', fontWeight: '700', letterSpacing: '0.04em',
              }}>
                Week {weekInfo.week} · Session {weekInfo.session_number}
              </span>
              {weekInfo.theme && (
                <span style={{ color: T.textMuted, fontSize: '11px' }}>{weekInfo.theme}</span>
              )}
            </div>
          </div>

          {/* 5-part progress bar */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {([1,2,3,4,5] as SessionPart[]).map(p => (
              <div key={p} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}>
                <div style={{
                  height: '3px', width: '100%', borderRadius: '2px',
                  background: p < currentPart ? T.green : p === currentPart ? T.accent : T.border,
                  transition: 'background 0.4s ease',
                }} />
                {p === currentPart && (
                  <span style={{ color: '#a78bfa', fontSize: '9px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {PART_LABELS[p]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Session loading ──────────────────────────────────── */}
      {sessionLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: T.textMuted, fontSize: '13px', marginBottom: '16px' }}>
          <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
          Starting your session…
        </div>
      )}

      {/* ── Conversation history ─────────────────────────────── */}
      {messages.length > 0 && !sessionComplete && (
        <div style={{
          width: '100%', maxHeight: '240px', overflowY: 'auto',
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
                  Therapist · {msg.part ? PART_LABELS[msg.part] : ''}
                </p>
              )}
              {msg.text}
            </div>
          ))}
          <div ref={scrollAnchorRef} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          PART 1 — CHECK-IN UI (shown below opening message)
          ═══════════════════════════════════════════════════════ */}
      {currentPart === 1 && sessionId && !checkinSubmitted && !sessionComplete && (
        <CheckinPanel
          score={checkinScore}
          note={checkinNote}
          onScoreChange={setCheckinScore}
          onNoteChange={setCheckinNote}
          onSubmit={submitCheckin}
          isLoading={mode === 'thinking'}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
          PART 2 — REVIEW: voice/text conversation orb
          PART 5 — COMMIT: same orb
          (Parts 3 and 4 have their own full UI cards below)
          ═══════════════════════════════════════════════════════ */}
       
{isVoicePart && !sessionComplete && (
  <>
    <AvatarCanvas
      mode={mode}
      orbLevel={orbLevel}
      onTap={handleOrbTap}
      size={240}
    />
  </>
)}

      {/* ═══════════════════════════════════════════════════════
          PART 3 — PSYCHOEDUCATION CARD
          ═══════════════════════════════════════════════════════ */}
      {currentPart === 3 && psychoed && !sessionComplete && (
        <PsychoeducationCard
          content={psychoed}
          onContinue={completePsychoeducation}
          isLoading={mode === 'thinking'}
        />
      )}

      {/* Error + retry */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 16px', borderRadius: '10px',
          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
          flexShrink: 0, flexWrap: 'wrap', width: '100%',
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

      {/* ── Controls (voice parts only) ─────────────────────── */}
      {isVoicePart && !sessionComplete && (
        <div style={{ width: '100%', flexShrink: 0, marginTop: '8px' }}>
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

      {/* ═══════════════════════════════════════════════════════
          SESSION COMPLETE
          ═══════════════════════════════════════════════════════ */}
      {sessionComplete && (
        <div style={{
          width: '100%', background: T.elevated, border: `1px solid ${T.border}`,
          borderRadius: '24px', padding: '28px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: T.greenSoft, border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', flexShrink: 0,
            }}>✓</div>
            <div>
              <p style={{ color: T.green, fontWeight: '700', fontSize: '16px', margin: 0 }}>
                {programComplete ? '🎉 Program complete!' : 'Session complete'}
              </p>
              <p style={{ color: T.textMuted, fontSize: '12px', margin: '3px 0 0' }}>
                {weekInfo ? `Week ${weekInfo.week} · Session ${weekInfo.session_number}` : ''}{weekInfo?.title ? ` — ${weekInfo.title}` : ''}
              </p>
            </div>
          </div>

          {commitment && (
            <div style={{
              padding: '16px 18px', borderRadius: '14px',
              background: T.accentSoft, border: `1px solid ${T.borderHov}`, marginBottom: '20px',
            }}>
              <p style={{ color: T.textMuted, fontSize: '10px', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>🎯 Your commitment</p>
              <p style={{ color: T.textPrimary, fontWeight: '600', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>{commitment}</p>
            </div>
          )}

          {!programComplete && (
            <button onClick={resetSession} style={{
              width: '100%', padding: '15px', marginBottom: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
              border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '700', fontSize: '15px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 24px rgba(124,58,237,0.3)',
            }}>
              <ArrowRight style={{ width: 16, height: 16 }} /> Next session
            </button>
          )}
          <button onClick={resetSession} style={{
            width: '100%', padding: '11px', background: 'none',
            border: `1px solid ${T.border}`, borderRadius: '12px',
            color: T.textMuted, fontSize: '13px', cursor: 'pointer',
          }}>Start over</button>
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
// PART 1 — CHECK-IN PANEL
// ══════════════════════════════════════════════════════════════════════════

function CheckinPanel({
  score, note, onScoreChange, onNoteChange, onSubmit, isLoading,
}: {
  score: number; note: string;
  onScoreChange: (v: number) => void;
  onNoteChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const color = score <= 3 ? T.green : score <= 6 ? T.amber : T.red;
  return (
    <div style={{
      width: '100%', background: T.elevated, border: `1px solid ${T.border}`,
      borderRadius: '20px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px',
    }}>
      <p style={{ color: T.textSecondary, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
        How anxious are you feeling right now?
      </p>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color, fontSize: '44px', fontWeight: '700', margin: '0 0 4px' }}>{score}</p>
        <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>out of 10</p>
      </div>

      <input
        type="range" min={0} max={10} step={1} value={score}
        onChange={e => onScoreChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: T.green, fontSize: '11px' }}>Calm</span>
        <span style={{ color: T.red, fontSize: '11px' }}>Very anxious</span>
      </div>

      <input
        value={note}
        onChange={e => onNoteChange(e.target.value)}
        placeholder="What's on your mind coming in? (optional)"
        style={{
          padding: '12px 14px', borderRadius: '12px',
          background: T.surface, border: `1px solid ${T.border}`,
          color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit',
        }}
      />

      <button
        onClick={onSubmit}
        disabled={isLoading}
        style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: isLoading ? T.accentSoft : T.accent,
          color: '#fff', fontSize: '15px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {isLoading
          ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Submitting…</>
          : <>Continue <ChevronRight style={{ width: 16, height: 16 }} /></>}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PART 3 — PSYCHOEDUCATION CARD
// ══════════════════════════════════════════════════════════════════════════

function PsychoeducationCard({
  content, onContinue, isLoading,
}: {
  content: { title: string; body: string; key_insight: string };
  onContinue: () => void;
  isLoading: boolean;
}) {
  return (
    <div style={{
      width: '100%', background: T.elevated, border: `1px solid ${T.border}`,
      borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, #7c3aed, #0ea5e9)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: T.tealSoft, border: `1px solid rgba(14,165,233,0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BookOpen style={{ width: 16, height: 16, color: T.teal }} />
        </div>
        <div>
          <p style={{ color: T.textMuted, fontSize: '10px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>
            This session's concept
          </p>
          <p style={{ color: T.textPrimary, fontWeight: '700', fontSize: '15px', margin: 0 }}>{content.title}</p>
        </div>
      </div>

      <p style={{ color: T.textSecondary, fontSize: '14px', lineHeight: 1.7, margin: 0 }}>{content.body}</p>

      {/* Key insight */}
      <div style={{
        padding: '14px 16px', borderRadius: '14px',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(14,165,233,0.08))',
        border: `1px solid ${T.borderHov}`,
      }}>
        <p style={{ color: T.textMuted, fontSize: '10px', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>💡 Key insight</p>
        <p style={{ color: '#c4b5fd', fontSize: '14px', fontWeight: '600', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
          "{content.key_insight}"
        </p>
      </div>

      <button
        onClick={onContinue}
        disabled={isLoading}
        style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: isLoading ? T.accentSoft : 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
          color: '#fff', fontSize: '15px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: isLoading ? 'none' : '0 4px 20px rgba(124,58,237,0.3)',
        }}
      >
        {isLoading
          ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Loading exercise…</>
          : <><Dumbbell style={{ width: 16, height: 16 }} /> Start exercise</>}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PART 4 — EXERCISE SCREEN (full-screen overlay)
// ══════════════════════════════════════════════════════════════════════════

function ExerciseScreen({
  data, anxietyPre, onComplete, onSkip,
}: {
  data: { exercise_type: string; exercise: Exercise; intro_message?: string; audio_b64?: string };
  anxietyPre: number;
  onComplete: (r: any) => void;
  onSkip: () => void;
}) {
  const ex   = data.exercise;
  const type = data.exercise_type;
  const cfg  = ex.config;

  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);

  const wrap = (child: React.ReactNode) => (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '0',
      padding: '12px 0 24px', height: '100%', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: T.accentSoft, border: `1px solid ${T.borderHov}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Dumbbell style={{ width: 16, height: 16, color: '#a78bfa' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#a78bfa', fontSize: '11px', margin: '0 0 2px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exercise · Part 4</p>
          <p style={{ color: T.textPrimary, fontWeight: '700', fontSize: '15px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ex.name}</p>
        </div>
        <button onClick={onSkip} style={{
          padding: '6px 12px', borderRadius: '100px', fontSize: '12px',
          background: 'none', border: `1px solid ${T.border}`, color: T.textMuted, cursor: 'pointer', flexShrink: 0,
        }}>Skip</button>
      </div>

      {cfg.message && (
        <p style={{ color: T.textSecondary, fontSize: '13px', lineHeight: 1.6, margin: '0 0 18px', fontStyle: 'italic' }}>
          "{cfg.message}"
        </p>
      )}

      {child}
    </div>
  );

  if (type === 'box_breathing' || type === 'diaphragmatic_breathing' || type === 'physiological_sigh') {
    return wrap(<BreathingExercise config={cfg} anxietyPre={anxietyPre} onComplete={onComplete} />);
  }
  if (type === 'grounding_54321') {
    return wrap(<GroundingExercise config={cfg} anxietyPre={anxietyPre} onComplete={onComplete} />);
  }
  if (type === 'thought_record' || type === 'thought_catch' || type === 'evidence_court') {
    return wrap(<ThoughtRecordExercise config={cfg} anxietyPre={anxietyPre} onComplete={onComplete} />);
  }
  if (type === 'body_scan') {
    return wrap(<BodyScanExercise config={cfg} anxietyPre={anxietyPre} onComplete={onComplete} />);
  }
  if (type === 'values_compass') {
    return wrap(<ValuesCompassExercise config={cfg} anxietyPre={anxietyPre} onComplete={onComplete} />);
  }
  if (type === 'safe_place') {
    return wrap(<SafePlaceExercise config={cfg} anxietyPre={anxietyPre} onComplete={onComplete} />);
  }

  // Generic fallback for all other exercise types (anxiety_mapping, trigger_swipe, fear_ladder, etc.)
  return wrap(
    <GenericExercise exercise={ex} anxietyPre={anxietyPre} exerciseType={type} onComplete={onComplete} />
  );
}

// ── Generic exercise fallback ─────────────────────────────────────────────

function GenericExercise({ exercise, anxietyPre, exerciseType, onComplete }: {
  exercise: Exercise; anxietyPre: number; exerciseType: string; onComplete: (r: any) => void;
}) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes]         = useState('');
  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);
  const cfg = exercise.config;

  const update = (id: string, val: any) => setResponses(r => ({ ...r, [id]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Render any fields if the catalog defines them */}
      {cfg.fields?.map(f => (
        <div key={f.id}>
          <p style={{ color: T.textSecondary, fontSize: '13px', margin: '0 0 8px' }}>{f.label}</p>
          {f.type === 'textarea' ? (
            <textarea
              rows={f.rows || 2}
              value={responses[f.id] || ''}
              onChange={e => update(f.id, e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', resize: 'none',
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          ) : f.type === 'slider' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: T.textMuted, fontSize: '12px' }}>{f.min ?? 0}</span>
                <span style={{ color: T.textPrimary, fontSize: '14px', fontWeight: '700' }}>{responses[f.id] ?? f.min ?? 0}{f.unit}</span>
                <span style={{ color: T.textMuted, fontSize: '12px' }}>{f.max ?? 10}</span>
              </div>
              <input
                type="range" min={f.min ?? 0} max={f.max ?? 10} step={f.step ?? 1}
                value={responses[f.id] ?? f.min ?? 0}
                onChange={e => update(f.id, Number(e.target.value))}
                style={{ width: '100%', accentColor: T.accent }}
              />
            </div>
          ) : (
            <input
              value={responses[f.id] || ''}
              onChange={e => update(f.id, e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          )}
        </div>
      ))}

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Any notes or reflections…"
        rows={2}
        style={{
          width: '100%', padding: '12px', borderRadius: '12px', resize: 'none',
          background: T.surface, border: `1px solid ${T.border}`,
          color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />

      <AnxietyPostSlider label="How do you feel now?" initial={anxietyPre} onChange={setAnxietyPost} showSubmit={false} onSubmit={() => {}} />

      <button
        onClick={() => onComplete({ exercise_type: exerciseType, responses, notes, anxiety_post: anxietyPost })}
        style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}
      >
        Complete exercise <ChevronRight style={{ width: 16, height: 16, display: 'inline-block', verticalAlign: 'middle' }} />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// BREATHING EXERCISE
// ══════════════════════════════════════════════════════════════════════════

function BreathingExercise({ config, anxietyPre, onComplete }: { config: ExerciseConfig; anxietyPre: number; onComplete: (r: any) => void }) {
  const phases   = config.phases || [
    { label: 'Inhale',  duration: 4, color: T.teal },
    { label: 'Hold',    duration: 4, color: T.amber },
    { label: 'Exhale',  duration: 4, color: T.accent },
    { label: 'Hold',    duration: 4, color: T.textMuted },
  ];
  const totalCycles = config.cycles || 4;

  const [phaseIdx, setPhaseIdx]   = useState(0);
  const [countdown, setCountdown] = useState(phases[0].duration);
  const [cycle, setCycle]         = useState(0);
  const [running, setRunning]     = useState(false);
  const [done, setDone]           = useState(false);
  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => {
      setCountdown(c => {
        if (c > 1) return c - 1;
        // Move to next phase
        setPhaseIdx(p => {
          const next = (p + 1) % phases.length;
          if (next === 0) {
            setCycle(cy => {
              const newCy = cy + 1;
              if (newCy >= totalCycles) { setDone(true); setRunning(false); }
              return newCy;
            });
          }
          setCountdown(phases[next].duration);
          return next;
        });
        return phases[0].duration; // will be overwritten above
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, done, phases, totalCycles]);

  const currentPhase = phases[phaseIdx];
  const progress = 1 - (countdown / currentPhase.duration);

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: T.green, fontWeight: '700', fontSize: '16px', textAlign: 'center', margin: 0 }}>
          ✓ Breathing complete
        </p>
        <AnxietyPostSlider label="How do you feel now?" initial={anxietyPre} onChange={setAnxietyPost} showSubmit={false} onSubmit={() => {}} />
        <button onClick={() => onComplete({ anxiety_post: anxietyPost, responses: { cycles_completed: cycle } })} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>Done</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      {/* Animated circle */}
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg width="160" height="160" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke={T.border} strokeWidth="4" />
          <circle
            cx="80" cy="80" r="70" fill="none"
            stroke={currentPhase.color} strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress)}`}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <p style={{ color: currentPhase.color, fontSize: '28px', fontWeight: '700', margin: 0 }}>{countdown}</p>
          <p style={{ color: T.textSecondary, fontSize: '13px', fontWeight: '600', margin: 0 }}>{currentPhase.label}</p>
        </div>
      </div>

      <p style={{ color: T.textMuted, fontSize: '12px', margin: 0 }}>Cycle {cycle + 1} of {totalCycles}</p>

      <button onClick={() => setRunning(r => !r)} style={{
        padding: '14px 32px', borderRadius: '14px', border: 'none',
        background: running ? T.accentSoft : T.accent,
        color: running ? '#a78bfa' : '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        border_: `1px solid ${T.borderHov}`,
      }}>
        {running ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// GROUNDING 5-4-3-2-1
// ══════════════════════════════════════════════════════════════════════════

function GroundingExercise({ config, anxietyPre, onComplete }: { config: ExerciseConfig; anxietyPre: number; onComplete: (r: any) => void }) {
  const steps = config.steps || [];
  const [stepIdx, setStepIdx]         = useState(0);
  const [responses, setResponses]     = useState<string[]>(steps.map(() => ''));
  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);
  const [done, setDone]               = useState(false);

  const current = steps[stepIdx];

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnxietyPostSlider label="How grounded do you feel?" initial={anxietyPre} onChange={setAnxietyPost} showSubmit={false} onSubmit={() => {}} />
        <button onClick={() => onComplete({ anxiety_post: anxietyPost, responses: Object.fromEntries(steps.map((s, i) => [s.sense, responses[i]])) })} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>Done</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{
        padding: '20px', borderRadius: '16px',
        background: T.accentSoft, border: `1px solid ${T.borderHov}`, textAlign: 'center',
      }}>
        <p style={{ fontSize: '32px', margin: '0 0 8px' }}>{current.icon}</p>
        <p style={{ color: '#a78bfa', fontSize: '22px', fontWeight: '700', margin: '0 0 4px' }}>{current.count}</p>
        <p style={{ color: T.textSecondary, fontSize: '14px', margin: 0 }}>{current.prompt}</p>
      </div>

      <textarea
        rows={2}
        value={responses[stepIdx]}
        onChange={e => setResponses(r => r.map((v, i) => i === stepIdx ? e.target.value : v))}
        placeholder={`Name ${current.count} thing${current.count > 1 ? 's' : ''} you can ${current.sense}…`}
        style={{
          width: '100%', padding: '12px', borderRadius: '12px', resize: 'none',
          background: T.surface, border: `1px solid ${T.border}`,
          color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === stepIdx ? '20px' : '6px', height: '6px', borderRadius: '3px',
            background: i < stepIdx ? T.green : i === stepIdx ? T.accent : T.border,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {stepIdx < steps.length - 1 ? (
        <button onClick={() => setStepIdx(i => i + 1)} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          Next <ChevronRight style={{ width: 16, height: 16 }} />
        </button>
      ) : (
        <button onClick={() => setDone(true)} style={{
          padding: '14px', borderRadius: '14px', border: 'none',
          background: T.green, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>Complete</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// THOUGHT RECORD
// ══════════════════════════════════════════════════════════════════════════

function ThoughtRecordExercise({ config, anxietyPre, onComplete }: { config: ExerciseConfig; anxietyPre: number; onComplete: (r: any) => void }) {
  const fields = config.fields || [];
  const [responses, setResponses]     = useState<Record<string, any>>({});
  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);

  const update = (id: string, val: any) => setResponses(r => ({ ...r, [id]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {fields.map(f => (
        <div key={f.id}>
          <p style={{ color: T.textSecondary, fontSize: '13px', margin: '0 0 8px', lineHeight: 1.4 }}>{f.label}</p>
          {f.type === 'textarea' ? (
            <textarea
              rows={f.rows || 2}
              value={responses[f.id] || ''}
              onChange={e => update(f.id, e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', resize: 'none',
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          ) : f.type === 'slider' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: T.textMuted, fontSize: '11px' }}>0</span>
                <span style={{ color: T.textPrimary, fontSize: '15px', fontWeight: '700' }}>{responses[f.id] ?? 50}{f.unit}</span>
                <span style={{ color: T.textMuted, fontSize: '11px' }}>100</span>
              </div>
              <input
                type="range" min={f.min ?? 0} max={f.max ?? 100} step={f.step ?? 5}
                value={responses[f.id] ?? 50}
                onChange={e => update(f.id, Number(e.target.value))}
                style={{ width: '100%', accentColor: T.accent }}
              />
            </div>
          ) : (
            <input
              value={responses[f.id] || ''}
              onChange={e => update(f.id, e.target.value)}
              placeholder={f.placeholder}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          )}
        </div>
      ))}

      <AnxietyPostSlider label="How do you feel now?" initial={anxietyPre} onChange={setAnxietyPost} showSubmit={false} onSubmit={() => {}} />

      <button onClick={() => onComplete({ responses, anxiety_post: anxietyPost })} style={{
        padding: '14px', borderRadius: '14px', border: 'none',
        background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
      }}>Submit record</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// BODY SCAN
// ══════════════════════════════════════════════════════════════════════════

function BodyScanExercise({ config, anxietyPre, onComplete }: { config: ExerciseConfig; anxietyPre: number; onComplete: (r: any) => void }) {
  const zones   = config.zones || [];
  const scale   = config.tension_scale || { min: 0, max: 10, label: 'Tension level' };
  const [ratings, setRatings]         = useState<Record<string, number>>(Object.fromEntries(zones.map(z => [z.id, 5])));
  const [notes, setNotes]             = useState('');
  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);
  const [activeZone, setActiveZone]   = useState(zones[0]?.id || '');

  const current = zones.find(z => z.id === activeZone);
  const activeIdx = zones.findIndex(z => z.id === activeZone);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Zone selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {zones.map(z => (
          <button key={z.id} onClick={() => setActiveZone(z.id)} style={{
            padding: '7px 13px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
            background: z.id === activeZone ? T.accent : T.surface,
            color: z.id === activeZone ? '#fff' : T.textSecondary,
            border_: `1px solid ${z.id === activeZone ? 'transparent' : T.border}`,
          }}>{z.label}</button>
        ))}
      </div>

      {current && (
        <div style={{ padding: '18px', borderRadius: '16px', background: T.elevated, border: `1px solid ${T.border}` }}>
          <p style={{ color: T.textSecondary, fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5 }}>{current.prompt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: T.green, fontSize: '11px' }}>Relaxed</span>
            <span style={{ color: T.textPrimary, fontSize: '15px', fontWeight: '700' }}>{ratings[current.id]}/10</span>
            <span style={{ color: T.red, fontSize: '11px' }}>Tense</span>
          </div>
          <input
            type="range" min={scale.min} max={scale.max} step={1} value={ratings[current.id]}
            onChange={e => setRatings(r => ({ ...r, [current.id]: Number(e.target.value) }))}
            style={{ width: '100%', accentColor: T.accent }}
          />
          {activeIdx < zones.length - 1 && (
            <button onClick={() => setActiveZone(zones[activeIdx + 1].id)} style={{
              marginTop: '12px', width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
              background: T.accentSoft, color: '#a78bfa', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              Next zone <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>
      )}

      <textarea
        value={notes} onChange={e => setNotes(e.target.value)}
        placeholder="Any sensations or observations…" rows={2}
        style={{
          width: '100%', padding: '12px', borderRadius: '12px', resize: 'none',
          background: T.surface, border: `1px solid ${T.border}`,
          color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />

      <AnxietyPostSlider label="How does your body feel now?" initial={anxietyPre} onChange={setAnxietyPost} showSubmit={false} onSubmit={() => {}} />

      <button onClick={() => onComplete({ zone_ratings: ratings, notes, anxiety_post: anxietyPost })} style={{
        padding: '14px', borderRadius: '14px', border: 'none',
        background: T.accent, color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
      }}>Complete scan</button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// VALUES COMPASS
// ══════════════════════════════════════════════════════════════════════════

function ValuesCompassExercise({ config, anxietyPre, onComplete }: { config: ExerciseConfig; anxietyPre: number; onComplete: (r: any) => void }) {
  const domains = config.domains || [];
  const [ratings, setRatings] = useState<Record<string, { importance: number; living_it: number }>>(
    Object.fromEntries(domains.map(d => [d, { importance: 5, living_it: 5 }]))
  );
  const [notes, setNotes] = useState('');

  const update = (domain: string, field: 'importance' | 'living_it', val: number) =>
    setRatings(r => ({ ...r, [domain]: { ...r[domain], [field]: val } }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {domains.map(domain => {
        const r   = ratings[domain] || { importance: 5, living_it: 5 };
        const gap = r.importance - r.living_it;
        return (
          <div key={domain} style={{ padding: '14px', borderRadius: '14px', background: T.elevated, border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
              <span style={{ color: T.textPrimary, fontSize: '13px', fontWeight: '600' }}>{domain}</span>
              {gap > 2 && <span style={{
                padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontWeight: '700',
                background: 'rgba(245,158,11,0.1)', color: T.amber, border: '1px solid rgba(245,158,11,0.2)',
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
// SAFE PLACE
// ══════════════════════════════════════════════════════════════════════════

function SafePlaceExercise({ config, anxietyPre, onComplete }: { config: ExerciseConfig; anxietyPre: number; onComplete: (r: any) => void }) {
  const prompts = config.prompts || [];
  const [promptIdx, setPromptIdx]     = useState(0);
  const [placeName, setPlaceName]     = useState('');
  const [description, setDescription] = useState('');
  const [anxietyPost, setAnxietyPost] = useState(anxietyPre);
  const [done, setDone]               = useState(false);

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnxietyPostSlider label="How calm do you feel now?" initial={anxietyPre} onChange={setAnxietyPost} showSubmit={false} onSubmit={() => {}} />
        <input
          value={placeName} onChange={e => setPlaceName(e.target.value)}
          placeholder="Give this place a name…"
          style={{
            padding: '12px', borderRadius: '10px',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textPrimary, fontSize: '14px', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <textarea
          value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Describe it in a few words…" rows={2}
          style={{
            padding: '12px', borderRadius: '10px',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.textPrimary, fontSize: '14px', resize: 'none', outline: 'none', fontFamily: 'inherit',
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
          background: T.accentSoft, color: '#a78bfa', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
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