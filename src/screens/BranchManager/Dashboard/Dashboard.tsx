/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container } from '../../../components';
import { CashieringCard } from '../../../components/CashieringCard/CashieringCard';
import { selectors as authSelectors } from '../../../ducks/auth';
import { request } from '../../../global/types';
import { useBranchesDays } from '../../../hooks/useBranchesDays';
import { useBranches } from '../../OfficeManager/hooks/useBranches';
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
		createBranchDay(user?.branch?.id, user.id);
	};

	const onEndDay = () => {
		editBranchDay(user?.branch?.id, branchDay.id, user.id);
	};

	return (
		<Container title="Dashboard">
			<section className="Dashboard">
				<BackupServerUrlForm branch={branch} loading={branchStatus === request.REQUESTING} />

				<LocalServerUrlForm branch={branch} loading={branchStatus === request.REQUESTING} />

				<CashieringCard
					branchDay={branchDay}
					onClick={branchDay ? onEndDay : onStartDay}
					loading={branchDayStatus === request.REQUESTING}
				/>

				<MachineReportTable />
			</section>
		</Container>
	);
};

export default Dashboard;
