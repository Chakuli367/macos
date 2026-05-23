// mentorScriptInteractionPlanner.ts
// 🎯 Dedicated tour script for the Interaction Planner modal

export const mentorScriptInteractionPlanner = [
  // ========================================
  // WELCOME TO INTERACTION PLANNER
  // ========================================
  {
    target: '.bg-gradient-to-br.from-indigo-900\\/95.to-purple-900\\/95',
    text: '✨ Welcome to your Interaction Planner! This is your command center for preparing and scheduling anxiety-inducing situations.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // EXPOSURE HIERARCHY SECTION
  // ========================================
  {
    target: '#exposure-hierarchy-section',
    text: '📈 First feature: Exposure Hierarchy! Click here to build your personalized fear ladder - rank situations from easiest to hardest!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
    waitForSignal: true,
  },

  // User clicks Exposure Hierarchy - opens new modal
  {
    target: '.bg-gradient-to-br.from-purple-900\\/95.to-indigo-900\\/95',
    text: '🪜 Build your fear ladder here! Add situations you want to face, rate their difficulty (1-10), and work your way up gradually.',
    onModalContent: true,
    pauseForModal: 'showExposureHierarchy',
    requireModalClose: true,
  },

  {
    target: 'body',
    text: '✅ Great! Close this to return to the Interaction Planner.',
    showAfterModalClose: 'showExposureHierarchy',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // UPCOMING INTERACTIONS SECTION
  // ========================================
  {
    target: '.bg-gradient-to-br.from-blue-800\\/60.to-indigo-900\\/60',
    text: '⏰ This takes you to your scheduled interactions with countdowns and reminders! You can manage all your planned exposures here.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // PLAN NEW INTERACTION - HEADER
  // ========================================
  {
    target: '.bg-gradient-to-br.from-indigo-950\\/80.to-purple-950\\/80',
    text: '📝 Now let\'s plan a new interaction! This is where the magic happens - let me walk you through each step.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // SITUATION TYPE SELECTION
  // ========================================
  {
    target: '.grid.grid-cols-2.md\\:grid-cols-3.gap-3:has(#situation-type-medical)',
    text: '🎭 Step 1: Choose your situation type. Medical appointments? Social events? Work situations? Public places? Phone calls? Pick the one that matches!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // ACTIVITY NAME INPUT
  // ========================================
  {
    target: 'input[placeholder*="Doctor appointment"]',
    text: '✍️ Step 2: Be specific with the name! "Doctor appointment for persistent cough" is better than just "doctor". Specificity helps you prepare mentally.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // DATE & TIME INPUTS
  // ========================================
  {
    target: 'input[type="date"][min]',
    text: '📆 Step 3: Schedule the date! Having a set date makes it real and gives you time to prepare properly.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: 'input[type="time"]',
    text: '⏰ And the time! This helps you plan your day around it and know when to use your calming tools.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // DIFFICULTY RATING
  // ========================================
  {
    target: 'input[type="range"][min="1"][max="10"]',
    text: '😰 Step 4: Rate how difficult this feels RIGHT NOW (1-10). This is your baseline anxiety - you\'ll compare this to how you feel AFTER!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: '.flex.justify-between.text-xs.text-indigo-400:has(span:contains("Easy"))',
    text: '💡 The scale helps you track patterns. You\'ll see that anticipation is ALWAYS worse than reality!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // WHY FIELD
  // ========================================
  {
    target: 'textarea[placeholder*="health concerns"]',
    text: '❓ Step 5: Write WHY you\'re doing this. This is crucial! When anxiety spikes and you want to cancel, this reminder will keep you going.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================
  {
    target: '#schedule-interaction-btn',
    text: '✅ Once you fill everything out, click "Schedule It" to add this to your upcoming activities! It will appear on your dashboard with a countdown.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: '#prep-kit-btn',
    text: '🎒 OR click "View Prep Kit" for detailed preparation materials! This gives you scripts, questions, and tips specific to your situation type. Try it now!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
    waitForSignal: true,
  },

  // ========================================
  // PREP KIT MODAL (Nested)
  // ========================================
  {
    target: '.bg-gradient-to-br.from-indigo-900\\/95.to-purple-900\\/95:has(h2:contains("Prep Kit"))',
    text: '🎁 Your situation-specific prep kit! Each type has custom scripts, questions to ask, communication tips, and reality checks. Pure gold!',
    onModalContent: true,
    pauseForModal: 'showPrepKit',
    requireModalClose: true,
  },

  {
    target: 'body',
    text: '✅ Awesome! Close this to return to the Planner.',
    showAfterModalClose: 'showPrepKit',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // QUICK ACCESS TOOLS
  // ========================================
  {
    target: '.grid.grid-cols-2.md\\:grid-cols-4.gap-3:has(button:contains("Breathing"))',
    text: '🛠️ Quick access tools at the bottom! Breathing, Reframing, Discovery, and Motivation - all your support tools one click away!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: 'button:has(.lucide-wind):contains("Breathing")',
    text: '🌬️ Breathing exercises to calm your nerves instantly.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: 'button:has(.lucide-brain):contains("Reframe")',
    text: '🧠 Thought reframing to challenge catastrophic thinking.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: 'button:has(.lucide-search):contains("Discover")',
    text: '🔍 Discover new activities when you need inspiration.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  {
    target: 'button:has(.lucide-sparkles):contains("Motivate")',
    text: '✨ Get an instant motivational boost when you need it!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // WORKFLOW SUMMARY
  // ========================================
  {
    target: 'body',
    text: '💡 Pro workflow: 1️⃣ Pick situation type → 2️⃣ Fill details → 3️⃣ Check prep kit → 4️⃣ Schedule it → 5️⃣ Use tools when anxious!',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
  },

  // ========================================
  // CLOSING
  // ========================================
  {
    target: 'body',
    text: '👍 You\'re now a pro at using the Interaction Planner! Close it to continue exploring the main dashboard.',
    onModalContent: true,
    pauseForModal: 'showInteractionPlanner',
    requireModalClose: true,
  },

  {
    target: 'body',
    text: '✅ Perfect! You\'ve mastered the Interaction Planner - your most powerful tool for facing fears systematically!',
    showAfterModalClose: 'showInteractionPlanner',
  },
];