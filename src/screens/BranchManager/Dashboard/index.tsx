import { CashieringCard, Content } from 'components';
import React from 'react';
import { BranchProductBalances } from './components/BranchProductBalances';
import { ReportsPerMachine } from './components/ReportsPerMachine';

export const Dashboard = () => (
	<Content title="Dashboard">
		<CashieringCard />

		<ReportsPerMachine />

		<BranchProductBalances />
	</Content>
);
