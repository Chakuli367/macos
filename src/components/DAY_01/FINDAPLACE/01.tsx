import React, { useState, useEffect, useRef } from 'react';
import { doc, setDoc, collection , writeBatch } from "firebase/firestore";
import { db, auth } from "./firebase"; // adjust path to your firebase config
import { MapPin, Edit2, Check, X, TrendingUp, Sparkles, ChevronUp, ChevronDown, Target, Heart, Zap, Plus, Trash2 } from 'lucide-react';
import { apiKeys } from 'src/backend/keys/apiKeys';


const AILocationDiscovery = ({ onComplete }) => {
  const [stage, setStage] = useState('intro');
  const [interests, setInterests] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [brainNodes, setBrainNodes] = useState([]);
  const [editingData, setEditingData] = useState({
  name: '',
  reason: '',
  comfortScore: 0,
  conversationPotential: 0,
  tips: []
  });
  const [connections, setConnections] = useState([]);
  const [aiResponses, setAiResponses] = useState([
    { id: 1, text: "Hello! I'm your AI Neural Mapper. Share your interests and hobbies, and watch as I build your personalized interest map!" }
  ]);
  const canvasRef = useRef(null);

  const userId = 'mfT1HBiZYxZmZX1CyI4Ll4PQYwQ2'; // Replace with actual user ID
const goalName = 'Make new friends'; // Replace with actual goal
const API_BASE = 'https://one23-u2ck.onrender.com';
const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Initialize brain visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    let animationId;
    let particles = [];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${particle.opacity})`;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      brainNodes.forEach((node, i) => {
        const pulse = Math.sin(Date.now() / 500 + i) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse + 5, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      connections.forEach(conn => {
        const node1 = brainNodes[conn.from];
        const node2 = brainNodes[conn.to];
        if (node1 && node2) {
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [brainNodes, connections]);

  const addInterest = async  () => {
    if (!currentInput.trim()) return;
    
    const inputs = currentInput.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    const newInterests = [];
    const newNodes = [];
    const newConns = [...connections];
    
    inputs.forEach(input => {
      const newInterest = {
        id: Date.now() + Math.random(),
        text: input,
        category: categorizeInterest(input)
      };
      
      newInterests.push(newInterest);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const currentNodeCount = brainNodes.length + newNodes.length;
      const angle = (currentNodeCount * 137.5 * Math.PI) / 180;
      const radius = 80 + currentNodeCount * 15;
      
      const newNode = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        radius: 8,
        color: getCategoryColor(newInterest.category)
      };
      
      newNodes.push(newNode);
      
      const allExistingInterests = [...interests, ...newInterests.slice(0, -1)];
      allExistingInterests.forEach((interest, idx) => {
        if (areRelated(interest.text, input)) {
          newConns.push({
            from: idx,
            to: brainNodes.length + newNodes.length - 1
          });
        }
        else if (interest.category === newInterest.category) {
          newConns.push({
            from: idx,
            to: brainNodes.length + newNodes.length - 1
          });
        }
      });
      
      if (currentNodeCount > 0) {
        newConns.push({
          from: currentNodeCount - 1,
          to: currentNodeCount
        });
      }
    });
    
    setInterests([...interests, ...newInterests]);
    setBrainNodes([...brainNodes, ...newNodes]);
    setConnections(newConns);
    
    const aiResponse = await generateAiResponse(inputs, [...interests, ...newInterests]);
    setAiResponses([...aiResponses, { id: Date.now(), text: aiResponse }]);
    
    setCurrentInput('');
    
    if (stage === 'intro') {
      setStage('collecting');
    }
  };

  const generateAiResponse = async (newInputs, allInterests) => {
  setIsLoadingAI(true);

  try {
    // ✅ Get the Firebase auth token
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    const token = await user.getIdToken();

    let data: any;
    let success = false;

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        const response = await fetch(`${API_BASE}/reply-day-chat-advanced`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`
          },
          body: JSON.stringify({
            user_id: userId,
            message: newInputs.join(', '),
            goal_name: goalName,
            user_interests: allInterests.map(i => i.text)
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`API key ${apiKey} failed:`, response.status, errorText);
          continue; // try next key
        }

        data = await response.json();
        success = true;
        break; // success, exit loop
      } catch (err) {
        console.warn(`Request failed with key ${apiKey}:`, err);
        // try next key
      }
    }

    setIsLoadingAI(false);
    if (success) return data.reply || "Thanks for sharing! Tell me more.";

    // fallback if all keys fail
    const fallbackResponses = [
      "Fascinating! I'm detecting patterns in your neural map. Keep sharing!",
      "Great! Building connections between your interests. Tell me more!",
      "I see! Your neural network is taking shape beautifully."
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

  } catch (error) {
    console.error('AI Error:', error);
    setIsLoadingAI(false);

    const fallbackResponses = [
      "Fascinating! I'm detecting patterns in your neural map. Keep sharing!",
      "Great! Building connections between your interests. Tell me more!",
      "I see! Your neural network is taking shape beautifully."
    ];
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};


  const categorizeInterest = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('book') || lower.includes('read')) return 'intellectual';
    if (lower.includes('coffee') || lower.includes('café') || lower.includes('cafe')) return 'social';
    if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout')) return 'active';
    if (lower.includes('art') || lower.includes('paint') || lower.includes('creative')) return 'creative';
    if (lower.includes('game') || lower.includes('board') || lower.includes('play')) return 'playful';
    if (lower.includes('music') || lower.includes('concert')) return 'cultural';
    if (lower.includes('outdoor') || lower.includes('nature') || lower.includes('hik')) return 'nature';
    if (lower.includes('dog') || lower.includes('pet')) return 'animals';
    if (lower.includes('tech') || lower.includes('coding')) return 'tech';
    if (lower.includes('yoga') || lower.includes('meditat')) return 'wellness';
    if (lower.includes('food') || lower.includes('cook')) return 'culinary';
    return 'general';
  };

  const getCategoryColor = (category) => {
    const colors = {
      intellectual: 'rgba(59, 130, 246, 0.8)',
      social: 'rgba(236, 72, 153, 0.8)',
      active: 'rgba(34, 197, 94, 0.8)',
      creative: 'rgba(168, 85, 247, 0.8)',
      playful: 'rgba(251, 191, 36, 0.8)',
      cultural: 'rgba(239, 68, 68, 0.8)',
      nature: 'rgba(16, 185, 129, 0.8)',
      animals: 'rgba(249, 115, 22, 0.8)',
      tech: 'rgba(99, 102, 241, 0.8)',
      wellness: 'rgba(139, 92, 246, 0.8)',
      culinary: 'rgba(245, 158, 11, 0.8)',
      general: 'rgba(148, 163, 184, 0.8)'
    };
    return colors[category] || colors.general;
  };

  const areRelated = (text1, text2) => {
    const keywords1 = text1.toLowerCase().split(' ');
    const keywords2 = text2.toLowerCase().split(' ');
    return keywords1.some(word => keywords2.includes(word) && word.length > 3);
  };

  const removeInterest = (id) => {
    // Keeping for future use
  };

  const analyzeAndGenerate = async () => {
  if (interests.length === 0) {
    console.warn("[AI] No interests found, aborting analysis.");
    return;
  }

  console.log("[AI] Starting analysis for interests:", interests);
  setStage('analyzing');
  setIsLoadingAI(true);

  // Add initial AI message
  setAiResponses(prev => [
    ...prev,
    { 
      id: Date.now(), 
      text: `Perfect! I've mapped ${interests.length} interests across your neural network. Now analyzing patterns to discover your ideal social locations...` 
    }
  ]);

  try {
    // ✅ Get Firebase auth token
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    const token = await user.getIdToken();
    console.log("[AI] User authenticated, token obtained");

    const payload = { user_id: userId, goal_name: goalName };
    console.log("[AI] Sending request to:", `${API_BASE}/generate-user-places`);
    console.log("[AI] Request payload:", payload);

    let data: any;
    let success = false;

    // ✅ Multi-key failover
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        const response = await fetch(`${API_BASE}/generate-user-places`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[AI] API key ${apiKey} failed:`, response.status, errorText);
          continue; // Try next key
        }

        data = await response.json();
        success = true;
        break; // Success
      } catch (err) {
        console.warn(`[AI] Request failed with key ${apiKey}:`, err);
        // Try next key
      }
    }

    setIsLoadingAI(false);

    if (!success) throw new Error("All API keys failed. Using fallback.");

    // ✅ Handle extracted places
    if (data.extracted_this_turn) {
      console.log("✅ Extracted this turn:", data.extracted_this_turn);
      const { current_places, desired_places } = data.extracted_this_turn;

      if ((current_places?.length || 0) > 0 || (desired_places?.length || 0) > 0) {
        const badges = [];
        if (current_places?.length) badges.push(`📍 Places you go: ${current_places.join(", ")}`);
        if (desired_places?.length) badges.push(`✨ Want to try: ${desired_places.join(", ")}`);

        setTimeout(() => {
          setAiResponses(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              text: `I captured: ${badges.join(" • ")}`,
              isExtraction: true
            }
          ]);
        }, 500);
      }
    }

    console.log("[AI] Raw API response:", data);

    let aiText = (data.suggested_places || '').replace(/```json|```/g, '').trim();
    let parsedLocations = [];

    try {
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        parsedLocations = parsed.locations || [];
      }
    } catch (err) {
      console.warn("[AI WARN] Failed full JSON parse, falling back:", err);
      const locationMatches = [...aiText.matchAll(/"id"\s*:\s*(\d+)[\s\S]*?"name"\s*:\s*"([^"]+)"[\s\S]*?"reason"\s*:\s*"([^"]+)"/g)];
      parsedLocations = locationMatches.map(m => ({
        id: parseInt(m[1], 10),
        name: m[2],
        reason: m[3],
        comfortScore: null,
        conversationPotential: null,
        tips: []
      }));
    }

    console.log("[AI] Parsed locations:", parsedLocations);
    setLocations(parsedLocations);

    setAiResponses(prev => [
      ...prev,
      { 
        id: Date.now() + 1, 
        text: `Analysis complete! Based on your neural map, I've discovered ${parsedLocations.length} locations!` 
      }
    ]);

    setStage('results');

  } catch (error) {
    console.error("[AI ERROR] Location generation error:", error);
    setIsLoadingAI(false);

    console.warn("[AI] Falling back to local location generation...");
    const fallbackLocations = generateFallbackLocations(interests);
    console.log("[AI] Fallback locations:", fallbackLocations);

    setLocations(fallbackLocations);
    setStage('results');
  }
};





