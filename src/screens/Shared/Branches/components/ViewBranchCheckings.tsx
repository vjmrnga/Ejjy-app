import { Col, Radio, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RequestErrors, TableHeader } from '../../../../components';
import { BadgePill, Label } from '../../../../components/elements';
import { pageSizeOptions } from '../../../../global/options';
import { productCheckingTypes, request } from '../../../../global/types';
import {
	convertIntoArray,
	formatDateTime,
	getUrlPrefix,
} from '../../../../utils/function';
import { useProductChecks } from '../../../BranchManager/hooks/useProductChecks';
import { useAuth } from '../../../../hooks/useAuth';
import { EMPTY_CELL } from '../../../../global/constants';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Requested', dataIndex: 'datetime_requested' },
	{ title: 'Date & Time Fulfilled', dataIndex: 'datetime_fulfilled' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	branchId: any;
}

export const ViewBranchCheckings = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [type, setType] = useState(productCheckingTypes.DAILY);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		productChecks,
		getProductChecks,
		pageCount,
		pageSize,
		currentPage,
		status,
		errors,
	} = useProductChecks();

	// METHODS
	useEffect(() => {
		getProductChecks(
			{
				branchId,
				type,
				page: 1,
			},
			true,
		);
	}, []);

	useEffect(() => {
		setData(
			productChecks.map((productCheck) => {
				const { id, datetime_created, datetime_fulfilled, is_success } =
					productCheck;

				return {
					key: id,
					id: (
						<Link
							to={`${getUrlPrefix(
								user.user_type,
							)}/branches/${branchId}/product-checks/${id}`}
						>
							{id}
						</Link>
					),
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

	const onSelectType = (value) => {
		getProductChecks(
			{
				branchId,
				type: value,
				page: 1,
			},
			true,
		);

		setType(value);
	};

	const onPageChange = (page, newPageSize) => {
		getProductChecks(
			{
				branchId,
				type,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<div className="ViewBranchCheckings">
			<TableHeader title="Checkings" />

			<RequestErrors errors={convertIntoArray(errors)} />

			<Filter onSelectType={onSelectType} />

			<br />

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
				loading={status === request.REQUESTING}
			/>
		</div>
	);
};

interface FilterProps {
	onSelectType: any;
}
const Filter = ({ onSelectType }: FilterProps) => (
	<Row className="mb-4" gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Type" spacing />
			<Radio.Group
				optionType="button"
				options={[
					{ label: 'Daily', value: productCheckingTypes.DAILY },
					{ label: 'Random', value: productCheckingTypes.RANDOM },
				]}
				onChange={(e) => {
					const { value } = e.target;
					onSelectType(value);
				}}
				defaultValue={productCheckingTypes.DAILY}
			/>
		</Col>
	</Row>
);
