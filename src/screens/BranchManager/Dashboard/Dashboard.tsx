/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from '../../../components';
import { CashieringCard } from '../../../components/CashieringCard/CashieringCard';
import { selectors as authSelectors } from '../../../ducks/auth';
import { IS_APP_LIVE } from '../../../global/constants';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useBranchesDays } from '../../../hooks/useBranchesDays';
import { BackupServerUrlForm } from './components/BackupServerUrlForm';
import { LocalServerUrlForm } from './components/LocalServerUrlForm';
import { MachineReportTable } from './components/MachineReportTable';
import './style.scss';

const Dashboard = () => {
	// CUSTOM HOOKS
	const {
		branchDay,
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status: branchDayStatus,
		errors: branchDayErrors,
	} = useBranchesDays();
	const { branch, getBranch, status: branchStatus } = useBranches();
	const user = useSelector(authSelectors.selectUser());

	// METHODS
	useEffect(() => {
		getBranchDay(user?.branch?.id);
		getBranch(user?.branch?.id);
	}, []);

	// Effect: Display errors from branch cashiering
	useEffect(() => {
		if (branchDayErrors?.length && branchDayStatus === request.ERROR) {
			message.error(branchDayErrors);
		}
	}, [branchDayErrors, branchDayStatus]);

	const onStartDay = () => {
		const onlineStartedById = IS_APP_LIVE ? user.id : null;
		const startedById = IS_APP_LIVE ? null : user.id;
		createBranchDay(user?.branch?.id, startedById, onlineStartedById);
	};

	const onEndDay = () => {
		const onlineEndedById = IS_APP_LIVE ? user.id : null;
		const endedById = IS_APP_LIVE ? null : user.id;
		editBranchDay(user?.branch?.id, branchDay.id, endedById, onlineEndedById);
	};

	return (
		<Container title="Dashboard">
			<section className="Dashboard">
				<BackupServerUrlForm branch={branch} loading={branchStatus === request.REQUESTING} />

				<LocalServerUrlForm branch={branch} loading={branchStatus === request.REQUESTING} />

				<CashieringCard
					branchDay={branchDay}
					onConfirm={branchDay ? onEndDay : onStartDay}
					loading={branchDayStatus === request.REQUESTING}
				/>

				<MachineReportTable />
			</section>
		</Container>
	);
};

export default Dashboard;
