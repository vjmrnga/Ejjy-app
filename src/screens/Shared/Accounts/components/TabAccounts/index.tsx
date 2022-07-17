import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Select, Table, Tag } from 'antd';
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
import { useAccounts, useAuth, useQueryParams } from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { convertIntoArray, formatDate, getFullName, isCUDShown } from 'utils';

interface Props {
	disabled: boolean;
}

export const TabAccounts = ({ disabled }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedAccountEdit, setSelectedAccountEdit] = useState(null);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const { user } = useAuth();
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
				<Link to={`accounts/${account.id}`}>{account.account_code}</Link>
			),
			name: getFullName(account),
			homeAddress: account.home_address,
			businessAddress: account.business_address,
			contactNumber: account.contact_number,
			datetimeCreated: formatDate(account.datetime_created),
			isPointSystemEligible: account.is_point_system_eligible ? (
				<Tag color="green">Yes</Tag>
			) : (
				<Tag color="red">No</Tag>
			),
			actions: (
				<TableActions
					areButtonsDisabled={disabled}
					onEdit={() => {
						setSelectedAccountEdit(account);
					}}
				/>
			),
		}));

		setDataSource(data);
	}, [accounts, disabled]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Client Code', dataIndex: 'clientCode' },
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Address (Home)', dataIndex: 'homeAddress' },
			{ title: 'Address (Business)', dataIndex: 'businessAddress' },
			{ title: 'Contact #', dataIndex: 'contactNumber' },
			{ title: 'Date of Registration', dataIndex: 'datetimeCreated' },
			{
				title: 'Loyalty Membership',
				dataIndex: 'isPointSystemEligible',
				align: 'center',
			},
		];

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	return (
		<div>
			{isCUDShown(user.user_type) && (
				<TableHeader
					buttonName="Create Account"
					title="Accounts"
					onCreate={() => setIsCreateModalVisible(true)}
					onCreateDisabled={disabled}
				/>
			)}

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				loading={isFetching}
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
				scroll={{ x: 1000 }}
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
					onClose={() => {
						setIsCreateModalVisible(false);
						setSelectedAccountEdit(null);
					}}
					onSuccess={refetchAccounts}
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
					defaultValue={params.search}
					prefix={<SearchOutlined />}
					allowClear
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Select
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					optionFilterProp="children"
					style={{ width: '100%' }}
					value={params.type}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ type: value });
					}}
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
