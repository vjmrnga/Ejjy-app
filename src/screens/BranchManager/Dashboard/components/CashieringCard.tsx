import { Spin } from 'antd';
import React, { useCallback } from 'react';
import { Box, Button } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { formatDateTimeExtended } from '../../../../utils/function';

interface Props {
	branchDay: any;
	onClick: any;
	loading: boolean;
}

export const CashieringCard = ({ branchDay, onClick, loading }: Props) => {
	const getTitle = useCallback(() => {
		if (branchDay?.datetime_ended) {
			return 'Day has been ended.';
		} else if (branchDay) {
			return 'Day has been started.';
		} else {
			return EMPTY_CELL;
		}
	}, [branchDay]);

	const getDate = useCallback(() => {
		if (branchDay?.datetime_ended) {
			return formatDateTimeExtended(branchDay?.datetime_ended);
		} else if (branchDay) {
			return formatDateTimeExtended(branchDay?.datetime_created);
		} else {
			return null;
		}
	}, [branchDay]);

	return (
		<Box>
			<Spin size="large" spinning={loading}>
				<div className="cashiering-container">
					<div>
						<p className="title">{getTitle()}</p>
						<span className="date">{getDate()}</span>
					</div>

					{!branchDay?.datetime_ended && (
						<Button
							text={branchDay ? 'End Day' : 'Start Day'}
							variant="primary"
							onClick={onClick}
						/>
					)}
				</div>
			</Spin>
		</Box>
	);
};
