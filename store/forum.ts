import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ForumPost, ForumComment } from '@/types/forum';
import { mockForumPosts } from '@/mocks/forum';

interface ForumState {
  posts: ForumPost[];
  addPost: (post: ForumPost) => void;
  getPost: (id: string) => ForumPost | undefined;
  addComment: (postId: string, comment: ForumComment) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  getUnreadCount: () => number;
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      posts: mockForumPosts,
      
      addPost: (post: ForumPost) => {
        set((state) => ({
          posts: [post, ...state.posts]
        }));
      },
      
      getPost: (id: string) => {
        return get().posts.find(post => post.id === id);
      },
      
      addComment: (postId: string, comment: ForumComment) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...post.comments, comment],
                commentCount: post.commentCount + 1
              };
            }
            return post;
          })
        }));
      },
      
      likePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId && !post.likedBy.includes('currentUser')) {
              return {
                ...post,
                likedBy: [...post.likedBy, 'currentUser']
              };
            }
            return post;
          })
        }));
      },
      
      unlikePost: (postId: string) => {
        set((state) => ({
          posts: state.posts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                likedBy: post.likedBy.filter(id => id !== 'currentUser')
              };
            }
            return post;
          })
        }));
      },
      
      getUnreadCount: () => {
        // In a real app, this would check for unread forum notifications
        return 0;
      }
    }),
    {
      name: 'forum-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);