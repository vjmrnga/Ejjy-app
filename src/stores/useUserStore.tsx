import { User } from 'ejjy-global';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Store {
	user: User;
	setUser: (user: User) => void;
	resetUser: () => void;
}

const useUserStore = create(
	persist<Store>(
		(set) => ({
			user: {} as User,
			setUser: (user) => {
				set({ user });
			},
			resetUser: () => {
				set({ user: {} as User });
			},
		}),
		{
			name: 'user-storage',
			getStorage: () => localStorage,
		},
	),
);

export default useUserStore;
