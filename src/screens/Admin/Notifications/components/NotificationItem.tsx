import React from 'react';
import { Box } from '../../../../components/elements';
import '../style.scss';

interface Props {
	message: string;
	datetime: string;
}

export const NotificationItem = ({ message, datetime }: Props) => (
	<section className="NotificationItem">
		<Box>
			<span className="title">{message}</span>
			<span className="datetime">{datetime}</span>
		</Box>
	</section>
);
