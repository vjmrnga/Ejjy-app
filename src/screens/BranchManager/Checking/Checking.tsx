import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { AddButtonIcon, Content, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { request, productCheckingTypes } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { formatDateTime } from '../../../utils/function';
import { useProductChecks } from '../hooks/useProductChecks';
import { DailyCheckCard } from './components/DailyCheckCard';
import { FulfillCheckModal } from './components/FulfillCheckModal';
import './style.scss';
import { pageSizeOptions } from '../../../global/options';

const columns: ColumnsType = [
	{ title: 'Date & Time Requested', dataIndex: 'datetime_requested' },
	{ title: 'Actions', dataIndex: 'action' },
];

export const Checking = () => {
	// STATES
	const [data, setData] = useState([]);
	const [dailyCheck, setDailyCheck] = useState(null);
	const [selectedProductCheck, setSelectedProductCheck] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { getProductCheckDaily } = useProductChecks();
	const {
		productChecks: randomChecks,
		getProductChecks: getRandomChecks,
		pageCount,
		pageSize,
		currentPage,
		status: randomChecksStatus,
	} = useProductChecks();

	// METHODS
	useEffect(() => {
		getProductCheckDaily(
			{
				branchId: user?.branch?.id,
				type: productCheckingTypes.DAILY,
				isFilledUp: false,
			},
			({ status, response }) => {
				if (status === request.SUCCESS) {
					setDailyCheck(response);
				}
			},
		);

		getRandomChecks(
			{
				page: 1,
				branchId: user?.branch?.id,
				type: productCheckingTypes.RANDOM,
				isFilledUp: false,
				onlyOfToday: true,
			},
			true,
		);
	}, []);

	useEffect(() => {
		setData(
			randomChecks.map((randomCheck) => ({
				datetime_requested: formatDateTime(randomCheck?.datetime_created),
				action: (
					<AddButtonIcon
						tooltip="Fulfill random check"
						onClick={() => setSelectedProductCheck(randomCheck)}
					/>
				),
			})),
		);
	}, [randomChecks]);

	const onPageChange = (page, newPageSize) => {
		getRandomChecks(
			{
				branchId: user?.branch?.id,
				type: productCheckingTypes.RANDOM,
				isFilledUp: false,
				onlyOfToday: true,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<Content className="Checking" title="Checking">
			{dailyCheck && (
				<DailyCheckCard
					dateTimeRequested={dailyCheck?.datetime_created}
					onDailyCheck={() => {
						setSelectedProductCheck(dailyCheck);
					}}
				/>
			)}

			<Box>
				<TableHeader title="Random Checks" />
				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: onPageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					loading={randomChecksStatus === request.REQUESTING}
				/>
			</Box>

			{selectedProductCheck && (
				<FulfillCheckModal
					branchId={user?.branch?.id}
					productCheck={selectedProductCheck}
					onSuccess={() => setDailyCheck(null)}
					onClose={() => setSelectedProductCheck(null)}
				/>
			)}
		</Content>
	);
};
