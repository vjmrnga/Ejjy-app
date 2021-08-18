import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { CashieringCard } from '../../../../components/CashieringCard/CashieringCard';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import { IS_APP_LIVE } from '../../../../global/constants';
import { request } from '../../../../global/types';
import { useAuth } from '../../../../hooks/useAuth';
import { useBranchesDays } from '../../../../hooks/useBranchesDays';
import { convertIntoArray } from '../../../../utils/function';

interface BranchDayProps {
	branchId: number;
	isActive: boolean;
	disabled: boolean;
}

export const BranchDay = ({ branchId, isActive, disabled }: BranchDayProps) => {
	// STATES
	const [branchDay, setBranchDay] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		branchDay: latestBranchDay,
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status: branchesDaysStatus,
		errors: branchesDaysErrors,
		warnings: branchesDaysWarnings,
	} = useBranchesDays();

	// METHODS
	useEffect(() => {
		if (isActive) {
			getBranchDay(branchId);
		}
	}, [isActive]);

	useEffect(() => {
		if (latestBranchDay && dayjs(latestBranchDay.datetime_created)?.isToday()) {
			setBranchDay(latestBranchDay);
		}
	}, [latestBranchDay]);

	const onStartDay = () => {
		const onlineStartedById = IS_APP_LIVE ? user.id : null;
		const startedById = IS_APP_LIVE ? null : user.id;
		createBranchDay(branchId, startedById, onlineStartedById);
	};

	const onEndDay = () => {
		const onlineEndedById = IS_APP_LIVE ? user.id : null;
		const endedById = IS_APP_LIVE ? null : user.id;
		editBranchDay(branchId, branchDay.id, endedById, onlineEndedById);
	};

	return (
		<>
			<RequestErrors
				errors={convertIntoArray(branchesDaysErrors, 'Branch Day')}
				withSpaceBottom
			/>

			<RequestWarnings
				warnings={convertIntoArray(branchesDaysWarnings, 'Branch Day')}
				withSpaceBottom
			/>

			<CashieringCard
				classNames="BranchBalanceItem_cashieringCard"
				branchDay={branchDay}
				onConfirm={branchDay ? onEndDay : onStartDay}
				loading={branchesDaysStatus === request.REQUESTING}
				disabled={disabled}
				bordered
			/>
		</>
	);
};
