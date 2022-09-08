import { Button, Result } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';

const NetworkError = () => {
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
				extra={
					<Button type="primary" onClick={() => window.location.reload()}>
						Reconnect
					</Button>
				}
				status="500"
				subTitle="Cannot connect to the server."
				title="Server Error"
			/>
		</div>
	);
};

export default NetworkError;
