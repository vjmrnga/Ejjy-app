import { message } from 'antd';
import Table from 'antd/lib/table';
import {
	ConnectionAlert,
	Content,
	ModifyPointSystemTagModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, pageSizeOptions } from 'global';
import {
	useAuth,
	usePingOnlineServer,
	usePointSystemTagDelete,
	usePointSystemTags,
	useQueryParams,
} from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatInPeso,
	isCUDShown,
	isUserFromBranch,
} from 'utils';

export const PointSystemTags = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedPointSystemTag, setSelectedPointSystemTag] = useState(null);
	const [
		modifyPointSystemTagModalVisible,
		setModifyPointSystemTagModalVisible,
	] = useState(false);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { isConnected } = usePingOnlineServer();
	const { user } = useAuth();
	const {
		data: { pointSystemTags, total },
		isFetching,
		error: listError,
	} = usePointSystemTags({ params });
	const {
		mutate: deletePointSystemTag,
		isLoading,
		error: deleteError,
	} = usePointSystemTagDelete();

	// METHODS
	useEffect(() => {
		const data = pointSystemTags.map((pointSystemTag) => ({
			key: pointSystemTag.id,
			name: pointSystemTag.name,
			divisorAmount: formatInPeso(pointSystemTag.divisor_amount),
			actions: (
				<TableActions
					areButtonsDisabled={isConnected === false}
					onEdit={() => {
						setSelectedPointSystemTag(pointSystemTag);
						setModifyPointSystemTagModalVisible(true);
					}}
					onRemove={() => {
						message.success('Point system tag was deleted successfully');
						deletePointSystemTag(pointSystemTag.id);
					}}
				/>
			),
		}));

		setDataSource(data);
	}, [pointSystemTags, isConnected]);

	const getColumns = useCallback(() => {
		const columns = [
			{ title: 'Name', dataIndex: 'name' },
			{ title: 'Divisor Amount', dataIndex: 'divisorAmount' },
		];

		if (isCUDShown(user.user_type)) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user]);

	return (
		<Content title="Point System Tags">
			<ConnectionAlert />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create Point System Tag"
						onCreateDisabled={isConnected === false}
						onCreate={() => setModifyPointSystemTagModalVisible(true)}
					/>
				)}

				<RequestErrors
					className="px-4"
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					loading={isFetching || isLoading}
					bordered
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
				/>

				{modifyPointSystemTagModalVisible && (
					<ModifyPointSystemTagModal
						pointSystemTag={selectedPointSystemTag}
						onClose={() => {
							setSelectedPointSystemTag(null);
							setModifyPointSystemTagModalVisible(false);
						}}
					/>
				)}
			</Box>
		</Content>
	);
};