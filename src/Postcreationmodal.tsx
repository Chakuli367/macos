import React, { useState } from 'react';
import {
  Shield, X, AlertCircle
} from 'lucide-react';

// ============================================
// CONSTANTS - Moved inside this file
// ============================================

const SUPPORT_POST_TEMPLATES = [
  {
    type: 'NEED_SUPPORT_NOW',
    icon: '🆘',
    title: 'Need Support Right Now',
    description: 'For when you\'re really struggling in this moment',
    color: 'from-red-600 to-orange-600',
    adviceDefault: false,
    fields: [
      {
        name: 'groupId',
        label: 'Post to which group?',
        type: 'group-select',
        placeholder: 'Select a support group...'
      },
      {
        name: 'situation',
        label: 'What\'s happening right now?',
        placeholder: 'I\'m supposed to go to class but I can\'t leave my room...',
        type: 'textarea'
      },
      {
        name: 'feeling',
        label: 'How does this feel?',
        placeholder: 'My heart is racing, I feel trapped...',
        type: 'textarea'
      },
      {
        name: 'needType',
        label: 'What would help most?',
        type: 'select',
        options: [
          'Just need someone to listen',
          'Need validation that this is real',
          'Want to hear from others who\'ve been there',
          'Could use some coping strategies',
          'Just need to not be alone right now'
        ]
      }
    ]
  },
  {
    type: 'SMALL_WIN',
    icon: '✨',
    title: 'Small Victory (No Matter How Tiny)',
    description: 'Celebrate progress, even if it seems small to others',
    color: 'from-green-600 to-emerald-600',
    adviceDefault: false,
    fields: [
      {
        name: 'groupId',
        label: 'Post to which group?',
        type: 'group-select',
        placeholder: 'Select a support group...'
      },
      {
        name: 'achievement',
        label: 'What did you do?',
        placeholder: 'I left my room to get food today',
        type: 'textarea'
      },
      {
        name: 'whyHard',
        label: 'Why was this hard for you?',
        placeholder: 'I\'ve been avoiding the dining hall for a week because...',
        type: 'textarea'
      },
      {
        name: 'howFeels',
        label: 'How does it feel?',
        placeholder: 'Proud but also exhausted',
        type: 'textarea'
      }
    ]
  },
  {
    type: 'JUST_VENTING',
    icon: '💨',
    title: 'Just Venting (No Advice Please)',
    description: 'Sometimes you just need to let it out',
    color: 'from-purple-600 to-pink-600',
    adviceDefault: false,
    fields: [
      {
        name: 'groupId',
        label: 'Post to which group?',
        type: 'group-select',
        placeholder: 'Select a support group...'
      },
      {
        name: 'vent',
        label: 'Let it out...',
        placeholder: 'I\'m so tired of people saying "just go out more" like it\'s that simple...',
        type: 'textarea',
        rows: 6
      }
    ]
  },
  {
    type: 'WHAT_HELPS',
    icon: '💡',
    title: 'Something That Actually Helped Me',
    description: 'Share real strategies that worked (not generic advice)',
    color: 'from-blue-600 to-cyan-600',
    adviceDefault: false,
    fields: [
      {
        name: 'groupId',
        label: 'Post to which group?',
        type: 'group-select',
        placeholder: 'Select a support group...'
      },
      {
        name: 'strategy',
        label: 'What helped you?',
        placeholder: 'Texting a friend "I\'m going to class" and having them reply helped me actually go',
        type: 'textarea'
      },
      {
        name: 'situation',
        label: 'What situation was this for?',
        placeholder: 'When I\'m too anxious to leave my room',
        type: 'textarea'
      },
      {
        name: 'honesty',
        label: 'What didn\'t work or made it harder?',
        placeholder: 'Deep breathing made me more anxious because I focused on my breathing',
        type: 'textarea'
      }
    ]
  },
  {
    type: 'CHECK_IN',
    icon: '📊',
    title: 'Honest Check-in',
    description: 'How you\'re really doing (not fine when you\'re not)',
    color: 'from-yellow-600 to-orange-600',
    adviceDefault: false,
    fields: [
      {
        name: 'groupId',
        label: 'Post to which group?',
        type: 'group-select',
        placeholder: 'Select a support group...'
      },
      {
        name: 'today',
        label: 'Today I\'m at (1=worst, 10=best)',
        type: 'range',
        min: 1,
        max: 10
      },
      {
        name: 'struggles',
        label: 'What made it hard today?',
        placeholder: 'Had to skip class because I couldn\'t deal with people',
        type: 'textarea'
      },
      {
        name: 'wins',
        label: 'Any tiny wins? (even just getting out of bed counts)',
        placeholder: 'I showered today',
        type: 'textarea',
        optional: true
      }
    ]
  }
];


