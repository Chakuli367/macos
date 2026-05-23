import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, MapPin, Users, Target, Heart, TrendingUp, Award, Coffee, Loader2, Home } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  databaseURL: "https://goalgrid-c5e9c-default-rtdb.firebaseio.com",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Simplified Data
const PLACE_CATEGORIES = [
  { id: 'creative_arts', name: 'Creative & Arts', icon: '🎨' },
  { id: 'learning', name: 'Learning & Books', icon: '📚' },
  { id: 'fitness', name: 'Fitness & Movement', icon: '💪' },
  { id: 'hobbies', name: 'Hobbies & Games', icon: '🎮' },
  { id: 'food_social', name: 'Food & Coffee', icon: '☕' },
  { id: 'community', name: 'Community & Volunteering', icon: '🌱' }
];

const OBSTACLES = [
  { id: 'anxiety', label: 'Social anxiety/nervousness' },
  { id: 'rejection', label: 'Fear of rejection or judgment' },
  { id: 'not_knowing', label: 'Not knowing what to say' },
  { id: 'energy', label: 'Low energy or burnout' },
  { id: 'too_far_behind', label: 'Feeling too far behind socially' },
  { id: 'past_trauma', label: 'Past negative experiences' }
];

export default function Onboardingquiz() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [formData, setFormData] = useState({
    satisfactionScore: 5,
    biggestChallenges: [],
    successDefinition: '',
    socialEnergyProfile: 'ambivert',
    idealSetting: '',
    connectionApproach: '',
    selectedCategories: [],
    geographicDistance: 10,
    availableTimeBlocks: [],
    primaryObstacles: [],
    supportNeeds: [],
    motivationStyle: 'gentle_encouragement',
    monthlyGoals: {
      conversations: 3,
      contacts: 2,
      secondMeetings: 1
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userProfileRef = doc(db, 'users', currentUser.uid, 'userProfile', 'onboarding');
        const profileDoc = await getDoc(userProfileRef);
        if (profileDoc.exists()) {
          setCompleted(true);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const toggleArrayItem = (path, item) => {
    let current = formData;
    const keys = path.split('.');
    for (const key of keys) {
      current = current[key];
    }
    const array = Array.isArray(current) ? current : [];
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    updateFormData(path, newArray);
  };

  const saveToFirestore = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'userProfile', 'onboarding');
      const dataToSave = {
        ...formData,
        completedAt: new Date().toISOString(),
        userId: user.uid
      };
      await setDoc(userProfileRef, dataToSave);
      setCompleted(true);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => {
    let next = currentStep + 1;
    while (next < steps.length && steps[next].skip && steps[next].skip()) {
      next++;
    }
    if (next < steps.length) {
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    let prev = currentStep - 1;
    while (prev >= 0 && steps[prev].skip && steps[prev].skip()) {
      prev--;
    }
    if (prev >= 0) {
      setCurrentStep(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    // Step 0: Welcome
    {
      title: 'Let\'s Figure Out What Might Help',
      subtitle: 'A few quick questions to understand where you\'re at',
      icon: Sparkles,
      render: () => (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            You Don't Have to Figure This Out Alone
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Answer what feels right. Skip what doesn't. Nothing here is set in stone—you can change any of this later.
          </p>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30 max-w-xl mx-auto">
            <p className="text-purple-300 text-sm mb-2">A few things to know:</p>
            <ul className="text-purple-200 space-y-2 text-sm text-left">
              <li>✓ This takes about 3-5 minutes</li>
              <li>✓ You can skip questions that don't fit</li>
              <li>✓ Everything you share stays private</li>
              <li>✓ You can change your answers anytime</li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-500/30">
            <button
              onClick={nextStep}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl inline-flex items-center gap-2"
            >
              Okay, Let's Try This <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )
    },

    // Step 1: Where You're Starting
    {
      title: 'Where You\'re Starting',
      subtitle: 'No judgment—just trying to understand',
      icon: Heart,
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              How do you feel about your social situation right now?
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.satisfactionScore}
              onChange={(e) => updateFormData('satisfactionScore', parseInt(e.target.value))}
              className="w-full h-3 bg-purple-900/50 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-purple-300 mt-2">
              <span>Really struggling</span>
              <span className="text-2xl font-bold text-white">{formData.satisfactionScore}</span>
              <span>Pretty okay</span>
            </div>
            <p className="text-purple-400 text-xs mt-3 text-center">There's no wrong answer here.</p>
          </div>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              What makes connection hard for you right now?
            </label>
            <p className="text-purple-300 text-sm mb-4">Pick whatever feels true. You can select multiple.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Making new friends',
                'I don\'t know where to start',
                'Overcoming social anxiety',
                'I feel too far behind',
                'Finding like-minded people',
                'Nothing has worked before'
              ].map(challenge => (
                <button
                  key={challenge}
                  onClick={() => toggleArrayItem('biggestChallenges', challenge)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.biggestChallenges.includes(challenge)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              What would make you feel less alone? (Can be small)
            </label>
            <textarea
              value={formData.successDefinition}
              onChange={(e) => updateFormData('successDefinition', e.target.value)}
              placeholder="E.g., Having one person to text when something happens, not dreading weekends, feeling okay at the grocery store..."
              className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
              rows={3}
            />
            <p className="text-purple-400 text-xs mt-2">Or skip this if you're not sure yet.</p>
          </div>
        </div>
      )
    },

    // Step 2: How You Prefer to Connect
    {
      title: 'How You Prefer to Connect',
      subtitle: 'What feels most natural to you?',
      icon: Users,
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              Which sounds most like you?
            </label>
            <div className="flex flex-col gap-3">
              {[
                { value: 'introvert', label: 'Introvert', desc: 'Social stuff drains me—I need lots of alone time', emoji: '🤫' },
                { value: 'ambivert', label: 'Ambivert', desc: 'Depends on the day and who I\'m with', emoji: '⚖️' },
                { value: 'extrovert', label: 'Extrovert', desc: 'Being around people energizes me', emoji: '🎉' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('socialEnergyProfile', option.value)}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    formData.socialEnergyProfile === option.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400 scale-105'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{option.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{option.label}</div>
                      <div className="text-sm opacity-80">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              If you HAD to socialize, what would feel least awful?
            </label>
            <div className="space-y-3">
              {[
                { value: 'one_on_one', label: 'One-on-one coffee chats', icon: '☕' },
                { value: 'small_groups', label: 'Small groups (3-5 people)', icon: '👥' },
                { value: 'structured', label: 'Structured events (class, workshop)', icon: '📋' },
                { value: 'online_first', label: 'Online communities first, then maybe meet', icon: '💻' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('idealSetting', option.value)}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                    formData.idealSetting === option.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-semibold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Step 3: New or Familiar
    {
      title: 'New Places or Stick With Familiar?',
      subtitle: 'What sounds less scary?',
      icon: MapPin,
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              How do you want to approach this?
            </label>
            <p className="text-purple-300 text-sm mb-4">Pick whichever feels more doable right now.</p>
            <div className="space-y-3">
              {[
                { value: 'maximize_existing', label: 'Stay where I already go', desc: 'Just try talking more at familiar places', icon: '🏠' },
                { value: 'explore_new', label: 'Try completely new places', desc: 'Fresh start where no one knows me', icon: '🗺️' },
                { value: 'balanced', label: 'Mix of both', desc: 'Mostly familiar, maybe try one new thing', icon: '⚖️' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('connectionApproach', option.value)}
                  className={`w-full p-6 rounded-2xl text-left transition-all ${
                    formData.connectionApproach === option.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{option.label}</div>
                      <div className="text-sm opacity-80">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Step 4: Places That Might Work (Conditional)
    {
      title: 'Places That Might Work',
      subtitle: 'You don\'t have to go yet—just exploring',
      icon: MapPin,
      skip: () => formData.connectionApproach === 'maximize_existing',
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              Which of these sound tolerable?
            </label>
            <p className="text-purple-300 text-sm mb-4">Pick a few that don't sound horrible. You don't have to commit to anything.</p>
            <div className="space-y-3">
              {PLACE_CATEGORIES.map(category => {
                const isSelected = formData.selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleArrayItem('selectedCategories', category.id)}
                    className={`w-full p-4 text-left flex items-center gap-3 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400' 
                        : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-3xl">{category.icon}</span>
                    <span className="font-semibold flex-1">{category.name}</span>
                    {isSelected && <Check className="w-5 h-5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              How far feels manageable?
            </label>
            <div className="flex justify-between text-purple-200 mb-2">
              <span>Distance willing to travel</span>
              <span className="font-bold text-white">{formData.geographicDistance} miles</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={formData.geographicDistance}
              onChange={(e) => updateFormData('geographicDistance', parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900/50 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      )
    },

    // Step 5: What Gets in the Way
    {
      title: 'What Gets in the Way?',
      subtitle: 'Understanding what makes this hard',
      icon: Award,
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              What makes this stuff hardest for you?
            </label>
            <p className="text-purple-300 text-sm mb-4">Pick all that apply. This helps us know how to support you.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {OBSTACLES.map(obstacle => (
                <button
                  key={obstacle.id}
                  onClick={() => toggleArrayItem('primaryObstacles', obstacle.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.primaryObstacles.includes(obstacle.id)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  {obstacle.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              What would actually help?
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Scripts/what to say',
                'Small challenges to try',
                'Reminders and encouragement',
                'Understanding why I feel this way',
                'Knowing I\'m not alone'
              ].map(need => (
                <button
                  key={need}
                  onClick={() => toggleArrayItem('supportNeeds', need)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    formData.supportNeeds.includes(need)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Step 6: Realistic Progress
    {
      title: 'What Would Realistic Progress Look Like?',
      subtitle: 'Just ballpark ideas—nothing set in stone',
      icon: TrendingUp,
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              If things went okay, what might be possible in a month?
            </label>
            <p className="text-purple-300 text-sm mb-4">These are just starting points. You can change them anytime.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <label className="text-purple-200 flex-1">Actually talking to someone new</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.monthlyGoals.conversations}
                  onChange={(e) => updateFormData('monthlyGoals.conversations', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-purple-950/50 border border-purple-600/50 rounded-lg text-white text-center"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-purple-200 flex-1">Getting someone's contact info</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.monthlyGoals.contacts}
                  onChange={(e) => updateFormData('monthlyGoals.contacts', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-purple-950/50 border border-purple-600/50 rounded-lg text-white text-center"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-purple-200 flex-1">Seeing someone a second time</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.monthlyGoals.secondMeetings}
                  onChange={(e) => updateFormData('monthlyGoals.secondMeetings', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-purple-950/50 border border-purple-600/50 rounded-lg text-white text-center"
                />
              </div>
            </div>
            <p className="text-purple-400 text-xs mt-4">Remember: Even one of these would be progress.</p>
          </div>
        </div>
      )
    },

    // Step 7: How Should We Talk to You
    {
      title: 'How Should We Talk to You?',
      subtitle: 'What kind of support works for you?',
      icon: Coffee,
      render: () => (
        <div className="space-y-6">
          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30">
            <label className="block text-lg font-bold text-white mb-4">
              What kind of encouragement would you want?
            </label>
            <div className="flex flex-col space-y-3">
              {[
                { value: 'gentle_encouragement', label: 'Gentle and patient', desc: 'Supportive, understanding tone' },
                { value: 'data_driven', label: 'Show me the numbers', desc: 'Just track progress, no fluff' },
                { value: 'tough_love', label: 'Be direct—push me a bit', desc: 'Challenging but caring' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => updateFormData('motivationStyle', option.value)}
                  className={`p-5 rounded-xl text-left transition-all ${
                    formData.motivationStyle === option.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400'
                      : 'bg-purple-900/30 text-purple-200 border border-purple-700/30 hover:border-purple-500/50'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{option.label}</div>
                  <div className="text-sm opacity-80">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },

    // Step 8: You Made It Through
    {
      title: 'You Made It Through',
      subtitle: 'Nothing is final—you can change any of this later',
      icon: Check,
      render: () => (
        <div className="text-center space-y-6">
          <Check className="w-20 h-20 text-green-400 mx-auto bg-green-900/30 p-4 rounded-full mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Okay, Here's What You Told Us
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Take a look. If something feels off, go back and change it. Or just save it and adjust later—whatever works.
          </p>

          <div className="bg-purple-800/30 p-6 rounded-2xl border border-purple-500/30 text-left max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Quick Summary:</h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>
                <span className="font-semibold text-white">How you're feeling:</span> {formData.satisfactionScore}/10
              </li>
              <li>
                <span className="font-semibold text-white">Your style:</span> {formData.socialEnergyProfile} who prefers {formData.idealSetting ? formData.idealSetting.replace('_', ' ') : 'not specified'}
              </li>
              <li>
                <span className="font-semibold text-white">Your approach:</span> {formData.connectionApproach ? formData.connectionApproach.replace('_', ' ') : 'not specified'}
              </li>
              <li>
                <span className="font-semibold text-white">Main challenge:</span> {formData.primaryObstacles[0] ? OBSTACLES.find(o => o.id === formData.primaryObstacles[0])?.label : 'Not specified'}
              </li>
            </ul>
          </div>

          <div className="bg-purple-900/40 p-5 rounded-xl border border-purple-600/30 max-w-xl mx-auto">
            <p className="text-purple-300 text-sm">
              💡 Everything you shared is private. You can update any of this whenever you want.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-500/30">
            {user ? (
              <button
                onClick={saveToFirestore}
                disabled={saving}
                className={`px-8 py-4 w-full md:w-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl font-bold text-lg text-white transition-all shadow-xl inline-flex items-center justify-center gap-2 ${
                  saving ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-400 hover:to-teal-400'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Save This and Continue <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-8 py-4 w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl font-bold text-lg text-white transition-all shadow-xl inline-flex items-center justify-center gap-2 hover:from-blue-400 hover:to-indigo-400"
              >
                Sign In with Google to Save
              </button>
            )}
            <p className="text-purple-400 text-sm mt-3">
              Your answers are saved privately and securely.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const totalSteps = steps.filter(s => !s.skip || !s.skip()).length;
  const currentVisibleStepIndex = steps.filter((s, i) => i <= currentStep && (!s.skip || !s.skip())).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-3">Loading...</span>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-gradient-to-br from-[#310b50] to-[#1a0033] p-8 md:p-12 rounded-3xl shadow-2xl text-center text-white space-y-6 border border-purple-600/50">
          <Check className="w-20 h-20 text-green-400 mx-auto bg-green-900/30 p-4 rounded-full mb-6" />
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            You Did It
          </h1>
          <p className="text-xl text-purple-200">
            Everything's saved. You can change any of it later if you want.
          </p>
          <p className="text-md text-purple-300">
            Ready to see what's next? No pressure—just take a look.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-xl inline-flex items-center gap-2 mt-4"
          >
            See What's Next <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0a4e] via-[#1a0033] to-[#0f001a] animate-gradient flex items-center justify-center p-4">
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>
      <div className="max-w-3xl w-full">
        {/* Progress Bar (Hidden on Welcome Step) */}
        {currentStep > 0 && (
          <div className="mb-8 p-4 bg-purple-900/40 backdrop-blur-md rounded-2xl shadow-xl border border-purple-400/50">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center text-purple-300">
                <currentStepData.icon className="w-5 h-5 mr-2" />
                <span className="font-semibold text-sm">
                  Step {currentVisibleStepIndex} of {totalSteps}
                </span>
              </div>
              {user && (
                <div className="text-xs text-green-400 flex items-center">
                  <span className="truncate max-w-[120px]">{user.email}</span>
                  <Check className="w-3 h-3 ml-1" />
                </div>
              )}
            </div>
            <div className="w-full bg-purple-900/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentVisibleStepIndex / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className="text-purple-400 text-xs mt-2 text-center">You're doing great. Take your time.</p>
          </div>
        )}

        {/* Quiz Card */}
        <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/20 backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-2xl border border-purple-400/50">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {currentStepData.title}
            </h1>
            <p className="text-lg md:text-xl text-purple-300 mt-2">{currentStepData.subtitle}</p>
          </header>

          <main>
            {currentStepData.render()}
          </main>

          {/* Navigation */}
          <footer className="flex justify-between mt-10 pt-6 border-t border-purple-700/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                currentStep === 0
                  ? 'text-gray-600 bg-purple-900/30 cursor-not-allowed opacity-50'
                  : 'bg-purple-700 hover:bg-purple-600 text-white'
              }`}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>

            {currentStep < steps.length - 1 && (
              <button
                onClick={nextStep}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2 text-white"
              >
                Next <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button
                onClick={saveToFirestore}
                disabled={saving || !user}
                className={`px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                  saving || !user ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-400 hover:to-teal-400'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Save and Continue <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}