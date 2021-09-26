import { Col, Radio, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import * as queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RequestErrors, TableHeader } from '../../../../components';
import { BadgePill, Label } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { productCheckingTypes, request } from '../../../../global/types';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { convertIntoArray, formatDateTime } from '../../../../utils/function';
import { useProductChecks } from '../../../BranchManager/hooks/useProductChecks';
import '../style.scss';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Requested', dataIndex: 'datetime_requested' },
	{ title: 'Date & Time Fulfilled', dataIndex: 'datetime_fulfilled' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	branchId: any;
	isActive: boolean;
}

export const BranchCheckings = ({ branchId, isActive }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		productChecks,
		getProductChecks,
		pageCount,
		pageSize,
		currentPage,
		status,
		errors,
	} = useProductChecks();

	const { setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			if (isActive) {
				getProductChecks(params, true);
			}
		},
	});

	// METHODS
	useEffect(() => {
		setData(
			productChecks.map((productCheck) => {
				const { id, datetime_created, datetime_fulfilled, is_success } =
					productCheck;

				return {
					key: id,
					id: <Link to={`checkings/${branchId}/${id}`}>{id}</Link>,
					datetime_requested: formatDateTime(datetime_created),
					datetime_fulfilled: datetime_fulfilled
						? formatDateTime(datetime_fulfilled)
						: EMPTY_CELL,
					status: is_success ? (
						<BadgePill label="Success" variant="primary" />
					) : (
						<BadgePill label="Error" variant="error" />
					),
				};
			}),
		);
	}, [productChecks]);

	return (
		<div className="BranchCheckings">
			<TableHeader title="Checkings" />

			<Filter
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

			<RequestErrors
				errors={convertIntoArray(errors)}
				withSpaceTop
				withSpaceBottom
			/>

			<br />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 650 }}
				rowKey="key"
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={status === request.REQUESTING}
			/>
		</div>
	);
};

interface FilterProps {
	setQueryParams: any;
}
const Filter = ({ setQueryParams }: FilterProps) => {
	// CUSTOM HOOKS
	const history = useHistory();
	const params = queryString.parse(history.location.search);

	useEffect(() => {
		if (!params.type) {
			setQueryParams({ type: productCheckingTypes.DAILY });
		}
	}, []);

	return (
		<Row className="BranchCheckings_filter" gutter={[15, 15]}>
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