const ANONYMITY_LEVELS = [
  {
    id: 'full-anonymous',
    name: 'Fully Anonymous',
    description: 'No one can see who you are, not even group members',
    icon: '👤',
    showsName: false,
    showsAvatar: false,
    showsHistory: false
  },
  {
    id: 'group-anonymous',
    name: 'Anonymous in This Group Only',
    description: 'Hidden in this group, but visible elsewhere',
    icon: '🎭',
    showsName: false,
    showsAvatar: false,
    showsHistory: false
  },
  {
    id: 'first-name-only',
    name: 'First Name Only',
    description: 'Show first name but hide last name and username',
    icon: '👋',
    showsName: 'first',
    showsAvatar: true,
    showsHistory: false
  },
  {
    id: 'full-profile',
    name: 'Full Profile',
    description: 'Show your complete profile',
    icon: '😊',
    showsName: true,
    showsAvatar: true,
    showsHistory: true
  }
];

const CONTENT_WARNING_TAGS = [
  { id: 'panic-attacks', label: 'Panic Attacks', color: 'red' },
  { id: 'suicidal-thoughts', label: 'Suicidal Thoughts', color: 'red' },
  { id: 'self-harm', label: 'Self-Harm', color: 'red' },
  { id: 'eating-disorders', label: 'Eating Disorders', color: 'orange' },
  { id: 'trauma', label: 'Trauma', color: 'orange' },
  { id: 'family-issues', label: 'Family Issues', color: 'yellow' },
  { id: 'substance-use', label: 'Substance Use', color: 'yellow' },
  { id: 'academic-stress', label: 'Academic Stress', color: 'blue' }
];

// ============================================
// MAIN COMPONENT
// ============================================

const PostCreationModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  availableGroups = [],
  preSelectedGroup = null
}) => {
  // ============================================
  // STATE
  // ============================================
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [postData, setPostData] = useState({});
  const [anonymityLevel, setAnonymityLevel] = useState('group-anonymous');
  const [contentWarnings, setContentWarnings] = useState([]);
  const [adviceWanted, setAdviceWanted] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(preSelectedGroup);

  // ============================================
  // HANDLERS
  // ============================================
  
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setAdviceWanted(template.adviceDefault);
    setPostData({});
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedTemplate(null);
    setPostData({});
    setAnonymityLevel('group-anonymous');
    setContentWarnings([]);
    setAdviceWanted(false);
    setSelectedGroupId(preSelectedGroup);
    onClose();
  };

  const handleSubmit = () => {
  const groupId = postData['groupId']; // Get groupId from form fields
  
  if (!groupId) {
    alert('Please select a support group');
    return;
  }

  if (!selectedTemplate) {
    alert('Please select a post type');
    return;
  }

  const requiredFields = selectedTemplate.fields.filter(f => !f.optional && f.type !== 'group-select');
  const missingFields = requiredFields.filter(f => {
    const value = postData[f.name];
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return !value.trim();
    return false;
  });

  if (missingFields.length > 0) {
    alert(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
    return;
  }

  const finalPostData = {
    groupId: groupId,
    type: selectedTemplate.type,
    template: selectedTemplate,
    content: postData,
    anonymityLevel,
    contentWarnings,
    adviceWanted,
    createdAt: new Date()
  };

  onSubmit(finalPostData);
  handleClose();
};


  const handleFieldChange = (fieldName, value) => {
    setPostData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const toggleContentWarning = (tagId) => {
    setContentWarnings(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl border-2 border-purple-500/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {step === 1 ? 'What do you need?' : selectedTemplate?.title}
            </h2>
            <button
              onClick={handleClose}
              className="text-purple-300 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* STEP 1: SELECT TEMPLATE */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-purple-300 mb-6">
                Choose what kind of post you want to create:
              </p>

              {SUPPORT_POST_TEMPLATES.map((template) => (
                <button
                  key={template.type}
                  onClick={() => handleSelectTemplate(template)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left
                    bg-gradient-to-br ${template.color}/10 border-purple-500/30
                    hover:border-purple-400/60 hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{template.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">
                        {template.title}
                      </h3>
                      <p className="text-purple-300 text-sm">
                        {template.description}
                      </p>
                      {!template.adviceDefault && (
                        <div className="mt-2 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-xs font-semibold">
                            Just listening mode by default
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: FILL FORM */}
          {step === 2 && selectedTemplate && (
            <div className="space-y-6">
              
              <div className="p-4 bg-purple-950/50 rounded-xl border border-purple-500/30">
                <p className="text-purple-200 text-sm">
                  {selectedTemplate.description}
                </p>
              </div>

              {selectedTemplate.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-white font-semibold mb-2">
                    {field.label}
                    {field.optional && (
                      <span className="text-purple-400 text-sm ml-2">(optional)</span>
                    )}
                  </label>

                  {/* Group Select */}
                  {field.type === 'group-select' && (
                    <select
                      value={postData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30
                        rounded-xl text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="">{field.placeholder}</option>
                      {availableGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.icon} {group.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Textarea */}
                  {field.type === 'textarea' && (
                    <textarea
                      value={postData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 4}
                      className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30
                        rounded-xl text-white placeholder-purple-400 focus:border-purple-400
                        focus:outline-none resize-none"
                    />
                  )}

                  {/* Select */}
                  {field.type === 'select' && (
                    <select
                      value={postData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30
                        rounded-xl text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Range */}
                  {field.type === 'range' && (
                    <div>
                      <input
                        type="range"
                        min={field.min || 1}
                        max={field.max || 10}
                        value={postData[field.name] || 5}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-purple-300 text-sm mt-2">
                        <span>1 (Worst)</span>
                        <span className="font-bold text-white text-lg">
                          {postData[field.name] || 5}
                        </span>
                        <span>10 (Best)</span>
                      </div>
                    </div>
                  )}

                  {/* Text Input */}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={postData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-500/30
                        rounded-xl text-white placeholder-purple-400 focus:border-purple-400
                        focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Anonymity Level */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  How do you want to appear?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ANONYMITY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setAnonymityLevel(level.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left
                        ${anonymityLevel === level.id
                          ? 'bg-purple-600/30 border-purple-400'
                          : 'bg-purple-950/30 border-purple-500/30 hover:border-purple-400/60'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{level.icon}</span>
                        <span className="font-bold text-white text-sm">
                          {level.name}
                        </span>
                      </div>
                      <p className="text-purple-300 text-xs">
                        {level.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advice Toggle */}
              <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold mb-1">
                      {adviceWanted ? '💡 Open to Advice' : '👂 Just Listening'}
                    </p>
                    <p className="text-purple-400 text-sm">
                      {adviceWanted
                        ? 'People can offer suggestions and coping strategies'
                        : 'People will focus on validation and understanding'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setAdviceWanted(!adviceWanted)}
                    className={`w-16 h-8 rounded-full transition-all relative ${
                      adviceWanted ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all ${
                      adviceWanted ? 'left-9' : 'left-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Content Warnings */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Content Warnings (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_WARNING_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleContentWarning(tag.id)}
                      className={`px-4 py-2 rounded-full border-2 transition-all text-sm font-semibold
                        ${contentWarnings.includes(tag.id)
                          ? `bg-${tag.color}-600/30 border-${tag.color}-400 text-${tag.color}-200`
                          : 'bg-gray-800/50 border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedTemplate(null);
                    setPostData({});
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                    hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold transition-all"
                >
                  Share with Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default PostCreationModal;