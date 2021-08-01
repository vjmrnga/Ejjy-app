import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	Content,
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import { request } from '../../../global/types';
import { useProductCategories } from '../../../hooks/useProductCategories';
import { convertIntoArray } from '../../../utils/function';
import { CreateEditProductCategoryModal } from './components/CreateEditProductCategoryModal';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

export const ProductCategories = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedProductCategory, setSelectedProductCategory] = useState(null);
	const [
		createEditProductCategoryModalVisible,
		setCreateEditProductCategoryModalVisible,
	] = useState(false);

	// CUSTOM HOOKS
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
		getProductCategories(({ status, data: responseData }) => {
			if (status === request.SUCCESS) {
				setData(
					responseData.map((productCategory) => ({
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
		});
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
		removeProductCategory(productCategoryId, ({ status }) => {
			if (status === request.SUCCESS) {
				fetchProductCategories();
			}
		});
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
					columns={columns}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={false}
					loading={productCategoriesStatus === request.REQUESTING}
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
