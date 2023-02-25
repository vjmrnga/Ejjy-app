import create from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create<any>(
	persist(
		(set) => ({
			user: {},
			setUser: (user) => set({ user }),
			resetUser: () => set({ user: {} }),
		}),
		{
			name: 'user-storage',
		},
	),
);

export default useUserStore;
