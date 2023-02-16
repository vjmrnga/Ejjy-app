import create from 'zustand';

const initialState = {
	isPrinterConnected: null,
	isSidebarCollapsed: false,
};

const useUserInterfaceStore = create<any>((set) => ({
	userInterface: initialState,
	setUserInterface: (payload) =>
		set((state) => ({
			userInterface: {
				...state.userInterface,
				...payload,
			},
		})),
	resetUserInterface: () => set(initialState),
}));

export default useUserInterfaceStore;
