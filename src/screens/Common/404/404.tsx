/* eslint-disable react/jsx-wrap-multilines */
import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Error404 = () => {
	const history = useHistory();

	const handleBackHome = () => {
		history.replace('dashboard');
	};

	return (
		<Result
			extra={
				<Button type="primary" onClick={handleBackHome}>
					Back Home
				</Button>
			}
			status="404"
			subTitle="Sorry, the page you visited does not exist."
			title="404"
		/>
	);
};

export default Error404;
