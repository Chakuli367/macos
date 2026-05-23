import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────
// 🔧 PASTE YOUR FIREBASE CONFIG HERE
// ─────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const avatars = ['😊', '🧠', '💜', '🌟', '🦋', '🌱', '🔥', '🐻', '🌺', '🎯'];
const timeAgos = ['just now', '2m ago', '15m ago', '1h ago', '3h ago', '6h ago', '12h ago', '1d ago'];
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const baseReactions = () => ({
  relate: randomInt(0, 48),
  helped: randomInt(0, 32),
  following: randomInt(0, 20),
  comments: randomInt(0, 15),
  cheering: randomInt(0, 25),
  joined: randomInt(0, 18),
  trying: randomInt(0, 12),
});

const makeAuthor = () => ({
  avatar: randomItem(avatars),
  uid: 'seed-user',
});

// ─────────────────────────────────────────────────────────
// POST DATA — 50 posts across 4 types
// ─────────────────────────────────────────────────────────

// ── TYPE 1: struggle-solution (15 posts) ──────────────────
const strugglePosts = [
  {
    struggle: "I completely freeze every time my manager asks me a question in front of the whole team. My mind goes blank and people look at me like I'm stupid.",
    helpNeeded: "Techniques to think on my feet and respond calmly even when I'm put on the spot.",
    whatTried: ["Rehearsing answers beforehand", "Deep breathing before the meeting", "Writing notes to reference"],
    urgency: "high",
    responseTime: "< 2h response avg",
  },
  {
    struggle: "Going grocery shopping has become impossible. I panic when the aisles are crowded and have to leave with nothing, then feel ashamed.",
    helpNeeded: "Strategies to get through everyday errands without a full anxiety spiral.",
    whatTried: ["Going very early in the morning", "Using self-checkout only", "Online delivery (gets expensive)"],
    urgency: "medium",
    responseTime: "< 4h response avg",
  },
  {
    struggle: "I can't make eye contact with anyone. Even on video calls I stare at my camera like a robot instead of being present. It feels fake either way.",
    helpNeeded: "How to make natural eye contact without it feeling forced or creepy.",
    whatTried: ["Practicing in the mirror", "Looking at the nose/forehead area", "Reducing call frequency"],
    urgency: "low",
    responseTime: "< 6h response avg",
  },
  {
    struggle: "I've been invited to my coworker's birthday dinner and I'm dreading it. I like her but I know I'll sit there silent and everyone will notice.",
    helpNeeded: "Scripts or conversation starters to use at social events so I don't freeze.",
    whatTried: ["Googling 'how to make small talk'", "Asking questions to deflect from myself"],
    urgency: "high",
    responseTime: "< 1h response avg",
  },
  {
    struggle: "I get a racing heart anytime someone knocks on my door unexpectedly. Even food delivery feels like too much interaction.",
    helpNeeded: "How to reduce the startle response and not feel so invaded by normal human contact.",
    whatTried: ["Setting my phone to silent", "Ordering click-and-collect", "Using a doorbell camera"],
    urgency: "medium",
    responseTime: "< 3h response avg",
  },
  {
    struggle: "I said something weird in a meeting three weeks ago and I still replay it every single night before I sleep.",
    helpNeeded: "How to stop ruminating on social mistakes and let them go.",
    whatTried: ["Journaling it out", "Telling myself it wasn't a big deal", "Distracting with Netflix"],
    urgency: "medium",
    responseTime: "< 5h response avg",
  },
  {
    struggle: "I moved to a new city six months ago and have made zero friends. I don't know how to break into social circles as an adult.",
    helpNeeded: "Realistic, non-cringe ways to meet people as an introvert in a new place.",
    whatTried: ["Downloaded Bumble BFF (deleted after 2 days)", "Joined a gym (go at off-peak hours to avoid people)"],
    urgency: "high",
    responseTime: "< 2h response avg",
  },
  {
    struggle: "Phone calls terrify me. I let voicemails pile up for weeks. A simple call to book a dentist appointment took me 4 months to make.",
    helpNeeded: "A system to make phone calls feel less catastrophic.",
    whatTried: ["Writing a script beforehand", "Using email/texting alternatives", "Having a friend call for me"],
    urgency: "medium",
    responseTime: "< 4h response avg",
  },
  {
    struggle: "I went to a party last weekend, hid in the bathroom for 20 minutes, then left without saying goodbye to the host. I feel awful.",
    helpNeeded: "How to exit social events gracefully without disappearing or lying.",
    whatTried: ["Telling myself I'd stay for at least 1 hour", "Driving myself so I have control"],
    urgency: "low",
    responseTime: "< 8h response avg",
  },
  {
    struggle: "I can't send emails without re-reading them 10+ times convinced they sound rude or stupid. It takes me an hour to send a 3-line reply.",
    helpNeeded: "How to write and send communication without the obsessive checking cycle.",
    whatTried: ["Setting a 2-read limit rule (breaks immediately)", "Using Grammarly to feel confident"],
    urgency: "medium",
    responseTime: "< 3h response avg",
  },
  {
    struggle: "My voice shakes every time I speak in public. Even introducing myself in a group of 5 people makes me noticeably tremor.",
    helpNeeded: "Voice control exercises and confidence techniques for speaking out loud.",
    whatTried: ["Singing practice", "Toastmasters (quit after 2nd session)", "Vocal warm-ups"],
    urgency: "high",
    responseTime: "< 2h response avg",
  },
  {
    struggle: "I overthink every text message I send. If someone doesn't reply quickly I convince myself they hate me.",
    helpNeeded: "How to stop attaching my self-worth to response times.",
    whatTried: ["Deleting read-receipts", "Keeping myself busy after sending", "Cognitive journaling"],
    urgency: "low",
    responseTime: "< 6h response avg",
  },
  {
    struggle: "Group chats are my personal nightmare. I have 11 unread group chats and I muted them all because I never know what to say.",
    helpNeeded: "How to participate in group chats without feeling like an outsider in my own friend group.",
    whatTried: ["Reacting with emojis instead of replying", "Reading only and lurking"],
    urgency: "low",
    responseTime: "< 12h response avg",
  },
  {
    struggle: "Every time I try to speak up in class or a workshop, someone talks over me and I just give up. I stop trying and feel invisible.",
    helpNeeded: "Assertive communication techniques for getting heard without being aggressive.",
    whatTried: ["Raising my hand earlier", "Trying to speak louder", "Asking the facilitator directly"],
    urgency: "medium",
    responseTime: "< 4h response avg",
  },
  {
    struggle: "I blush uncontrollably whenever attention is on me. Red face, hot ears, the works. People always comment on it which makes it 10x worse.",
    helpNeeded: "How to manage blushing and how to react if someone points it out.",
    whatTried: ["Cooling techniques before social events", "Accepting it (doesn't work)", "Makeup cover"],
    urgency: "high",
    responseTime: "< 1h response avg",
  },
];

