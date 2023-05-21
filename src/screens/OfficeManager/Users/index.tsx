import {
	DeleteOutlined,
	DesktopOutlined,
	EditFilled,
	SelectOutlined,
} from '@ant-design/icons';
import {
	Button,
	Col,
	Popconfirm,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	BranchAssignmentUserModal,
	ConnectionAlert,
	Content,
	ModifyUserModal,
	RequestErrors,
	TableHeader,
	UserPendingApprovalType,
	ViewUserModal,
} from 'components';
import { Box, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	DEV_USERNAME,
	MAX_PAGE_SIZE,
	NO_BRANCH_ID,
	pageSizeOptions,
	serviceTypes,
	userTypes,
} from 'global';
import {
	useBranches,
	usePingOnlineServer,
	useQueryParams,
	useUserPendingApprovals,
	useUserRequestUserDeletion,
	useUsers,
} from 'hooks';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
	convertIntoArray,
	filterOption,
	getFullName,
	getId,
	getUserTypeName,
	isUserFromOffice,
} from 'utils';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const Users = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [viewUserModalVisible, setViewUserModalVisible] = useState(false);
	const [modifyUserModalVisible, setModifyUserModalVisible] = useState(false);
	const [reassignUserModalVisible, setReassignUserModalVisible] =
		useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const { params, setQueryParams } = useQueryParams();
	const { isConnected } = usePingOnlineServer();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchesError,
	} = useBranches();
	const {
		isFetchedAfterMount: isUserPendingApprovalsFetched,
		isFetching: isFetchingUserPendingApprovals,
		error: userPendingApprovalsError,
	} = useUserPendingApprovals({
		options: {
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
		},
	});
	const {
		data: { users, total },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: {
			...params,
			serviceType: serviceTypes.OFFLINE,
		},
		options: { enabled: isUserPendingApprovalsFetched },
	});
	const {
		mutateAsync: requestUserDeletion,
		isLoading: isRequestingUserDeletion,
		error: requestUserDeletionError,
	} = useUserRequestUserDeletion();

	// METHODS
	useEffect(() => {
		const isDisabled = isConnected === false;
		const branchId = Number(params?.branchId);
		let branch = null;

		if (branchId === NO_BRANCH_ID) {
			branch = { id: NO_BRANCH_ID, online_id: NO_BRANCH_ID };
		} else {
			branch = branches?.filter(({ id }) => id === branchId);
		}

		const formattedUsers = users
			.filter((user) => user.username !== DEV_USERNAME)
			.map((user) => ({
				key: user.id,
				id: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => setSelectedUser(user)}
					>
						{user.employee_id}
					</Button>
				),
				name: getFullName(user),
				type: getUserTypeName(user.user_type),
				actions: user.pending_approval?.approval_type ? (
					<UserPendingApprovalType
						type={user.pending_approval?.approval_type}
					/>
				) : (
					<Space>
						{user.user_type !== userTypes.ADMIN && (
							<>
								<Tooltip title="Cashiering Assignment">
									<Link to={`/office-manager/users/assign/${user.id}`}>
										<Button
											disabled={isDisabled}
											icon={<DesktopOutlined />}
											type="primary"
											ghost
										/>
									</Link>
								</Tooltip>

								<Tooltip title="Assign Branch">
									<Button
										disabled={isDisabled}
										icon={<SelectOutlined />}
										type="primary"
										ghost
										onClick={() => {
											setReassignUserModalVisible(true);
											setSelectedUser({ ...user, branchId: getId(branch) });
										}}
									/>
								</Tooltip>
							</>
						)}

						<Tooltip title="Edit">
							<Button
								disabled={isDisabled}
								icon={<EditFilled />}
								type="primary"
								ghost
								onClick={() => {
									setModifyUserModalVisible(true);
									setSelectedUser({ ...user, branchId: getId(branch) });
								}}
							/>
						</Tooltip>

						{user.user_type !== userTypes.ADMIN && (
							<Popconfirm
								cancelText="No"
								okText="Yes"
								placement="left"
								title="Are you sure to remove this user?"
								onConfirm={async () => {
									await requestUserDeletion(getId(user));
									queryClient.invalidateQueries('useUserPendingApprovals');
								}}
							>
								<Tooltip title="Remove">
									<Button
										disabled={isDisabled}
										icon={<DeleteOutlined />}
										type="primary"
										danger
										ghost
									/>
								</Tooltip>
							</Popconfirm>
						)}
					</Space>
				),
			}));

		setDataSource(formattedUsers);
	}, [users, params?.branchId, branches, isConnected]);

	return (
		<Content title="Users">
			<ConnectionAlert />

			<Box>
				<Spin spinning={isFetchingBranches || isFetchingUserPendingApprovals}>
					<RequestErrors
						className="px-6"
						errors={[
							...convertIntoArray(branchesError, 'Branches'),
							...convertIntoArray(
								userPendingApprovalsError,
								'User Pending Approvals',
							),
							...convertIntoArray(usersError, 'Users'),
							...convertIntoArray(
								requestUserDeletionError?.errors,
								'User Deletion',
							),
						]}
						withSpaceBottom
					/>

					<TableHeader
						buttonName="Create User"
						onCreate={() => setModifyUserModalVisible(true)}
					/>

					<Filter />

					<Table
						columns={columns}
						dataSource={dataSource}
						loading={isFetchingUsers || isRequestingUserDeletion}
						pagination={{
							current: Number(params.page) || DEFAULT_PAGE,
							total,
							pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
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
						scroll={{ x: 1000 }}
						bordered
					/>

					{viewUserModalVisible && selectedUser && (
						<ViewUserModal
							user={selectedUser}
							onClose={() => {
								setViewUserModalVisible(false);
								setSelectedUser(null);
							}}
						/>
					)}

					{modifyUserModalVisible && selectedUser && (
						<ModifyUserModal
							user={selectedUser}
							onClose={() => {
								setModifyUserModalVisible(false);
								setSelectedUser(null);
							}}
						/>
					)}

					{reassignUserModalVisible && selectedUser && (
						<BranchAssignmentUserModal
							branches={branches}
							user={selectedUser}
							onClose={() => {
								setReassignUserModalVisible(false);
								setSelectedUser(null);
							}}
						/>
					)}
				</Spin>
			</Box>
		</Content>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { enabled: isUserFromOffice(user.user_type) },
	});

	return (
		<div className="pa-6 pt-0">
			<RequestErrors
				errors={convertIntoArray(branchErrors, 'Branches')}
				withSpaceBottom
			/>

			<Row gutter={[16, 16]}>
				{isUserFromOffice(user.user_type) && (
					<Col lg={12} span={24}>
						<Label label="Branch" spacing />
						<Select
							className="w-100"
							filterOption={filterOption}
							loading={isFetchingBranches}
							optionFilterProp="children"
							value={params.branchId ? Number(params.branchId) : null}
							allowClear
							showSearch
							onChange={(value) => {
								setQueryParams({ branchId: value }, { shouldResetPage: true });
							}}
						>
							<Select.Option key={NO_BRANCH_ID} value={NO_BRANCH_ID}>
								Unassigned
							</Select.Option>
							{branches.map((branch) => (
								<Select.Option key={branch.id} value={branch.id}>
									{branch.name}
								</Select.Option>
							))}
						</Select>
					</Col>
				)}
			</Row>
		</div>
	);
};
