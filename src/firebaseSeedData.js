// firebaseSeedData.js
// Complete seed data script for your social support app

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getDatabase, ref, set, push } from 'firebase/database';

// YOUR Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBNCXIOAX2HUdeLvUxkTJh7DVbv8JU485s",
  authDomain: "goalgrid-c5e9c.firebaseapp.com",
  databaseURL: "https://goalgrid-c5e9c-default-rtdb.firebaseio.com",
  projectId: "goalgrid-c5e9c",
  storageBucket: "goalgrid-c5e9c.firebasestorage.app",
  messagingSenderId: "544004357501",
  appId: "1:544004357501:web:4b81a3686422b28534e014",
  measurementId: "G-BJQMLK9JJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// ============================================
// SAMPLE USERS DATA
// ============================================
const sampleUsers = [
  {
    uid: 'user001',
    displayName: 'Alex Journey',
    photoURL: '👤',
    bio: 'Recovering from social anxiety, one step at a time',
    recoveryStage: 'intermediate',
    primaryStruggle: 'social-anxiety',
    availability: 'weekly',
    openToPartnership: true,
    currentStreak: 12,
    lookingFor: 'Someone to do exposure challenges with',
    responseRate: '95%'
  },
  {
    uid: 'user002',
    displayName: 'Sam Progress',
    photoURL: '🙂',
    bio: 'Learning to embrace discomfort and grow',
    recoveryStage: 'beginner',
    primaryStruggle: 'crowds',
    availability: 'daily',
    openToPartnership: true,
    currentStreak: 5,
    lookingFor: 'Daily check-ins and motivation',
    responseRate: '88%'
  },
  {
    uid: 'user003',
    displayName: 'Jordan Hope',
    photoURL: '😊',
    bio: '2 years into recovery, here to help others',
    recoveryStage: 'advanced',
    primaryStruggle: 'phone-calls',
    availability: 'few-times-week',
    openToPartnership: true,
    currentStreak: 45,
    lookingFor: 'Mentoring others and staying accountable',
    responseRate: '92%'
  },
  {
    uid: 'user004',
    displayName: 'Casey Brave',
    photoURL: '💪',
    bio: 'Facing fears daily, getting stronger',
    recoveryStage: 'intermediate',
    primaryStruggle: 'meeting-new-people',
    availability: 'flexible',
    openToPartnership: true,
    currentStreak: 21,
    lookingFor: 'Partner for social challenges',
    responseRate: '90%'
  }
];

// ============================================
// SAMPLE POSTS DATA
// ============================================
const samplePosts = [
  {
    type: 'struggle-solution',
    struggle: 'I freeze up completely when someone tries to start a conversation with me at work',
    helpNeeded: 'Need strategies to respond naturally without overthinking every word',
    whatTried: [
      'Prepared conversation starters (felt too scripted)',
      'Deep breathing before interactions',
      'Avoiding eye contact (made it worse)'
    ],
    urgency: 'high',
    author: { avatar: '😰', uid: 'user001' },
    timeAgo: '2 hours ago',
    responseTime: 'avg 15 min',
    reactions: {
      relate: 23,
      helped: 8,
      following: 12,
      comments: 5,
      cheering: 0,
      joined: 0,
      trying: 0
    },
    solutions: [
      {
        id: 'sol001',
        text: 'What helped me was the "3-second rule" - respond within 3 seconds without overthinking. Even just "Hey!" or "How\'s it going?" breaks the ice. Your brain gets better at this with practice.',
        from: '👤',
        author: 'user003',
        helped: 15,
        verified: true,
        context: ['Practical', 'Beginner-friendly', 'Evidence-based']
      },
      {
        id: 'sol002',
        text: 'I started with simple acknowledgments: smile + nod + "good morning". Built up from there. Took pressure off finding perfect words.',
        from: '😊',
        author: 'user002',
        helped: 8,
        verified: false,
        context: ['Gradual approach', 'Low pressure']
      }
    ],
    comments: [
      {
        id: 'com001',
        text: 'I relate to this so much. The overthinking is exhausting.',
        author: '🙂',
        authorUid: 'user002',
        timeAgo: '1 hour ago',
        likes: 3
      }
    ]
  },
  {
    type: 'journey-tracker',
    title: 'From Hermit to Human: My 6-Month Journey',
    before: 'I couldn\'t leave my apartment without panic attacks. Groceries were delivered, work was remote, I had zero in-person friends.',
    today: 'I go to a coffee shop twice a week, joined a book club, and can handle small talk without completely falling apart.',
    goal: 'Attend social events without needing an "escape plan" and maybe even enjoy them',
    timeline: '6 months',
    author: { avatar: '🌱', uid: 'user003' },
    timeAgo: '5 hours ago',
    reactions: {
      relate: 45,
      helped: 0,
      following: 18,
      comments: 12,
      cheering: 34,
      joined: 0,
      trying: 0
    },
    updates: [
      {
        day: 30,
        note: 'First time at coffee shop - stayed 10 minutes. Hands were shaking but I did it!'
      },
      {
        day: 60,
        note: 'Ordered without writing it down first. Small win, huge for me.'
      },
      {
        day: 120,
        note: 'Had a 5-minute conversation with the barista. Actually smiled.'
      }
    ]
  },
  {
    type: 'what-worked',
    problem: 'Phone calls gave me such bad anxiety I was missing important calls (doctor, work, family)',
    solution: 'Started with voicemail practice - left myself messages to hear my voice. Then called automated numbers (weather, time). Graduated to calling stores to ask about hours. Built up slowly over 3 months.',
    impact: 'Now I can make necessary calls without week-long anxiety buildup. Still not fun, but manageable. Answered a surprise call from my mom last week without panicking!',
    verified: true,
    author: { avatar: '📞', uid: 'user004' },
    timeAgo: '1 day ago',
    reactions: {
      relate: 67,
      helped: 23,
      following: 15,
      comments: 8,
      cheering: 0,
      joined: 0,
      trying: 31
    }
  },
  {
    type: 'micro-challenge',
    challenge: 'Make eye contact with 3 strangers for 2 seconds each',
    whyThisMatters: 'Eye contact is fundamental to connection. Starting small builds confidence without overwhelming anxiety.',
    duration: '7 days',
    difficulty: 'beginner',
    author: { avatar: '👁️', uid: 'user003' },
    timeAgo: '3 days ago',
    reactions: {
      relate: 12,
      helped: 0,
      following: 8,
      comments: 4,
      cheering: 0,
      joined: 28,
      trying: 0
    },
    participants: [
      {
        avatar: '😊',
        status: 'done',
        timeAgo: '1 day ago',
        note: 'Day 7 - Did it! Started with cashiers (easier because they expect it). Felt less scary by day 3.'
      },
      {
        avatar: '😰',
        status: 'in-progress',
        timeAgo: '2 hours ago',
        note: 'Day 3 - Got 2 today. Still feels awkward but getting easier.'
      },
      {
        avatar: '😓',
        status: 'setback',
        timeAgo: '5 hours ago',
        note: 'Had a panic moment, avoiding it today. Will try again tomorrow.'
      }
    ]
  }
];

