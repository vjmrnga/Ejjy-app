import { Spin } from 'antd';
import React, { useCallback } from 'react';
import swal from 'sweetalert';
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

	const confirm = () => {
		swal({
			title: 'Confirmation',
			text: `Are you sure you want to ${branchDay ? 'End Day' : 'Start Day'}?`,
			icon: 'warning',
			buttons: {
				cancel: {
					text: 'Cancel',
					value: null,
					visible: true,
					closeModal: true,
				},
				confirm: {
					text: 'OK',
					value: true,
					visible: true,
					closeModal: true,
				},
			},
		}).then((value) => {
			if (value) {
				onClick();
			}
		});
	};

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
							onClick={confirm}
						/>
					)}
				</div>
			</Spin>
		</Box>
	);
};
