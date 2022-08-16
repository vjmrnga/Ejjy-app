import { MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { arrayMoveImmutable } from 'array-move';
import {
	ConnectionAlert,
	Content,
	ModifyProductCategoryModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import {
	useAuth,
	usePingOnlineServer,
	useProductCategories,
	useProductCategoryDelete,
	useProductCategoryEdit,
} from 'hooks';
import { cloneDeep } from 'lodash';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';
import { convertIntoArray, isCUDShown } from 'utils';

const DragHandle = SortableHandle(() => (
	<MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const SortableItem = SortableElement(
	(props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
);
const SortableBody = SortableContainer(
	(props: React.HTMLAttributes<HTMLTableSectionElement>) => (
		<tbody {...props} />
	),
);

export const ProductCategories = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedProductCategory, setSelectedProductCategory] = useState(null);
	const [
		modifyProductCategoryModalVisible,
		setModifyProductCategoryModalVisible,
	] = useState(false);
	const [isSorted, setIsSorted] = useState(false);

	// REFS
	const sortedProductCategoriesRef = useRef([]);

	// CUSTOM HOOKS
	const { isConnected } = usePingOnlineServer();
	const { user } = useAuth();
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
		error: listError,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		mutate: editProductCategory,
		isLoading: isEditingProductCategory,
		error: editError,
	} = useProductCategoryEdit();
	const {
		mutate: deleteProductCategory,
		isLoading: isDeletingProductCategory,
		error: deleteError,
	} = useProductCategoryDelete();

	// EFFECTS
	useEffect(() => {
		const sortedProductCategories = cloneDeep(productCategories);
		sortedProductCategories.sort((a, b) => a.priority_level - b.priority_level);
		console.log('productCategories', productCategories);
		console.log('sortedProductCategories', sortedProductCategories);
		const data = sortedProductCategories.map((productCategory, index) => ({
			id: productCategory.id,
			name: productCategory.name,
			actions: (
				<TableActions
					areButtonsDisabled={isConnected === false}
					onEdit={() => {
						setSelectedProductCategory(productCategory);
						setModifyProductCategoryModalVisible(true);
					}}
					onRemove={() => deleteProductCategory(productCategory.id)}
				/>
			),
			index,
		}));

		setDataSource(data);
	}, [productCategories, isConnected]);

	const handleSaveEdits = useCallback(() => {
		console.log('sortedProductCategories', sortedProductCategoriesRef);

		sortedProductCategoriesRef.current.forEach(
			(sortedProductCategory, index) => {
				if (sortedProductCategory.priority_level !== index) {
					editProductCategory({
						id: sortedProductCategory.id,
						name: sortedProductCategory.name,
						priorityLevel: index,
					});
				}
			},
		);

		setIsSorted(false);
	}, [sortedProductCategoriesRef.current]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Name', dataIndex: 'name', className: 'drag-visible' },
		];

		if (isCUDShown(user.user_type)) {
			columns.unshift({
				title: isSorted && (
					<Tooltip title="Save Order">
						<Button
							icon={<SaveOutlined />}
							shape="round"
							type="primary"
							onClick={handleSaveEdits}
						/>
					</Tooltip>
				),
				dataIndex: 'sort',
				width: 80,
				className: 'drag-visible',
				align: 'center',
				render: () => <DragHandle />,
			});
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [user, isSorted]);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(
				dataSource.slice(),
				oldIndex,
				newIndex,
			).filter((el) => !!el);

			setDataSource(newData);
			setIsSorted(true);
			sortedProductCategoriesRef.current = newData;
		}
	};

	const renderDraggableContainer = (props) => (
		<SortableBody
			helperClass="row-dragging"
			disableAutoscroll
			useDragHandle
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const renderDraggableBodyRow = ({ className, style, ...restProps }) => {
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = dataSource.findIndex(
			(x) => x.index === restProps['data-row-key'],
		);
		return <SortableItem index={index} {...restProps} />;
	};

	return (
		<Content title="Product Categories">
			<ConnectionAlert />

			<Box>
				{isCUDShown(user.user_type) && (
					<TableHeader
						buttonName="Create Product Category"
						onCreate={() => {
							setSelectedProductCategory(null);
							setModifyProductCategoryModalVisible(true);
						}}
						onCreateDisabled={isConnected === false}
					/>
				)}

				<RequestErrors
					className="px-4"
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
						...convertIntoArray(editError?.errors),
					]}
					withSpaceBottom
				/>

				<Table
					columns={getColumns()}
					components={{
						body: {
							wrapper: renderDraggableContainer,
							row: renderDraggableBodyRow,
						},
					}}
					dataSource={dataSource}
					loading={
						isFetchingProductCategories ||
						isDeletingProductCategory ||
						isEditingProductCategory
					}
					pagination={false}
					// Intentionally used `index` as row key to make the draggable work
					rowKey="index"
				/>
			</Box>

			{modifyProductCategoryModalVisible && (
				<ModifyProductCategoryModal
					productCategory={selectedProductCategory}
					onClose={() => {
						setSelectedProductCategory(null);
						setModifyProductCategoryModalVisible(false);
					}}
				/>
			)}
		</Content>
	);
};
