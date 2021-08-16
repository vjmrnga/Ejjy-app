import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';
import { request } from '../../../../global/types';
import { useSessions } from '../../../../hooks/useSessions';
import {
	convertIntoArray,
	formatDateTimeShortMonth,
} from '../../../../utils/function';
import { pageSizeOptions } from '../../../../global/options';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user', key: 'user' },
	{ title: 'Machine', dataIndex: 'machine', key: 'machine' },
	{ title: 'Date & Time', dataIndex: 'datetime', key: 'datetime' },
];

interface Props {
	branchId: any;
}

export const ViewBranchSessions = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);

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

	// METHODS
	useEffect(() => {
		listSessions({ branchId, page: 1 });
	}, []);

	// Effect: Format branch sessions to be rendered in Table
	useEffect(() => {
		const formattedBranchSession = sessions.map((session) => {
			const { user, branch_machine, datetime_started, datetime_ended } =
				session;

			return {
				user: `${user.first_name} ${user.last_name}`,
				machine: branch_machine.name,
				datetime: getDateTime(datetime_started, datetime_ended),
			};
		});

		setData(formattedBranchSession);
	}, [sessions]);

	const getDateTime = (datetime_started, datetime_ended) => (
		<div className="branch-session-column">
			<div className="first-row">
				<span className="label">Start: </span>
				<span className="value">
					{datetime_started
						? formatDateTimeShortMonth(datetime_started)
						: EMPTY_CELL}
				</span>
			</div>
			<div>
				<span className="label">End: </span>
				<span className="value">
					{datetime_ended
						? formatDateTimeShortMonth(datetime_ended)
						: EMPTY_CELL}
				</span>
			</div>
		</div>
	);

	const onPageChange = (page, newPageSize) => {
		listSessions(
			{ branchId, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<div className="ViewBranchSessions">
			<TableHeader title="Sessions" />

			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 650 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: onPageChange,
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={status === request.REQUESTING}
			/>
		</div>
	);
};
