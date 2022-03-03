import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../../components';
import { Label } from '../../../../../components/elements';
import { SEARCH_DEBOUNCE_TIME } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { request } from '../../../../../global/types';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import { useSessions } from '../../../../../hooks/useSessions';
import { convertIntoArray } from '../../../../../utils/function';
import { ViewClientAccountModal } from '../ClientAccounts/ViewClientAccountModal';
import { CreateCreditRegistrationModal } from './CreateCreditRegistrationModal';

const columns: ColumnsType = [
	{ title: 'Client Code', dataIndex: 'client_code' },
	{ title: 'Client Name', dataIndex: 'client_name' },
	{ title: 'Credit Limit', dataIndex: 'credit_limit' },
	{ title: 'Total Balance', dataIndex: 'total_balance' },
	{ title: 'Date of Registration', dataIndex: 'date' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const ClientCreditRegistrations = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		sessions,
		pageCount,
		currentPage,
		pageSize,

		listSessions,
		status,
		errors,
		warnings,
	} = useSessions();

	const { params: queryParams, setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			listSessions(
				{
					...params,
				},
				true,
			);
		},
	});

	// METHODS

	return (
		<div className="ClientCreditRegistrations">
			<TableHeader
				title="Credit Registrations"
				buttonName="Create Credit Registration"
				onCreate={() => setIsCreateModalVisible(true)}
			/>

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<Table
				columns={columns}
				dataSource={data}
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

			{selectedAccount && (
				<ViewClientAccountModal
					account={selectedAccount}
					onClose={() => setSelectedAccount(null)}
				/>
			)}

			{isCreateModalVisible && (
				<CreateCreditRegistrationModal
					onSuccess={() => {}}
					onClose={() => setIsCreateModalVisible(false)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	params: any;
	setQueryParams: any;
}

const Filter = ({ params, setQueryParams }: FilterProps) => {
	const onSearchDebounced = useCallback(
		debounce((search) => {
			setQueryParams({ search });
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Row className="ClientCreditRegistrations_filter" gutter={[15, 15]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					defaultValue={params.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>
		</Row>
	);
};