const parseAILocations = (aiText) => {
  // Try to parse structured locations from AI response
  try {
    // If AI returns JSON
    const parsed = JSON.parse(aiText);
    if (parsed.locations) {
      return parsed.locations.slice(0, 3).map((loc, idx) => ({
        id: loc.id || idx + 1,
        name: loc.name || 'AI-Suggested Location',
        reason: loc.reason || aiText.substring(0, 200),
        easeLevel: idx + 1,
        comfortScore: loc.comfortScore || 85,
        conversationPotential: loc.conversationPotential || 80,
        tips: loc.tips || ['Start with a smile', 'Ask open questions', 'Share your interests']
      }));
    }
  } catch {
    // If not JSON, extract from text
    return [{
      id: 1,
      name: 'AI-Recommended Location',
      reason: aiText.substring(0, 200),
      easeLevel: 1,
      comfortScore: 85,
      conversationPotential: 80,
      tips: ['Engage naturally', 'Ask about their interests', 'Be genuine']
    }];
  }
  
  return generateFallbackLocations(interests);
};

const generateFallbackLocations = (userInterests) => {
  const allText = userInterests.map(i => i.text).join(' ').toLowerCase();
  const locations = [];
  
  if (allText.includes('book') || allText.includes('read')) {
    locations.push({
      id: 1,
      name: 'The Cozy Corner Bookstore & Café',
      reason: 'Perfect for book lovers! Quiet atmosphere with reading nooks.',
      easeLevel: 1,
      comfortScore: 95,
      conversationPotential: 85,
      tips: ['Ask what they\'re reading', 'Join book club', 'Comment on recommendations']
    });
  }
  
  if (allText.includes('coffee') || allText.includes('café')) {
    locations.push({
      id: 2,
      name: 'Brew & Chat Community Café',
      reason: 'Relaxed environment designed for conversation.',
      easeLevel: 1,
      comfortScore: 90,
      conversationPotential: 88,
      tips: ['Ask about the special', 'Comment on atmosphere', 'Sit at community table']
    });
  }
  
  // Add more fallbacks as needed from your original code
  
  if (locations.length === 0) {
    locations.push({
      id: 1,
      name: 'Local Community Center',
      reason: 'Welcoming space matching your interests.',
      easeLevel: 1,
      comfortScore: 85,
      conversationPotential: 80,
      tips: ['Join activities', 'Volunteer', 'Attend workshops']
    });
  }
  
  return locations.slice(0, 3).map((loc, idx) => ({
    ...loc,
    easeLevel: idx + 1
  }));
};

  const handleEditLocation = (location) => {
  console.log('🖊️ Editing location:', location);
  setEditingId(location.id);
  setEditingData({
    name: location.name || '',
    reason: location.reason || '',
    comfortScore: location.comfortScore || 85,
    conversationPotential: location.conversationPotential || 80,
    tips: Array.isArray(location.tips) ? location.tips : [] // ✅ Ensure it's always an array
  });
};

