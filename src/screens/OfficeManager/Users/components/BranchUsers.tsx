import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors, TableActions } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useUserDelete, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, getFullName, getUserTypeName } from 'utils';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	branchId: any;
	onEditUser: any;
}

export const BranchUsers = ({ branchId, onEditUser }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		isFetching: isFetchingUsers,
		data: { users },
		error: listError,
	} = useUsers({
		params: {
			// branchId, NOTE: Temporarily removed the branch ID
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutate: deleteUser,
		isLoading: isDeletingUser,
		error: deleteError,
	} = useUserDelete();

	// METHODS
	useEffect(() => {
		const formattedUsers = users.map((user) => ({
			key: user.id,
			id: user.employee_id,
			name: getFullName(user),
			type: getUserTypeName(user.user_type),
			actions: (
				<TableActions
					onEdit={() => onEditUser({ ...user, branchId })}
					onRemove={() => deleteUser(user.id)}
				/>
			),
		}));

		setDataSource(formattedUsers);
	}, [users]);

	return (
		<>
			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(listError),
					...convertIntoArray(deleteError?.errors),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 650 }}
				loading={isFetchingUsers || isDeletingUser}
				pagination={false}
			/>
		</>
	);
};
