import React, { useEffect, useState } from 'react';
import { TableHeader, TableNormal } from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';
import { formatDateTimeShortMonth } from '../../../../utils/function';

interface Props {
	branchDays: any;
}

const columns = [{ name: 'Branch' }, { name: 'User' }, { name: 'Date & Time' }];

export const ViewBranchDays = ({ branchDays }: Props) => {
	// States

	// TODO Implement searching later on
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);

	// Effect: Format branch days to be rendered in Table
	useEffect(() => {
		const formattedBranchDays = branchDays.map((branchDay) => {
			const { branch, started_by, ended_by, datetime_created, datetime_ended } = branchDay;

			return [
				{ isHidden: true }, // TODO: For searching functionality (payload)
				branch.name,
				getUser(started_by, ended_by),
				getDateTime(datetime_created, datetime_ended),
			];
		});
		setData(formattedBranchDays);
		setTableData(formattedBranchDays);
	}, [branchDays]);

	const getUser = (startedBy, endedBy) => {
		const startedByUser = `${startedBy.first_name} ${startedBy.last_name}`;
		const endedByUser = `${endedBy?.first_name} ${endedBy?.last_name}`;

		return (
			<div className="branch-day-column">
				<div className="first-row">
					<span className="label">Start: </span>
					<span className="value">{startedBy ? startedByUser : EMPTY_CELL}</span>
				</div>
				<div>
					<span className="label">End: </span>
					<span className="value">{endedBy ? endedByUser : EMPTY_CELL}</span>
				</div>
			</div>
		);
	};

	const getDateTime = (datetime_created, datetime_ended) => {
		return (
			<div className="branch-day-column">
				<div className="first-row">
					<span className="label">Start: </span>
					<span className="value">
						{datetime_created ? formatDateTimeShortMonth(datetime_created) : EMPTY_CELL}
					</span>
				</div>
				<div>
					<span className="label">End: </span>
					<span className="value">
						{datetime_ended ? formatDateTimeShortMonth(datetime_ended) : EMPTY_CELL}
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className="ViewBranchDays">
			<TableHeader title="Days" />

			<TableNormal columns={columns} data={tableData} />
		</div>
	);
};
