import { message, Spin, Table } from 'antd';
import cn from 'classnames';
import {
	AddButtonIcon,
	CancelButtonIcon,
	Content,
	DetailsRow,
	DetailsSingle,
	RequestErrors,
} from 'components';
import { Box, Select } from 'components/elements';
import { RequestWarnings } from 'components/RequestWarnings/RequestWarnings';
import dayjs from 'dayjs';

import { request, userTypes } from 'global';
import { useBranchMachines } from 'hooks';

import { useUsers } from 'hooks/useUsers';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { convertIntoArray } from 'utils/function';
import './style.scss';

const columns = [
	{ title: 'Date', dataIndex: 'date' },
	{ title: 'Day', dataIndex: 'day' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const BRANCH_USER_TYPES = [
	userTypes.BRANCH_MANAGER,
	userTypes.BRANCH_PERSONNEL,
];

interface Props {
	match: any;
}

export const AssignUser = ({ match }: Props) => {
	return null;
	// // STATES
	// const [data, setData] = useState([]);

	// // CUSTOM HOOKS
	// const userId = match?.params?.id;
	// const history = useHistory();
	// const { user, getOnlineUserById, status: userStatus } = useUsers();
	// const {
	// 	data: { branchMachines },
	// 	isFetching: isFetchingBranchMachines,
	// 	error: branchesMachinesErrors,
	// } = useBranchMachines();
	// const {
	// 	cashieringAssignments,
	// 	getCashieringAssignmentsByUserId,
	// 	createCashieringAssignment,
	// 	editCashieringAssignment,
	// 	removeCashieringAssignment,
	// 	status: cashieringAssignmentsStatus,
	// 	errors: cashieringAssignmentsErrors,
	// 	warnings: cashieringAssignmentsWarnings,
	// 	recentRequest: cashieringAssignmentsRecentRequest,
	// } = useCashieringAssignments();

	// // METHODS
	// useEffect(() => {
	// 	getOnlineUserById(userId, ({ status, data: userData }) => {
	// 		if (status === request.ERROR) {
	// 			history.replace('/404');
	// 		} else if (
	// 			status === request.SUCCESS &&
	// 			BRANCH_USER_TYPES.includes(userData?.user_type)
	// 		) {
	// 			const branchId = userData?.branch?.id;
	// 			getCashieringAssignmentsByUserId({
	// 				userId,
	// 				branchId,
	// 			});
	// 		}
	// 	});
	// }, []);

	// // Effect: Format cashiering assignments
	// useEffect(() => {
	// 	if (user && cashieringAssignments && branchMachines) {
	// 		const today = dayjs();
	// 		const days = getDays();
	// 		const machineOptions = getMachineOptions();

	// 		const formattedAssignments = days.map((item) => {
	// 			const isDateAfter = today.isAfter(item.date);
	// 			const assignment = cashieringAssignments.find((ca) =>
	// 				dayjs.tz(ca.date, 'YYYY-MM-DD').isSame(item.date, 'date'),
	// 			);

	// 			return {
	// 				date: item.display,
	// 				day: item.day,
	// 				actions: assignment ? (
	// 					<div className="AssignUsers_machineSelection">
	// 						<Select
	// 							classNames="AssignUsers_machineSelection_select"
	// 							options={machineOptions}
	// 							placeholder="Cashiering Machines"
	// 							value={assignment.branch_machine_id}
	// 							onChange={(value) => onChangeAssignment(assignment.id, value)}
	// 							disabled={isDateAfter}
	// 						/>
	// 						{!isDateAfter && (
	// 							<CancelButtonIcon
	// 								tooltip="Remove"
	// 								onClick={() => onRemoveAssignment(assignment.id)}
	// 							/>
	// 						)}
	// 					</div>
	// 				) : (
	// 					<AddButtonIcon
	// 						classNames={cn({ AssignUsers_btnAssign__disabled: isDateAfter })}
	// 						tooltip="Assign"
	// 						onClick={() => onAssign(item.date, branchMachines?.[0]?.id)}
	// 					/>
	// 				),
	// 			};
	// 		});

	// 		setData(formattedAssignments);
	// 	}
	// }, [user, cashieringAssignments, branchMachines]);

	// const onAssign = (date, branchMachineId) => {
	// 	if (branchMachines.length) {
	// 		createCashieringAssignment({
	// 			user_id: userId,
	// 			branchId: user?.branch?.id,
	// 			branch_machine_id: branchMachineId,
	// 			date: date.format('YYYY-MM-DD'),
	// 		});
	// 	} else {
	// 		message.error('There is no branch machines fetched.');
	// 	}
	// };

	// const onChangeAssignment = (assignmentId, branchMachineId) => {
	// 	editCashieringAssignment({
	// 		id: assignmentId,
	// 		branchId: user?.branch?.id,
	// 		branch_machine_id: Number(branchMachineId),
	// 	});
	// };

	// const onRemoveAssignment = (assignmentId) => {
	// 	removeCashieringAssignment({
	// 		id: assignmentId,
	// 		branchId: user?.branch?.id,
	// 	});
	// };

	// const getDays = useCallback(() => {
	// 	const numberOfDays = dayjs().daysInMonth();
	// 	const days = [];
	// 	const today = dayjs().date();

	// 	for (let i = today; i <= numberOfDays; i += 1) {
	// 		const date = dayjs().date(i);
	// 		days.push({
	// 			date,
	// 			display: date.format('MMM D, YYYY'),
	// 			day: date.format('ddd'),
	// 		});
	// 	}

	// 	for (let i = 1; i < today; i += 1) {
	// 		const date = dayjs().date(i);
	// 		days.push({
	// 			date,
	// 			display: date.format('MMM D, YYYY'),
	// 			day: date.format('ddd'),
	// 		});
	// 	}

	// 	return days;
	// }, []);

	// const getMachineOptions = useCallback(
	// 	() =>
	// 		branchMachines.map((machine) => ({
	// 			name: machine.name,
	// 			value: machine.id,
	// 		})),
	// 	[branchMachines],
	// );

	// const isFetching = useCallback(
	// 	() =>
	// 		(cashieringAssignmentsStatus === request.REQUESTING &&
	// 			cashieringAssignmentsRecentRequest ===
	// 				types.GET_CASHIERING_ASSIGNMENTS_BY_USER_ID) ||
	// 		userStatus === request.REQUESTING ||
	// 		isFetchingBranchMachines,
	// 	[
	// 		cashieringAssignmentsStatus,
	// 		cashieringAssignmentsRecentRequest,
	// 		userStatus,
	// 		isFetchingBranchMachines,
	// 	],
	// );

	// const isChangingAssignments = useCallback(
	// 	() =>
	// 		cashieringAssignmentsStatus === request.REQUESTING &&
	// 		cashieringAssignmentsRecentRequest !==
	// 			types.GET_CASHIERING_ASSIGNMENTS_BY_USER_ID,
	// 	[cashieringAssignmentsStatus, cashieringAssignmentsRecentRequest],
	// );

	// return (
	// 	<Content className="AssignUsers" title="Assign User">
	// 		<Spin size="large" spinning={isFetching()} tip="Fetching user details...">
	// 			<Box>
	// 				<div className="PaddingHorizontal PaddingVertical">
	// 					<DetailsRow>
	// 						<DetailsSingle
	// 							label="Name"
	// 							value={`${user?.first_name} ${user?.last_name}`}
	// 						/>
	// 						<DetailsSingle label="Branch" value={user?.branch?.name} />
	// 					</DetailsRow>
	// 				</div>

	// 				{BRANCH_USER_TYPES.includes(user?.user_type) && (
	// 					<>
	// 						<RequestErrors
	// 							errors={[
	// 								...convertIntoArray(
	// 									branchesMachinesErrors,
	// 									'Branch Machines',
	// 								),
	// 								...convertIntoArray(
	// 									cashieringAssignmentsErrors,
	// 									'Cashiering Assignments',
	// 								),
	// 							]}
	// 							withSpaceBottom
	// 						/>

	// 						<RequestWarnings
	// 							warnings={convertIntoArray(cashieringAssignmentsWarnings)}
	// 							withSpaceBottom
	// 						/>

	// 						<Table
	// 							columns={columns}
	// 							dataSource={data}
	// 							loading={isChangingAssignments()}
	// 							pagination={false}
	// 						/>
	// 					</>
	// 				)}
	// 			</Box>
	// 		</Spin>
	// 	</Content>
	// );
};
