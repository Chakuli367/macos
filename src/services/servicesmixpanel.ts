// src/services/mixpanel.ts
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '3f57bf9b5f5d11792f52742c157e9004';

interface UserProperties {
  name?: string;
  email?: string;
  signupDate?: string;
  username?: string;
  league?: string;
  totalXP?: number;
  streak?: number;
  friendsCount?: number;
  [key: string]: any;
}

interface QuizData {
  userId: string;
  archetypeCurrent?: string;
  archetypeFuture?: string;
  quizDuration?: number | null;
  traitsSelected?: string[];
  totalQuestions?: number;
}

interface LessonData {
  lessonId: string;
  lessonNumber: number;
  lessonName: string;
  moduleName: string;
  timeSpent: number;
  completionPercentage: number;
}

interface ChallengeData {
  challengeId: string;
  title: string;
  xp: number;
  streak: number;
}

interface MoodData {
  mood: string;
  weekNumber: number;
}

interface SkillData {
  skillName: string;
  level: number;
  xpGained: number;
  currentXp: number;
  maxXp: number;
}

interface TraitData {
  traitName: string;
  previousValue: number;
  currentValue: number;
}

// NEW INTERFACES FOR COMMUNITY FEATURES
interface FriendData {
  friendId: string;
  friendName?: string;
  friendLeague?: string;
}

interface GroupData {
  groupId: string;
  groupName: string;
  groupCategory?: string;
  memberCount?: number;
}

interface PostData {
  postId?: string;
  groupId: string;
  postType: string;
  contentLength?: number;
  templateType?: string;
}

interface CommunitySearchData {
  query: string;
  resultCount?: number;
  queryLength?: number;
}

interface NotificationData {
  notificationType?: string;
  unreadCount?: number;
}

class MixpanelService {
  private initialized: boolean = false;

  init(): void {
    if (!this.initialized) {
      try {
        mixpanel.init(MIXPANEL_TOKEN, {
          debug: process.env.NODE_ENV === 'development',
          track_pageview: true,
          persistence: 'localStorage'
        });
        this.initialized = true;
        console.log('✅ Mixpanel initialized successfully');
      } catch (error) {
        console.error('❌ Mixpanel initialization failed:', error);
      }
    }
  }

  // Generic track event method
  trackEvent(eventName: string, properties: Record<string, any> = {}): void {
    if (this.initialized) {
      try {
        mixpanel.track(eventName, {
          ...properties,
          timestamp: new Date().toISOString()
        });
        console.log(`📊 Tracked: ${eventName}`, properties);
      } catch (error) {
        console.error('❌ Error tracking event:', error);
      }
    } else {
      console.warn('⚠️ Mixpanel not initialized. Call init() first.');
    }
  }

  // Identify user (UPDATED with community properties)
  identifyUser(userId: string, userProperties: UserProperties = {}): void {
    if (this.initialized) {
      try {
        mixpanel.identify(userId);
        mixpanel.people.set({
          $name: userProperties.name,
          $email: userProperties.email,
          signup_date: userProperties.signupDate,
          username: userProperties.username,
          league: userProperties.league,
          total_xp: userProperties.totalXP,
          streak: userProperties.streak,
          friends_count: userProperties.friendsCount,
          ...userProperties
        });
        console.log(`👤 User identified: ${userId}`);
      } catch (error) {
        console.error('❌ Error identifying user:', error);
      }
    }
  }

  // ============================================
  // AUTHENTICATION EVENTS
  // ============================================

  trackSignup(userId: string, email: string, method: string = 'email'): void {
    this.trackEvent('User Signed Up', {
      user_id: userId,
      email: email,
      signup_method: method
    });

    mixpanel.people.set({
      $email: email,
      signup_date: new Date().toISOString()
    });
  }

  trackLogin(userId: string): void {
    this.trackEvent('User Login', {
      user_id: userId
    });

    mixpanel.people.set({
      last_login: new Date().toISOString()
    });
    mixpanel.people.increment('total_logins', 1);
  }

  trackLogout(): void {
    this.trackEvent('User Logout');
    this.reset();
  }

