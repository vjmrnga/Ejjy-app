import { Button, Result } from 'antd';
import { AppSettingsModal } from 'components';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';

const NetworkError = () => {
	// STATES
	const [appSettingsModalVisible, setAppSettingsModalVisible] = useState(false);

	// CUSTOM HOOKS
	const history = useHistory();

	// METHODS
	useEffect(() => {
		if (!history.location.state) {
			history.replace('/');
		}
	}, [history.location.state]);

	return (
		<div className="NetworkError">
			<Result
				extra={[
					<Button
						key="reconnect"
						type="primary"
						onClick={() => window.location.reload()}
					>
						Reconnect
					</Button>,
					<Button
						key="settings"
						onClick={() => setAppSettingsModalVisible(true)}
					>
						Edit App Settings
					</Button>,
				]}
				status="500"
				subTitle="Cannot connect to the server."
				title="Server Error"
			/>

			{appSettingsModalVisible && (
				<AppSettingsModal
					onClose={() => setAppSettingsModalVisible(false)}
					onSuccess={() => {
						window.location.reload();
					}}
				/>
			)}
		</div>
	);
};

export default NetworkError;
