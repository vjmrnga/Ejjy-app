import { CashieringCard, Content } from 'components';
import { useAuth } from 'hooks/useAuth';
import React from 'react';
import { MachineReportTable } from './components/MachineReportTable';
import './style.scss';

export const Dashboard = () => {
	// CUSTOM HOOKS
	const { user } = useAuth();

	return (
		<Content className="Dashboard" title="Dashboard">
			<CashieringCard branchId={user?.branch?.id} isAuthorization />

			<MachineReportTable />
		</Content>
	);
};
