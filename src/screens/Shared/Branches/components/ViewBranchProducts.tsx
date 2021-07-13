import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { RequestWarnings } from 'components/RequestWarnings/RequestWarnings';
import { SHOW_HIDE_SHORTCUT } from 'global/constants';
import React, { useEffect, useState } from 'react';
import {
	confirmPassword,
	convertIntoArray,
	getKeyDownCombination,
} from 'utils/function';
import { TableActions, TableHeader } from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import { AddBranchProductBalanceModal } from './BranchProducts/AddBranchProductBalanceModal';
import { EditBranchProductsModal } from './BranchProducts/EditBranchProductsModal';
import { ViewBranchProductModal } from './BranchProducts/ViewBranchProductModal';

interface Props {
	branch: any;
}

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Balance', dataIndex: 'balance', key: 'balance' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

export const ViewBranchProducts = ({ branch }: Props) => {
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);
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
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

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

			return {
				barcode: (
					<ButtonLink
						text={barcode || textcode}
						onClick={() => onView(branchProduct)}
					/>
				),
				name,
				balance: `${
					isCurrentBalanceVisible ? current_balance : '???'
				} / ${max_balance}`,
				actions: (
					<TableActions
						onAddName="Supplier Delivery"
						onAdd={() => onAdd(branchProduct)}
						onEdit={() => onEdit(branchProduct)}
					/>
				),
			};
		});

		setData(formattedBranchProducts);
	}, [isCurrentBalanceVisible, branchProducts]);

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

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (
			SHOW_HIDE_SHORTCUT.includes(key) &&
			![
				viewBranchProductModalVisible,
				editBranchProductModalVisible,
				addBranchProductModalVisible,
			].includes(true)
		) {
			event.preventDefault();

			if (isCurrentBalanceVisible) {
				setIsCurrentBalanceVisible(false);
			} else {
				confirmPassword({
					onSuccess: () => setIsCurrentBalanceVisible(true),
				});
			}
		}
	};

	return (
		<>
			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<TableHeader
				title="Products"
				buttonName="Create Branch Product"
				onSearch={onSearch}
			/>

			<Table
				columns={columns}
				dataSource={data}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: onPageChange,
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={status === request.REQUESTING}
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
