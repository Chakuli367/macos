import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, Bell, BellOff, MapPin, Check, ArrowRight,
  Sparkles, Target, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';

export default function ActionSchedulerPage({ tasks, onComplete, onBack }) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [selectedTime, setSelectedTime] = useState({ hour: 15, minute: 0, period: 'PM' });
  const [selectedDay, setSelectedDay] = useState('today');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('15min');
  const [location, setLocation] = useState('');
  const [showCommitment, setShowCommitment] = useState(false);
  const [commitmentText, setCommitmentText] = useState('');
  const [isRotating, setIsRotating] = useState(false);

  // Clock hand angles
  const hourAngle = ((selectedTime.hour % 12) * 30) + (selectedTime.minute * 0.5);
  const minuteAngle = selectedTime.minute * 6;

  const dayOptions = [
    { value: 'today', label: 'Today', date: new Date() },
    { value: 'tomorrow', label: 'Tomorrow', date: new Date(Date.now() + 86400000) },
    { value: 'this_week', label: 'This Week', date: new Date(Date.now() + 259200000) }
  ];

  const reminderOptions = [
    { value: '15min', label: '15 min before' },
    { value: '1hour', label: '1 hour before' },
    { value: 'morning', label: 'Morning of' }
  ];

  const currentTask = tasks[currentTaskIndex];
  const allTasksScheduled = scheduledTasks.length === tasks.length;

  // Analytics tracking
  const trackEvent = (eventName, properties = {}) => {
    console.log('📊 Analytics Event:', eventName, properties);
    // TODO: Replace with your analytics service (GA4, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag('event', eventName, properties);
    }
  };

  useEffect(() => {
    trackEvent('scheduler_page_viewed', {
      task_count: tasks.length,
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleTimeChange = (type, value) => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 300);

    if (type === 'hour') {
      setSelectedTime(prev => ({ ...prev, hour: value }));
    } else if (type === 'minute') {
      setSelectedTime(prev => ({ ...prev, minute: value }));
    } else if (type === 'period') {
      setSelectedTime(prev => ({ ...prev, period: value }));
    }

    trackEvent('time_adjusted', {
      type,
      value,
      task_index: currentTaskIndex
    });
  };

  const handleScheduleTask = () => {
    const scheduledDateTime = getScheduledDateTime();
    
    const scheduled = {
      task: currentTask,
      time: selectedTime,
      day: selectedDay,
      dateTime: scheduledDateTime,
      reminder: reminderEnabled ? reminderTime : null,
      location: location || null,
      scheduledAt: new Date().toISOString()
    };

    setScheduledTasks([...scheduledTasks, scheduled]);

    trackEvent('task_scheduled', {
      task_index: currentTaskIndex,
      day: selectedDay,
      time: `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`,
      reminder_enabled: reminderEnabled,
      has_location: !!location
    });

    // Schedule reminder if enabled
    if (reminderEnabled) {
      scheduleReminder(scheduled);
    }

    // Move to next task or show commitment
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setLocation('');
    } else {
      setShowCommitment(true);
    }
  };

  const getScheduledDateTime = () => {
    const dayOption = dayOptions.find(d => d.value === selectedDay);
    const date = new Date(dayOption.date);
    
    let hour = selectedTime.hour;
    if (selectedTime.period === 'PM' && hour !== 12) hour += 12;
    if (selectedTime.period === 'AM' && hour === 12) hour = 0;
    
    date.setHours(hour, selectedTime.minute, 0, 0);
    return date;
  };

  const scheduleReminder = (scheduled) => {
    const reminderTime = new Date(scheduled.dateTime);
    
    switch (scheduled.reminder) {
      case '15min':
        reminderTime.setMinutes(reminderTime.getMinutes() - 15);
        break;
      case '1hour':
        reminderTime.setHours(reminderTime.getHours() - 1);
        break;
      case 'morning':
        reminderTime.setHours(8, 0, 0, 0);
        break;
    }

    // TODO: Implement with Firebase Cloud Functions or Web Push API
    console.log('🔔 Reminder scheduled for:', reminderTime);
    
    // Example: Save to Firestore for Cloud Function to process
    // await addDoc(collection(db, 'reminders'), {
    //   userId: auth.currentUser.uid,
    //   taskText: scheduled.task.task,
    //   scheduledTime: scheduled.dateTime,
    //   reminderTime: reminderTime,
    //   sent: false
    // });

    trackEvent('reminder_set', {
      reminder_type: scheduled.reminder,
      minutes_before: reminderTime
    });
  };

  const addToCalendar = (scheduled) => {
    const event = {
      title: `Action: ${scheduled.task.task}`,
      start: scheduled.dateTime,
      duration: 30, // 30 minutes default
      description: `Task from your learning journey`,
      location: scheduled.location || ''
    };

    // Google Calendar URL
    const startTime = new Date(scheduled.dateTime).toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(scheduled.dateTime.getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d+/g, '');
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

    window.open(googleCalendarUrl, '_blank');

    trackEvent('calendar_export', {
      platform: 'google',
      task_count: scheduledTasks.length
    });
  };

  const handleFinalCommitment = () => {
    if (commitmentText.toUpperCase() === 'I COMMIT') {
      trackEvent('commitment_completed', {
        total_tasks: scheduledTasks.length,
        time_spent: 'calculated_in_real_app',
        all_reminders_enabled: scheduledTasks.every(t => t.reminder)
      });

      // Save to Firestore
      // await saveScheduledTasks(scheduledTasks);

      onComplete(scheduledTasks);
    }
  };

  if (showCommitment) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl mx-auto px-4"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-2">Your Commitment Contract</h2>
            <p className="text-slate-400">Make it official</p>
          </div>

          {/* Scheduled Tasks Summary */}
          <div className="bg-slate-700/30 rounded-2xl p-6 mb-6 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">You've scheduled:</h3>
            {scheduledTasks.map((scheduled, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium mb-2">{scheduled.task.task}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {dayOptions.find(d => d.value === scheduled.day)?.label}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {scheduled.time.hour}:{scheduled.time.minute.toString().padStart(2, '0')} {scheduled.time.period}
                      </span>
                      {scheduled.reminder && (
                        <span className="flex items-center gap-1 text-green-400">
                          <Bell className="w-4 h-4" />
                          {reminderOptions.find(r => r.value === scheduled.reminder)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCalendar(scheduled)}
                    className="ml-4 text-purple-400 hover:text-purple-300 transition-colors"
                    title="Add to Calendar"
                  >
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Commitment Input */}
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl p-6 border border-purple-500/30 mb-6">
            <p className="text-slate-200 text-lg mb-4 text-center">
              "I commit to completing these actions at the scheduled times. I understand that specific planning leads to action."
            </p>
            <div className="mb-4">
              <label className="block text-slate-300 mb-2">Type "I COMMIT" to confirm:</label>
              <input
                type="text"
                value={commitmentText}
                onChange={(e) => setCommitmentText(e.target.value)}
                placeholder="I COMMIT"
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-200 text-center text-xl font-bold uppercase placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            {commitmentText && commitmentText.toUpperCase() !== 'I COMMIT' && (
              <p className="text-orange-400 text-sm text-center">Type exactly: "I COMMIT"</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{scheduledTasks.length}</p>
              <p className="text-slate-400 text-sm">Tasks Scheduled</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <Bell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {scheduledTasks.filter(t => t.reminder).length}
              </p>
              <p className="text-slate-400 text-sm">Reminders Set</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4 text-center">
              <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">3x</p>
              <p className="text-slate-400 text-sm">Success Rate</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleFinalCommitment}
              disabled={commitmentText.toUpperCase() !== 'I COMMIT'}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                commitmentText.toUpperCase() === 'I COMMIT'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/50'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Lock In My Commitment <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>
            <p className="text-slate-500 text-sm mt-4">
              💡 Tip: Screenshot this page for accountability
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
          >
            <Clock className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-2">When Will You Take Action?</h2>
          <p className="text-slate-400 mb-4">
            The difference between wanting and doing? A specific time.
          </p>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>
          </div>
        </div>

        {/* Current Task */}
        <motion.div
          key={currentTaskIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/30 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{currentTask.task}</h3>
              <p className="text-slate-400 text-sm">Schedule exactly when you'll do this</p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Clock */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Select Time</h3>
            
            {/* 3D Analog Clock */}
            <div className="relative w-80 h-80 mx-auto mb-6">
              {/* Clock Face */}
              <motion.div
                animate={isRotating ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full shadow-2xl border-8 border-slate-600"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.7)'
                }}
              >
                {/* Wood grain texture overlay */}
                <div className="absolute inset-0 rounded-full opacity-10"
                  style={{
                    background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                  }}
                />
                
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-slate-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg" />

                {/* Hour markers */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30) - 90;
                  const isMainHour = i % 3 === 0;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        transform: `rotate(${angle + 90}deg) translateY(-140px)`,
                        transformOrigin: '0 0'
                      }}
                    >
                      <div className={`${isMainHour ? 'w-1 h-6 bg-slate-300' : 'w-0.5 h-3 bg-slate-400'} mx-auto`} />
                      {isMainHour && (
                        <div className="text-slate-300 text-xl font-bold mt-2 text-center"
                          style={{ transform: `rotate(${-angle - 90}deg)` }}
                        >
                          {i === 0 ? 12 : i}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Hour hand */}
                <motion.div
                  animate={{ rotate: hourAngle }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    width: '8px',
                    height: '80px',
                    marginLeft: '-4px',
                    marginTop: '-80px'
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-slate-300 to-slate-400 rounded-full shadow-lg" />
                </motion.div>

                {/* Minute hand */}
                <motion.div
                  animate={{ rotate: minuteAngle }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    width: '6px',
                    height: '110px',
                    marginLeft: '-3px',
                    marginTop: '-110px'
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-500 rounded-full shadow-lg" />
                </motion.div>
              </motion.div>
            </div>

            {/* Time Controls */}
            <div className="bg-slate-700/30 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Hour</label>
                  <select
                    value={selectedTime.hour}
                    onChange={(e) => handleTimeChange('hour', Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-center font-bold focus:outline-none focus:border-blue-500"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Minute</label>
                  <select
                    value={selectedTime.minute}
                    onChange={(e) => handleTimeChange('minute', Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-center font-bold focus:outline-none focus:border-blue-500"
                  >
                    {[0, 15, 30, 45].map((min) => (
                      <option key={min} value={min}>{min.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Period</label>
                  <select
                    value={selectedTime.period}
                    onChange={(e) => handleTimeChange('period', e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white text-center font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const now = new Date();
                    const hour = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
                    handleTimeChange('hour', hour || 12);
                    handleTimeChange('minute', now.getMinutes());
                    handleTimeChange('period', now.getHours() >= 12 ? 'PM' : 'AM');
                  }}
                  className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Now
                </button>
                <button
                  onClick={() => {
                    handleTimeChange('hour', 6);
                    handleTimeChange('minute', 0);
                    handleTimeChange('period', 'PM');
                  }}
                  className="bg-slate-600 hover:bg-slate-500 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Evening
                </button>
              </div>
            </div>
          </div>

          {/* Right: Day & Details */}
          <div className="space-y-6">
            {/* Day Selection */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Choose Day</h3>
              <div className="grid grid-cols-3 gap-3">
                {dayOptions.map((day) => (
                  <motion.button
                    key={day.value}
                    onClick={() => {
                      setSelectedDay(day.value);
                      trackEvent('day_selected', { day: day.value });
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDay === day.value
                        ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/30'
                        : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <Calendar className={`w-6 h-6 mx-auto mb-2 ${
                      selectedDay === day.value ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      selectedDay === day.value ? 'text-blue-300' : 'text-slate-300'
                    }`}>
                      {day.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Reminder Toggle */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white">Reminder</h3>
                <button
                  onClick={() => {
                    setReminderEnabled(!reminderEnabled);
                    trackEvent('reminder_toggled', { enabled: !reminderEnabled });
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    reminderEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {reminderEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                </button>
              </div>
              
              {reminderEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  {reminderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setReminderTime(option.value);
                        trackEvent('reminder_time_selected', { time: option.value });
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        reminderTime === option.value
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {reminderTime === option.value && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Location (Optional) */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Location (Optional)</h3>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Coffee shop, Gym, Office..."
                  className="w-full bg-slate-700/30 border border-slate-600 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleScheduleTask}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105"
            >
              Schedule This Task <ArrowRight className="inline ml-2 w-5 h-5" />
            </button>

            {/* Progress Indicator */}
            {scheduledTasks.length > 0 && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm font-medium">Progress</span>
                  <span className="text-purple-400 text-sm font-bold">
                    {scheduledTasks.length}/{tasks.length}
                  </span>
                </div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(scheduledTasks.length / tasks.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {tasks.length - scheduledTasks.length} task{tasks.length - scheduledTasks.length !== 1 ? 's' : ''} remaining
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-purple-300 text-sm font-medium mb-1">💡 Pro Tip</p>
              <p className="text-slate-400 text-sm">
                People who schedule specific times are 3x more likely to follow through. You're setting yourself up for success!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}