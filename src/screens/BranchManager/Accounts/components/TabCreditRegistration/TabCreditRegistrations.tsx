import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../../../components';
import { Label } from '../../../../../components/elements';
import { SEARCH_DEBOUNCE_TIME } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { useCreditRegistrations } from '../../../../../hooks';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
} from '../../../../../utils/function';
import { ViewAccountModal } from '../TabAccounts/ViewAccountModal';
import { CreateCreditRegistrationModal } from './CreateCreditRegistrationModal';

const columns: ColumnsType = [
	{ title: 'Client Code', dataIndex: 'client_code' },
	{ title: 'Client Name', dataIndex: 'client_name' },
	{ title: 'Credit Limit', dataIndex: 'credit_limit' },
	{ title: 'Total Balance', dataIndex: 'total_balance' },
	{ title: 'Date of Registration', dataIndex: 'datetime_created' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabCreditRegistrations = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(false);
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
				client_code: (
					<Button type="link" onClick={() => setSelectedAccount(account)}>
						{account.id}
					</Button>
				),
				client_name: `${account.first_name} ${account.last_name}`,
				credit_limit: formatInPeso(credit_limit),
				total_balance: formatInPeso(total_balance),
				datetime_created: formatDate(account.datetime_created),
				actions: (
					<TableActions
						onView={() => {}}
						onViewName="View Credit Transactions"
					/>
				),
			};
		});

		setDataSource(data);
	}, [creditRegistrations]);

	return (
		<div>
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

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				rowKey="key"
				columns={columns}
				dataSource={dataSource}
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
				<CreateCreditRegistrationModal
					onSuccess={refetchCreditRegistrations}
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
		<Row className="TabCreditRegistrations_filter" gutter={[15, 15]}>
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
