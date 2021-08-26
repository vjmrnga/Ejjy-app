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

const columns: ColumnsType = [
	{ title: 'Date & Time Requested', dataIndex: 'datetime_requested' },
	{ title: 'Action', dataIndex: 'action' },
];

export const Checking = () => {
	// STATES
	const [data, setData] = useState([]);
	const [dailyCheck, setDailyCheck] = useState(null);
	const [randomChecks, setRandomCheck] = useState([]);
	const [selectedProductCheck, setSelectedProductCheck] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { getProductChecks: getDailyCheck } = useProductChecks();
	const { getProductChecks: getRandomChecks, status: randomChecksStatus } =
		useProductChecks();

	// METHODS
	useEffect(() => {
		getDailyCheck(
			{
				assignedStoreId: user?.branch?.id,
				type: productCheckingTypes.DAILY,
				isFilledUp: false,
			},
			({ status, response }) => {
				if (status === request.SUCCESS) {
					setDailyCheck(response?.[0]);
				}
			},
		);

		getRandomChecks(
			{
				assignedStoreId: user?.branch?.id,
				type: productCheckingTypes.RANDOM,
				isFilledUp: false,
			},
			({ status, response }) => {
				if (status === request.SUCCESS) {
					setRandomCheck(response);
				}
			},
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
					pagination={false}
					loading={randomChecksStatus === request.REQUESTING}
				/>
			</Box>

			{selectedProductCheck && (
				<FulfillCheckModal
					branchId={user?.branch?.id}
					productCheck={selectedProductCheck}
					onClose={() => setSelectedProductCheck(null)}
				/>
			)}
		</Content>
	);
};
