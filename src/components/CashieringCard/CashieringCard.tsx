import { Spin } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { RequestErrors, RequestWarnings } from '..';
import { EMPTY_CELL, IS_APP_LIVE } from '../../global/constants';
import { request } from '../../global/types';
import {
	useBranchesDayAuthorizationsCreate,
	useBranchesDayAuthorizationsRetrieve,
} from '../../hooks';
import { useAuth } from '../../hooks/useAuth';
import { useBranchesDays } from '../../hooks/useBranchesDays';
import { convertIntoArray, formatDateTimeExtended } from '../../utils/function';
import { Box, Button } from '../elements';
import './style.scss';

interface Props {
	branchId: number;
	className?: string;
	bordered?: boolean;
	disabled?: boolean;
	loading?: boolean;
	isAuthorization?: boolean;
}

export const CashieringCard = ({
	className,
	branchId,
	bordered,
	disabled,
	loading,
	isAuthorization,
}: Props) => {
	// STATES
	const [branchDay, setBranchDay] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status: branchesDaysStatus,
		errors: branchesDaysErrors,
		warnings: branchesDaysWarnings,
	} = useBranchesDays();
	const {
		data: branchDayAuthorization,
		isFetching: isFetchingBranchDayAuthorization,
	} = useBranchesDayAuthorizationsRetrieve({
		branchId,
	});
	const {
		mutate: createBranchDayAuthorization,
		isLoading: isCreatingBranchDayAuthorization,
	} = useBranchesDayAuthorizationsCreate(branchId);

	// METHODS
	useEffect(() => {
		if (!isAuthorization) {
			getBranchDay(branchId, onBranchDayResponse);
		}
	}, [isAuthorization]);

	useEffect(() => {
		if (branchDayAuthorization?.id && isAuthorization) {
			setBranchDay(branchDayAuthorization);
		}
	}, [branchDayAuthorization, isAuthorization]);

	const onBranchDayResponse = ({ status, response }) => {
		if (status === request.SUCCESS) {
			const date = dayjs.tz(response?.datetime_created);
			if (date?.isToday()) {
				setBranchDay(response);
			}
		}
	};

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

	const onStartDay = () => {
		const onlineStartedById = IS_APP_LIVE ? user.id : null;
		const startedById = IS_APP_LIVE ? null : user.id;

		if (isAuthorization) {
			createBranchDayAuthorization(
				{
					branchId,
					startedById,
					onlineStartedById,
				},
				{
					onSuccess: (data) => {
						setBranchDay(data);
					},
				},
			);
		} else {
			createBranchDay(
				{ branchId, startedById, onlineStartedById },
				onBranchDayResponse,
			);
		}
	};

	const onEndDay = () => {
		const onlineEndedById = IS_APP_LIVE ? user.id : null;
		const endedById = IS_APP_LIVE ? null : user.id;
		editBranchDay(
			{ id: branchDay.id, branchId, endedById, onlineEndedById },
			onBranchDayResponse,
		);
	};

	const onClick = () => {
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
				if (branchDay) {
					onEndDay();
				} else {
					onStartDay();
				}
			}
		});
	};

	return (
		<Box
			className={cn('CashieringCard', className, {
				CashieringCard__bordered: bordered,
			})}
		>
			<Spin
				spinning={
					branchesDaysStatus === request.REQUESTING ||
					isCreatingBranchDayAuthorization ||
					isFetchingBranchDayAuthorization ||
					loading
				}
			>
				<div className="CashieringCard_container">
					<RequestErrors
						errors={convertIntoArray(branchesDaysErrors)}
						withSpaceBottom
					/>

					<RequestWarnings
						warnings={convertIntoArray(branchesDaysWarnings)}
						withSpaceBottom
					/>

					<div>
						<p className="CashieringCard_title">{getTitle()}</p>
						<span className="CashieringCard_date">{getDate()}</span>
					</div>

					{!branchDay?.datetime_ended && (
						<Button
							text={branchDay ? 'Close Day' : 'Open Day'}
							variant="primary"
							onClick={onClick}
							disabled={disabled}
						/>
					)}
				</div>
			</Spin>
		</Box>
	);
};

CashieringCard.defaultProps = {
	className: undefined,
	bordered: false,
	disabled: false,
	loading: false,
};