// ── TYPE 2: journey-tracker (13 posts) ────────────────────
const journeyPosts = [
  {
    title: "From hiding at parties to actually enjoying them",
    before: "I used to spend parties hiding near the food table pretending to be busy. I'd count down the minutes until I could leave without being rude.",
    today: "Last weekend I stayed at a party for 3 full hours, had 2 real conversations, and left when I actually wanted to — not from panic.",
    goal: "To reach a point where social events feel like a choice, not an obligation I survive.",
    timeline: "8 months in",
  },
  {
    title: "Learning to speak up at work",
    before: "I would physically write down what I wanted to say in meetings, then still not say it. I've watched junior people get credit for ideas I had first.",
    today: "I shared two ideas in our last sprint and one got implemented. My heart was pounding but I did it.",
    goal: "Get comfortable contributing in real time without the mental rehearsal crutch.",
    timeline: "5 months in",
  },
  {
    title: "Rebuilding social life after 2 years of isolation",
    before: "Pandemic + remote work + anxiety = me not seeing a friend in person for 23 months. I'd forgotten how conversations even worked.",
    today: "I have a weekly coffee catch-up with one friend. One. But it's consistent and I actually look forward to it now.",
    goal: "Build a small, reliable social circle where I can be myself without exhaustion.",
    timeline: "7 months in",
  },
  {
    title: "Phone anxiety to making calls confidently",
    before: "I once left a broken tooth untreated for 6 weeks because I couldn't bring myself to call the dentist. The shame spiral was unbearable.",
    today: "I called my dentist, a plumber, AND cancelled a subscription in the same week. Small to most people. Massive to me.",
    goal: "Use the phone like a normal tool, not a threat.",
    timeline: "4 months in",
  },
  {
    title: "My journey with blushing and public attention",
    before: "If someone looked at me across a table, my entire face would turn crimson. I avoided restaurants, presentations, dates.",
    today: "Still blush, but I've stopped apologizing for it. Saying 'yeah I blush easily' out loud has weirdly shrunk its power over me.",
    goal: "Blushing that doesn't derail my day or stop me from showing up.",
    timeline: "1 year in",
  },
  {
    title: "From never going out to hosting my first dinner",
    before: "Social avoidance so severe I'd order food and then hide upstairs while my flatmate answered the door.",
    today: "I hosted a dinner for 4 people last month. Cooked the whole meal. They stayed until 1am.",
    goal: "Create a home that feels like a safe social space instead of a bunker.",
    timeline: "14 months in",
  },
  {
    title: "Eye contact — my ongoing battle",
    before: "Eye contact felt like a confrontation. I'd look at shoes, phones, anything but faces. People thought I was rude or detached.",
    today: "I can hold eye contact for a few seconds naturally now. I found that looking at the triangle between someone's eyes and mouth is easier.",
    goal: "Natural, comfortable eye contact that makes people feel heard.",
    timeline: "6 months in",
  },
  {
    title: "Joining my first running club after years of solo workouts",
    before: "I exercised alone for 6 years. The thought of joining a group was paralyzing — what if I'm too slow, too weird, too quiet?",
    today: "3 months in. Nobody cares about my speed. I've learned 4 people's names. It's a low-pressure way to be around people.",
    goal: "Find activities where socializing is a side effect of doing something I already love.",
    timeline: "3 months in",
  },
  {
    title: "Learning to ask for help",
    before: "I would struggle silently for days rather than ask a colleague a quick question. I thought needing help meant I was incompetent.",
    today: "I sent a 'can I ask you something quick?' Slack message yesterday and it took 2 minutes. The person seemed happy to help.",
    goal: "Treat asking for help as normal collaboration, not defeat.",
    timeline: "2 months in",
  },
  {
    title: "From muted to participating in group chats",
    before: "Had 14 group chats muted. Felt like a ghost in every social group I technically belonged to.",
    today: "Unmuted 3 chats. Even sent a meme in one. Nobody made a big deal. I'm not sure why I expected them to.",
    goal: "Feel like an active member of my communities, not a passive lurker.",
    timeline: "6 weeks in",
  },
  {
    title: "Anxiety and dating — my journey",
    before: "Cancelled 11 first dates in the last 2 years. Not because I didn't want to go — because the anxiety was too loud.",
    today: "Went on 2 dates this month. Arrived. Stayed. Was genuinely myself. No catastrophe.",
    goal: "Stop letting anxiety write the story of whether I'm 'ready' for connection.",
    timeline: "3 months in",
  },
  {
    title: "Overcoming the Sunday dread loop",
    before: "Every Sunday evening was consumed by dread about Monday — the meetings, the faces, the performance of being okay.",
    today: "Sunday evenings are still hard but I have a 'wind-down ritual' now: cooking, music, no doom-scrolling. It reduces the spiral by 60%.",
    goal: "A life where weekdays don't destroy weekends.",
    timeline: "10 weeks in",
  },
  {
    title: "Moving from therapist's office to real life practice",
    before: "I'd been in therapy for social anxiety for 2 years. Great at understanding my patterns. Terrible at changing them outside the office.",
    today: "Finally bridging the gap — applying the exposure hierarchy my therapist and I built. One small action per week in the real world.",
    goal: "Make my actual daily life the practice ground, not just the 50-minute session.",
    timeline: "2 months of real-world work",
  },
];

