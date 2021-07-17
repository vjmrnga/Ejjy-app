import { Radio, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import { TableActions, TableHeader } from '../../../../components';
import { ButtonLink, Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { RequestWarnings } from '../../../../components/RequestWarnings/RequestWarnings';
import { SHOW_HIDE_SHORTCUT } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchProducts } from '../../../../hooks/useBranchProducts';
import {
	confirmPassword,
	convertIntoArray,
	getKeyDownCombination,
} from '../../../../utils/function';
import { AddBranchProductBalanceModal } from './BranchProducts/AddBranchProductBalanceModal';
import { EditBranchProductsModal } from './BranchProducts/EditBranchProductsModal';
import { ViewBranchProductModal } from './BranchProducts/ViewBranchProductModal';

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Balance', dataIndex: 'balance', key: 'balance' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

interface Props {
	branch: any;
}

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
	const [isSoldInBranch, setIsSoldInBranch] = useState(true);

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
		getBranchProducts({ branchId: branch?.id, isSoldInBranch, page: 1 });
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
				isSoldInBranch,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	const onSearch = (keyword) => {
		const lowerCaseKeyword = keyword?.toLowerCase();
		getBranchProducts(
			{
				search: lowerCaseKeyword,
				branchId: branch?.id,
				isSoldInBranch,
				page: 1,
			},
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
		<div className="ViewBranchProducts">
			<TableHeader
				title="Products"
				buttonName="Create Branch Product"
				onSearch={onSearch}
			/>

			<Space
				className="ViewBranchProducts_filter"
				direction="vertical"
				size={15}
			>
				<Label label="Show Sold In Branch" />
				<Radio.Group
					options={[
						{ label: 'Show All', value: null },
						{ label: 'Show Not Sold', value: false },
						{ label: 'Show Sold Only', value: true },
					]}
					onChange={(e) => {
						const { value } = e.target;

						getBranchProducts(
							{
								search: searchedKeyword,
								branchId: branch?.id,
								isSoldInBranch: value,
								page: 1,
							},
							true,
						);
						setIsSoldInBranch(value);
					}}
					// eslint-disable-next-line react/jsx-boolean-value
					defaultValue={true}
					optionType="button"
				/>
			</Space>

			<br />
			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 800 }}
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
		</div>
	);
};