// ============================================
// SAMPLE ACTIVITIES DATA
// ============================================
const sampleActivities = [
  {
    name: 'Beginner Yoga Class',
    type: 'Yoga',
    scheduledDate: Date.now() + (2 * 24 * 60 * 60 * 1000), // 2 days from now
    preAnxiety: 7,
    why: 'Want to be around people in a low-pressure environment',
    completed: false,
    cheers: 5
  },
  {
    name: 'Coffee Shop Sitting Challenge',
    type: 'Social',
    scheduledDate: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
    preAnxiety: 8,
    postAnxiety: 4,
    why: 'Build comfort being in public spaces',
    completed: true,
    completedDate: Date.now() - (1 * 24 * 60 * 60 * 1000),
    reflection: 'Way easier than I expected! The barista even smiled at me.',
    cheers: 12
  },
  {
    name: 'Martial Arts Trial Class',
    type: 'Martial Arts',
    scheduledDate: Date.now() + (5 * 24 * 60 * 60 * 1000), // 5 days from now
    preAnxiety: 9,
    why: 'Face my fear of group activities and physical contact',
    completed: false,
    cheers: 8
  }
];

// ============================================
// ACCOUNTABILITY PARTNERS DATA
// ============================================
const samplePartnerships = [
  {
    partnershipId: 'partnership001',
    participants: ['user001', 'user002'],
    partner1: {
      id: 'user002',
      name: 'Sam Progress',
      photo: '🙂',
      matchedDate: '2 weeks ago',
      streak: 14,
      totalCheckIns: 28,
      goalsCompleted: 3,
      nextSync: Date.now() + (2 * 24 * 60 * 60 * 1000),
      sharedGoals: [
        {
          text: 'Attend one social event per week',
          progress: 75,
          deadline: 'End of month',
          completed: false
        },
        {
          text: 'Make small talk with 3 strangers',
          progress: 100,
          deadline: 'This week',
          completed: true
        }
      ],
      recentCheckIns: [
        {
          from: 'Sam Progress',
          mood: '😊',
          timeAgo: '2 days ago',
          text: 'Did the grocery store challenge! Talked to the cashier about the weather.'
        },
        {
          from: 'Alex Journey',
          mood: '😓',
          timeAgo: '3 days ago',
          text: 'Rough day, avoided a work meeting. Feeling discouraged.'
        }
      ]
    }
  }
];

// ============================================
// SEED FUNCTIONS
// ============================================

async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  for (const user of sampleUsers) {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...user,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      console.log(`✅ Created user: ${user.displayName}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.displayName}:`, error);
    }
  }
}

