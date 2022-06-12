import { message, Spin } from 'antd';
import { Box, Button, ControlledInput, Label } from 'components/elements';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

export const BackupServerUrlForm = ({ branch, loading }) => {
	// STATES
	const [backupServerUrl, setBackupServerUrl] = useState('');

	// CUSTOM HOOKS

	// EFFECTS
	useEffect(() => {
		setBackupServerUrl(branch?.backup_server_url || '');
	}, [branch]);

	const onSaveSettings = () => {
		if (isEmpty(backupServerUrl)) {
			message.error('Please make sure to fill all the fields.');
			return;
		}
	};

	return (
		<Spin spinning={loading}>
			<Box className="BackupServerUrl" padding>
				<div className="BackupServerUrl_inputWrapper">
					<Label label="Backup Server URL" spacing />
					<ControlledInput
						value={backupServerUrl}
						onChange={(value) => setBackupServerUrl(value)}
						max={75}
					/>
				</div>
				<Button
					text="Save Settings"
					variant="primary"
					onClick={onSaveSettings}
				/>
			</Box>
		</Spin>
	);
};