// ── TYPE 3: what-worked (12 posts) ───────────────────────
const whatWorkedPosts = [
  {
    problem: "Complete mental blank whenever I had to introduce myself in new groups.",
    solution: "I created a 3-sentence 'about me' script that I memorized cold. Name, what I do, one casual interest. Having something to fall back on stopped the spiral before it started.",
    impact: "Introductions went from my worst fear to something I could actually get through. The script evolved into something that actually sounds like me now.",
  },
  {
    problem: "Dreading every social event so much I'd cancel at the last minute.",
    solution: "I started making a 'minimum viable appearance' deal with myself — commit to just 20 minutes. No guilt about leaving after. 80% of the time I end up staying longer.",
    impact: "I stopped cancelling. Even on hard days I show up for the 20 minutes. It removed the all-or-nothing pressure that was making me bail.",
  },
  {
    problem: "Blushing uncontrollably every time someone paid attention to me.",
    solution: "Paradoxical intervention — I started saying it out loud first. 'Oh there I go, I blush easily.' Naming it out loud shrinks it somehow. You're laughing with the room instead of being the joke.",
    impact: "People are disarmed by the honesty. Comments went from awkward to warm. And my actual blushing decreased because I removed the layer of shame on top.",
  },
  {
    problem: "Ruminating on embarrassing social moments for weeks.",
    solution: "The 'courtroom test' — I imagine putting the incident in front of a neutral jury. When I describe it objectively out loud (or write it), it almost always sounds far less dramatic than it felt in my head.",
    impact: "Cut my average rumination time from 2 weeks to 2–3 days. Still working on it but the shift is real.",
  },
  {
    problem: "Panic attacks in crowded public spaces like malls and supermarkets.",
    solution: "Sensory anchoring: when the spiral starts I name 5 things I can see, 4 I can touch, 3 I can hear, 2 I can smell, 1 I can taste. Forces the brain into the present moment.",
    impact: "Haven't had to leave a space mid-errand in 6 weeks. It's not perfect but it buys me enough time to ride the wave instead of flee.",
  },
  {
    problem: "Social media making my social anxiety massively worse — seeing everyone looking confident and connected.",
    solution: "Aggressive curation — unfollowed anything that made me feel bad. Only follow accounts in my interests (cycling, cooking, space). My feed is no longer a highlight reel of other people's social lives.",
    impact: "Genuine 40% drop in the 'everyone else is normal and I'm broken' narrative. The algorithm stops feeding me what made me feel worst.",
  },
  {
    problem: "Couldn't make phone calls without major anxiety spiral beforehand.",
    solution: "The 5-second rule. Count 5-4-3-2-1 and dial before the anxiety catches up with you. Also: write a bullet-point script on paper first, not to read word for word, just to feel prepared.",
    impact: "Made 8 phone calls this month alone. It still feels uncomfortable but it's no longer the day-ruining event it used to be.",
  },
  {
    problem: "Feeling exhausted and depleted after every social interaction, even ones I enjoyed.",
    solution: "Building intentional recovery time into my schedule after any social event. I treat it the same as physical recovery. 30–60 mins alone, no phone, no obligations. It's not antisocial — it's maintenance.",
    impact: "Stopped dreading events because I now have a plan for the aftermath. The events themselves feel more enjoyable knowing recovery is scheduled.",
  },
  {
    problem: "Couldn't disagree with anyone or express a different opinion out of fear of conflict.",
    solution: "Practicing 'soft pushback phrases' that I internalized: 'I see it a bit differently...', 'That's interesting — my take is...', 'I'm not totally sure I agree — here's why'. They soften the disagreement without erasing my view.",
    impact: "I've disagreed with my boss twice in the last month. Professionally. No explosion. My relationships actually got more real and less performative.",
  },
  {
    problem: "Compulsively over-apologizing in every social interaction — sorry for breathing, sorry for existing.",
    solution: "Replacing 'sorry' with 'thank you' wherever possible. 'Sorry I'm late' → 'Thank you for waiting'. 'Sorry to bother you' → 'Thank you for your time'. Changes the energy from self-diminishment to gratitude.",
    impact: "People respond warmer. I feel less small in conversations. The habit is still breaking but the substitution trick makes it concrete.",
  },
  {
    problem: "Convinced everyone was judging me and analysing everything I said.",
    solution: "The 'other people's inner monologue' exercise. I started genuinely asking: what is this person actually thinking about right now? Usually their own stuff. Their commute. Their lunch. Their deadline. Realizing people are self-focused, not other-focused, was liberating.",
    impact: "Reduced my imagined audience significantly. I still slip back but this reframe is something I return to constantly and it works.",
  },
  {
    problem: "Being completely unable to ask for things — in restaurants, at work, anywhere.",
    solution: "Micro-requests practice. Started with the smallest possible asks: asking for extra napkins, a table by the window, a coffee order change. Built tolerance to requesting and getting a yes or no without catastrophe.",
    impact: "I now ask for things at work regularly. It started with tiny low-stakes requests and the muscle grew from there.",
  },
];

