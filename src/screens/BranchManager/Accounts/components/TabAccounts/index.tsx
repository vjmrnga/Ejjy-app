import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	RequestErrors,
	TableHeader,
	ViewAccountModal,
} from '../../../../../components';
import { Label } from '../../../../../components/elements';
import { SEARCH_DEBOUNCE_TIME } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { accountTypes } from '../../../../../global/types';
import { useAccounts } from '../../../../../hooks';
import { useQueryParams } from 'hooks';
import {
	convertIntoArray,
	formatDate,
	getFullName,
} from '../../../../../utils/function';
import '../../style.scss';
import { CreateAccountModal } from './CreateAccountModal';

const columns: ColumnsType = [
	{ title: 'Client Code', dataIndex: 'client_code' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Address (Home)', dataIndex: 'home_address' },
	{ title: 'Address (Business)', dataIndex: 'business_address' },
	{ title: 'Contact #', dataIndex: 'contact_number' },
	{ title: 'Date of Registration', dataIndex: 'datetime_created' },
];

export const TabAccounts = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(false);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		isFetching,
		data: { accounts, total },
		refetch: refetchAccounts,
		error,
	} = useAccounts({ params: queryParams });

	// METHODS
	useEffect(() => {
		const data = accounts.map((account) => ({
			client_code: (
				<Button type="link" onClick={() => setSelectedAccount(account)}>
					{account.id}
				</Button>
			),
			name: getFullName(account),
			home_address: account.home_address,
			business_address: account.business_address,
			contact_number: account.contact_number,
			datetime_created: formatDate(account.datetime_created),
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
					current: Number(queryParams.page) || 1,
					total,
					pageSize: Number(queryParams.pageSize) || 10,
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

			{isCreateModalVisible && (
				<CreateAccountModal
					onSuccess={refetchAccounts}
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
		<Row className="mb-4" gutter={[15, 15]}>
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
