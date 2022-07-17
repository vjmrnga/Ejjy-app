import { Col, Radio, Row } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
import { BadgePill, Box, Label } from 'components/elements';
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
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
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
			isFilledUp: true,
			type: productCheckingTypes.DAILY,
			...params,
		},
	});

	// METHODS
	useEffect(() => {
		const data = productChecks.map((productCheck) => {
			const { id, datetime_created, datetime_fulfilled, is_success } =
				productCheck;

			return {
				key: id,
				id: <Link to={`checkings/${id}`}>{id}</Link>,
				datetimeRequested: formatDateTime(datetime_created),
				datetimeFulfilled: datetime_fulfilled
					? formatDateTime(datetime_fulfilled)
					: EMPTY_CELL,
				status: is_success ? (
					<BadgePill label="Success" variant="primary" />
				) : (
					<BadgePill label="Error" variant="error" />
				),
			};
		});

		setDataSource(data);
	}, [productChecks]);

	return (
		<Content title="Checkings">
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
					defaultValue={params.type || productCheckingTypes.DAILY}
					options={[
						{ label: 'Daily', value: productCheckingTypes.DAILY },
						{ label: 'Random', value: productCheckingTypes.RANDOM },
						{ label: 'All', value: undefined },
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
