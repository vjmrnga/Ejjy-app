import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	TableActions,
	TableHeader,
	ViewAccountModal,
} from 'components';
import { ModifyCreditRegistrationModal } from 'components/';
import { Label } from 'components/elements';
import { pageSizeOptions, SEARCH_DEBOUNCE_TIME } from 'global';
import { useCreditRegistrations, useQueryParams } from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { accountTabs } from 'screens/BranchManager/Accounts/data';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
	getFullName,
} from 'utils/function';

const columns: ColumnsType = [
	{ title: 'Client Code', dataIndex: 'clientCode' },
	{ title: 'Client Name', dataIndex: 'clientName' },
	{ title: 'Credit Limit', dataIndex: 'creditLimit' },
	{ title: 'Total Balance', dataIndex: 'totalBalance' },
	{ title: 'Date of Registration', dataIndex: 'datetimeCreated' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabCreditRegistrations = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedCreditRegistration, setSelectedCreditRegistration] =
		useState(null);
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		isFetching,
		data: { creditRegistrations, total },
		refetch: refetchCreditRegistrations,
		error,
	} = useCreditRegistrations({ params: queryParams });

	// METHODS
	useEffect(() => {
		const data = creditRegistrations.map((creditRegistration) => {
			const { id, account, credit_limit, total_balance } = creditRegistration;

			return {
				key: id,
				clientCode: (
					<Button type="link" onClick={() => setSelectedAccount(account)}>
						{account.id}
					</Button>
				),
				clientName: getFullName(account),
				creditLimit: formatInPeso(credit_limit),
				totalBalance: formatInPeso(total_balance),
				datetimeCreated: formatDate(account.datetime_created),
				actions: (
					<TableActions
						onView={() =>
							setQueryParams(
								{
									tab: accountTabs.CREDIT_TRANSACTIONS,
									payor: JSON.stringify(creditRegistration),
								},
								{ shouldResetPage: true },
							)
						}
						onViewName="View Credit Transactions"
						onEdit={() => {
							setSelectedCreditRegistration(creditRegistration);
						}}
					/>
				),
			};
		});

		setDataSource(data);
	}, [creditRegistrations]);

	return (
		<div>
			<TableHeader
				title="Credit Account"
				buttonName="Create Credit Account"
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

			{(isCreateModalVisible || selectedCreditRegistration) && (
				<ModifyCreditRegistrationModal
					creditRegistration={selectedCreditRegistration}
					onSuccess={refetchCreditRegistrations}
					onClose={() => {
						setIsCreateModalVisible(false);
						setSelectedCreditRegistration(null);
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
		</Row>
	);
};
