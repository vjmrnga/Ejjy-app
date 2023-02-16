import create from 'zustand';
import { createConnectivitySlice } from './createConnectivitySlice';
import { createDtrSlice } from './createDtrSlice';

export const useNotificationStore = create<any>()((...a) => ({
	...createConnectivitySlice(...a),
	...createDtrSlice(...a),
}));
