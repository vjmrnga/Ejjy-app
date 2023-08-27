import { Content } from 'components';
import { Box } from 'components/elements';
import { ReportsPerMachine } from 'screens/Shared/Dashboard/components/ReportsPerMachine';
import { getLocalBranchId } from 'utils';
import React from 'react';

export const Dashboard = () => {
	return (
		<Content title="Dashboard">
			<Box>
				<ReportsPerMachine branchId={getLocalBranchId()} />
			</Box>
		</Content>
	);
};
