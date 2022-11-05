import { useEffect, useState } from 'react';

let ipcRenderer;
if (window.require) {
	const electron = window.require('electron');
	ipcRenderer = electron.ipcRenderer;
}

const SET_METHOD_NAME = 'setStoreValue';
const GET_METHOD_NAME = 'getStoreValue';
const KEY = 'appType';

const useAppType = () => {
	const [appType, setAppType] = useState(null);

	useEffect(() => {
		if (ipcRenderer) {
			const fetchData = async () => {
				const data = await ipcRenderer.invoke(GET_METHOD_NAME, KEY);
				setAppType(data);
			};

			fetchData();
		}
	}, [ipcRenderer]);

	const setNewAppType = (newAppType) => {
		if (ipcRenderer) {
			ipcRenderer.invoke(SET_METHOD_NAME, {
				key: KEY,
				value: newAppType,
				relaunch: true,
			});
		}
	};

	return {
		appType,
		setAppType: setNewAppType,
	};
};

export default useAppType;
