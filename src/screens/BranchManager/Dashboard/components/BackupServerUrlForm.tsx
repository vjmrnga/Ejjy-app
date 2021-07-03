import { Col, message, Row, Spin } from 'antd';
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
		<Box className="BackupServerUrl">
			<Spin size="large" spinning={loading || status === request.REQUESTING}>
				<Row gutter={[15, 0]}>
					<Col xs={24} sm={20} md={20}>
						<Label label="Backup Server URL" spacing />
						<ControlledInput
							value={backupServerUrl}
							onChange={(value) => setBackupServerUrl(value)}
							max={75}
						/>
					</Col>
					<Col xs={24} sm={4} md={4} className="button-column">
						<Button
							text="Save Settings"
							variant="primary"
							onClick={onSaveSettings}
						/>
					</Col>
				</Row>
			</Spin>
		</Box>
	);
};
