/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Container, Table, TableActions } from '../../../components';
import { Box } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { calculateTableHeight, formatDateTime, sleep } from '../../../utils/function';
import { useFailedTransfers } from '../hooks/useFailedTransfers';
import './style.scss';

const columns = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Count', dataIndex: 'count' },
	{ title: 'Action', dataIndex: 'actions' },
];

const Branches = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		failedTransfers,
		getFailedTansferCount,
		status: failedTransfersStatus,
	} = useFailedTransfers();
	const { branches, getBranches, status: branchesStatus } = useBranches();

	// EFFECTS
	useEffect(() => {
		getBranches();
	}, []);
	console.log('failed', failedTransfers);
	// Effect: Format branches to be rendered in Table
	useEffect(() => {
		const formattedBranches = branches.map((branch) => {
			const { id, name } = branch;

			return {
				name,
				count:
					failedTransfers?.[id]?.count >= 0 ? (
						<div>
							{failedTransfers?.[id]?.count}
							<small className="last-updated">
								Last Updated: {formatDateTime(failedTransfers?.[id]?.datetime)}
							</small>
						</div>
					) : (
						EMPTY_CELL
					),
				actions: (
					<TableActions
						onView={() => {
							getFailedTansferCount(
								{
									branchId: id,
								},
								({ errors, status }) => {
									if (status === request.ERROR) {
										message.error(errors);
									}
								},
							);
						}}
						onViewName="Get Count"
					/>
				),
			};
		});

		sleep(500).then(() => setData(formattedBranches));
	}, [branches, failedTransfers]);

	return (
		<Container title="Failed Transfers">
			<section className="FailedTransfers">
				<Box>
					<Table
						columns={columns}
						dataSource={data}
						scroll={{ y: calculateTableHeight(data.length), x: '100%' }}
						loading={[failedTransfersStatus, branchesStatus].includes(request.REQUESTING)}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default Branches;
