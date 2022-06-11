import { MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { arrayMoveImmutable } from 'array-move';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { service as ProductCategoryService } from '../../../services/product-categories';
import { convertIntoArray } from 'utils';
import { CreateEditProductCategoryModal } from './components/CreateEditProductCategoryModal';

const DragHandle = SortableHandle(() => (
	<MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const SortableItem = SortableElement((props) => <tr {...props} />);

const SortableBody = SortableContainer((props) => <tbody {...props} />);

export const ProductCategories = () => {
	// STATES
	const [data, setData] = useState([]);
	const [initialProductCategories, setInitialProductCategories] = useState([]);
	const [selectedProductCategory, setSelectedProductCategory] = useState(null);
	const [
		createEditProductCategoryModalVisible,
		setCreateEditProductCategoryModalVisible,
	] = useState(false);
	const [isSorted, setIsSorted] = useState(false);

	const sortedProductCategories = useRef([]);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		getProductCategories,
		removeProductCategory,
		status: productCategoriesStatus,
		errors,
	} = useProductCategories();

	// EFFECTS
	useEffect(() => {
		fetchProductCategories();
	}, []);

	const fetchProductCategories = () => {
		getProductCategories(
			{ branchId: user?.branch?.id },
			({ status, data: responseData }) => {
				if (status === request.SUCCESS) {
					setInitialProductCategories(responseData);
					setData(
						responseData.map((productCategory, index) => ({
							index,
							key: productCategory.id,
							id: productCategory.id,
							name: productCategory.name,
							actions: (
								<TableActions
									onEdit={() => onEdit(productCategory)}
									onRemove={() => onRemove(productCategory.id)}
								/>
							),
						})),
					);
				}
			},
		);
	};

	const onCreate = () => {
		setSelectedProductCategory(null);
		setCreateEditProductCategoryModalVisible(true);
	};

	const onEdit = (branch) => {
		setSelectedProductCategory(branch);
		setCreateEditProductCategoryModalVisible(true);
	};

	const onRemove = (productCategoryId) => {
		removeProductCategory(
			{
				id: productCategoryId,
				branchId: user?.branch?.id,
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					fetchProductCategories();
				}
			},
		);
	};

	const onEditOrder = useCallback(() => {
		sortedProductCategories.current.forEach((pc, index) => {
			const productCategory = initialProductCategories[index];

			if (productCategory.id !== pc.id) {
				const onlineUrl = user?.branch?.online_url;

				if (onlineUrl) {
					ProductCategoryService.edit(
						{
							id: pc.id,
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
				[].concat(data),
				oldIndex,
				newIndex,
			).filter((el) => !!el);

			setData(newData);

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
		const index = data.findIndex((x) => x.index === restProps['data-row-key']);
		return <SortableItem index={index} {...restProps} />;
	};

	return (
		<Content className="ProductCategories" title="Product Categories">
			<Box>
				<TableHeader buttonName="Create Product Category" onCreate={onCreate} />

				<RequestErrors
					className="PaddingHorizontal"
					errors={convertIntoArray(errors)}
					withSpaceBottom
				/>

				<Table
					rowKey="index"
					columns={getColumns()}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={false}
					loading={productCategoriesStatus === request.REQUESTING}
					components={{
						body: {
							wrapper: renderDraggableContainer,
							row: renderDraggableBodyRow,
						},
					}}
				/>
			</Box>

			<CreateEditProductCategoryModal
				productCategory={selectedProductCategory}
				visible={createEditProductCategoryModalVisible}
				onClose={() => setCreateEditProductCategoryModalVisible(false)}
				onSuccess={fetchProductCategories}
			/>
		</Content>
	);
};
