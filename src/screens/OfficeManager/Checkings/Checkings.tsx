import { Tabs } from 'antd';
import { useBranches, useQueryParams } from 'hooks';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';

export const Checkings = () => {
	// CUSTOM HOOKS
	const {
		data: { branches },
	} = useBranches();

	// VARIABLES
	const {
		params: { branchId: currentBranchId },
		setQueryParams,
	} = useQueryParams();

	// METHODS
	useEffect(() => {
		if (branches && !currentBranchId) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const onTabClick = (branchId) => {
		setQueryParams({
			branchId,
			page: 1,
			pageSize: 10,
		});
	};

	return (
		<Content className="Checkings" title="Checkings">
			<Box padding>
				<Tabs
					activeKey={toString(currentBranchId)}
					type="card"
					destroyInactiveTabPane
					onTabClick={onTabClick}
				>
					{branches.map(({ name, id, online_url }) => (
						<Tabs.TabPane key={id} disabled={!online_url} tab={name}>
							{/* <BranchCheckings branchId={id} /> */}
						</Tabs.TabPane>
					))}
				</Tabs>
			</Box>
		</Content>
	);
};
