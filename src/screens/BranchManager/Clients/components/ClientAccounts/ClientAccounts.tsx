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
import '../../style.scss';
import { CreateAccountModal } from './CreateAccountModal';
import { ViewClientAccountModal } from './ViewClientAccountModal';

const columns: ColumnsType = [
	{ title: 'Client Code', dataIndex: 'client_code' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Address (Home)', dataIndex: 'address_home' },
	{ title: 'Address (Business)', dataIndex: 'address_business' },
	{ title: 'Contact #', dataIndex: 'contact_num' },
	{ title: 'Date of Registration', dataIndex: 'date' },
];

export const ClientAccounts = () => {
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
		<div className="ClientAccounts">
			<TableHeader
				title="Accounts"
				buttonName="Create Account"
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
				<CreateAccountModal
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
		<Row className="ClientAccounts_filter" gutter={[15, 15]}>
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
