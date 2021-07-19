import React from 'react';
import { AddIcon } from '../../../../components';
import { Box, Button } from '../../../../components/elements';
import { formatDateTimeExtended } from '../../../../utils/function';

interface Props {
	onDailyCheck?: any;
	dateTimeRequested?: any;
}

export const DailyCheckCard = ({ onDailyCheck, dateTimeRequested }: Props) => (
	<Box className="DailyCheckCard">
		<div>
			<p className="DailyCheckCard_title">Daily Check</p>
			<span className="DailyCheckCard_date">
				{formatDateTimeExtended(dateTimeRequested)}
			</span>
		</div>

		<Button
			text="Input Daily Check"
			variant="primary"
			onClick={onDailyCheck}
			iconDirection="left"
			icon={<AddIcon />}
		/>
	</Box>
);
