import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../components';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { useSessions } from '../../../../hooks/useSessions';
import { convertIntoArray } from '../../../../utils/function';
import '../style.scss';
import { ViewClientAccountModal } from './ClientAccounts/ViewClientAccountModal';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Client Code', dataIndex: 'client_code' },
	{ title: 'Invoice Number', dataIndex: 'invoice_number' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Authorizer', dataIndex: 'authorizer' },
];

export const ClientCreditTransactions = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState(false);

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
		<div className="ClientCreditTransactions">
			<TableHeader title="Credit Transactions" />

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
		</div>
	);
};
