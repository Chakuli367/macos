// src/pages/products.tsx
import { CONFIG } from 'src/config-global';
import { ActionGroupFeed } from 'src/sections/product/view';
import { WhatsAppInterface } from 'src/sections/product/view';
import { useEffect, useState } from 'react';
import { auth } from 'src/lib/firebase';
import React, {  useCallback } from 'react';
import { db } from 'src/lib/firebase';
import { collection, query, orderBy, onSnapshot, getDocs, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Search, Users, ArrowLeft, MoreVertical, Bell, Pin, Archive, Settings, User, MessageCircle, CheckCircle, Camera, Menu } from 'lucide-react';
import GroupChatApp from 'src/sections/product/view/GroupChatApp'; // Your existing component


function WhatsAppInterface() {
  console.log('🔵 WhatsAppInterface component rendered');
  
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState(null);

  console.log('📊 Current state:', { 
    groupsCount: groups.length, 
    selectedGroup: selectedGroup?.name || 'none',
    searchQuery,
    showMenu,
    loadingGroups,
    error
  });

  const formatTime = (timestamp) => {
    console.log('⏰ Formatting time:', timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'yesterday';
    return `${days}d`;
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('🔍 Filtered groups:', filteredGroups.length, 'out of', groups.length);

  const pinnedGroups = filteredGroups.filter(g => g.pinned);
  const regularGroups = filteredGroups.filter(g => !g.pinned);
  console.log('📌 Pinned groups:', pinnedGroups.length, 'Regular groups:', regularGroups.length);

  // Wrap loadGroups in useCallback to make it stable
  const loadGroups = useCallback(async () => {
    console.log('🚀 loadGroups called');
    const user = "0ZBMPAlN3rRnSs3rBwIQUlbQTJ82";
    console.log('👤 User ID:', user);
    
    if (!user) {
      console.log('❌ No user authenticated');
      setError('No user authenticated');
      return;
    }
    
    try {
      console.log('⏳ Setting loadingGroups to true');
      setLoadingGroups(true);
      setError(null);
      
      console.log('📡 Checking db object:', db);
      if (!db) {
        throw new Error('Firebase db is not initialized');
      }
      
      console.log('📡 Creating Firestore query...');
      const q = query(collection(db, 'groups'), orderBy('lastMessageTime', 'desc'));
      
      console.log('🔄 Fetching documents from Firestore...');
      const snapshot = await getDocs(q);
      
      console.log('✅ Firestore snapshot received:', snapshot.docs.length, 'documents');
      
      const groupsList = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Group document:', doc.id, data);
        return {
          id: doc.id,
          ...data,
        };
      });
      
      console.log('📦 Groups list prepared:', groupsList);
      setGroups(groupsList);
      console.log('✅ Groups state updated');
      
    } catch (err) {
      console.error('❌ Error loading groups:', err);
      console.error('Error details:', err.message, err.code, err.stack);
      setError(err.message);
    } finally {
      console.log('⏳ Setting loadingGroups to false');
      setLoadingGroups(false);
    }
  }, []);

  // Initial load - runs once on mount
  useEffect(() => {
    console.log('🎬 Initial load useEffect triggered - MOUNTING');
    const user = "0ZBMPAlN3rRnSs3rBwIQUlbQTJ82";
    console.log('👤 Checking user:', user);
    
    if (user) {
      console.log('✅ User exists, calling loadGroups');
      loadGroups();
    } else {
      console.log('❌ No user, skipping loadGroups');
    }

    // Cleanup log
    return () => {
      console.log('🧹 Initial load useEffect UNMOUNTING');
    };
  }, [loadGroups]);

  // Listen to all groups in real-time - runs once on mount
 useEffect(() => {
  console.log('🎧 Real-time listener useEffect triggered - MOUNTING');
  const user = "0ZBMPAlN3rRnSs3rBwIQUlbQTJ82";
  console.log('👤 Checking user for listener:', user);
  
  if (!user) {
    console.log('❌ No user, skipping real-time listener');
    return;
  }
  
  console.log('📡 Setting up Firestore real-time listener...');
  
  try {
    const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('🔔 Real-time update received!');
        console.log('📊 Snapshot contains', snapshot.docs.length, 'documents');
        
        const groupList = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📄 Real-time group update:', doc.id, data);
          return {
            id: doc.id,
            name: data.name,
            members: data.memberCount || 0,
            activeMembers: data.activeNow || 0,
            avatar: data.icon || '👥',
            lastMessage: data.description || 'No messages yet',
            lastMessageTime: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
            unreadCount: 0,
            pinned: data.pinned || false,
            category: data.category,
            description: data.description,
          };
        });
        
        console.log('📦 Real-time groups list:', groupList);
        setGroups(groupList);
        console.log('✅ Groups state updated from real-time listener');
      },
      (error) => {
        console.error("❌ Error in real-time listener:", error);
        console.error('Error details:', error.message, error.code);
        setError(error.message);
      }
    );
    
    console.log('✅ Real-time listener set up successfully');
    
    return () => {
      console.log('🧹 Cleaning up real-time listener - UNMOUNTING');
      unsubscribe();
    };
  } catch (err) {
    console.error('❌ Error setting up real-time listener:', err);
    setError(err.message);
  }
}, []);

  const handleCreateGroup = async () => {
    console.log('➕ handleCreateGroup called');
    const name = prompt("Enter group name:");
    console.log('📝 Group name entered:', name);
    
    if (!name) {
      console.log('❌ No name provided, cancelling group creation');
      return;
    }
    
    try {
      console.log('🔄 Creating new group in Firestore...');
      const newGroup = {
        name,
        members: 1,
        activeMembers: 1,
        lastMessage: "New group created",
        lastMessageTime: serverTimestamp(),
        unreadCount: 0,
        avatar: '🆕',
        pinned: false
      };
      console.log('📦 New group data:', newGroup);
      
      const docRef = await addDoc(collection(db, 'groups'), newGroup);
      console.log('✅ Group created successfully with ID:', docRef.id);
    } catch (err) {
      console.error('❌ Error creating group:', err);
      console.error('Error details:', err.message, err.code);
      alert(`Error creating group: ${err.message}`);
    }
  };

  const handleSelectGroup = (group) => {
    console.log('👆 Group selected:', group);
    setSelectedGroup(group);
  };

  const handleBackFromChat = () => {
    console.log('⬅️ Back button clicked from chat');
    setSelectedGroup(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('🔍 Search query changed:', value);
    setSearchQuery(value);
  };

  const handleMenuToggle = () => {
    console.log('🍔 Menu toggle clicked, current state:', showMenu);
    setShowMenu(!showMenu);
  };

  const handleMenuClose = () => {
    console.log('❌ Menu closed');
    setShowMenu(false);
  };

  // If a group is selected, render the GroupChatApp component
  if (selectedGroup) {
    console.log('🎯 Rendering GroupChatApp for group:', selectedGroup.name);
    return (
      <div className="h-screen w-full">
        <GroupChatApp 
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          groupMembers={selectedGroup.members}
          activeMembers={selectedGroup.activeMembers}
          onBack={handleBackFromChat}
        />
      </div>
    );
  }

  console.log('📱 Rendering groups list view');
  
  // Groups list view
  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="bg-purple-700 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleMenuToggle}
            className="p-2 hover:bg-purple-600 rounded-full transition-all"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-semibold text-white">AccountaBuddy Groups</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-purple-600 rounded-full transition-all">
            <Camera className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 hover:bg-purple-600 rounded-full transition-all">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-purple-700 px-4 pb-3">
        <div className="bg-white rounded-lg flex items-center px-4 py-2 gap-3">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 outline-none text-gray-800 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-2 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Groups List */}
      <div className="flex-1 bg-white overflow-y-auto">
        {loadingGroups ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-lg">Loading groups...</p>
          </div>
        ) : (
          <>
            {/* Pinned Groups */}
            {pinnedGroups.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-100 flex items-center gap-2">
                  <Pin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-600">Pinned</span>
                </div>
                {pinnedGroups.map(group => {
                  console.log('🖼️ Rendering pinned group:', group.name);
                  return (
                    <GroupItem 
                      key={group.id} 
                      group={group} 
                      onSelect={handleSelectGroup}
                      formatTime={formatTime}
                    />
                  );
                })}
              </div>
            )}

            {/* Regular Groups */}
            {regularGroups.map(group => {
              console.log('🖼️ Rendering regular group:', group.name);
              return (
                <GroupItem 
                  key={group.id} 
                  group={group} 
                  onSelect={handleSelectGroup}
                  formatTime={formatTime}
                />
              );
            })}

            {filteredGroups.length === 0 && !loadingGroups && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">No groups found</p>
                {error && <p className="text-sm mt-2 text-red-500">Check console for errors</p>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleCreateGroup}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Side Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleMenuClose}
          />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl animate-slide-in">
            <div className="bg-purple-700 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">Alex Johnson</p>
                  <p className="text-purple-200 text-sm">alex@example.com</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              <MenuItem icon={<Users />} label="New Group" />
              <MenuItem icon={<Bell />} label="Notifications" />
              <MenuItem icon={<Archive />} label="Archived" />
              <MenuItem icon={<Settings />} label="Settings" />
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function GroupItem({ group, onSelect, formatTime }) {
  console.log('🎴 GroupItem rendered for:', group.name);
  
  const handleClick = () => {
    console.log('👆 GroupItem clicked:', group.name);
    onSelect(group);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-100"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
        {group.avatar}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
          <span className={`text-xs ${group.unreadCount > 0 ? 'text-purple-600 font-semibold' : 'text-gray-500'}`}>
            {formatTime(group.lastMessageTime?.toMillis ? group.lastMessageTime.toMillis() : group.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate flex-1">{group.lastMessage}</p>
          {group.unreadCount > 0 && (
            <span className="ml-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {group.unreadCount}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">{group.activeMembers} active • {group.members} members</p>
      </div>
    </button>
  );
}

function MenuItem({ icon, label }) {
  console.log('📋 MenuItem rendered:', label);
  
  const handleClick = () => {
    console.log('👆 MenuItem clicked:', label);
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-100 transition-all"
    >
      <div className="text-gray-600">
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className="text-gray-800 font-medium">{label}</span>
    </button>
  );
}





// ----------------------------------------------------------------------

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [error, setError] = useState(null);

  useEffect(() => {
    const user = "0ZBMPAlN3rRnSs3rBwIQUlbQTJ82";
    if (user) {
      console.log('✅ User UID:', user);
      setUserId(user);
    } else {
      console.log('❌ No user authenticated');
    }
  }, []);


  const formatTime = (timestamp) => {
    console.log('⏰ Formatting time:', timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'yesterday';
    return `${days}d`;
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log('🔍 Filtered groups:', filteredGroups.length, 'out of', groups.length);

  const pinnedGroups = filteredGroups.filter(g => g.pinned);
  const regularGroups = filteredGroups.filter(g => !g.pinned);
  console.log('📌 Pinned groups:', pinnedGroups.length, 'Regular groups:', regularGroups.length);

  // Wrap loadGroups in useCallback to make it stable
  
const loadGroups = useCallback(async () => {
  console.log('🚀 loadGroups called');
  const user = "0ZBMPAlN3rRnSs3rBwIQUlbQTJ82";
  console.log('👤 User ID:', user);
  
  if (!user) {
    console.log('❌ No user authenticated');
    setError('No user authenticated');
    return;
  }
  
  try {
    console.log('⏳ Setting loadingGroups to true');
    setLoadingGroups(true);
    setError(null);
    
    console.log('📡 Checking db object:', db);
    if (!db) {
      throw new Error('Firebase db is not initialized');
    }
    
    console.log('📡 Creating Firestore query...');
    const q = query(collection(db, 'groups'), orderBy('createdAt', 'desc'));
    
    console.log('🔄 Fetching documents from Firestore...');
    const snapshot = await getDocs(q);
    
    console.log('✅ Firestore snapshot received:', snapshot.docs.length, 'documents');
    
    const groupsList = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('📄 Group document:', doc.id, data);
      return {
        id: doc.id,
        name: data.name,
        members: data.memberCount || 0,
        activeMembers: data.activeNow || 0,
        avatar: data.icon || '👥',
        lastMessage: data.description || 'No messages yet',
        lastMessageTime: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        unreadCount: 0,
        pinned: data.pinned || false,
        category: data.category,
        description: data.description,
      };
    });
    
    console.log('📦 Groups list prepared:', groupsList);
    setGroups(groupsList);
    console.log('✅ Groups state updated');
    
  } catch (err) {
    console.error('❌ Error loading groups:', err);
    console.error('Error details:', err.message, err.code, err.stack);
    setError(err.message);
  } finally {
    console.log('⏳ Setting loadingGroups to false');
    setLoadingGroups(false);
  }
}, []);

  
  
  const handleCreateGroup = async () => {
    console.log('➕ handleCreateGroup called');
    const name = prompt("Enter group name:");
    console.log('📝 Group name entered:', name);
    
    if (!name) {
      console.log('❌ No name provided, cancelling group creation');
      return;
    }
    
    try {
      console.log('🔄 Creating new group in Firestore...');
      const newGroup = {
        name,
        members: 1,
        activeMembers: 1,
        lastMessage: "New group created",
        lastMessageTime: serverTimestamp(),
        unreadCount: 0,
        avatar: '🆕',
        pinned: false
      };
      console.log('📦 New group data:', newGroup);
      
      const docRef = await addDoc(collection(db, 'groups'), newGroup);
      console.log('✅ Group created successfully with ID:', docRef.id);
    } catch (err) {
      console.error('❌ Error creating group:', err);
      console.error('Error details:', err.message, err.code);
      alert(`Error creating group: ${err.message}`);
    }
  };

  const handleSelectGroup = (group) => {
    console.log('👆 Group selected:', group);
    setSelectedGroup(group);
  };

  const handleBackFromChat = () => {
    console.log('⬅️ Back button clicked from chat');
    setSelectedGroup(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    console.log('🔍 Search query changed:', value);
    setSearchQuery(value);
  };

  const handleMenuToggle = () => {
    console.log('🍔 Menu toggle clicked, current state:', showMenu);
    setShowMenu(!showMenu);
  };

  const handleMenuClose = () => {
    console.log('❌ Menu closed');
    setShowMenu(false);
  };

  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>
      
     <WhatsAppInterface />
    </>
  );
}
