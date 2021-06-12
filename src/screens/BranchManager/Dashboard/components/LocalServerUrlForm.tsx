/* eslint-disable react-hooks/exhaustive-deps */
import { Col, message, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Box, Button, ControlledInput, Label } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useBranches } from '../../../../hooks/useBranches';

interface Props {
	branch: any;
	loading: boolean;
}

export const LocalServerUrlForm = ({ branch, loading }: Props) => {
	// STATES
	const [localServerUrl, setLocalServerUrl] = useState('');

	// CUSTOM HOOKS

	const { editBranch, status } = useBranches();

	// EFFECTS
	useEffect(() => {
		setLocalServerUrl(branch?.local_ip_address || '');
	}, [branch]);

	const onSaveSettings = () => {
		if (isEmpty(localServerUrl)) {
			message.error('Please make sure to fill all the fields.');
			return;
		}

		editBranch({
			...branch,
			local_ip_address: localServerUrl,
		});
	};

	return (
		<Box className="LocalServerUrl">
			<Spin size="large" spinning={loading || status === request.REQUESTING}>
				<Row gutter={[15, 0]}>
					<Col xs={24} sm={20} md={20}>
						<Label label="Local API URL" spacing />
						<ControlledInput
							value={localServerUrl}
							onChange={(value) => setLocalServerUrl(value)}
							max={75}
						/>
					</Col>
					<Col xs={24} sm={4} md={4} className="button-column">
						<Button text="Save Settings" variant="primary" onClick={onSaveSettings} />
					</Col>
				</Row>
			</Spin>
		</Box>
	);
};