  // ============================================
  // NAVIGATION EVENTS
  // ============================================

  trackTabView(tabName: string, tabIndex: number): void {
    this.trackEvent('Tab Viewed', {
      tab_name: tabName,
      tab_index: tabIndex
    });
  }

  trackPageView(pageName: string, pageUrl?: string): void {
    this.trackEvent('Page Viewed', {
      page_name: pageName,
      page_url: pageUrl || window.location.pathname
    });
  }

  // ============================================
  // FRIEND EVENTS
  // ============================================

  trackFriendSearch(query: string, resultCount?: number): void {
    this.trackEvent('Friends Searched', {
      search_query: query,
      query_length: query.length,
      result_count: resultCount
    });
  }

  trackFriendRequestSent(friendData: FriendData): void {
    this.trackEvent('Friend Request Sent', {
      friend_id: friendData.friendId,
      friend_name: friendData.friendName
    });

    mixpanel.people.increment('friend_requests_sent', 1);
  }

  trackFriendRequestAccepted(friendData: FriendData): void {
    this.trackEvent('Friend Request Accepted', {
      friend_id: friendData.friendId,
      friend_name: friendData.friendName
    });

    mixpanel.people.increment('friends_count', 1);
    mixpanel.people.increment('friend_requests_accepted', 1);
  }

  trackFriendRequestDeclined(friendId: string): void {
    this.trackEvent('Friend Request Declined', {
      friend_id: friendId
    });
  }

  trackFriendRemoved(friendData: FriendData): void {
    this.trackEvent('Friend Removed', {
      friend_id: friendData.friendId,
      friend_name: friendData.friendName
    });

    mixpanel.people.increment('friends_count', -1);
  }

  trackFriendProfileViewed(friendData: FriendData): void {
    this.trackEvent('Friend Profile Viewed', {
      friend_id: friendData.friendId,
      friend_name: friendData.friendName,
      friend_league: friendData.friendLeague
    });
  }

  trackMessageSent(friendId: string): void {
    this.trackEvent('Message Sent', {
      recipient_id: friendId
    });

    mixpanel.people.increment('messages_sent', 1);
  }

  // ============================================
  // DISCOVERY EVENTS
  // ============================================

  trackDiscoverOpened(): void {
    this.trackEvent('Discover Modal Opened');
  }

  trackDiscoveryFiltered(league: string, sortBy: string): void {
    this.trackEvent('Discovery Filtered', {
      league_filter: league,
      sort_by: sortBy
    });
  }

  trackMoreUsersLoaded(currentCount: number): void {
    this.trackEvent('More Users Loaded', {
      current_user_count: currentCount
    });
  }

  trackUserDiscovered(userId: string, userLeague?: string): void {
    this.trackEvent('User Discovered', {
      discovered_user_id: userId,
      user_league: userLeague
    });
  }

  // ============================================
  // GROUP EVENTS
  // ============================================

  trackGroupViewed(groupData: GroupData): void {
    this.trackEvent('Group Viewed', {
      group_id: groupData.groupId,
      group_name: groupData.groupName,
      group_category: groupData.groupCategory,
      member_count: groupData.memberCount
    });
  }

  trackGroupJoined(groupData: GroupData): void {
    this.trackEvent('Group Joined', {
      group_id: groupData.groupId,
      group_name: groupData.groupName,
      group_category: groupData.groupCategory
    });

    mixpanel.people.increment('groups_joined', 1);
  }

  trackGroupLeft(groupData: GroupData): void {
    this.trackEvent('Group Left', {
      group_id: groupData.groupId,
      group_name: groupData.groupName
    });

    mixpanel.people.increment('groups_joined', -1);
  }

  trackGroupCreated(groupData: GroupData): void {
    this.trackEvent('Group Created', {
      group_id: groupData.groupId,
      group_name: groupData.groupName,
      group_category: groupData.groupCategory
    });

    mixpanel.people.increment('groups_created', 1);
  }

