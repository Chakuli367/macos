import { useState } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Zap, 
  Users, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Star
} from 'lucide-react';

// Quiz questions and configuration
const QUIZ_STEPS = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome to Your Social Growth Journey! 🌟',
    subtitle: 'Let\'s understand where you are today and where you want to go',
    description: 'This quick assessment will help us create a personalized growth plan just for you. Be honest - there are no wrong answers!'
  },
  {
    id: 'conversation',
    type: 'trait',
    trait: 'conversation',
    icon: MessageCircle,
    color: '#a855f7',
    title: 'Starting Conversations',
    questions: [
      {
        text: 'How comfortable are you starting conversations with strangers?',
        options: [
          { label: 'Very uncomfortable - I avoid it', value: 20 },
          { label: 'Somewhat uncomfortable but I try', value: 40 },
          { label: 'Neutral - depends on the situation', value: 60 },
          { label: 'Comfortable - I do it regularly', value: 80 },
          { label: 'Very comfortable - I love meeting new people', value: 100 }
        ]
      },
      {
        text: 'How often do you initiate conversations in group settings?',
        options: [
          { label: 'Never - I stay quiet', value: 20 },
          { label: 'Rarely - only when necessary', value: 40 },
          { label: 'Sometimes - when I feel comfortable', value: 60 },
          { label: 'Often - I\'m fairly active', value: 80 },
          { label: 'Always - I\'m usually the conversation starter', value: 100 }
        ]
      }
    ]
  },
  {
    id: 'listening',
    type: 'trait',
    trait: 'listening',
    icon: Heart,
    color: '#c084fc',
    title: 'Active Listening & Empathy',
    questions: [
      {
        text: 'How well do you remember details from conversations?',
        options: [
          { label: 'Poorly - I often forget what was said', value: 20 },
          { label: 'Somewhat - I remember main points', value: 40 },
          { label: 'Moderately well - I recall most details', value: 60 },
          { label: 'Very well - I remember specific details', value: 80 },
          { label: 'Exceptionally - I remember conversations vividly', value: 100 }
        ]
      },
      {
        text: 'How often do others say you really understand them?',
        options: [
          { label: 'Never - people feel unheard', value: 20 },
          { label: 'Rarely - I struggle to empathize', value: 40 },
          { label: 'Sometimes - I\'m working on it', value: 60 },
          { label: 'Often - people feel understood', value: 80 },
          { label: 'Always - I\'m known for being empathetic', value: 100 }
        ]
      }
    ]
  },
  {
    id: 'confidence',
    type: 'trait',
    trait: 'confidence',
    icon: Zap,
    color: '#d946ef',
    title: 'Confidence & Assertiveness',
    questions: [
      {
        text: 'How comfortable are you speaking up for yourself?',
        options: [
          { label: 'Very uncomfortable - I avoid it', value: 20 },
          { label: 'Uncomfortable - I struggle with it', value: 40 },
          { label: 'Somewhat comfortable - working on it', value: 60 },
          { label: 'Comfortable - I do it when needed', value: 80 },
          { label: 'Very comfortable - I express myself clearly', value: 100 }
        ]
      },
      {
        text: 'How do you feel in social situations with new people?',
        options: [
          { label: 'Extremely anxious - I avoid them', value: 20 },
          { label: 'Anxious - but I push through', value: 40 },
          { label: 'Slightly nervous - but manageable', value: 60 },
          { label: 'Comfortable - I adapt quickly', value: 80 },
          { label: 'Excited - I thrive in new settings', value: 100 }
        ]
      }
    ]
  },
  {
    id: 'networking',
    type: 'trait',
    trait: 'networking',
    icon: Users,
    color: '#9333ea',
    title: 'Networking & Relationship Building',
    questions: [
      {
        text: 'How many meaningful connections do you make monthly?',
        options: [
          { label: 'None - I don\'t try', value: 20 },
          { label: '1-2 - Very few', value: 40 },
          { label: '3-5 - Some connections', value: 60 },
          { label: '6-10 - Regular networking', value: 80 },
          { label: '10+ - I\'m a natural connector', value: 100 }
        ]
      },
      {
        text: 'How good are you at maintaining relationships?',
        options: [
          { label: 'Poor - I lose touch quickly', value: 20 },
          { label: 'Below average - I struggle to keep in touch', value: 40 },
          { label: 'Average - I maintain some relationships', value: 60 },
          { label: 'Good - I stay connected regularly', value: 80 },
          { label: 'Excellent - I\'m great at nurturing friendships', value: 100 }
        ]
      }
    ]
  },
  {
    id: 'empathy',
    type: 'trait',
    trait: 'empathy',
    icon: Sparkles,
    color: '#e879f9',
    title: 'Emotional Intelligence',
    questions: [
      {
        text: 'How well do you read others\' emotions?',
        options: [
          { label: 'Poorly - I often miss cues', value: 20 },
          { label: 'Below average - I need help', value: 40 },
          { label: 'Average - I pick up on some things', value: 60 },
          { label: 'Well - I notice most emotional shifts', value: 80 },
          { label: 'Excellently - I\'m very attuned to others', value: 100 }
        ]
      },
      {
        text: 'How well do you manage your own emotions in social settings?',
        options: [
          { label: 'Poorly - I often lose control', value: 20 },
          { label: 'With difficulty - I struggle sometimes', value: 40 },
          { label: 'Moderately - I\'m working on it', value: 60 },
          { label: 'Well - I handle emotions effectively', value: 80 },
          { label: 'Very well - I\'m emotionally balanced', value: 100 }
        ]
      }
    ]
  },
  {
    id: 'goals',
    type: 'goals',
    title: 'Your Social Goals 🎯',
    subtitle: 'What do you want to achieve?',
    goals: [
      { id: 'confidence', label: 'Build unshakeable confidence', icon: '💪' },
      { id: 'friends', label: 'Make meaningful friendships', icon: '🤝' },
      { id: 'networking', label: 'Expand professional network', icon: '📈' },
      { id: 'conversations', label: 'Master small talk', icon: '💬' },
      { id: 'public_speaking', label: 'Overcome public speaking fear', icon: '🎤' },
      { id: 'charisma', label: 'Develop charisma', icon: '✨' }
    ]
  },
  {
    id: 'commitment',
    type: 'commitment',
    title: 'Your Commitment Level 📅',
    subtitle: 'How much time can you dedicate?',
    options: [
      { 
        id: 'casual', 
        label: 'Casual Explorer',
        time: '5-10 min/day',
        description: 'Light practice when you have time',
        xpMultiplier: 1
      },
      { 
        id: 'regular', 
        label: 'Regular Practitioner',
        time: '15-30 min/day',
        description: 'Consistent daily practice',
        xpMultiplier: 1.5
      },
      { 
        id: 'dedicated', 
        label: 'Dedicated Grower',
        time: '30-60 min/day',
        description: 'Serious about transformation',
        xpMultiplier: 2
      }
    ]
  },
  {
    id: 'complete',
    type: 'complete',
    title: 'Your Profile is Ready! 🎉',
    subtitle: 'Let\'s see your personalized growth plan'
  }
];

