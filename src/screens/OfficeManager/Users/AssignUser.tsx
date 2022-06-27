import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Alert, Button, Col, message, Row, Space, Table, Tooltip } from 'antd';
import {
	AddButtonIcon,
	Breadcrumb,
	Content,
	ModifyCashieringAssignmentModal,
	RequestErrors,
} from 'components';
import { Box } from 'components/elements';
import dayjs from 'dayjs';
import { GENERIC_ERROR_MESSAGE, MAX_PAGE_SIZE } from 'global';
import {
	useAuth,
	useCashieringAssignmentDelete,
	useCashieringAssignments,
	usePingOnlineServer,
	useUserRetrieve,
} from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import {
	confirmPassword,
	convertIntoArray,
	getFullName,
	isUserFromBranch,
} from 'utils';

const columns = [
	{ title: 'Date', dataIndex: 'date', width: 175 },
	{ title: 'Day', dataIndex: 'day', width: 100 },
	{ title: 'Assignments', dataIndex: 'assignments' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	match: any;
}

export const AssignUser = ({ match }: Props) => {
	// VARIABLES
	const userId = match?.params?.id;

	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedDate, setSelectededDate] = useState(null);
	const [selectedCashieringAssignment, setSelectedCashieringAssignment] =
		useState(null);

	// CUSTOM HOOKS
	const { isConnected } = usePingOnlineServer();
	const { user: actingUser } = useAuth();
	const {
		data: user,
		isFetching: isFetchingUser,
		isSuccess: isSuccessUser,
		error: userErrors,
	} = useUserRetrieve({
		id: userId,
		options: {
			enabled: !!userId,
			onError: (error: any) => {
				if (error.response.status === 404) {
					message.error('User does not exist');
				} else {
					message.error(GENERIC_ERROR_MESSAGE);
				}
			},
		},
	});
	const {
		data: { cashieringAssignments },
		isFetching: isFetchingCashieringAssignments,
		error: cashieringAssignmentsError,
	} = useCashieringAssignments({
		params: {
			pageSize: MAX_PAGE_SIZE,
			userId,
		},
		options: {
			enabled: isSuccessUser,
		},
	});
	const { mutateAsync: deleteCashieringAssignment, error: deleteError } =
		useCashieringAssignmentDelete();

	// METHODS
	useEffect(() => {
		if (user && cashieringAssignments) {
			const today = dayjs();
			const days = getDays();

			const formattedAssignments = days.map((item) => {
				const isDateAfter = today.isAfter(item.date);
				const assignments = cashieringAssignments
					.filter((ca) => dayjs.tz(ca.datetime_start).isSame(item.date, 'date'))
					.sort((assignmentA, assignmentB) => {
						const startTimeA = dayjs.tz(assignmentA.datetime_start);
						const startTimeB = dayjs.tz(assignmentB.datetime_start);

						return startTimeA.isAfter(startTimeB) ? 1 : -1;
					});

				return {
					key: item.display,
					date: item.display,
					day: item.day,
					assignments: (
						<Assignments
							assignments={assignments}
							disabled={isConnected === false}
							onEdit={setSelectedCashieringAssignment}
							onDelete={(assignment) =>
								deleteCashieringAssignment({
									id: assignment.id,
									actingUserId: actingUser.id,
								})
							}
						/>
					),
					actions: !isDateAfter && (
						<AddButtonIcon
							disabled={isConnected === false}
							tooltip="Assign"
							onClick={() => setSelectededDate(item.date)}
						/>
					),
				};
			});

			setDataSource(formattedAssignments);
		}
	}, [user, actingUser, cashieringAssignments, isConnected]);

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

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Users', link: '/branch-manager/users' },
			{ name: getFullName(user) },
		],
		[user],
	);

	return (
		<Content
			className="AssignUsers"
			title="Assign User"
			rightTitle={getFullName(user)}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			{isConnected === false && (
				<Alert
					className="mb-4"
					message="Online Server cannot be reached."
					description="Create, Edit, and Delete functionalities are temporarily disabled until connection to Online Server is restored."
					type="error"
					showIcon
				/>
			)}

			<Box>
				{isUserFromBranch(user?.user_type) && (
					<>
						<RequestErrors
							errors={[
								...convertIntoArray(
									cashieringAssignmentsError,
									'Cashiering Assignments',
								),
								...convertIntoArray(userErrors, 'User'),
								...convertIntoArray(
									deleteError?.errors,
									'Delete Cashiering Assignment',
								),
							]}
							withSpaceBottom
						/>

						<Table
							columns={columns}
							dataSource={dataSource}
							scroll={{ x: 1000 }}
							loading={isFetchingUser || isFetchingCashieringAssignments}
							pagination={false}
						/>

						{(selectedDate || selectedCashieringAssignment) && (
							<ModifyCashieringAssignmentModal
								assignments={cashieringAssignments}
								assignment={selectedCashieringAssignment}
								date={selectedDate}
								userId={userId}
								onClose={() => {
									setSelectededDate(null);
									setSelectedCashieringAssignment(null);
								}}
							/>
						)}
					</>
				)}
			</Box>
		</Content>
	);
};

interface AssignmentsProps {
	assignments: any;
	disabled: boolean;
	onEdit: any;
	onDelete: any;
}

const Assignments = ({
	assignments,
	disabled,
	onDelete,
	onEdit,
}: AssignmentsProps) => (
	<Row gutter={[16, 16]}>
		{assignments.map((assignment) => (
			<Col key={assignment.id} span={24}>
				<Space align="center" className="w-100">
					<div>
						{`${assignment.branch_machine.name}: ${dayjs
							.tz(assignment.datetime_start)
							.format('h:mmA')} – ${dayjs
							.tz(assignment.datetime_end)
							.format('h:mmA')}`}
					</div>

					<Tooltip title="Edit">
						<Button
							type="primary"
							shape="circle"
							size="small"
							disabled={disabled}
							icon={<EditOutlined />}
							onClick={() =>
								confirmPassword({ onSuccess: () => onEdit(assignment) })
							}
						/>
					</Tooltip>

					<Tooltip title="Delete">
						<Button
							danger
							shape="circle"
							size="small"
							ghost
							disabled={disabled}
							icon={<DeleteOutlined />}
							onClick={() =>
								confirmPassword({ onSuccess: onDelete(assignment) })
							}
						/>
					</Tooltip>
				</Space>
			</Col>
		))}
	</Row>
);
