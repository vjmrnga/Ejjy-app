import { Spin } from 'antd';
import { Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { useBranchDayRetrieve } from 'hooks';
import _ from 'lodash';
import React from 'react';
import { ReportsPerMachine } from 'screens/Shared/Dashboard/components/ReportsPerMachine';
import { convertIntoArray, getLocalBranchId } from 'utils';

export const Dashboard = () => {
	const {
		data: branchDay,
		isFetching: isFetchingBranchDay,
		error: branchDayError,
	} = useBranchDayRetrieve({
		params: { branchId: getLocalBranchId() },
	});

	return (
		<Content title="Dashboard">
			<Spin spinning={isFetchingBranchDay}>
				<Box>
					<RequestErrors
						errors={convertIntoArray(branchDayError)}
						withSpaceBottom
					/>

					<ReportsPerMachine
						branchId={getLocalBranchId()}
						isDisableZReadButton={_.isEmpty(branchDay?.datetime_ended)}
					/>
				</Box>
			</Spin>
		</Content>
	);
};
