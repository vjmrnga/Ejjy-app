import { Tabs } from 'antd';
import { toString } from 'lodash';
import React, { useEffect } from 'react';
import { Box } from '../../../../components/elements';
import { useBranches } from '../../../../hooks/useBranches';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { SalesBranch } from './SalesBranch';

export const SalesBranchSection = () => {
	// CUSTOM HOOKS
	const { branches } = useBranches();
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
		});
	};

	return (
		<Box>
			<Tabs
				type="card"
				className="PaddingHorizontal PaddingVertical"
				activeKey={toString(currentBranchId)}
				onTabClick={onTabClick}
				destroyInactiveTabPane
			>
				{branches.map(({ name, id, online_url }) => (
					<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
						<SalesBranch branchId={id} />
					</Tabs.TabPane>
				))}
			</Tabs>
		</Box>
	);
};
