import { MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { arrayMoveImmutable } from 'array-move';
import {
	Content,
	ModifyProductCategoryModal,
	RequestErrors,
	TableActions,
	TableHeader,
} from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import {
	useProductCategories,
	useProductCategoryDelete,
	useQueryParams,
} from 'hooks';
import { useAuth } from 'hooks/useAuth';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';
import { ProductCategoriesService } from 'services';
import { convertIntoArray } from 'utils';

const DragHandle = SortableHandle(() => (
	<MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const SortableItem = SortableElement((props) => <tr {...props} />);

const SortableBody = SortableContainer((props) => <tbody {...props} />);

export const ProductCategories = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [initialProductCategories, setInitialProductCategories] = useState([]);
	const [selectedProductCategory, setSelectedProductCategory] = useState(null);
	const [
		modifyProductCategoryModalVisible,
		setModifyProductCategoryModalVisible,
	] = useState(false);
	const [isSorted, setIsSorted] = useState(false);

	// REFS
	const sortedProductCategories = useRef([]);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { productCategories, total },
		isFetching,
		error: listError,
	} = useProductCategories({
		params: {
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		mutate: deleteProductCategory,
		isLoading,
		error: deleteError,
	} = useProductCategoryDelete();

	// EFFECTS
	useEffect(() => {
		const formattedProductCategories = productCategories.map(
			(productCategory) => ({
				key: productCategory.id,
				id: productCategory.id,
				name: productCategory.name,
				actions: (
					<TableActions
						onEdit={() => {
							setSelectedProductCategory(productCategory);
							setModifyProductCategoryModalVisible(true);
						}}
						onRemove={() => deleteProductCategory(productCategory.id)}
					/>
				),
			}),
		);

		setInitialProductCategories(productCategories);
		setDataSource(formattedProductCategories);
	}, [productCategories]);

	const onEditOrder = useCallback(() => {
		sortedProductCategories.current.forEach((pc, index) => {
			const productCategory = initialProductCategories[index];

			if (productCategory.id !== pc.id) {
				const onlineUrl = user?.branch?.online_url;

				if (onlineUrl) {
					ProductCategoriesService.edit(
						pc.id,
						{
							name: pc.name,
							priority_level: index,
						},
						onlineUrl,
					).catch(() => {
						// Do nothing
					});
				}
			}
		});

		setIsSorted(false);
	}, [sortedProductCategories.current, initialProductCategories]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{
				title: isSorted ? (
					<Button
						type="primary"
						shape="round"
						icon={<SaveOutlined />}
						onClick={onEditOrder}
					/>
				) : (
					''
				),
				dataIndex: 'sort',
				width: 80,
				className: 'drag-visible',
				align: 'center',
				render: () => <DragHandle />,
			},
			{ title: 'Name', dataIndex: 'name', key: 'name' },
			{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
		];

		return columns;
	}, [isSorted]);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		if (oldIndex !== newIndex) {
			const newData = arrayMoveImmutable(
				[].concat(dataSource),
				oldIndex,
				newIndex,
			).filter((el) => !!el);

			setDataSource(newData);

			setIsSorted(true);

			sortedProductCategories.current = newData;
		}
	};

	const renderDraggableContainer = (props) => (
		<SortableBody
			useDragHandle
			disableAutoscroll
			helperClass="row-dragging"
			onSortEnd={onSortEnd}
			{...props}
		/>
	);

	const renderDraggableBodyRow = ({ className, style, ...restProps }) => {
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = dataSource.findIndex(
			(x) => x.index === restProps['data-row-key'],
		);
		return <SortableItem index={index} {...restProps} />;
	};

	return (
		<Content className="ProductCategories" title="Product Categories">
			<Box>
				<TableHeader
					buttonName="Create Product Category"
					onCreate={() => {
						setSelectedProductCategory(null);
						setModifyProductCategoryModalVisible(true);
					}}
				/>

				<RequestErrors
					errors={[
						...convertIntoArray(listError),
						...convertIntoArray(deleteError?.errors),
					]}
				/>

				<Table
					columns={getColumns()}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					pagination={false}
					loading={isFetching}
					components={{
						body: {
							wrapper: renderDraggableContainer,
							row: renderDraggableBodyRow,
						},
					}}
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
