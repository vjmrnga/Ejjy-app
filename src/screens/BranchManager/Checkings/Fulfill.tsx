import Table, { ColumnsType } from 'antd/lib/table';
import {
	AddButtonIcon,
	Breadcrumb,
	Content,
	FulfillCheckModal,
	RequestErrors,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	productCheckingTypes,
} from 'global';
import { useProductChecks, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTime } from 'utils/function';
import { DailyCheckCard } from './components/DailyCheckCard';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'Date & Time Requested', dataIndex: 'datetimeRequested' },
	{ title: 'Actions', dataIndex: 'action' },
];

export const FulfillChecking = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [dailyCheck, setDailyCheck] = useState(null);
	const [selectedProductCheck, setSelectedProductCheck] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { productChecks: dailyProductChecks },
		isFetching: isFetchingDailyProductChecks,
		error: dailyProductChecksErrors,
	} = useProductChecks({
		params: {
			isFilledUp: false,
			type: productCheckingTypes.DAILY,
		},
	});
	const {
		data: { productChecks: randomProductChecks, total },
		isFetching: isFetchingRandomProductChecks,
		error: randomProductChecksErrors,
	} = useProductChecks({
		params: {
			type: productCheckingTypes.RANDOM,
			isFilledUp: false,
			onlyOfToday: true,
			...params,
		},
	});

	// METHODS
	useEffect(() => {
		const data = randomProductChecks.map((randomCheck) => ({
			datetimeRequested: formatDateTime(randomCheck?.datetime_created),
			action: (
				<AddButtonIcon
					tooltip="Fulfill random check"
					onClick={() => setSelectedProductCheck(randomCheck)}
				/>
			),
		}));

		setDataSource(data);
	}, [randomProductChecks]);

	useEffect(() => {
		setDailyCheck(dailyProductChecks?.[0]);
	}, [dailyProductChecks]);

	return (
		<Content
			className="Checking"
			title="[FULFILL] Check"
			breadcrumb={
				<Breadcrumb
					items={[
						{ name: 'Checkings', link: '/branch-manager/checkings' },
						{ name: 'Fulfill' },
					]}
				/>
			}
		>
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

				<RequestErrors
					errors={[
						...convertIntoArray(
							dailyProductChecksErrors,
							'Daily Product Checks',
						),
						...convertIntoArray(
							randomProductChecksErrors,
							'Random Product Checks',
						),
					]}
					withSpaceBottom
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 650 }}
					pagination={{
						current: Number(params.page) || DEFAULT_PAGE,
						total,
						pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
						onChange: (page, newPageSize) => {
							setQueryParams({
								page,
								pageSize: newPageSize,
							});
						},
						disabled: !dataSource,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					loading={
						isFetchingRandomProductChecks || isFetchingDailyProductChecks
					}
				/>
			</Box>

			{selectedProductCheck && (
				<FulfillCheckModal
					productCheck={selectedProductCheck}
					onSuccess={() => setDailyCheck(null)}
					onClose={() => setSelectedProductCheck(null)}
				/>
			)}
		</Content>
	);
};
