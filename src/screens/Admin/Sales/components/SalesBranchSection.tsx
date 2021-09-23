import { Tabs } from 'antd';
import { toString } from 'lodash';
import * as queryString from 'query-string';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Box } from '../../../../components/elements';
import { useBranches } from '../../../../hooks/useBranches';
import { SalesBranch } from './SalesBranch';

export const SalesBranchSection = () => {
	// CUSTOM HOOKS
	const history = useHistory();
	const { branches } = useBranches();

	// VARIABLES
	const { branchId: currentBranchId } = queryString.parse(
		history.location.search,
	);

	// METHODS
	useEffect(() => {
		if (branches && !currentBranchId) {
			onTabClick(branches?.[0]?.id);
		}
	}, [branches, currentBranchId]);

	const onTabClick = (branchId) => {
		history.push(
			queryString.stringifyUrl({
				url: '',
				query: {
					...queryString.parse(history.location.search),
					branchId,
				},
			}),
		);
	};

	return (
		<Box>
			<Tabs
				className="PaddingHorizontal PaddingVertical"
				type="card"
				defaultActiveKey={toString(currentBranchId)}
				onTabClick={onTabClick}
			>
				{branches.map(({ name, id, online_url }) => (
					<Tabs.TabPane key={id} tab={name} disabled={!online_url}>
						<SalesBranch
							branchId={id}
							isActive={id === Number(currentBranchId)}
						/>
					</Tabs.TabPane>
				))}
			</Tabs>
		</Box>
	);
};
