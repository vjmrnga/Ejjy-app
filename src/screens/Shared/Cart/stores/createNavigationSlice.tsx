export const createNavigationSlice: any = (set) => ({
	pageNumber: 1,
	nextPage: () => set((state) => ({ pageNumber: state.pageNumber + 1 })),
	prevPage: () => set((state) => ({ pageNumber: state.pageNumber - 1 })),
	resetPage: () => set(() => ({ pageNumber: 1 })),
});
