import { Spin, Table } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	AddButtonIcon,
	CancelButtonIcon,
	Content,
	DetailsRow,
	DetailsSingle,
	RequestErrors,
} from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useCashieringAssignments } from '../../../hooks/useCashieringAssignments';
import { useUsers } from '../../../hooks/useUsers';
import { convertIntoArray, isUserFromBranch } from '../../../utils/function';
import './style.scss';

const columns = [
	{ title: 'Date', dataIndex: 'date' },
	{ title: 'Day', dataIndex: 'day' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	match: any;
}

export const AssignUser = ({ match }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const userId = match?.params?.id;
	const history = useHistory();
	const { user, getUserById, status: userStatus } = useUsers();
	const {
		cashieringAssignments,
		getCashieringAssignmentsByUserId,
		status: getCashieringAssignmentsStatus,
		errors: getCashieringAssignmentsErrors,
	} = useCashieringAssignments();

	const {
		createCashieringAssignment,
		removeCashieringAssignment,
		status: modifyCashieringAssignmentsStatus,
		errors: modifyCashieringAssignmentsErrors,
	} = useCashieringAssignments();

	// METHODS
	useEffect(() => {
		getUserById(userId, ({ status, data: userData }) => {
			if (status === request.SUCCESS && isUserFromBranch(userData?.user_type)) {
				getCashieringAssignmentsByUserId({ userId });
			} else if (status === request.ERROR) {
				history.replace('/404');
			}
		});
	}, []);

	// Effect: Format cashiering assignments
	useEffect(() => {
		if (user && cashieringAssignments) {
			const today = dayjs();
			const days = getDays();

			const formattedAssignments = days.map((item) => {
				const isDateAfter = today.isAfter(item.date);
				const assignment = cashieringAssignments.find((ca) =>
					dayjs.tz(ca.date, 'YYYY-MM-DD').isSame(item.date, 'date'),
				);

				return {
					date: item.display,
					day: item.day,
					actions: assignment ? (
						<>
							{!isDateAfter && (
								<CancelButtonIcon
									tooltip="Remove"
									onClick={() => onRemoveAssignment(assignment.id)}
								/>
							)}
						</>
					) : (
						<AddButtonIcon
							classNames={cn({ AssignUsers_btnAssign__disabled: isDateAfter })}
							tooltip="Assign"
							onClick={() => onAssign(item.date)}
						/>
					),
				};
			});

			setData(formattedAssignments);
		}
	}, [user, cashieringAssignments]);

	const onAssign = (date) => {
		createCashieringAssignment({
			user_id: userId,
			date: date.format('YYYY-MM-DD'),
		});
	};

	const onRemoveAssignment = (assignmentId) => {
		removeCashieringAssignment({
			id: assignmentId,
		});
	};

	const getDays = useCallback(() => {
		const numberOfDays = dayjs().daysInMonth();
		const days = [];
		const today = dayjs().date();

		for (let i = today; i <= numberOfDays; i += 1) {
			const date = dayjs().date(i);
			days.push({
				date,
				display: date.format('MMM D, YYYY'),
				day: date.format('ddd'),
			});
		}

		for (let i = 1; i < today; i += 1) {
			const date = dayjs().date(i);
			days.push({
				date,
				display: date.format('MMM D, YYYY'),
				day: date.format('ddd'),
			});
		}

		return days;
	}, []);

	const isFetching = useCallback(
		() =>
			[getCashieringAssignmentsStatus, userStatus].includes(request.REQUESTING),
		[getCashieringAssignmentsStatus, userStatus],
	);

	return (
		<Content className="AssignUsers" title="Assign User">
			<Spin size="large" spinning={isFetching()} tip="Fetching user details...">
				<Box>
					<div className="PaddingHorizontal PaddingVertical">
						<DetailsRow>
							<DetailsSingle
								label="Name"
								value={`${user?.first_name} ${user?.last_name}`}
							/>
						</DetailsRow>
					</div>

					{isUserFromBranch(user?.user_type) && (
						<>
							<RequestErrors
								errors={[
									...convertIntoArray(
										[
											...getCashieringAssignmentsErrors,
											...modifyCashieringAssignmentsErrors,
										],
										'Cashiering Assignments',
									),
								]}
								withSpaceBottom
							/>

							<Table
								columns={columns}
								dataSource={data}
								loading={
									modifyCashieringAssignmentsStatus === request.REQUESTING
								}
								pagination={false}
							/>
						</>
					)}
				</Box>
			</Spin>
		</Content>
	);
};
