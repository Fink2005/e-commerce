// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   avatar?: string;
//   roles: string[];
//   createdAt: string;
//   lastLoginAt: string;
// }

// interface UserStore {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
//   login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
//   logout: () => void;
//   updateUser: (userData: Partial<User>) => void;
//   clearError: () => void;
//   hasRole: (role: string) => boolean;
//   setUser: (userData: User | null) => void;
// }

// const useUserStore = create<UserStore>()(
//   persist(
//     (set, get) => ({
//       // State
//       user: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       // Actions
//       login: async (credentials) => {
//         set({ isLoading: true, error: null });

//         try {
//           // Replace this with your actual login API call
//           const response = await fetch('/api/login', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(credentials),
//           });

//           if (!response.ok) {
//             throw new Error('Login failed');
//           }

//           const userData = await response.json();

//           set({
//             user: userData,
//             isAuthenticated: true,
//             isLoading: false,
//             error: null,
//           });

//           return { success: true, user: userData };
//         } catch (error) {
//           set({
//             user: null,
//             isAuthenticated: false,
//             isLoading: false,
//             error: error.message,
//           });
//           return { success: false, error: error.message };
//         }
//       },

//       logout: () => {
//         set({
//           user: null,
//           isAuthenticated: false,
//           isLoading: false,
//           error: null,
//         });
//       },

//       updateUser: (userData) => {
//         set(state => ({
//           user: { ...state.user, ...userData },
//         }));
//       },

//       clearError: () => {
//         set({ error: null });
//       },

//       // Helper to check if user has specific role
//       hasRole: (role) => {
//         const { user } = get();
//         return user?.roles?.includes(role) || false;
//       },

//       // Set user directly (useful for registration or external auth)
//       setUser: (userData) => {
//         set({
//           user: userData,
//           isAuthenticated: !!userData,
//           error: null,
//         });
//       },
//     }),
//     {
//       name: 'user-storage',
//       partialize: state => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );

// export default useUserStore;
