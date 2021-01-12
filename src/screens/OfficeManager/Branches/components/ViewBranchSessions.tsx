import React, { useEffect, useState } from 'react';
import { TableHeader, TableNormal } from '../../../../components';
import { EMPTY_CELL } from '../../../../global/constants';
import { formatDateTimeShortMonth } from '../../../../utils/function';

interface Props {
	sessions: any;
}

const columns = [{ name: 'User' }, { name: 'Machine' }, { name: 'Date & Time' }];

export const ViewBranchSessions = ({ sessions }: Props) => {
	// TODO Implement searching later on
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);

	// Effect: Format branch sessions to be rendered in Table
	useEffect(() => {
		const formattedBranchSession = sessions.map((session) => {
			const { user, branch_machine, datetime_started, datetime_ended } = session;

			return [
				{ isHidden: true }, // TODO: For searching functionality (payload)
				`${user.first_name} ${user.last_name}`,
				branch_machine.name,
				getDateTime(datetime_started, datetime_ended),
			];
		});

		setData(formattedBranchSession);
		setTableData(formattedBranchSession);
	}, [sessions]);

	const getDateTime = (datetime_started, datetime_ended) => {
		return (
			<div className="branch-session-column">
				<div className="first-row">
					<span className="label">Start: </span>
					<span className="value">
						{datetime_started ? formatDateTimeShortMonth(datetime_started) : EMPTY_CELL}
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
		<div className="ViewBranchSessions">
			<TableHeader title="Sessions" />

			<TableNormal columns={columns} data={tableData} />
		</div>
	);
};
