import { Alert } from 'antd';
import { usePingOnlineServer } from 'hooks';
import React from 'react';

export const ConnectionAlert = () => {
	const { isConnected } = usePingOnlineServer();

	return (
		isConnected === false && (
			<Alert
				className="mb-4"
				message="Online Server cannot be reached."
				description="Create, Edit, and Delete functionalities are temporarily disabled until connection to Online Server is restored."
				type="error"
				showIcon
			/>
		)
	);
};
