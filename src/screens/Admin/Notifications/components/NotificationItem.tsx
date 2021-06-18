/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Box } from '../../../../components/elements';
import '../style.scss';

export const NotificationItem = ({ message, datetime }) => {
	return (
		<section className="NotificationItem">
			<Box>
				<span className="title">{message}</span>
				<span className="datetime">{datetime}</span>
			</Box>
		</section>
	);
};
