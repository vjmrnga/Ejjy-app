import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	Input,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModifyAccountModal,
	RequestErrors,
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
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	convertIntoArray,
	filterOption,
	formatDate,
	getFullName,
	isCUDShown,
} from 'utils';

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
	const { params, setQueryParams } = useQueryParams();
	const { user } = useAuth();
	const {
		data: { accounts, total },
		isFetching: isFetchingAccounts,
		error: accountError,
		refetch: refetchAccounts,
	} = useAccounts({ params });

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
				<Space>
					<Tooltip title="Edit">
						<Button
							disabled={disabled}
							icon={<EditOutlined />}
							type="primary"
							onClick={() => setSelectedAccountEdit(account)}
						/>
					</Tooltip>
				</Space>
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
					wrapperClassName="px-0"
					onCreate={() => setIsCreateModalVisible(true)}
					onCreateDisabled={disabled}
				/>
			)}

			<Filter />

			<RequestErrors errors={convertIntoArray(accountError)} withSpaceBottom />

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				loading={isFetchingAccounts}
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

const Filter = () => {
	const { params, setQueryParams } = useQueryParams();

	const onSearchDebounced = useCallback(
		_.debounce((search) => {
			setQueryParams({ search }, { shouldResetPage: true });
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
					className="w-100"
					filterOption={filterOption}
					optionFilterProp="children"
					value={params.type}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ type: value }, { shouldResetPage: true });
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