const handleSaveEdit = (id) => {
  setLocations(locations.map(loc => 
    loc.id === id ? { 
      ...loc, 
      name: editingData.name,
      reason: editingData.reason,
      comfortScore: editingData.comfortScore,
      conversationPotential: editingData.conversationPotential,
      tips: editingData.tips
    } : loc
  ));
  setEditingId(null);
  setEditingData({ name: '', reason: '', comfortScore: 0, conversationPotential: 0, tips: [] });
};

const handleCancelEdit = () => {
  setEditingId(null);
  setEditingData({ name: '', reason: '', comfortScore: 0, conversationPotential: 0, tips: [] });
};

const handleTipChange = (index, value) => {
  const newTips = [...editingData.tips];
  newTips[index] = value;
  setEditingData({ ...editingData, tips: newTips });
};

const handleAddTip = () => {
  setEditingData({ ...editingData, tips: [...editingData.tips, ''] });
};

const handleRemoveTip = (index) => {
  const newTips = editingData.tips.filter((_, i) => i !== index);
  setEditingData({ ...editingData, tips: newTips });
};

  const handleReorder = (id, direction) => {
    const index = locations.findIndex(loc => loc.id === id);
    if (direction === 'up' && index > 0) {
      const newLocations = [...locations];
      [newLocations[index], newLocations[index - 1]] = [newLocations[index - 1], newLocations[index]];
      newLocations[index].easeLevel = index + 1;
      newLocations[index - 1].easeLevel = index;
      setLocations(newLocations);
    } else if (direction === 'down' && index < locations.length - 1) {
      const newLocations = [...locations];
      [newLocations[index], newLocations[index + 1]] = [newLocations[index + 1], newLocations[index]];
      newLocations[index].easeLevel = index + 1;
      newLocations[index + 1].easeLevel = index + 2;
      setLocations(newLocations);
    }
  };

  const handleConfirm = async () => {
  console.log("🟦 handleConfirm triggered");

  if (!auth.currentUser) {
    alert("You must be logged in to save locations.");
    return;
  }

  const uid = auth.currentUser.uid;
  console.log("👤 User ID:", uid);

  try {
    console.log("💾 Saving locations in batch (lightweight mode)...");
    const userDocRef = doc(db, "users", uid);
    const locationsRef = collection(userDocRef, "locations");

    // --- batch save simplified locations ---
    const batch = writeBatch(db);
    locations.forEach((loc, i) => {
      const locDocRef = doc(locationsRef);
      batch.set(locDocRef, {
        name: loc.name || `Location ${i + 1}`,
        id: loc.id || null,
        address: loc.address || null,
        lat: loc.lat || null,
        lng: loc.lng || null,
      });
    });
    await batch.commit();
    console.log("✅ Lightweight location data saved");

    // --- Save summary data only ---
    await setDoc(
      userDocRef,
      {
        selected_locations: locations.map((l) => ({
          name: l.name || "Unknown",
          id: l.id || null,
        })),
        locations_confirmed_at: new Date().toISOString(),
        goal_name: goalName || "social_skills",
      },
      { merge: true }
    );
    console.log("✅ User document updated with lightweight summary");

    // --- Backend trigger with multi-key failover ---
    console.log("🌐 Sending modify-tasks-with-locations request...");
    let success = false;
    let result: any = null;

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      try {
        const response = await fetch(
          "https://one23-u2ck.onrender.com/modify-tasks-with-locations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer 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`,
            },
            body: JSON.stringify({
              user_id: uid,
              course_id: "social_skills",
            }),
          }
        );

        console.log(`🌐 Response status with key ${i + 1}:`, response.status);

        result = await response.json();

        if (response.ok && result.success) {
          success = true;
          console.log("🎯 Success: tasks updated");
          break; // stop trying further keys
        } else {
          console.warn(`API key ${i + 1} failed:`, result.error || "Unknown error");
        }
      } catch (err) {
        console.warn(`Request failed with API key ${i + 1}:`, err);
      }
    }

    if (success) {
      alert("✅ Locations saved and tasks updated!");
      onComplete?.();
    } else {
      throw new Error("All API keys failed. Could not update tasks.");
    }
  } catch (error) {
    console.error("🔥 Error in handleConfirm:", error);
    alert("Failed to save locations or update tasks.");
  }
};




  const getComfortColor = (score) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="min-h-screen relative text-white bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div id="page-top-anchor" style={{ height: "1px", visibility: "hidden" }} />
  {/* Transparent Background Gradient */}
  <div className="absolute inset-0 bg-transparent z-0" />

  {/* Animated Background Grid */}
  <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }}
    />
  </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center py-6 md:py-8 px-4">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 px-4 py-2 bg-purple-800/40 backdrop-blur-sm rounded-full border border-purple-500/30">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-300" />
            <span className="text-xs md:text-sm font-medium text-purple-200">AI Neural Discovery</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent">
            Neural Location Mapper
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-purple-300 max-w-2xl mx-auto px-4">
            Watch as AI maps your interests into a neural network and discovers your perfect social spots
          </p>
        </div>

        <div className="px-4 md:px-6 lg:px-10 max-w-6xl mx-auto pb-8">
          {/* Brain Visualization Area */}
          <div className="mb-6 md:mb-8">
            <div className="relative w-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl overflow-hidden" style={{ height: '50vh', minHeight: '300px', maxHeight: '500px' }}>
              <canvas ref={canvasRef} className="w-full h-full" />
              
              {aiResponses.length > 0 && (
  <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12 pointer-events-none">
    <div className="max-w-3xl w-full h-full flex flex-col animate-fadeIn">
      {/* Scrollable AI Response Container */}
      <div className="flex-1 overflow-y-auto pointer-events-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent pr-2">
        <p className="text-xl md:text-2xl lg:text-3xl text-white text-center leading-relaxed font-bold drop-shadow-2xl" style={{ textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 20px rgba(0, 0, 0, 0.9)' }}>
          {aiResponses[aiResponses.length - 1].text}
        </p>
      </div>
      
      {/* Loading Indicator */}
      {isLoadingAI && (
        <div className="mt-4 flex gap-2 justify-center pointer-events-none">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  </div>
)}
              
              {/* Stage-based Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {stage === 'analyzing' && (
                  <div className="text-center px-4">
                    <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-spin">
                      <Zap className="w-10 h-10 md:w-16 md:h-16" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Section */}
          {stage !== 'results' && (
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl border-2 border-purple-500/30 shadow-2xl p-5 md:p-6 lg:p-8 mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-100 mb-1">Share Your Interests</h2>
                  <p className="text-xs md:text-sm text-purple-300">What activities do you enjoy?</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                    placeholder="Tell me about yourself... (Press Enter to send)"
                    className="flex-1 px-4 md:px-5 py-3 md:py-4 bg-purple-950/50 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-sm md:text-base transition-all"
                    disabled={stage === 'analyzing'}
                  />
                  <button
                    onClick={addInterest}
                    disabled={!currentInput.trim() || stage === 'analyzing'}
                    className="px-4 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-sm md:text-base hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Send</span>
                    <span className="sm:hidden">→</span>
                  </button>
                </div>
                
                <p className="text-xs md:text-sm text-purple-400 text-center font-medium">
                  💡 Keep chatting! Each message adds nodes to your neural network
                </p>
                
                {interests.length > 0 && stage !== 'analyzing' && (
                  <button
                    onClick={analyzeAndGenerate}
                    className="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl font-bold text-sm md:text-base hover:shadow-xl hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 md:w-5 md:h-5" />
                    Analyze Neural Network ({interests.length} node{interests.length !== 1 ? 's' : ''})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Results Section */}
          {stage === 'results' && locations.length > 0 && (
            <div>
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl shadow-2xl p-5 md:p-6 border-2 border-purple-500/30">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                  <h2 className="text-xl md:text-2xl font-bold text-purple-100">
                    Your Neural Matches
                  </h2>
                </div>
                <button
                  onClick={handleConfirm}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 px-6 md:px-8 py-3 rounded-2xl hover:shadow-xl hover:shadow-purple-500/50 transition-all font-bold text-sm md:text-base flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                  Confirm & Save
                </button>
              </div>

              {/* Location Cards */}
              <div className="space-y-6">
                {locations.map((location, idx) => (
  <div key={location.id} className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl shadow-2xl p-5 md:p-8 border-2 border-purple-500/30 hover:border-purple-400/50 transition-all relative overflow-hidden">
    {/* Ease Level Badge */}
    <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 -mr-4 md:-mr-8 -mt-4 md:-mt-8">
      <div className={`w-full h-full rounded-full flex items-end justify-start p-3 md:p-6 text-white font-black text-2xl md:text-4xl ${
        location.easeLevel === 1 ? 'bg-gradient-to-br from-green-400 to-green-600' : 
        location.easeLevel === 2 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
        'bg-gradient-to-br from-orange-400 to-orange-600'
      }`}>
        {location.easeLevel}
      </div>
    </div>

    <div className="flex flex-col lg:flex-row items-start gap-6">
      <div className="flex-1 w-full">
        {editingId === location.id ? (
          /* EDITING MODE */
          <div className="space-y-6">
            {/* Edit Location Name */}
            <div>
              <label className="block text-sm font-bold text-purple-300 mb-2">Location Name</label>
              <input
                type="text"
                value={editingData.name}
                onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-400/50 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-lg font-bold text-white"
                placeholder="e.g., The Cozy Corner Bookstore"
              />
            </div>

            {/* Edit Reason */}
            <div>
              <label className="block text-sm font-bold text-purple-300 mb-2">Why This Place?</label>
              <textarea
                value={editingData.reason}
                onChange={(e) => setEditingData({ ...editingData, reason: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-purple-950/50 border-2 border-purple-400/50 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-base text-white resize-none"
                placeholder="Explain why this place is a good match..."
              />
            </div>

            {/* Edit Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">
                  Comfort Score: {editingData.comfortScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingData.comfortScore}
                  onChange={(e) => setEditingData({ ...editingData, comfortScore: parseInt(e.target.value) })}
                  className="w-full h-3 bg-purple-950/50 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${editingData.comfortScore}%, rgba(88, 28, 135, 0.3) ${editingData.comfortScore}%, rgba(88, 28, 135, 0.3) 100%)`
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">
                  Conversation Potential: {editingData.conversationPotential}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingData.conversationPotential}
                  onChange={(e) => setEditingData({ ...editingData, conversationPotential: parseInt(e.target.value) })}
                  className="w-full h-3 bg-purple-950/50 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${editingData.conversationPotential}%, rgba(29, 78, 216, 0.3) ${editingData.conversationPotential}%, rgba(29, 78, 216, 0.3) 100%)`
                  }}
                />
              </div>
            </div>

            {/* Edit Tips */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-purple-300">Conversation Starters</label>
                <button
                  onClick={handleAddTip}
                  className="p-2 bg-green-600/80 hover:bg-green-600 text-white rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {editingData.tips.map((tip, tipIdx) => (
                  <div key={tipIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleTipChange(tipIdx, e.target.value)}
                      className="flex-1 px-4 py-2 bg-purple-950/50 border-2 border-purple-400/50 rounded-xl focus:outline-none focus:border-purple-400 text-white text-sm"
                      placeholder={`Tip ${tipIdx + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveTip(tipIdx)}
                      className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => handleSaveEdit(location.id)} 
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Save Changes
              </button>
              <button 
                onClick={handleCancelEdit}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* VIEW MODE */
          <>
            {/* Location Name */}
<div className="flex flex-wrap items-center gap-3 mb-4">
  <button 
    onClick={() => handleEditLocation(location)} 
    className="p-2 md:p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all border-2 border-purple-400 shadow-lg hover:shadow-purple-500/50"
  >
    <Edit2 className="w-5 h-5" />
  </button>
  <MapPin className="w-6 h-6 md:w-7 md:h-7 text-purple-400 flex-shrink-0" />
  <h3 className="text-xl md:text-2xl font-bold text-purple-100 flex-1">{location.name}</h3>
</div>
            
            {/* AI Reasoning */}
            <div className="bg-purple-950/40 backdrop-blur-sm rounded-2xl p-4 md:p-5 mb-6 border-2 border-purple-500/30">
              <p className="text-sm md:text-base text-purple-200 leading-relaxed">
                <span className="font-semibold text-purple-300">Neural Match: </span>
                {location.reason}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-bold text-purple-300 uppercase tracking-wide">Comfort Level</span>
                  <span className="text-base md:text-lg font-black text-purple-200">{location.comfortScore}%</span>
                </div>
                <div className="h-3 md:h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                  <div className={`h-full rounded-full transition-all shadow-lg ${getComfortColor(location.comfortScore)}`} style={{width: `${location.comfortScore}%`}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-bold text-purple-300 uppercase tracking-wide">Conversation Potential</span>
                  <span className="text-base md:text-lg font-black text-blue-300">{location.conversationPotential}%</span>
                </div>
                <div className="h-3 md:h-4 bg-purple-950/50 rounded-full overflow-hidden border border-purple-700/30">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all shadow-lg" style={{width: `${location.conversationPotential}%`}}></div>
                </div>
              </div>
            </div>

            {/* Conversation Tips */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-2 border-indigo-500/30">
              <h4 className="font-bold text-indigo-300 mb-3 flex items-center gap-2 text-base md:text-lg">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                Conversation Starters
              </h4>
              <div className="space-y-2">
                {(location.tips || []).map((tip, tipIdx) => (
                  <div key={tipIdx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                    <span className="text-sm md:text-base text-purple-200">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reorder Controls - Only show when NOT editing */}
      {editingId !== location.id && (
        <div className="flex lg:flex-col gap-3 w-full lg:w-auto justify-center">
          <button
            onClick={() => handleReorder(location.id, 'up')}
            disabled={idx === 0}
            className="flex-1 lg:flex-none p-3 md:p-4 bg-purple-900/40 text-purple-300 rounded-2xl hover:bg-purple-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg border-2 border-purple-500/30"
          >
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 mx-auto" />
          </button>
          <button
            onClick={() => handleReorder(location.id, 'down')}
            disabled={idx === locations.length - 1}
            className="flex-1 lg:flex-none p-3 md:p-4 bg-purple-900/40 text-purple-300 rounded-2xl hover:bg-purple-800/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg border-2 border-purple-500/30"
          >
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6 mx-auto" />
          </button>
        </div>
      )}
    </div>
  </div>
))}
               
              </div>

              {/* Start Over Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setStage('intro');
                    setInterests([]);
                    setLocations([]);
                    setBrainNodes([]);
                    setConnections([]);
                    setCurrentInput('');
                    setAiResponses([{ id: 1, text: "Hello! I'm your AI Neural Mapper. Share your interests and hobbies, and watch as I build your personalized interest map!" }]);
                  }}
                  className="px-6 md:px-8 py-3 md:py-4 bg-purple-900/60 hover:bg-purple-800/60 text-purple-200 rounded-2xl transition-all font-bold text-sm md:text-base border-2 border-purple-500/30 shadow-lg"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  html, body {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overflow: hidden; /* removes main scrollbar */
    height: 100%;
  }

  #root, .app-container {
    height: 100vh;       /* full viewport height */
    overflow-y: auto;    /* only main content scrolls */
    overflow-x: hidden;  /* hide horizontal scroll */
  }

  button, input {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  button {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  button:focus-visible,
  input:focus-visible {
    outline: 2px solid #a78bfa;
    outline-offset: 2px;
  }

  * {
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(168,85,247,0.5) transparent;
}

/* For Chrome, Edge, Safari */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(168,85,247,0.5);
  border-radius: 3px;
  border: none;
}

/* Custom Range Slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  border: 3px solid #a855f7;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
  border: 3px solid #a855f7;
}

`}</style>

    </div>
  );
};

export default AILocationDiscovery;