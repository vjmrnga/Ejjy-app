/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Breadcrumb, Container, Table } from '../../../components';
import { Box } from '../../../components/elements';
import { TableHeader } from '../../../components/TableHeaders/TableHeader';
import { types } from '../../../ducks/branch-products';
import { selectors as branchesSelectors } from '../../../ducks/branches';
import { request } from '../../../global/variables';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { useProducts } from '../../../hooks/useProducts';
import { useWindowDimensions } from '../../../hooks/useWindowDimensions';
import { CreateEditBranchProductsModal } from './components/BranchProducts/CreateEditBranchProductsModal';
import { ViewBranchProductModal } from './components/BranchProducts/ViewBranchProductModal';
import { BranchProductsActions } from './components/BranchProductsActions';
import './style.scss';

interface IBranchesProps {
	match: any;
}

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Balance', dataIndex: 'balance' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const Branches = ({ match }: IBranchesProps) => {
	const branchId = match?.params?.id;
	const [
		branchProducts,
		createBranchProduct,
		editBranchProduct,
		removeBranchProduct,
		status,
		errors,
		recentRequest,
	] = useBranchProducts();
	const [products, ..._] = useProducts();
	const { height } = useWindowDimensions();
	const branch = useSelector(branchesSelectors.selectBranchById(Number(branchId)));

	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [createEditBranchProductModalVisible, setCreateEditBranchProductModalVisible] = useState(
		false,
	);
	const [viewBranchProductModalVisible, setViewBranchProductModalVisible] = useState(false);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

	// Effect: Format branch products to be rendered in Table
	useEffect(() => {
		const formattedBranchProducts = branchProducts
			.filter(({ branch_id }) => branch_id === Number(branchId))
			.map((branchProduct) => {
				const {
					id,
					product: { barcode, name },
					current_balance,
				} = branchProduct;

				return {
					_barcode: barcode,
					barcode: (
						<a href="#" onClick={() => onView(branchProduct)}>
							{barcode}
						</a>
					),
					name,
					balance: current_balance,
					actions: (
						<BranchProductsActions
							onEdit={() => onEdit(branchProduct)}
							onRemove={() => removeBranchProduct(id)}
						/>
					),
				};
			});

		setData(formattedBranchProducts);
		setTableData(formattedBranchProducts);
	}, [branchProducts]);

	// Effect: Reload the list if recent requests are Create, Edit or Remove
	useEffect(() => {
		const reloadListTypes = [types.CREATE_BRANCH_PRODUCT, types.EDIT_BRANCH_PRODUCT];

		if (status === request.SUCCESS && reloadListTypes.includes(recentRequest)) {
			setCreateEditBranchProductModalVisible(false);
			setSelectedBranchProduct(null);
		}
	}, [status, recentRequest]);

	const getProductOptions = useCallback(() => {
		const existingProductsIds = branchProducts.map(({ product_id }) => product_id);
		const filteredProducts = selectedBranchProduct
			? products
			: products.filter(({ id }) => !existingProductsIds.includes(id));

		return filteredProducts.map(({ id, name }) => ({
			name,
			value: id,
			selected: selectedBranchProduct?.product_id === id,
		}));
	}, [products, branchProducts, selectedBranchProduct]);

	const getSelectedProductBranchForView = useCallback(() => {
		const product = products.find(({ id }) => id === selectedBranchProduct?.product_id);
		return selectedBranchProduct && product
			? {
					...product,
					...selectedBranchProduct,
			  }
			: null;
	}, [selectedBranchProduct]);

	const getBreadcrumbItems = useCallback(
		() => [{ name: 'Branches', link: '/branches' }, { name: branch?.name }],
		[branch],
	);

	const onView = (branchProduct) => {
		setSelectedBranchProduct(branchProduct);
		setViewBranchProductModalVisible(true);
	};

	const onCreate = () => {
		setSelectedBranchProduct(null);
		setCreateEditBranchProductModalVisible(true);
	};

	const onEdit = (branch) => {
		setSelectedBranchProduct(branch);
		setCreateEditBranchProductModalVisible(true);
	};

	const onSearch = (keyword) => {
		const filteredData =
			keyword.length > 0
				? data.filter(({ _barcode, name }) => _barcode.includes(keyword) || name.includes(keyword))
				: data;

		setTableData(filteredData);
	};

	return (
		<Container title="View Branch" rightTitle={branch?.name} breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}>
			<section>
				<Box>
					<TableHeader
						title="Products"
						buttonName="Create Branch Product"
						onSearch={onSearch}
						onCreate={onCreate}
					/>

					<Table
						columns={columns}
						dataSource={tableData}
						scroll={{ y: height * 0.6, x: '100vw' }}
					/>

					<ViewBranchProductModal
						branchProduct={getSelectedProductBranchForView()}
						visible={viewBranchProductModalVisible && !!getSelectedProductBranchForView()}
						onClose={() => setViewBranchProductModalVisible(false)}
					/>

					<CreateEditBranchProductsModal
						branchId={branchId}
						branchProduct={selectedBranchProduct}
						productOptions={getProductOptions()}
						visible={createEditBranchProductModalVisible}
						onSubmit={selectedBranchProduct ? editBranchProduct : createBranchProduct}
						onClose={() => setCreateEditBranchProductModalVisible(false)}
						errors={errors}
						loading={status === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default Branches;
