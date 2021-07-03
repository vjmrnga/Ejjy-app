import { Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { TableActions, TableHeader, TableNormal } from '../../../../components';
import {
	ButtonLink,
	FieldError,
	FieldWarning,
} from '../../../../components/elements';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { AddBranchProductBalanceModal } from './BranchProducts/AddBranchProductBalanceModal';
import { EditBranchProductsModal } from './BranchProducts/EditBranchProductsModal';
import { ViewBranchProductModal } from './BranchProducts/ViewBranchProductModal';

interface Props {
	branch: any;
}

const columns = [
	{ name: 'Barcode' },
	{ name: 'Name' },
	{ name: 'Balance' },
	{ name: 'Actions' },
];

export const ViewBranchProducts = ({ branch }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [editBranchProductModalVisible, setEditBranchProductModalVisible] =
		useState(false);
	const [viewBranchProductModalVisible, setViewBranchProductModalVisible] =
		useState(false);
	const [addBranchProductModalVisible, setAddBranchProductModalVisible] =
		useState(false);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);
	const [searchedKeyword, setSeachedKeyword] = useState('');

	// CUSTOM HOOKS
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		updateItemInPagination,

		getBranchProducts,
		status,
		errors,
		warnings,
	} = useBranchProducts();

	// EFFECTS
	useEffect(() => {
		getBranchProducts({ branchId: branch?.id, page: 1 });
	}, []);

	// Effect: Format branch products to be rendered in Table
	useEffect(() => {
		const formattedBranchProducts = branchProducts.map((branchProduct) => {
			const {
				product: { barcode, name, textcode },
				current_balance,
				max_balance,
			} = branchProduct;

			return [
				{ isHidden: true, barcode, name, textcode },
				<ButtonLink
					text={barcode || textcode}
					onClick={() => onView(branchProduct)}
				/>,
				name,
				`${current_balance} / ${max_balance}`,
				<TableActions
					onAddName="Supplier Delivery"
					onAdd={() => onAdd(branchProduct)}
					onEdit={() => onEdit(branchProduct)}
				/>,
			];
		});

		setData(formattedBranchProducts);
	}, [branchProducts]);

	const onView = (branchProduct) => {
		setSelectedBranchProduct(branchProduct);
		setViewBranchProductModalVisible(true);
	};

	const onEdit = (branchProduct) => {
		setSelectedBranchProduct(branchProduct);
		setEditBranchProductModalVisible(true);
	};

	const onAdd = (branchProduct) => {
		setSelectedBranchProduct(branchProduct);
		setAddBranchProductModalVisible(true);
	};

	const onPageChange = (page, newPageSize) => {
		getBranchProducts(
			{
				search: searchedKeyword,
				branchId: branch?.id,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	const onSearch = (keyword) => {
		const lowerCaseKeyword = keyword?.toLowerCase();
		getBranchProducts(
			{ search: lowerCaseKeyword, branchId: branch?.id, page: 1 },
			true,
		);

		setSeachedKeyword(lowerCaseKeyword);
	};

	return (
		<>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}
			{warnings.map((warning, index) => (
				<FieldWarning key={index} error={warning} />
			))}

			<TableHeader
				title="Products"
				buttonName="Create Branch Product"
				onSearch={onSearch}
			/>

			<TableNormal
				columns={columns}
				data={data}
				loading={status === request.REQUESTING}
			/>

			<Pagination
				className="table-pagination"
				current={currentPage}
				total={pageCount}
				pageSize={pageSize}
				onChange={onPageChange}
				disabled={!data}
			/>

			<ViewBranchProductModal
				branchName={branch?.name}
				branchProduct={selectedBranchProduct}
				visible={viewBranchProductModalVisible}
				onClose={() => setViewBranchProductModalVisible(false)}
			/>

			<EditBranchProductsModal
				branch={branch}
				branchProduct={selectedBranchProduct}
				updateItemInPagination={updateItemInPagination}
				visible={editBranchProductModalVisible}
				onClose={() => setEditBranchProductModalVisible(false)}
			/>

			<AddBranchProductBalanceModal
				branch={branch}
				branchProduct={selectedBranchProduct}
				updateItemInPagination={updateItemInPagination}
				visible={addBranchProductModalVisible}
				onClose={() => setAddBranchProductModalVisible(false)}
			/>
		</>
	);
};
