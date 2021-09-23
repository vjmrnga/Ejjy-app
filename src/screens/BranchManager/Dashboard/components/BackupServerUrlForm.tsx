import { message, Spin } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	ControlledInput,
	Label,
} from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';

interface Props {
	branch: any;
	loading: boolean;
}

export const BackupServerUrlForm = ({ branch, loading }: Props) => {
	// STATES
	const [backupServerUrl, setBackupServerUrl] = useState('');

	// CUSTOM HOOKS
	const { editBranch, status } = useBranches();

	// EFFECTS
	useEffect(() => {
		setBackupServerUrl(branch?.backup_server_url || '');
	}, [branch]);

	const onSaveSettings = () => {
		if (isEmpty(backupServerUrl)) {
			message.error('Please make sure to fill all the fields.');
			return;
		}

		editBranch({
			...branch,
			backup_server_url: backupServerUrl,
		});
	};

	return (
		<Spin spinning={loading || status === request.REQUESTING}>
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
