/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { TableActions, TableHeader, TableNormal } from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { EditBranchProductsModal } from './BranchProducts/EditBranchProductsModal';
import { ViewBranchProductModal } from './BranchProducts/ViewBranchProductModal';

interface Props {
	branchProducts: any;
	branch: any;
}

const columns = [{ name: 'Barcode' }, { name: 'Name' }, { name: 'Balance' }, { name: 'Actions' }];

export const ViewBranchProducts = ({ branchProducts, branch }: Props) => {
	// States
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [editBranchProductModalVisible, setEditBranchProductModalVisible] = useState(false);
	const [viewBranchProductModalVisible, setViewBranchProductModalVisible] = useState(false);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

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
				<ButtonLink text={barcode || textcode} onClick={() => onView(branchProduct)} />,
				name,
				`${current_balance} / ${max_balance}`,
				<TableActions onEdit={() => onEdit(branchProduct)} />,
			];
		});

		setData(formattedBranchProducts);
		setTableData(formattedBranchProducts);
	}, [branchProducts]);

	const onView = (branchProduct) => {
		setSelectedBranchProduct(branchProduct);
		setViewBranchProductModalVisible(true);
	};

	const onEdit = (branch) => {
		setSelectedBranchProduct(branch);
		setEditBranchProductModalVisible(true);
	};

	const onSearch = (keyword) => {
		keyword = keyword?.toLowerCase();

		const filteredData =
			keyword.length > 0
				? data.filter((item) => {
						const barcode = item?.[0]?.barcode?.toLowerCase() || '';
						const textcode = item?.[0]?.textcode?.toLowerCase() || '';
						const name = item?.[0]?.name?.toLowerCase() || '';

						return (
							name.includes(keyword) || barcode.includes(keyword) || textcode.includes(keyword)
						);
				  })
				: data;

		setData(filteredData);
	};

	return (
		<>
			<TableHeader title="Products" buttonName="Create Branch Product" onSearch={onSearch} />

			<TableNormal columns={columns} data={tableData} />

			<ViewBranchProductModal
				branchName={branch?.name}
				branchProduct={selectedBranchProduct}
				visible={viewBranchProductModalVisible}
				onClose={() => setViewBranchProductModalVisible(false)}
			/>

			<EditBranchProductsModal
				branch={branch}
				branchProduct={selectedBranchProduct}
				visible={editBranchProductModalVisible}
				onClose={() => setEditBranchProductModalVisible(false)}
			/>
		</>
	);
};
