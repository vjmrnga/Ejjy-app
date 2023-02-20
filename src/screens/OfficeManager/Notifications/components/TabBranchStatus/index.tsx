import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader } from 'components';
import { MAX_PAGE_SIZE, NOTIFICATION_INTERVAL_MS } from 'global';
import { useBranches } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray } from 'utils';

const columns: ColumnsType = [
	{ title: 'Branch', dataIndex: 'branch' },
	{ title: 'Connectivity Status', dataIndex: 'connectivityStatus' },
];

export const TabBranchStatus = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { branches },
		isLoading: isFetchingBranches,
		error: branchesErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { refetchInterval: NOTIFICATION_INTERVAL_MS },
	});

	// METHODS
	useEffect(() => {
		const data = branches.map((branch) => ({
			key: branch.id,
			branch: branch?.name,
			connectivityStatus: branch.is_online ? (
				<Tag color="green">Online</Tag>
			) : (
				<Tag color="red">Offline</Tag>
			),
		}));

		setDataSource(data);
	}, [branches]);

	return (
		<>
			<TableHeader
				title="Branch Connectivity Status"
				wrapperClassName="pt-2 px-0"
			/>

			<RequestErrors errors={convertIntoArray(branchesErrors)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranches}
				pagination={false}
				bordered
			/>
		</>
	);
};
