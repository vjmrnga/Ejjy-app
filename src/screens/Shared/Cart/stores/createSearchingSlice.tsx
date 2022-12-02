import { NO_INDEX_SELECTED } from 'screens/Shared/Cart/data';

export const createSearchingSlice: any = (set) => ({
	searchedText: '',
	activeIndex: NO_INDEX_SELECTED,

	setSearchedText: (value) => set(() => ({ searchedText: value })),
	setActiveIndex: (value) => set(() => ({ activeIndex: value })),
});
