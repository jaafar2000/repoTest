import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  searchTerm: '',
  setSearchTerm: (value) => set({ searchTerm: value }),
}));

export const usePostsStore = create((set) => ({
  posts: [],
  setPosts: (value) => set({ posts: value }),

}));