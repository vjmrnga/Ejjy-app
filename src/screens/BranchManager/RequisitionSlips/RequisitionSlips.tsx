/* eslint-disable no-underscore-dangle */
import { Col, Row, Select, Table } from 'antd';
import { upperFirst } from 'lodash';
import * as queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { formatDateTime, getRequisitionSlipStatus } from 'utils';
import { Content, TableHeader } from '../../../components';
import { Box, Label } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { requisitionSlipActionsOptionsWithAll } from '../../../global/options';
import { request, userTypes } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useRequisitionSlips } from '../../../hooks/useRequisitionSlips';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'datetime_created' },
	{ title: 'Requestor', dataIndex: 'requestor' },
	{ title: 'Request Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'action' },
	{ title: 'Progress', dataIndex: 'progress' },
];

export const RequisitionSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [pendingCount, setPendingCount] = useState(0);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		requisitionSlips,
		pageCount,
		currentPage,
		pageSize,
		getRequisitionSlipsExtended,
		status: requisitionSlipsStatus,
	} = useRequisitionSlips();
	const { getPendingCount } = useRequisitionSlips();

	const { setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			getRequisitionSlipsExtended(
				{
					...params,
					branchId: user?.branch?.id,
					status: params.status === 'all' ? null : params.status,
				},
				true,
			);

			getPendingCount({ userId: user.id }, ({ status, data: count }) => {
				if (status === request.SUCCESS) {
					setPendingCount(count);
				}
			});
		},
	});

	// METHODS
	useEffect(() => {
		const formattedProducts = requisitionSlips.map((requisitionSlip) => {
			const {
				id,
				type,
				requesting_user,
				progress,
				action: prAction,
			} = requisitionSlip;
			const { datetime_created, action } = prAction;
			const dateTime = formatDateTime(datetime_created);

			const isOwnRequisitionSlip =
				user?.branch?.id === requesting_user?.branch?.id;
			const _action = isOwnRequisitionSlip
				? getRequisitionSlipStatus(action, userTypes.BRANCH_MANAGER)
				: EMPTY_CELL;
			let _progress = progress
				? `${progress.current} / ${progress.total}`
				: EMPTY_CELL;
			_progress = isOwnRequisitionSlip ? _progress : EMPTY_CELL;

			return {
				id: <Link to={`/branch-manager/requisition-slips/${id}`}>{id}</Link>,
				datetime_created: dateTime,
				requestor: requesting_user?.branch?.name,
				type: upperFirst(type),
				action: _action,
				progress: _progress,
			};
		});

		setData(formattedProducts);
	}, [requisitionSlips]);

	return (
		<Content className="RequisitionSlips" title="Requisition Slips">
			<Box>
				<TableHeader
					buttonName="Create Requisition Slip"
					pending={pendingCount}
					onCreate={() => {
						history.push('/branch-manager/requisition-slips/create');
					}}
				/>

				<Filter
					setQueryParams={(params) => {
						setQueryParams(params, { shouldResetPage: true });
					}}
				/>

				<Table
					columns={columns}
					dataSource={data}
					loading={requisitionSlipsStatus === request.REQUESTING}
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
						pageSizeOptions: ['5', '10', '15'],
					}}
					scroll={{ x: 1000 }}
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
	const history = useHistory();
	const params = queryString.parse(history.location.search);

	return (
		<Row className="mb-4 PaddingHorizontal" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					defaultValue={params.status || 'all'}
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					optionFilterProp="children"
					style={{ width: '100%' }}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ status: value });
					}}
				>
					{requisitionSlipActionsOptionsWithAll.map(({ name, value }) => (
						<Select.Option key={value} value={value}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
