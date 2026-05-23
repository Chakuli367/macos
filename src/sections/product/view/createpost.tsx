import React, { useState } from 'react';
import {
  X, AlertCircle, Target, Lightbulb, TrendingUp, 
  Plus, Clock, ArrowRight, CheckCircle, Send
} from 'lucide-react';

const POST_TEMPLATES = [
  {
    type: 'struggle-solution',
    icon: '🆘',
    title: 'Need Support',
    color: 'from-red-600 to-pink-600',
    description: 'Share a struggle you\'re facing and get community support',
    fields: [
      { name: 'struggle', label: 'What are you struggling with?', type: 'textarea', placeholder: 'Describe your situation...', required: true },
      { name: 'helpNeeded', label: 'What help do you need?', type: 'textarea', placeholder: 'Be specific about what would help...', required: true },
      { name: 'whatTried', label: 'What have you tried? (one per line)', type: 'textarea', placeholder: 'List things you\'ve already attempted...', required: false },
      { name: 'urgency', label: 'Urgency Level', type: 'select', options: ['low', 'medium', 'high'], required: true }
    ]
  },
  {
    type: 'journey-tracker',
    icon: '🛤️',
    title: 'Share Journey',
    color: 'from-purple-600 to-indigo-600',
    description: 'Document your progress and inspire others',
    fields: [
      { name: 'title', label: 'Journey Title', type: 'text', placeholder: 'Give your journey a name...', required: true },
      { name: 'before', label: 'Where you started', type: 'textarea', placeholder: 'How things were before...', required: true },
      { name: 'today', label: 'Where you are today', type: 'textarea', placeholder: 'Your current situation...', required: true },
      { name: 'goal', label: 'Where you\'re going', type: 'textarea', placeholder: 'Your goal or aspiration...', required: true },
      { name: 'timeline', label: 'Timeline', type: 'text', placeholder: 'e.g., 3 months, 1 year...', required: false }
    ]
  },
  {
    type: 'what-worked',
    icon: '💡',
    title: 'Share Solution',
    color: 'from-green-600 to-emerald-600',
    description: 'Share what worked for you to help others',
    fields: [
      { name: 'problem', label: 'What was the problem?', type: 'textarea', placeholder: 'Describe the challenge you faced...', required: true },
      { name: 'solution', label: 'What worked for you?', type: 'textarea', placeholder: 'Explain your solution in detail...', required: true },
      { name: 'impact', label: 'How did it help?', type: 'textarea', placeholder: 'What changed after you tried this?', required: true }
    ]
  },
  {
    type: 'micro-challenge',
    icon: '🎯',
    title: 'Create Challenge',
    color: 'from-cyan-600 to-blue-600',
    description: 'Start a challenge and invite others to join',
    fields: [
      { name: 'challenge', label: 'The Challenge', type: 'textarea', placeholder: 'What\'s the challenge?', required: true },
      { name: 'whyThisMatters', label: 'Why this matters', type: 'textarea', placeholder: 'Why should people do this?', required: true },
      { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 7 days, 30 days...', required: true },
      { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'], required: true }
    ]
  }
];

const CreatePostModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [step, setStep] = useState(1); // 1: Select Template, 2: Fill Form
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetModal = () => {
    setStep(1);
    setSelectedTemplate(null);
    setFormData({});
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setStep(2);
    // Initialize form data with empty values
    const initialData = {};
    template.fields.forEach(field => {
      initialData[field.name] = field.type === 'select' ? field.options[0] : '';
    });
    setFormData(initialData);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    const missingFields = selectedTemplate.fields
      .filter(field => field.required && !formData[field.name]?.trim())
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Process whatTried field if it exists (convert to array)
      const processedData = { ...formData };
      if (formData.whatTried) {
        processedData.whatTried = formData.whatTried
          .split('\n')
          .filter(item => item.trim())
          .map(item => item.trim());
      }

      await onSubmit(selectedTemplate.type, processedData);
      handleClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl border-2 border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between border-b border-purple-500/30 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {step === 1 ? 'Choose Post Type' : selectedTemplate?.title}
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              {step === 1 ? 'Select what you want to share' : selectedTemplate?.description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* STEP 1: Template Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {POST_TEMPLATES.map((template) => (
                <button
                  key={template.type}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-6 rounded-xl border-2 border-purple-500/30 hover:border-purple-400 transition-all text-left bg-gradient-to-r ${template.color} bg-opacity-10 hover:scale-105 group`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{template.icon}</span>
                    <h3 className="font-bold text-white text-xl">{template.title}</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">{template.description}</p>
                  <div className="flex items-center gap-2 text-purple-300 text-sm">
                    <span>{template.fields.length} fields to fill</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: Form */}
          {step === 2 && selectedTemplate && (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setStep(1)}
                className="text-purple-300 hover:text-purple-100 text-sm flex items-center gap-2 transition-colors"
                disabled={isSubmitting}
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Change post type
              </button>

              {/* Form Fields */}
              {selectedTemplate.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-purple-200 font-semibold mb-2 text-sm">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.name === 'struggle' || field.name === 'solution' ? 5 : 3}
                      className="w-full px-4 py-3 bg-slate-800 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 resize-none"
                      disabled={isSubmitting}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border-2 border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400"
                      disabled={isSubmitting}
                    >
                      {field.options.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-slate-800 border-2 border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
                      disabled={isSubmitting}
                    />
                  )}
                </div>
              ))}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-purple-500/30">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r ${selectedTemplate.color} hover:scale-105 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Share {selectedTemplate.title}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Demo Component - Just the button with transparent background
export default function App() {
  const [showModal, setShowModal] = useState(false);

  const handleCreatePost = async (postType, postData) => {
    console.log('Creating post:', { postType, postData });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Post created successfully!\n\nType: ${postType}\nData: ${JSON.stringify(postData, null, 2)}`);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full p-3 md:p-4 mb-4 md:mb-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-900/70 hover:to-pink-900/70 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl text-purple-300 hover:text-white font-medium text-sm md:text-base transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 md:w-5 md:h-5" />
        Share your struggle, journey, solution, or challenge...
      </button>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePost}
        currentUser={{ uid: 'demo-user' }}
      />
    </>
  );
}