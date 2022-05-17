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
import { Link, useHistory } from 'react-router-dom';
import { convertIntoArray, formatDateTime } from 'utils/function';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Requested', dataIndex: 'datetimeRequested' },
	{ title: 'Date & Time Fulfilled', dataIndex: 'datetimeFulfilled' },
	{ title: 'Status', dataIndex: 'status' },
];

export const Checkings = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
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
		const formattedProductChecks = productChecks.map((productCheck) => {
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

		setDataSource(formattedProductChecks);
	}, [productChecks]);

	return (
		<Content className="Checkings" title="Checkings">
			<Box>
				<TableHeader
					title="Checkings"
					buttonName="Fulfill Check"
					onCreate={() => {
						history.push('/branch-manager/checkings/fulfill');
					}}
				/>

				<Filter
					setQueryParams={(params) => {
						setQueryParams(params, { shouldResetPage: true });
					}}
				/>

				<RequestErrors
					className="px-6"
					errors={convertIntoArray(productChecksErrors)}
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
					loading={isFetchingProductChecks}
				/>
			</Box>
		</Content>
	);
};

interface FilterProps {
	setQueryParams: any;
}
const Filter = ({ setQueryParams }: FilterProps) => {
	// CUSTOM HOOKS
	const { params } = useQueryParams();

	return (
		<Row className="px-6 mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Radio.Group
					optionType="button"
					options={[
						{ label: 'Daily', value: productCheckingTypes.DAILY },
						{ label: 'Random', value: productCheckingTypes.RANDOM },
					]}
					onChange={(e) => {
						setQueryParams({ type: e.target.value });
					}}
					defaultValue={params.type || productCheckingTypes.DAILY}
				/>
			</Col>
		</Row>
	);
};