  trackGroupInviteSent(groupData: GroupData, friendId: string): void {
    this.trackEvent('Group Invite Sent', {
      group_id: groupData.groupId,
      group_name: groupData.groupName,
      invited_friend_id: friendId
    });

    mixpanel.people.increment('group_invites_sent', 1);
  }

  trackGroupInviteAccepted(groupData: GroupData): void {
    this.trackEvent('Group Invite Accepted', {
      group_id: groupData.groupId,
      group_name: groupData.groupName
    });
  }

  trackGroupInviteDeclined(groupId: string): void {
    this.trackEvent('Group Invite Declined', {
      group_id: groupId
    });
  }

  // ============================================
  // POST EVENTS
  // ============================================

  trackPostModalOpened(groupId?: string): void {
    this.trackEvent('Post Modal Opened', {
      group_id: groupId
    });
  }

  trackPostTemplateSelected(templateType: string, templateName: string): void {
    this.trackEvent('Post Template Selected', {
      template_type: templateType,
      template_name: templateName
    });
  }

  trackPostCreated(postData: PostData): void {
    this.trackEvent('Post Created', {
      post_id: postData.postId,
      group_id: postData.groupId,
      post_type: postData.postType,
      content_length: postData.contentLength,
      template_type: postData.templateType
    });

    mixpanel.people.increment('posts_created', 1);
  }

  trackPostReaction(postId: string, reactionType: string, groupId: string): void {
    this.trackEvent('Post Reaction Added', {
      post_id: postId,
      reaction_type: reactionType,
      group_id: groupId
    });

    mixpanel.people.increment('reactions_given', 1);
  }

  trackPostCommented(postId: string, commentLength: number, groupId: string): void {
    this.trackEvent('Comment Added', {
      post_id: postId,
      comment_length: commentLength,
      group_id: groupId
    });

    mixpanel.people.increment('comments_posted', 1);
  }

  trackPostShared(postId: string, shareMethod?: string): void {
    this.trackEvent('Post Shared', {
      post_id: postId,
      share_method: shareMethod
    });

    mixpanel.people.increment('posts_shared', 1);
  }

  trackPostDeleted(postId: string, groupId: string): void {
    this.trackEvent('Post Deleted', {
      post_id: postId,
      group_id: groupId
    });
  }

  // ============================================
  // CHALLENGE EVENTS (COMMUNITY CHALLENGES)
  // ============================================

  trackChallengeModalOpened(friendId: string, friendName?: string): void {
    this.trackEvent('Challenge Modal Opened', {
      friend_id: friendId,
      friend_name: friendName
    });
  }

  trackChallengeTemplateSelected(templateId: string, templateName: string, difficulty: string): void {
    this.trackEvent('Challenge Template Selected', {
      template_id: templateId,
      template_name: templateName,
      difficulty: difficulty
    });
  }

  trackChallengeSent(friendId: string, challengeType: string, difficulty?: string): void {
    this.trackEvent('Challenge Sent', {
      friend_id: friendId,
      challenge_type: challengeType,
      difficulty: difficulty
    });

    mixpanel.people.increment('challenges_sent', 1);
  }

  trackChallengeAccepted(challengeId: string, challengeType: string): void {
    this.trackEvent('Challenge Accepted', {
      challenge_id: challengeId,
      challenge_type: challengeType
    });

    mixpanel.people.increment('challenges_accepted', 1);
  }

  trackChallengeDeclined(challengeId: string, challengeType: string): void {
    this.trackEvent('Challenge Declined', {
      challenge_id: challengeId,
      challenge_type: challengeType
    });
  }

  // Original Challenge Completed (from lessons/activities)
  trackChallengeCompleted(challengeData: ChallengeData): void {
    this.trackEvent('Challenge Completed', {
      challenge_id: challengeData.challengeId,
      challenge_title: challengeData.title,
      xp_earned: challengeData.xp,
      streak_days: challengeData.streak
    });

    mixpanel.people.increment('challenges_completed', 1);
    mixpanel.people.increment('total_xp', challengeData.xp);
  }

  trackChallengeProgressUpdated(challengeId: string, progress: number): void {
    this.trackEvent('Challenge Progress Updated', {
      challenge_id: challengeId,
      progress_percentage: progress
    });
  }

