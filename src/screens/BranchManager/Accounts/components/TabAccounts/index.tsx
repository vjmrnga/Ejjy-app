import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModifyAccountModal,
	RequestErrors,
	TableActions,
	TableHeader,
	ViewAccountModal,
} from 'components';
import { Label } from 'components/elements';
import {
	accountTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
} from 'global';
import { useAccounts, useQueryParams } from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray, formatDate, getFullName } from 'utils/function';

const columns: ColumnsType = [
	{ title: 'Client Code', dataIndex: 'clientCode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Address (Home)', dataIndex: 'homeAddress' },
	{ title: 'Address (Business)', dataIndex: 'businessAddress' },
	{ title: 'Contact #', dataIndex: 'contactNumber' },
	{ title: 'Date of Registration', dataIndex: 'datetimeCreated' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabAccounts = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedAccountEdit, setSelectedAccountEdit] = useState(null);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { accounts, total },
		isFetching,
		error,
		refetch: refetchAccounts,
	} = useAccounts({ params: queryParams });

	// METHODS
	useEffect(() => {
		const data = accounts.map((account) => ({
			key: account.id,
			clientCode: (
				<Button type="link" onClick={() => setSelectedAccount(account)}>
					{account.id}
				</Button>
			),
			name: getFullName(account),
			homeAddress: account.home_address,
			businessAddress: account.business_address,
			contactNumber: account.contact_number,
			datetimeCreated: formatDate(account.datetime_created),
			actions: (
				<TableActions
					onEdit={() => {
						setSelectedAccountEdit(account);
					}}
				/>
			),
		}));

		setDataSource(data);
	}, [accounts]);

	return (
		<div>
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

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
				pagination={{
					current: Number(queryParams.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(queryParams.pageSize) || DEFAULT_PAGE_SIZE,
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
				loading={isFetching}
			/>

			{selectedAccount && (
				<ViewAccountModal
					account={selectedAccount}
					onClose={() => setSelectedAccount(null)}
				/>
			)}

			{(isCreateModalVisible || selectedAccountEdit) && (
				<ModifyAccountModal
					account={selectedAccountEdit}
					onSuccess={refetchAccounts}
					onClose={() => {
						setIsCreateModalVisible(false);
						setSelectedAccountEdit(null);
					}}
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
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					defaultValue={params.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Select
					style={{ width: '100%' }}
					value={params.type}
					onChange={(value) => {
						setQueryParams({ type: value });
					}}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					<Select.Option
						key={accountTypes.PERSONAL}
						value={accountTypes.PERSONAL}
					>
						Personal
					</Select.Option>
					<Select.Option
						key={accountTypes.CORPORATE}
						value={accountTypes.CORPORATE}
					>
						Corporate
					</Select.Option>
					<Select.Option
						key={accountTypes.EMPLOYEE}
						value={accountTypes.EMPLOYEE}
					>
						Employee
					</Select.Option>
					<Select.Option
						key={accountTypes.GOVERNMENT}
						value={accountTypes.GOVERNMENT}
					>
						Government
					</Select.Option>
				</Select>
			</Col>
		</Row>
	);
};
