import { message } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import {
	Content,
	ModifyPointSystemTagModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, pageSizeOptions } from 'global';
import {
	usePointSystemTagDelete,
	usePointSystemTags,
	useQueryParams,
} from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Divisor Amount', dataIndex: 'divisorAmount' },
	{ title: 'Actions', dataIndex: 'actions' },
];

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
	}, [pointSystemTags]);

	return (
		<Content title="Point System Tags">
			<Box>
				<TableHeader
					buttonName="Create Point System Tag"
					onCreate={() => setModifyPointSystemTagModalVisible(true)}
				/>

				<RequestErrors
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
				/>

				<Table
					columns={columns}
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
