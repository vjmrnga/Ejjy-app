import { message } from 'antd';
import Table from 'antd/lib/table';
import cn from 'classnames';
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
	usePingOnlineServer,
	usePointSystemTagDelete,
	usePointSystemTags,
	useQueryParams,
} from 'hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray, formatInPeso, isCUDShown } from 'utils';

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
	const user = useUserStore((state) => state.user);
	const {
		data: { pointSystemTags, total },
		isFetching: isFetchingPointSystemTags,
		error: pointSystemTagsError,
	} = usePointSystemTags({ params });
	const {
		mutate: deletePointSystemTag,
		isLoading: isDeletingPointSystemTag,
		error: deletePointSystemTagError,
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
						onCreate={() => setModifyPointSystemTagModalVisible(true)}
						onCreateDisabled={isConnected === false}
					/>
				)}

				<RequestErrors
					className={cn('px-6', {
						'mt-6': !isCUDShown(user.user_type),
					})}
					errors={[
						...convertIntoArray(pointSystemTagsError),
						...convertIntoArray(deletePointSystemTagError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					loading={isFetchingPointSystemTags || isDeletingPointSystemTag}
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
					bordered
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
