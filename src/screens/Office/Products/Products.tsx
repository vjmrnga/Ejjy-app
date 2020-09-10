/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Container, Table } from '../../../components';
import { Box } from '../../../components/elements';
import { TableHeader } from '../../../components/TableHeaders/TableHeader';
import { types } from '../../../ducks/products';
import { request } from '../../../global/variables';
import { useProducts } from '../../../hooks/useProducts';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { CreateEditProductModal } from './components/CreateEditProductModal';
import { ProductActions } from './components/ProductActions';
import { ViewProductModal } from './components/ViewProductModal';

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const Products = () => {
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [createEditProductModalVisible, setCreateEditProductModalVisible] = useState(false);
	const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const { height } = useWindowDimensions();
	const [
		products,
		createProductRequest,
		editProductRequest,
		removeProductRequest,
		status,
		errors,
		recentRequest,
	] = useProducts();

	// Effect: Format products to be rendered in Table
	useEffect(() => {
		const formattedProducts = products.map((product) => {
			const { id, barcode, name } = product;

			return {
				_barcode: barcode,
				barcode: (
					<a href="#" onClick={() => onView(product)}>
						{barcode}
					</a>
				),
				name,
				actions: (
					<ProductActions
						onEdit={() => onEdit(product)}
						onRemove={() => removeProductRequest(id)}
					/>
				),
			};
		});

		setData(formattedProducts);
		setTableData(formattedProducts);
	}, [products]);

	// Effect: Reload the list if recent requests are Create, Edit or Remove
	useEffect(() => {
		const reloadListTypes = [types.CREATE_PRODUCT, types.EDIT_PRODUCT];

		if (status === request.SUCCESS && reloadListTypes.includes(recentRequest)) {
			setCreateEditProductModalVisible(false);
			setSelectedProduct(null);
		}
	}, [status, recentRequest]);

	const onView = (product) => {
		setSelectedProduct(product);
		setViewProductModalVisible(true);
	};

	const onCreate = () => {
		setSelectedProduct(null);
		setCreateEditProductModalVisible(true);
	};

	const onEdit = (product) => {
		setSelectedProduct(product);
		setCreateEditProductModalVisible(true);
	};

	const onSearch = (keyword) => {
		const filteredData =
			keyword.length > 0
				? data.filter(({ _barcode, name }) => _barcode.includes(keyword) || name.includes(keyword))
				: data;

		setTableData(filteredData);
	};

	return (
		<Container title="Products">
			<section className="Products">
				<Box>
					<TableHeader buttonName="Create Product" onSearch={onSearch} onCreate={onCreate} />

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: height * 0.6, x: '100vw' }}
					/>

					<ViewProductModal
						product={selectedProduct}
						visible={viewProductModalVisible}
						onClose={() => setViewProductModalVisible(false)}
					/>

					<CreateEditProductModal
						product={selectedProduct}
						visible={createEditProductModalVisible}
						onSubmit={selectedProduct ? editProductRequest : createProductRequest}
						onClose={() => setCreateEditProductModalVisible(false)}
						errors={errors}
						loading={status === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default Products;
