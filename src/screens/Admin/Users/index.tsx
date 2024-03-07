import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip, message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TableHeader } from 'components';
import { Box } from 'components/elements';
import { getFullName } from 'ejjy-global';
import { MAX_PAGE_SIZE, serviceTypes, userPendingApprovalTypes } from 'global';
import {
	useUserApproveUserPendingApproval,
	useUserDeclineUserPendingApproval,
	useUsers,
} from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, getGoogleApiUrl, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'User Type', dataIndex: 'userType' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const Users = () => (
	<Content className="Users" title="Users">
		<PendingUserCreation />
		<PendingEditUserType />
		<PendingUserDeletion />
	</Content>
);

const PendingUserCreation = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: {
			isPendingCreateApproval: true,
			pageSize: MAX_PAGE_SIZE,
			serverUrl: getGoogleApiUrl(),
			serviceType: serviceTypes.NORMAL,
		},
	});
	const {
		mutateAsync: approveUserPendingApproval,
		isLoading: isApprovingUserPendingApproval,
		error: approveUserPendingApprovalError,
	} = useUserApproveUserPendingApproval();
	const {
		mutate: declineUserPendingApproval,
		isLoading: isDecliningUserPendingApproval,
		error: declineUserPendingApprovalError,
	} = useUserDeclineUserPendingApproval();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, user_type } = user;

			return {
				key: id,
				name: getFullName(user),
				userType: getUserTypeName(user_type),
				actions: (
					<Space>
						<Tooltip title="Approve">
							<Button
								icon={<CheckCircleOutlined />}
								type="primary"
								ghost
								onClick={async () => {
									await approveUserPendingApproval({
										id,
										pendingApprovalType: userPendingApprovalTypes.CREATE,
									});
									message.success("User's creation was approved successfully");
								}}
							/>
						</Tooltip>
						<Tooltip title="Reject">
							<Button
								icon={<CloseCircleOutlined />}
								type="primary"
								danger
								ghost
								onClick={async () => {
									await declineUserPendingApproval({
										id,
										pendingApprovalType: userPendingApprovalTypes.CREATE,
									});

									message.success("User's creation was declined successfully");
								}}
							/>
						</Tooltip>
					</Space>
				),
			};
		});

		setDataSource(formattedUsers);
	}, [users]);

	return (
		<Box>
			<TableHeader title="Pending User Creation" />

			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveUserPendingApprovalError?.errors),
					...convertIntoArray(declineUserPendingApprovalError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					isFetchingUsers ||
					isApprovingUserPendingApproval ||
					isDecliningUserPendingApproval
				}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Box>
	);
};

const PendingEditUserType = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: {
			isPendingUpdateUserTypeApproval: true,
			pageSize: MAX_PAGE_SIZE,
			serviceType: serviceTypes.NORMAL,
			serverUrl: getGoogleApiUrl(),
		},
	});
	const {
		mutateAsync: approveUserPendingApproval,
		isLoading: isApprovingUserPendingApproval,
		error: approveUserPendingApprovalError,
	} = useUserApproveUserPendingApproval();
	const {
		mutate: declineUserPendingApproval,
		isLoading: isDecliningUserPendingApproval,
		error: declineUserPendingApprovalError,
	} = useUserDeclineUserPendingApproval();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, user_type } = user;

			return {
				key: id,
				name: getFullName(user),
				userType: getUserTypeName(user_type),
				actions: (
					<Space>
						<Tooltip title="Approve">
							<Button
								icon={<CheckCircleOutlined />}
								type="primary"
								ghost
								onClick={async () => {
									await approveUserPendingApproval({
										id,
										pendingApprovalType:
											userPendingApprovalTypes.UPDATE_USER_TYPE,
									});
									message.success(
										"User's type change request was updated successfully",
									);
								}}
							/>
						</Tooltip>
						<Tooltip title="Reject">
							<Button
								icon={<CloseCircleOutlined />}
								type="primary"
								danger
								ghost
								onClick={async () => {
									await declineUserPendingApproval({
										id,
										pendingApprovalType:
											userPendingApprovalTypes.UPDATE_USER_TYPE,
									});

									message.success(
										"User's type change request was declined successfully",
									);
								}}
							/>
						</Tooltip>
					</Space>
				),
			};
		});

		setDataSource(formattedUsers);
	}, [users]);

	return (
		<Box>
			<TableHeader title="Pending User Type Update" />

			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveUserPendingApprovalError?.errors),
					...convertIntoArray(declineUserPendingApprovalError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					isFetchingUsers ||
					isApprovingUserPendingApproval ||
					isDecliningUserPendingApproval
				}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Box>
	);
};

const PendingUserDeletion = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: {
			isPendingDeleteApproval: true,
			pageSize: MAX_PAGE_SIZE,
			serverUrl: getGoogleApiUrl(),
			serviceType: serviceTypes.NORMAL,
		},
	});
	const {
		mutateAsync: approveUserPendingApproval,
		isLoading: isApprovingUserPendingApproval,
		error: approveUserPendingApprovalError,
	} = useUserApproveUserPendingApproval();
	const {
		mutate: declineUserPendingApproval,
		isLoading: isDecliningUserPendingApproval,
		error: declineUserPendingApprovalError,
	} = useUserDeclineUserPendingApproval();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => {
			const { id, user_type } = user;

			return {
				key: id,
				name: getFullName(user),
				userType: getUserTypeName(user_type),
				actions: (
					<Space>
						<Tooltip title="Approve">
							<Button
								icon={<CheckCircleOutlined />}
								type="primary"
								ghost
								onClick={async () => {
									await approveUserPendingApproval({
										id,
										pendingApprovalType: userPendingApprovalTypes.DELETE,
									});
									message.success("User's deletion was approved successfully");
								}}
							/>
						</Tooltip>
						<Tooltip title="Reject">
							<Button
								icon={<CloseCircleOutlined />}
								type="primary"
								danger
								ghost
								onClick={async () => {
									await declineUserPendingApproval({
										id,
										pendingApprovalType: userPendingApprovalTypes.DELETE,
									});
									message.success("User's deletion was declined successfully");
								}}
							/>
						</Tooltip>
					</Space>
				),
			};
		});

		setDataSource(formattedUsers);
	}, [users]);

	return (
		<Box>
			<TableHeader title="Pending User Deletion" />

			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(userError),
					...convertIntoArray(approveUserPendingApprovalError?.errors),
					...convertIntoArray(declineUserPendingApprovalError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={
					isFetchingUsers ||
					isApprovingUserPendingApproval ||
					isDecliningUserPendingApproval
				}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Box>
	);
};