  // ============================================
  // NOTIFICATION EVENTS
  // ============================================

  trackNotificationsOpened(unreadCount: number): void {
    this.trackEvent('Notifications Opened', {
      unread_count: unreadCount
    });
  }

  trackNotificationRead(notificationType: string): void {
    this.trackEvent('Notification Read', {
      notification_type: notificationType
    });
  }

  trackAllNotificationsRead(): void {
    this.trackEvent('All Notifications Read');
  }

  trackNotificationClicked(notificationType: string, actionTaken?: string): void {
    this.trackEvent('Notification Clicked', {
      notification_type: notificationType,
      action_taken: actionTaken
    });
  }

  // ============================================
  // ONBOARDING EVENTS
  // ============================================

  trackOnboardingStarted(): void {
    this.trackEvent('Onboarding Started');
  }

  trackOnboardingCompleted(): void {
    this.trackEvent('Onboarding Completed');

    mixpanel.people.set({
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString()
    });
  }

  trackOnboardingSkipped(): void {
    this.trackEvent('Onboarding Skipped');

    mixpanel.people.set({
      onboarding_skipped: true
    });
  }

  trackOnboardingStepViewed(stepNumber: number, stepName: string): void {
    this.trackEvent('Onboarding Step Viewed', {
      step_number: stepNumber,
      step_name: stepName
    });
  }

  trackTourStarted(tourName: string): void {
    this.trackEvent('Tour Started', {
      tour_name: tourName
    });
  }

  trackTourCompleted(tourName: string): void {
    this.trackEvent('Tour Completed', {
      tour_name: tourName
    });
  }

  // ============================================
  // FEATURE USAGE EVENTS
  // ============================================

  trackIRLHubOpened(): void {
    this.trackEvent('IRL Hub Opened');
  }

  trackSocialMapViewed(): void {
    this.trackEvent('Social Map Viewed');
  }

  trackOptimizedSupportOpened(): void {
    this.trackEvent('Optimized Support Opened');
  }

  trackCommunityFeedViewed(): void {
    this.trackEvent('Community Feed Viewed');
  }

  trackCommunityStoriesViewed(): void {
    this.trackEvent('Community Stories Viewed');
  }

  trackStoryCreated(): void {
    this.trackEvent('Story Created');

    mixpanel.people.increment('stories_created', 1);
  }

  trackStoryViewed(storyId: string, authorId: string): void {
    this.trackEvent('Story Viewed', {
      story_id: storyId,
      author_id: authorId
    });
  }

  // ============================================
  // ENGAGEMENT EVENTS
  // ============================================

  trackMoodUpdated(moodEmoji: string, moodLabel: string): void {
    this.trackEvent('Mood Updated', {
      mood_emoji: moodEmoji,
      mood_label: moodLabel
    });

    mixpanel.people.set({
      last_mood: moodLabel,
      last_mood_updated: new Date().toISOString()
    });
  }

  trackProfileShared(targetUserId?: string): void {
    this.trackEvent('Profile Shared', {
      target_user_id: targetUserId
    });

    mixpanel.people.increment('profile_shares', 1);
  }

  trackStreakMaintained(streakDays: number): void {
    this.trackEvent('Streak Maintained', {
      streak_days: streakDays
    });

    mixpanel.people.set({
      current_streak: streakDays,
      last_streak_update: new Date().toISOString()
    });
  }

  trackXPEarned(xpAmount: number, source: string): void {
    this.trackEvent('XP Earned', {
      xp_amount: xpAmount,
      xp_source: source
    });

    mixpanel.people.increment('total_xp', xpAmount);
  }

  trackLeagueChanged(oldLeague: string, newLeague: string): void {
    this.trackEvent('League Changed', {
      old_league: oldLeague,
      new_league: newLeague
    });

    mixpanel.people.set({
      league: newLeague,
      league_changed_at: new Date().toISOString()
    });
  }

  trackAchievementUnlocked(achievementId: string, achievementName: string): void {
    this.trackEvent('Achievement Unlocked', {
      achievement_id: achievementId,
      achievement_name: achievementName
    });

    mixpanel.people.increment('achievements_unlocked', 1);
  }

