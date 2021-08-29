import React, { useEffect } from 'react';
import { Content } from '../../../components';
import { CashieringCard } from '../../../components/CashieringCard/CashieringCard';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranches } from '../../../hooks/useBranches';
import { BackupServerUrlForm } from './components/BackupServerUrlForm';
import { LocalServerUrlForm } from './components/LocalServerUrlForm';
import { MachineReportTable } from './components/MachineReportTable';
import './style.scss';

export const Dashboard = () => {
	// CUSTOM HOOKS
	const { branch, getBranch, status: branchStatus } = useBranches();
	const { user } = useAuth();

	// METHODS
	useEffect(() => {
		getBranch(user?.branch?.id);
	}, []);

	return (
		<Content className="Dashboard" title="Dashboard">
			<BackupServerUrlForm
				branch={branch}
				loading={branchStatus === request.REQUESTING}
			/>

			<LocalServerUrlForm
				branch={branch}
				loading={branchStatus === request.REQUESTING}
			/>

			<CashieringCard branchId={user?.branch?.id} />

			<MachineReportTable />
		</Content>
	);
};
