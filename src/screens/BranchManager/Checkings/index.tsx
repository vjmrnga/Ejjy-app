import { Col, Radio, Row, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
import { Box, Label } from 'components/elements';
import { CheckingInfo } from 'components/info/CheckingInfo';
import dayjs from 'dayjs';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	productCheckingTypes,
} from 'global';
import { useProductChecks, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray, formatDateTime } from 'utils';
import { FulfillChecking } from './components/FulfillChecks';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Requested', dataIndex: 'datetimeRequested' },
	{ title: 'Date & Time Fulfilled', dataIndex: 'datetimeFulfilled' },
	{ title: 'Type', dataIndex: 'type', align: 'center' },
	{
		title: 'Fulfillment Status',
		dataIndex: 'fulfillmentStatus',
		align: 'center',
	},
	{ title: 'Status', dataIndex: 'status', align: 'center' },
];

export const Checkings = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { productChecks, total },
		isFetching: isFetchingProductChecks,
		error: productChecksErrors,
	} = useProductChecks({
		params: {
			isFilledUp:
				params?.type === productCheckingTypes.RANDOM ? true : undefined,
			...params,
		},
	});

	// METHODS
	useEffect(() => {
		const data = productChecks
			.filter((productCheck) => {
				if (
					productCheck.type === productCheckingTypes.DAILY &&
					!productCheck.datetime_fulfilled &&
					dayjs.tz(productCheck.datetime_created).isToday()
				) {
					// Hide check if:
					// 1. Daily type
					// 2. Unfulfilled
					// 3. Created today
					return false;
				}

				return true;
			})
			.map((productCheck) => {
				const { id, datetime_created, datetime_fulfilled, is_success } =
					productCheck;

				let status = <Tag color="yellow">Pending</Tag>;
				if (datetime_fulfilled) {
					status = is_success ? (
						<Tag color="green">Success</Tag>
					) : (
						<Tag color="red">Error</Tag>
					);
				}

				return {
					key: id,
					id: <Link to={`checkings/${id}`}>{id}</Link>,
					datetimeRequested: formatDateTime(datetime_created),
					datetimeFulfilled: datetime_fulfilled
						? formatDateTime(datetime_fulfilled)
						: EMPTY_CELL,
					type:
						productCheck.type === productCheckingTypes.DAILY ? (
							<Tag color="purple">Daily Check</Tag>
						) : (
							<Tag color="blue">Random Check</Tag>
						),
					fulfillmentStatus: datetime_fulfilled ? (
						<Tag color="green">Fulfilled</Tag>
					) : (
						<Tag color="orange">Unfulfilled</Tag>
					),
					status,
				};
			});

		setDataSource(data);
	}, [productChecks]);

	return (
		<Content title="Checkings">
			<CheckingInfo />

			<FulfillChecking />

			<Box>
				<TableHeader title="Checkings" />

				<Filter />

				<RequestErrors
					className="px-6"
					errors={convertIntoArray(productChecksErrors)}
					withSpaceBottom
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					loading={isFetchingProductChecks}
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
					scroll={{ x: 650 }}
				/>
			</Box>
		</Content>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="px-6 mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Radio.Group
					defaultValue={params.type || 'all'}
					options={[
						{ label: 'Daily', value: productCheckingTypes.DAILY },
						{ label: 'Random', value: productCheckingTypes.RANDOM },
						{ label: 'All', value: 'all' },
					]}
					optionType="button"
					onChange={(e) => {
						setQueryParams({ type: e.target.value }, { shouldResetPage: true });
					}}
				/>
			</Col>
		</Row>
	);
};
