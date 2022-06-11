import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchesDays } from '../../../../hooks/useBranchesDays';
import { convertIntoArray, formatDateTimeShortMonth } from 'utils';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user', key: 'user' },

	{ title: 'Date & Time', dataIndex: 'datetime', key: 'datetime' },
];

interface Props {
	branchId: any;
}

export const ViewBranchDays = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		branchDays,
		pageCount,
		pageSize,
		currentPage,

		listBranchDays,
		status,
		errors,
		warnings,
	} = useBranchesDays();

	// METHODS
	useEffect(() => {
		listBranchDays({ branchId, page: 1 });
	}, []);

	// Effect: Format branch days to be rendered in Table
	useEffect(() => {
		const formattedBranchDays = branchDays.map((branchDay) => {
			const { started_by, ended_by, datetime_created, datetime_ended } =
				branchDay;

			return {
				user: getUser(started_by, ended_by),
				datetime: getDateTime(datetime_created, datetime_ended),
			};
		});

		setData(formattedBranchDays);
	}, [branchDays]);

	const getUser = (startedBy, endedBy) => {
		const startedByUser = startedBy
			? `${startedBy.first_name} ${startedBy.last_name}`
			: EMPTY_CELL;
		const endedByUser = endedBy
			? `${endedBy.first_name} ${endedBy.last_name}`
			: EMPTY_CELL;

		return (
			<div className="branch-day-column">
				<div className="first-row">
					<span className="label">Open: </span>
					<span className="value">
						{startedBy ? startedByUser : EMPTY_CELL}
					</span>
				</div>
				<div>
					<span className="label">Close: </span>
					<span className="value">{endedBy ? endedByUser : EMPTY_CELL}</span>
				</div>
			</div>
		);
	};

	const getDateTime = (datetime_created, datetime_ended) => (
		<div className="branch-day-column">
			<div className="first-row">
				<span className="label">Open: </span>
				<span className="value">
					{datetime_created
						? formatDateTimeShortMonth(datetime_created)
						: EMPTY_CELL}
				</span>
			</div>
			<div>
				<span className="label">Close: </span>
				<span className="value">
					{datetime_ended
						? formatDateTimeShortMonth(datetime_ended)
						: EMPTY_CELL}
				</span>
			</div>
		</div>
	);

	const onPageChange = (page, newPageSize) => {
		listBranchDays(
			{ branchId, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<div className="ViewBranchDays">
			<TableHeader title="Days" />

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