// Calculate archetype based on traits
const calculateArchetype = (traits) => {
  const scores = {
    observer: traits.listening || 0,
    connector: ((traits.networking || 0) + (traits.conversation || 0)) / 2,
    supporter: traits.empathy || 0,
    influencer: ((traits.confidence || 0) + (traits.conversation || 0)) / 2
  };
  
  return Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
};

// Calculate future archetype (projected growth)
const calculateFutureArchetype = (current, goals) => {
  if (goals.includes('networking') || goals.includes('friends')) return 'connector';
  if (goals.includes('confidence') || goals.includes('public_speaking')) return 'influencer';
  if (goals.includes('charisma')) return 'influencer';
  return 'connector'; // Default growth path
};

export default function SocialOnboardingQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [traitScores, setTraitScores] = useState({});
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [commitment, setCommitment] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const step = QUIZ_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === QUIZ_STEPS.length - 1;

  // Handle trait question answer
  const handleTraitAnswer = (value) => {
    const question = step.questions[questionIndex];
    const answerId = `${step.id}_q${questionIndex}`;
    
    setAnswers({ ...answers, [answerId]: value });

    // Move to next question or step
    if (questionIndex < step.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Calculate average for this trait
      const traitAnswers = step.questions.map((_, i) => 
        answers[`${step.id}_q${i}`] || 0
      );
      traitAnswers.push(value);
      const avgScore = Math.round(
        traitAnswers.reduce((sum, val) => sum + val, 0) / traitAnswers.length
      );
      
      setTraitScores({ ...traitScores, [step.trait]: avgScore });
      setQuestionIndex(0);
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle goal selection
  const toggleGoal = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  // Handle commitment selection
  const handleCommitment = (level) => {
    setCommitment(level);
    setCurrentStep(currentStep + 1);
  };

  // Calculate future trait scores based on goals
  const calculateFutureScores = () => {
    const futureScores = {};
    Object.keys(traitScores).forEach(trait => {
      const current = traitScores[trait];
      let growth = 20; // Base growth
      
      // Increase growth based on related goals
      if (trait === 'conversation' && selectedGoals.includes('conversations')) growth += 15;
      if (trait === 'confidence' && selectedGoals.includes('confidence')) growth += 15;
      if (trait === 'networking' && selectedGoals.includes('networking')) growth += 15;
      if (trait === 'empathy' && selectedGoals.includes('friends')) growth += 10;
      if (trait === 'listening' && selectedGoals.includes('friends')) growth += 10;
      
      // Commitment bonus
      if (commitment === 'dedicated') growth += 10;
      if (commitment === 'regular') growth += 5;
      
      futureScores[trait] = Math.min(current + growth, 100);
    });
    return futureScores;
  };

  // Complete onboarding
  const handleComplete = () => {
    const futureScores = calculateFutureScores();
    const currentArchetype = calculateArchetype(traitScores);
    const futureArchetype = calculateFutureArchetype(currentArchetype, selectedGoals);

    const profileData = {
      traits: {
        current: traitScores,
        future: futureScores
      },
      archetypes: {
        current: currentArchetype,
        future: futureArchetype
      },
      goals: selectedGoals,
      commitment: commitment,
      completedAt: new Date()
    };

    onComplete(profileData);
  };

  // Go back
  const handleBack = () => {
    if (step.type === 'trait' && questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
      setQuestionIndex(0);
    }
  };

  // Go next (for welcome and goals steps)
  const handleNext = () => {
    if (step.type === 'goals' && selectedGoals.length === 0) {
      alert('Please select at least one goal');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #581c87, #6b21a8, #4c1d95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background particles */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              borderRadius: '50%',
              background: ['#a855f7', '#c084fc', '#e879f9'][i % 3],
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main content */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(139, 92, 246, 0.15)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 10,
        animation: 'slideIn 0.5s ease-out'
      }}>
        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'rgba(168, 85, 247, 0.2)',
          borderRadius: '2rem 2rem 0 0'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #a855f7, #e879f9)',
            borderRadius: '2rem 2rem 0 0',
            width: `${((currentStep + 1) / QUIZ_STEPS.length) * 100}%`,
            transition: 'width 0.5s ease-out'
          }} />
        </div>

        {/* Step counter */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#c084fc',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          Step {currentStep + 1} of {QUIZ_STEPS.length}
        </div>

        {/* Welcome Step */}
        {step.type === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌟</div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#e9d5ff',
              marginBottom: '1rem'
            }}>
              {step.title}
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#c084fc', marginBottom: '1rem' }}>
              {step.subtitle}
            </p>
            <p style={{ color: '#e9d5ff', lineHeight: '1.6', marginBottom: '3rem' }}>
              {step.description}
            </p>
            <button
              onClick={handleNext}
              style={{
                padding: '1rem 3rem',
                background: 'linear-gradient(90deg, #a855f7, #e879f9)',
                color: '#fff',
                border: 'none',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Let's Begin <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Trait Question Step */}
        {step.type === 'trait' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '1rem',
                background: `${step.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${step.color}`
              }}>
                <step.icon size={32} color={step.color} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e9d5ff', margin: 0 }}>
                  {step.title}
                </h2>
                <p style={{ color: '#c084fc', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                  Question {questionIndex + 1} of {step.questions.length}
                </p>
              </div>
            </div>

            <p style={{
              fontSize: '1.125rem',
              color: '#e9d5ff',
              marginBottom: '2rem',
              fontWeight: '500'
            }}>
              {step.questions[questionIndex].text}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {step.questions[questionIndex].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleTraitAnswer(option.value)}
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '2px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '1rem',
                    color: '#e9d5ff',
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.4)';
                    e.currentTarget.style.borderColor = step.color;
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goals Step */}
        {step.type === 'goals' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.5rem' }}>
                {step.title}
              </h2>
              <p style={{ color: '#c084fc' }}>{step.subtitle}</p>
              <p style={{ fontSize: '0.875rem', color: '#e9d5ff', marginTop: '0.5rem' }}>
                Select all that apply
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {step.goals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      padding: '1.5rem',
                      background: isSelected ? 'rgba(168, 85, 247, 0.4)' : 'rgba(139, 92, 246, 0.2)',
                      border: `2px solid ${isSelected ? '#a855f7' : 'rgba(168, 85, 247, 0.3)'}`,
                      borderRadius: '1rem',
                      color: '#e9d5ff',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      position: 'relative',
                      textAlign: 'center'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#a855f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Check size={16} color="#fff" />
                      </div>
                    )}
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{goal.icon}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{goal.label}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedGoals.length === 0}
              style={{
                width: '100%',
                padding: '1rem',
                background: selectedGoals.length > 0 
                  ? 'linear-gradient(90deg, #a855f7, #e879f9)' 
                  : 'rgba(139, 92, 246, 0.3)',
                color: '#fff',
                border: 'none',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: selectedGoals.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: selectedGoals.length > 0 ? 1 : 0.5
              }}
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Commitment Step */}
        {step.type === 'commitment' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📅</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.5rem' }}>
                {step.title}
              </h2>
              <p style={{ color: '#c084fc' }}>{step.subtitle}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {step.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleCommitment(option.id)}
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '2px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '1rem',
                    color: '#e9d5ff',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.4)';
                    e.currentTarget.style.borderColor = '#a855f7';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{option.label}</span>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      background: 'rgba(168, 85, 247, 0.3)', 
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      color: '#e879f9',
                      fontWeight: '600'
                    }}>
                      {option.time}
                    </span>
                  </div>
                  <p style={{ color: '#c084fc', fontSize: '0.875rem', margin: 0 }}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step.type === 'complete' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#e9d5ff',
              marginBottom: '1rem'
            }}>
              {step.title}
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#c084fc', marginBottom: '2rem' }}>
              {step.subtitle}
            </p>

            <div style={{
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              border: '2px solid rgba(168, 85, 247, 0.3)'
            }}>
              <h3 style={{ color: '#e9d5ff', marginBottom: '1rem' }}>Your Starting Point:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {Object.entries(traitScores).map(([trait, score]) => (
                  <div key={trait} style={{
                    padding: '1rem',
                    background: 'rgba(139, 92, 246, 0.3)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(168, 85, 247, 0.4)'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#c084fc', textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                      {trait}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e879f9' }}>
                      {score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleComplete}
              style={{
                padding: '1rem 3rem',
                background: 'linear-gradient(90deg, #a855f7, #e879f9)',
                color: '#fff',
                border: 'none',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              View My Dashboard <Star size={20} />
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        {!isFirstStep && !isLastStep && step.type !== 'trait' && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <button
              onClick={handleBack}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '0.75rem',
                color: '#e9d5ff',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.4)';
                e.currentTarget.style.borderColor = '#a855f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        )}

        {step.type === 'trait' && (
          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <button
              onClick={handleBack}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(139, 92, 246, 0.2)',
                border: '2px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '0.75rem',
                color: '#e9d5ff',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.4)';
                e.currentTarget.style.borderColor = '#a855f7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}