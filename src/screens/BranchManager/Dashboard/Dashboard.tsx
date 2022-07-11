import { CashieringCard, Content } from 'components';
import React from 'react';
import { MachineReportTable } from './components/MachineReportTable';
import './style.scss';

export const Dashboard = () => {
	return (
		<Content className="Dashboard" title="Dashboard">
			<CashieringCard />

			<MachineReportTable />
		</Content>
	);
};