  // ============================================
  // ORIGINAL EVENTS (KEEPING FOR COMPATIBILITY)
  // ============================================

  trackProfileQuizDone(quizData: QuizData): void {
    this.trackEvent('Profile Quiz Done', {
      user_id: quizData.userId,
      archetype_current: quizData.archetypeCurrent,
      archetype_future: quizData.archetypeFuture,
      quiz_duration: quizData.quizDuration,
      traits_selected: quizData.traitsSelected,
      total_questions: quizData.totalQuestions
    });

    mixpanel.people.increment('quizzes_completed', 1);
    mixpanel.people.set({
      last_quiz_completed: new Date().toISOString(),
      current_archetype: quizData.archetypeCurrent
    });
  }

  trackLessonDone(lessonData: LessonData): void {
    this.trackEvent('Lesson Done', {
      lesson_id: lessonData.lessonId,
      lesson_number: lessonData.lessonNumber,
      lesson_name: lessonData.lessonName,
      module_name: lessonData.moduleName,
      time_spent: lessonData.timeSpent,
      completion_percentage: lessonData.completionPercentage
    });

    mixpanel.people.increment('lessons_completed', 1);
  }

  trackReflectionMood(moodData: MoodData): void {
    this.trackEvent('Weekly Reflection', {
      mood: moodData.mood,
      week_number: moodData.weekNumber
    });

    mixpanel.people.set({
      last_reflection_mood: moodData.mood,
      last_reflection_date: new Date().toISOString()
    });
  }

  trackProfileView(userId: string): void {
    this.trackEvent('Profile Viewed', {
      user_id: userId
    });
  }

  trackSkillProgress(skillData: SkillData): void {
    this.trackEvent('Skill Progress Updated', {
      skill_name: skillData.skillName,
      skill_level: skillData.level,
      xp_gained: skillData.xpGained,
      current_xp: skillData.currentXp,
      max_xp: skillData.maxXp
    });
  }

  trackTraitImprovement(traitData: TraitData): void {
    this.trackEvent('Trait Improved', {
      trait_name: traitData.traitName,
      previous_value: traitData.previousValue,
      current_value: traitData.currentValue,
      improvement: traitData.currentValue - traitData.previousValue
    });
  }

  // ============================================
  // ERROR TRACKING
  // ============================================

  trackError(errorType: string, errorMessage: string, context?: Record<string, any>): void {
    this.trackEvent('Error Occurred', {
      error_type: errorType,
      error_message: errorMessage,
      context: context
    });
  }

  // ============================================
  // SEARCH & FILTER EVENTS
  // ============================================

  trackSearch(searchType: string, query: string, resultCount?: number): void {
    this.trackEvent('Search Performed', {
      search_type: searchType,
      search_query: query,
      query_length: query.length,
      result_count: resultCount
    });
  }

  trackFilterApplied(filterType: string, filterValue: string): void {
    this.trackEvent('Filter Applied', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }

  trackSortChanged(sortBy: string): void {
    this.trackEvent('Sort Changed', {
      sort_by: sortBy
    });
  }

  // ============================================
  // LEADERBOARD EVENTS
  // ============================================

  trackLeaderboardViewed(leaderboardType: string): void {
    this.trackEvent('Leaderboard Viewed', {
      leaderboard_type: leaderboardType
    });
  }

  trackRankAchieved(rank: number, leaderboardType: string): void {
    this.trackEvent('Rank Achieved', {
      rank: rank,
      leaderboard_type: leaderboardType
    });

    mixpanel.people.set({
      highest_rank: rank,
      rank_achieved_at: new Date().toISOString()
    });
  }

  // Reset on logout
  reset(): void {
    if (this.initialized) {
      try {
        mixpanel.reset();
        console.log('🔄 Mixpanel reset');
      } catch (error) {
        console.error('❌ Error resetting Mixpanel:', error);
      }
    }
  }
}

const mixpanelService = new MixpanelService();
export default mixpanelService;