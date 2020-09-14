/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { lowerCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Container, Table, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { useProducts } from '../../../hooks/useProducts';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { ViewProductModal } from './components/ViewProductModal';

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const Products = () => {
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [viewProductModalVisible, setViewProductModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const { height } = useWindowDimensions();
	const { products } = useProducts();

	// Effect: Format products to be rendered in Table
	useEffect(() => {
		const formattedProducts = products.map((product) => {
			const { barcode, name } = product;

			return {
				_barcode: barcode,
				barcode: (
					<a href="#" onClick={() => onView(product)}>
						{barcode}
					</a>
				),
				name,
			};
		});

		setData(formattedProducts);
		setTableData(formattedProducts);
	}, [products]);

	const onView = (product) => {
		setSelectedProduct(product);
		setViewProductModalVisible(true);
	};

	const onSearch = (keyword) => {
		keyword = lowerCase(keyword);
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
					<TableHeader onSearch={onSearch} />

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
				</Box>
			</section>
		</Container>
	);
};

export default Products;
