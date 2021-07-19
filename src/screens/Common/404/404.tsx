/* eslint-disable react/jsx-wrap-multilines */
import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Error404 = () => {
	const history = useHistory();

	const onBackHome = () => {
		history.replace('dashboard');
	};

	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Button type="primary" onClick={onBackHome}>
					Back Home
				</Button>
			}
		/>
	);
};

export default Error404;