// ── TYPE 4: micro-challenge (10 posts) ───────────────────
const challengePosts = [
  {
    challenge: "The One Compliment Challenge: Give one genuine compliment to a stranger or acquaintance every day for 7 days.",
    whyThisMatters: "Initiating positive interaction is a core skill for reducing social avoidance. Compliments are low-risk, usually received well, and train you to look outward rather than inward.",
    duration: "7 days",
    difficulty: "beginner",
  },
  {
    challenge: "The Phone Call Challenge: Make one real phone call per day for 5 days — dentist, a friend, a shop, anything.",
    whyThisMatters: "Phone anxiety is one of the most common and debilitating forms of social avoidance. Consistent low-stakes exposure is proven to reduce it faster than avoidance.",
    duration: "5 days",
    difficulty: "intermediate",
  },
  {
    challenge: "Eat alone in a public place (café, restaurant, park) without your phone for 20 minutes — just sit and be there.",
    whyThisMatters: "Being visible without a 'prop' trains tolerance for public presence. The phone is often a shield — this removes it safely.",
    duration: "3 sessions over 2 weeks",
    difficulty: "intermediate",
  },
  {
    challenge: "The 'Yes' Experiment: Say yes to one social invitation per week that you'd normally decline — for 4 weeks.",
    whyThisMatters: "Avoidance maintains anxiety. Each 'yes' is a data point that the world doesn't end. You can always leave early. You just have to show up.",
    duration: "4 weeks",
    difficulty: "advanced",
  },
  {
    challenge: "Join one online community related to a hobby and make 3 genuine comments per week for 2 weeks.",
    whyThisMatters: "Online spaces are lower stakes and a great bridge to real-world connection. Getting comfortable contributing in text is a real skill.",
    duration: "2 weeks",
    difficulty: "beginner",
  },
  {
    challenge: "The Voice Note Challenge: Instead of texting back a friend or family member this week, send voice notes instead.",
    whyThisMatters: "Voice avoidance and text-dependency is common in social anxiety. Voice notes are a gentle middle ground between text and a real call.",
    duration: "1 week",
    difficulty: "beginner",
  },
  {
    challenge: "Make eye contact and smile at 3 people today (strangers, shop staff, whoever). That's the whole challenge.",
    whyThisMatters: "Micro eye contact practice reduces the fight-or-flight trigger associated with being 'seen'. It gets easier faster than you think.",
    duration: "1 day (repeat daily if ready)",
    difficulty: "beginner",
  },
  {
    challenge: "The Rejection Challenge: Ask for something you expect to be told no to — a discount, a table, an upgrade. Collect the no.",
    whyThisMatters: "Fear of rejection is at the heart of most social avoidance. Deliberately seeking rejection trains your nervous system that 'no' is survivable and not a catastrophe.",
    duration: "7 days",
    difficulty: "advanced",
  },
  {
    challenge: "Take a class, workshop, or group activity (yoga, art, cooking, language) — one session per week for a month.",
    whyThisMatters: "Task-focused social settings lower anxiety because interaction is optional and there's a shared focus. It's the easiest way to meet people as an adult.",
    duration: "4 weeks",
    difficulty: "intermediate",
  },
  {
    challenge: "Send one overdue message today. The friend you've been meaning to text, the email you've been avoiding. Just one.",
    whyThisMatters: "Overdue communication loops are a chronic source of low-level social anxiety. Clearing them one at a time dismantles the avoidance stack.",
    duration: "Today",
    difficulty: "beginner",
  },
];

