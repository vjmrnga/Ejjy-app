import { Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { Content } from '../../../components';
import { Box } from '../../../components/elements';
import { useBranches } from '../../../hooks/useBranches';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { BranchCheckings } from './components/BranchCheckings';

export const Checkings = () => {
	// CUSTOM HOOKS
	const { branches } = useBranches();

	// VARIABLES
	const {
		params: { currentBranchId },
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
					type="card"
					defaultActiveKey={toString(currentBranchId)}
					onTabClick={onTabClick}
				>
					{branches.map(({ name, id, online_url }) => (
						<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
							<BranchCheckings
								branchId={id}
								isActive={id === Number(currentBranchId)}
							/>
						</Tabs.TabPane>
					))}
				</Tabs>
			</Box>
		</Content>
	);
};
