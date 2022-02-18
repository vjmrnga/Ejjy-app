import { Tag } from 'antd';
import React, { useCallback } from 'react';
import { connectivityTypes } from '../../global/types';

interface Props {
	type: string;
}

const ConnectivityType = ({ type }: Props) => {
	const render = useCallback(() => {
		let component = null;

		switch (type) {
			case connectivityTypes.OFFLINE_TO_ONLINE:
				component = <Tag color="green">To Online</Tag>;
				break;
			case connectivityTypes.ONLINE_TO_OFFLINE:
				component = <Tag color="orange">To Offline</Tag>;
				break;
			default:
				break;
		}

		return component;
	}, [type]);

	return render();
};

export default ConnectivityType;