async function seedPosts() {
  console.log('🌱 Seeding posts...');
  
  for (const post of samplePosts) {
    try {
      const postRef = await addDoc(collection(db, 'groups', 'socialAvoidance', 'posts'), {
        ...post,
        timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random time in last week
        createdAt: Date.now()
      });
      
      console.log(`✅ Created post: ${post.type}`);

      // Add comments if they exist
      if (post.comments && post.comments.length > 0) {
        for (const comment of post.comments) {
          await addDoc(collection(db, 'groups', 'socialAvoidance', 'posts', postRef.id, 'comments'), {
            ...comment,
            timestamp: Date.now()
          });
        }
        console.log(`  💬 Added ${post.comments.length} comments`);
      }

      // Add solutions to Realtime Database if they exist
      if (post.solutions && post.solutions.length > 0) {
        const solutionsRef = ref(rtdb, `groups/socialAvoidance/posts/${postRef.id}/solutions`);
        for (const solution of post.solutions) {
          await push(solutionsRef, {
            ...solution,
            timestamp: Date.now()
          });
        }
        console.log(`  💡 Added ${post.solutions.length} solutions`);
      }
      
    } catch (error) {
      console.error(`❌ Error creating post:`, error);
    }
  }
}

async function seedActivities() {
  console.log('🌱 Seeding activities...');
  
  // Add activities for each user
  for (let i = 0; i < sampleUsers.length; i++) {
    const user = sampleUsers[i];
    const activity = sampleActivities[i % sampleActivities.length]; // Rotate through activities
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'activities'), {
        ...activity,
        createdAt: Date.now()
      });
      console.log(`✅ Created activity for ${user.displayName}: ${activity.name}`);
    } catch (error) {
      console.error(`❌ Error creating activity for ${user.displayName}:`, error);
    }
  }
}

async function seedPartnerships() {
  console.log('🌱 Seeding partnerships...');
  
  for (const partnership of samplePartnerships) {
    try {
      // Create partnership document
      await setDoc(doc(db, 'partnerships', partnership.partnershipId), {
        participants: partnership.participants,
        createdAt: Date.now(),
        status: 'active'
      });

      // Add partnership reference to each user
      for (const userId of partnership.participants) {
        const otherUserId = partnership.participants.find(id => id !== userId);
        const otherUser = sampleUsers.find(u => u.uid === otherUserId);
        
        await setDoc(doc(db, 'users', userId, 'partners', otherUserId), {
          partnershipId: partnership.partnershipId,
          ...partnership.partner1,
          id: otherUserId,
          name: otherUser.displayName,
          photo: otherUser.photoURL
        });
      }
      
      console.log(`✅ Created partnership: ${partnership.partnershipId}`);
    } catch (error) {
      console.error(`❌ Error creating partnership:`, error);
    }
  }
}

async function seedPartnerRequests() {
  console.log('🌱 Seeding partner requests...');
  
  const requests = [
    {
      from: 'user003',
      to: 'user001',
      status: 'pending',
      message: "Hi! I'd love to be accountability partners. Let's support each other!"
    },
    {
      from: 'user004',
      to: 'user002',
      status: 'pending',
      message: "Saw your profile - we have similar goals. Want to partner up?"
    }
  ];

  for (const request of requests) {
    try {
      const fromUser = sampleUsers.find(u => u.uid === request.from);
      await addDoc(collection(db, 'partnerRequests'), {
        ...request,
        fromName: fromUser.displayName,
        fromPhoto: fromUser.photoURL,
        timestamp: Date.now()
      });
      console.log(`✅ Created partner request from ${fromUser.displayName}`);
    } catch (error) {
      console.error(`❌ Error creating partner request:`, error);
    }
  }
}

// ============================================
// MAIN SEED FUNCTION
// ============================================
async function seedAllData() {
  console.log('🚀 Starting Firebase seed...\n');
  
  try {
    await seedUsers();
    console.log('\n');
    
    await seedPosts();
    console.log('\n');
    
    await seedActivities();
    console.log('\n');
    
    await seedPartnerships();
    console.log('\n');
    
    await seedPartnerRequests();
    console.log('\n');
    
    console.log('✅ ✅ ✅ ALL DATA SEEDED SUCCESSFULLY! ✅ ✅ ✅');
    console.log('\n📊 Summary:');
    console.log(`   - ${sampleUsers.length} users created`);
    console.log(`   - ${samplePosts.length} posts created`);
    console.log(`   - ${sampleUsers.length} activities created`);
    console.log(`   - ${samplePartnerships.length} partnerships created`);
    console.log(`   - 2 partner requests created`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// ============================================
// HELPER: Clear all data (use with caution!)
// ============================================
async function clearAllData() {
  console.log('🗑️  WARNING: This will delete ALL data!');
  console.log('⏳ Clearing in 3 seconds... (Ctrl+C to cancel)');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Note: You'll need to manually delete collections in Firebase Console
  // or use Firebase Admin SDK for this
  console.log('❌ Auto-delete not implemented for safety.');
  console.log('Please manually delete collections from Firebase Console if needed.');
}

// ============================================
// RUN THE SCRIPT
// ============================================

// Uncomment to run:
seedAllData();

// To clear data (use carefully!):
// clearAllData();

export { seedAllData, clearAllData };