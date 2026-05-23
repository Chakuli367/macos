// seedData.js - FOR FIRESTORE
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const seedSampleData = async () => {
  const db = getFirestore();
  
  const samplePosts = [
    {
      id: 'post1',
      type: 'struggle-solution',
      author: { 
        avatar: '👤', 
        helpScore: 47,
        uid: 'user1'
      },
      struggle: "Can talk one-on-one but freeze when third person joins",
      helpNeeded: "How to not become invisible when it goes from 2 to 3+ people",
      whatTried: [
        "Preparing topics (brain goes blank anyway)",
        "Staying quiet and laughing along (feel like furniture)",
        "Forcing myself to talk (comes out weird, regret it for days)"
      ],
      urgency: 'medium',
      timestamp: Date.now(),
      timeAgo: '12 min ago',
      reactions: { 
        relate: 156, 
        following: 34, 
        saved: 12, 
        comments: 8 
      },
      responseTime: 'avg 15 min',
      similarStruggles: 8,
      comments: [
        {
          id: 'comment1',
          author: '👤',
          authorUid: 'user2',
          text: "God this is so relatable. I become a mute statue when a third person shows up.",
          timestamp: Date.now() - 480000,
          timeAgo: '8 min ago',
          likes: 23
        },
        {
          id: 'comment2',
          author: '👤',
          authorUid: 'user3',
          text: "Have you tried the 'repeat the last thing said' trick? Buys you time to think.",
          timestamp: Date.now() - 300000,
          timeAgo: '5 min ago',
          likes: 15
        }
      ],
      solutions: [
        {
          id: 'solution1',
          from: '👤',
          authorUid: 'user5',
          helpScore: 23,
          text: "I mentally assign myself a role: 'question asker' or 'story reactor'. Having ONE job stops me from scrambling to be everything.",
          helped: 67,
          verified: true,
          difficulty: 'easy',
          timeToRelief: 'immediate',
          context: ['works in groups of 3-4', 'needs 30sec prep'],
          timestamp: Date.now() - 600000
        }
      ]
    },
    
    {
      id: 'post2',
      type: 'journey-tracker',
      author: { 
        avatar: '👤', 
        journeyStreak: 7,
        uid: 'user8'
      },
      title: "From 'person I know' to actual friend",
      before: "Been in same class with Jake for 6 weeks. We talk before lecture. That's it. Never hung out outside. Don't know how to make it happen.",
      today: "Asked if he wanted to grab food after class. He said yes. We went. It was fine. Not awkward. Just... fine. And that feels huge.",
      goal: "Turn 2-3 acquaintances into people I actually do things with",
      timeline: 'Week 1 of 8',
      timestamp: Date.now() - 7200000,
      timeAgo: '2 hours ago',
      reactions: { 
        relate: 203, 
        following: 89, 
        cheering: 67, 
        hope: 45, 
        comments: 12 
      },
      milestoneNext: 'Day 3 - Follow up with Jake',
      accountabilityPartners: 5,
      comments: [
        {
          id: 'comment1',
          author: '👤',
          text: "This is so inspiring!",
          timeAgo: '1 hour ago',
          likes: 34
        }
      ],
      updates: [
        {
          day: 1,
          status: 'completed',
          note: 'The asking was harder than the actual hanging out.',
          mood: 'proud'
        }
      ],
      setbacksAllowed: true
    },
    
    {
      id: 'post3',
      type: 'what-worked',
      author: { 
        avatar: '👤', 
        solutionsShared: 8,
        uid: 'user11'
      },
      problem: "Every group hangout invitation makes me panic-decline",
      solution: "I started saying 'maybe' instead of instant no. Then I decide 2 hours before.",
      impact: "Went to 3 group things this month. Left early twice, stayed for one. But I WENT.",
      timestamp: Date.now() - 18000000,
      timeAgo: '5 hours ago',
      reactions: { 
        relate: 234, 
        helped: 127, 
        trying: 89, 
        saved: 156, 
        comments: 18 
      },
      verified: true,
      difficulty: 'easy',
      tryingNow: 89,
      successRate: '73% found this helpful',
      comments: []
    },
    
    {
      id: 'post4',
      type: 'what-worked',
      author: { 
        avatar: '👤', 
        solutionsShared: 3,
        uid: 'user14'
      },
      problem: "I can't do small talk and it makes me unemployable",
      solution: "I stopped trying to be 'good' at small talk. Now I just do reconnaissance: find out ONE real thing about them, ask follow-up.",
      impact: "Got through 3 networking events and 2 job interviews without feeling like an alien.",
      timestamp: Date.now() - 28800000,
      timeAgo: '8 hours ago',
      reactions: { 
        relate: 312, 
        helped: 178, 
        trying: 134, 
        saved: 203, 
        comments: 24 
      },
      verified: true,
      professionalVerified: true,
      difficulty: 'medium',
      tryingNow: 134,
      successRate: '81% found this helpful',
      comments: [],
      variations: 5
    },
    
    {
      id: 'post5',
      type: 'micro-challenge',
      author: { 
        avatar: '👤', 
        challengesCreated: 12,
        uid: 'user15'
      },
      challenge: "Sit in the 'social' section instead of alone—just sit there, don't force conversation",
      difficulty: 'beginner',
      duration: '1 lunch/coffee session',
      timestamp: Date.now() - 21600000,
      timeAgo: '6 hours ago',
      reactions: { 
        relate: 67, 
        joined: 123, 
        comments: 15 
      },
      whyThisMatters: "You're training your nervous system that proximity ≠ performance.",
      nextChallenge: "After 3x: Make eye contact with someone nearby",
      buddyPairsAvailable: 8,
      comments: [],
      participants: [
        {
          avatar: '👤',
          status: 'done',
          note: 'Did this at campus library. No one cared. I lasted 45 min.',
          couragePoints: 5,
          timeAgo: '2 hours ago'
        },
        {
          avatar: '👤',
          status: 'setback',
          note: 'Tried at lunch. Got overwhelmed after 5 min and left.',
          couragePoints: 3,
          timeAgo: '4 hours ago'
        }
      ],
      completionRate: '67% (34 of 51 attempts)'
    }
  ];

  try {
    // Add each post to Firestore
    for (const post of samplePosts) {
      const postRef = doc(db, 'groups', 'socialAvoidance', 'posts', post.id);
      await setDoc(postRef, post);
      console.log(`✅ Added post: ${post.id}`);
    }
    
    console.log('✅ All sample data added successfully!');
    console.log('📍 Location: groups/socialAvoidance/posts');
    console.log('📊 Posts added:', samplePosts.length);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
};

export default seedSampleData;
