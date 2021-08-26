import { Spin } from 'antd';
import cn from 'classnames';
import React, { useCallback } from 'react';
import swal from 'sweetalert';
import { EMPTY_CELL } from '../../global/constants';
import { formatDateTimeExtended } from '../../utils/function';
import { Box, Button } from '../elements';
import './style.scss';

interface Props {
	branchDay: any;
	onConfirm: any;
	loading: boolean;
	classNames?: string;
	bordered?: boolean;
	disabled: boolean;
}

export const CashieringCard = ({
	branchDay,
	onConfirm,
	classNames,
	loading,
	bordered,
	disabled,
}: Props) => {
	const getTitle = useCallback(() => {
		if (branchDay?.datetime_ended) {
			return 'Day has been ended.';
		}
		if (branchDay) {
			return 'Day has been started.';
		}
		return EMPTY_CELL;
	}, [branchDay]);

	const getDate = useCallback(() => {
		if (branchDay?.datetime_ended) {
			return formatDateTimeExtended(branchDay?.datetime_ended);
		}
		if (branchDay) {
			return formatDateTimeExtended(branchDay?.datetime_created);
		}
		return null;
	}, [branchDay]);

	const confirm = () => {
		swal({
			title: 'Confirmation',
			text: `Are you sure you want to ${branchDay ? 'Close Day' : 'Open Day'}?`,
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
				onConfirm();
			}
		});
	};

	return (
		<Box
			className={cn('CashieringCard', classNames, {
				CashieringCard__bordered: bordered,
			})}
		>
			<Spin size="large" spinning={loading}>
				<div className="CashieringCard_container">
					<div>
						<p className="CashieringCard_title">{getTitle()}</p>
						<span className="CashieringCard_date">{getDate()}</span>
					</div>

					{!branchDay?.datetime_ended && (
						<Button
							text={branchDay ? 'Close Day' : 'Open Day'}
							variant="primary"
							onClick={confirm}
							disabled={disabled}
						/>
					)}
				</div>
			</Spin>
		</Box>
	);
};
