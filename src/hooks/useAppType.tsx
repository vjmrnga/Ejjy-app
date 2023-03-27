import { useEffect } from 'react';

let ipcRenderer;
if (window.require) {
	const electron = window.require('electron');
	ipcRenderer = electron.ipcRenderer;
}

const SET_METHOD_NAME = 'setStoreValue';
const GET_METHOD_NAME = 'getStoreValue';
const APP_TYPE_KEY = 'appType';
const MAIN_HEAD_OFFICE_KEY = 'isMainHeadOffice';

const useAppType = () => {
	useEffect(() => {
		if (ipcRenderer) {
			const fetchData = async () => {
				const data = await Promise.all([
					ipcRenderer.invoke(GET_METHOD_NAME, APP_TYPE_KEY),
					ipcRenderer.invoke(GET_METHOD_NAME, MAIN_HEAD_OFFICE_KEY),
				]);

				console.log('data', data);
			};

			fetchData();
		}
	}, [ipcRenderer]);

	const setNewAppType = (newAppType, relaunch = false) => {
		if (ipcRenderer) {
			ipcRenderer.invoke(SET_METHOD_NAME, {
				key: APP_TYPE_KEY,
				value: newAppType,
				relaunch,
			});
		}
	};

	const setNewIsMainHeadOffice = (newIsMainHeadOffice, relaunch = false) => {
		if (ipcRenderer) {
			ipcRenderer.invoke(SET_METHOD_NAME, {
				key: MAIN_HEAD_OFFICE_KEY,
				value: newIsMainHeadOffice,
				relaunch,
			});
		}
	};

	return {
		setAppType: setNewAppType,
		setIsMainHeadOffice: setNewIsMainHeadOffice,
	};
};

export default useAppType;