// ─────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────
const seedPosts = async () => {
  const postsRef = collection(db, 'groups', 'socialAvoidance', 'posts');
  let count = 0;

  console.log('🌱 Starting seed...');

  // Seed struggle-solution posts
  for (const post of strugglePosts) {
    await addDoc(postsRef, {
      type: 'struggle-solution',
      struggle: post.struggle,
      helpNeeded: post.helpNeeded,
      whatTried: post.whatTried,
      urgency: post.urgency,
      responseTime: post.responseTime,
      author: makeAuthor(),
      timestamp: serverTimestamp(),
      timeAgo: randomItem(timeAgos),
      reactions: baseReactions(),
      solutions: [],
      comments: [],
      participants: [],
      updates: [],
    });
    count++;
    console.log(`✅ [${count}/50] struggle-solution posted`);
  }

  // Seed journey-tracker posts
  for (const post of journeyPosts) {
    await addDoc(postsRef, {
      type: 'journey-tracker',
      title: post.title,
      before: post.before,
      today: post.today,
      goal: post.goal,
      timeline: post.timeline,
      author: makeAuthor(),
      timestamp: serverTimestamp(),
      timeAgo: randomItem(timeAgos),
      reactions: baseReactions(),
      solutions: [],
      comments: [],
      participants: [],
      updates: [],
    });
    count++;
    console.log(`✅ [${count}/50] journey-tracker posted`);
  }

  // Seed what-worked posts
  for (const post of whatWorkedPosts) {
    await addDoc(postsRef, {
      type: 'what-worked',
      problem: post.problem,
      solution: post.solution,
      impact: post.impact,
      author: makeAuthor(),
      timestamp: serverTimestamp(),
      timeAgo: randomItem(timeAgos),
      reactions: baseReactions(),
      solutions: [],
      comments: [],
      participants: [],
      updates: [],
    });
    count++;
    console.log(`✅ [${count}/50] what-worked posted`);
  }

  // Seed micro-challenge posts
  for (const post of challengePosts) {
    await addDoc(postsRef, {
      type: 'micro-challenge',
      challenge: post.challenge,
      whyThisMatters: post.whyThisMatters,
      duration: post.duration,
      difficulty: post.difficulty,
      author: makeAuthor(),
      timestamp: serverTimestamp(),
      timeAgo: randomItem(timeAgos),
      reactions: baseReactions(),
      solutions: [],
      comments: [],
      participants: [],
      updates: [],
    });
    count++;
    console.log(`✅ [${count}/50] micro-challenge posted`);
  }

  console.log(`\n🎉 Done! ${count} posts seeded to Firestore.`);
};

seedPosts().catch(console.error);