export const createInterfaceSlice: any = (set) => ({
	isLoading: false,
	setLoading: (value) => set(() => ({ isLoading: value })),
});
