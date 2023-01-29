import { Content, DashboardInfo } from 'components';
import { Box } from 'components/elements';
import React from 'react';
import { ReportsPerMachine } from 'screens/Shared/Dashboard/components/ReportsPerMachine';
import { getLocalBranchId } from 'utils';
import { BranchProductBalances } from './components/BranchProductBalances';

export const Dashboard = () => (
	<Content title="Dashboard">
		<DashboardInfo />

		<Box>
			<ReportsPerMachine branchId={getLocalBranchId()} />
		</Box>

		<BranchProductBalances />
	</Content>
);
