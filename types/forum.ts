export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  authorId: string;
  createdAt: string;
  comments: ForumComment[];
  likedBy: string[];
  commentCount: number;
}

export interface ForumComment {
  id: string;
  authorId: string;
  author: string;
  content: string;
  createdAt: string;
  likedBy: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
}

export interface ProfileSettings {
  darkMode: boolean;
  pushNotifications: boolean;
  locationServices: boolean;
}

export interface ProfileNotifications {
  messages: boolean;
  forumReplies: boolean;
  newListings: boolean;
}

export interface ProfilePrivacy {
  publicProfile: boolean;
  showActivity: boolean;
  dataForAds: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  settings: ProfileSettings;
  notifications: ProfileNotifications;
  privacy: ProfilePrivacy;
}