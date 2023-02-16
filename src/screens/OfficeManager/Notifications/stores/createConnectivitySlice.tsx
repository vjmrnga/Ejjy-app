export const createConnectivitySlice: any = (set) => ({
	connectivityCount: 0,
	setConnectivityCount: (value) => set(() => ({ connectivityCount: value })),
});
