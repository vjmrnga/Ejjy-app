import { CashieringCard, Content, DashboardInfo } from 'components';
import { Box } from 'components/elements';
import React from 'react';
import { ReportsPerMachine } from 'screens/Shared/Dashboard/components/ReportsPerMachine';
import { getLocalBranchId } from 'utils';
import { BranchProductBalances } from './components/BranchProductBalances';

export const Dashboard = () => (
	<Content title="Dashboard">
		<DashboardInfo />

		<CashieringCard />

		<Box>
			<ReportsPerMachine branchId={getLocalBranchId()} />
		</Box>

		<BranchProductBalances />
	</Content>
);
