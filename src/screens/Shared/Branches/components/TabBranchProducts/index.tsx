/* eslint-disable dot-notation */
import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Radio, Row, Select, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { TableActions, TableHeader } from 'components';
import { ButtonLink, Label } from 'components/elements';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	SEARCH_DEBOUNCE_TIME,
} from 'global';
import { useBranchProducts, useProductCategories, useQueryParams } from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray, formatQuantity, getId } from 'utils';
import { AddBranchProductBalanceModal } from './components/AddBranchProductBalanceModal';
import { EditBranchProductsModal } from './components/EditBranchProductsModal';
import { ViewBranchProductModal } from './components/ViewBranchProductModal';

const modals = {
	VIEW: 0,
	ADD: 1,
	EDIT: 2,
};

const isSoldInBranchOptions = {
	SHOW_ALL: 'show_all',
	SHOW_NOT_SOLD: 'show_not_sold',
	SHOW_IN_STOCK: 'show_in_stocks',
};

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Balance', dataIndex: 'balance' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	branch: any;
	disabled: boolean;
}

export const TabBranchProducts = ({ branch, disabled }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);
	const [modalType, setModalType] = useState(null);

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	const [isCurrentBalanceVisible] = useState(true);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams({
		onParamsCheck: (params) => {
			const newParams = {};

			if (!params.isSoldInBranch) {
				newParams['isSoldInBranch'] = isSoldInBranchOptions.SHOW_IN_STOCK;
			}

			return newParams;
		},
	});
	const {
		data: { branchProducts, total },
		isFetching: isFetchingBranchProducts,
		error: branchProductsErrors,
		refetch: refetchBranchProducts,
	} = useBranchProducts({
		params: {
			...params,
			branchId: branch.id,
			isSoldInBranch: (() => {
				let isSoldInBranch = null;
				if (params?.isSoldInBranch === isSoldInBranchOptions.SHOW_IN_STOCK) {
					isSoldInBranch = true;
				} else if (
					params?.isSoldInBranch === isSoldInBranchOptions.SHOW_NOT_SOLD
				) {
					isSoldInBranch = false;
				}

				return isSoldInBranch;
			})(),
		},
	});

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	// useEffect(() => {
	// 	document.addEventListener('keydown', handleKeyDown);

	// 	return () => {
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 	};
	// });

	// METHODS
	useEffect(() => {
		const formattedBranchProducts = branchProducts.map((branchProduct) => {
			const {
				id,
				product: {
					barcode,
					selling_barcode,
					packing_barcode,
					name,
					textcode,
					unit_of_measurement,
				},
				current_balance,
				max_balance,
			} = branchProduct;

			const currentBalance = (
				<Tooltip
					title={formatQuantity({
						unitOfMeasurement: unit_of_measurement,
						quantity: current_balance,
					})}
					overlayClassName="button-tooltip"
				>
					{formatQuantity({
						unitOfMeasurement: unit_of_measurement,
						quantity: current_balance,
						isCeiled: true,
					})}
				</Tooltip>
			);

			const maxBalance = formatQuantity({
				unitOfMeasurement: unit_of_measurement,
				quantity: max_balance,
			});

			return {
				key: id,
				barcode: (
					<ButtonLink
						text={barcode || selling_barcode || packing_barcode || textcode}
						onClick={() => {
							setSelectedBranchProduct(branchProduct);
							setModalType(modals.VIEW);
						}}
					/>
				),
				name,
				balance: (
					<>
						{isCurrentBalanceVisible ? currentBalance : '???'} / {maxBalance}
					</>
				),
				actions: (
					<TableActions
						areButtonsDisabled={disabled}
						onAddName="Supplier Delivery"
						onAdd={() => {
							setSelectedBranchProduct(branchProduct);
							setModalType(modals.ADD);
						}}
						onEdit={() => {
							setSelectedBranchProduct(branchProduct);
							setModalType(modals.EDIT);
						}}
					/>
				),
			};
		});

		setDataSource(formattedBranchProducts);
	}, [branchProducts, disabled]);

	// NOTE: Hiding/showing of current balance is temporarily disabled as requested by Emman
	// const handleKeyDown = (event) => {
	// 	const key = getKeyDownCombination(event);

	// 	if (SHOW_HIDE_SHORTCUT.includes(key) && modalType !== null) {
	// 		event.preventDefault();

	// 		if (isCurrentBalanceVisible) {
	// 			setIsCurrentBalanceVisible(false);
	// 		} else {
	// 			confirmPassword({
	// 				onSuccess: () => setIsCurrentBalanceVisible(true),
	// 			});
	// 		}
	// 	}
	// };

	return (
		<div>
			<TableHeader
				wrapperClassName="pt-0"
				title="Products"
				buttonName="Create Branch Product"
			/>

			<Filter
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

			<RequestErrors
				errors={convertIntoArray(branchProductsErrors, 'Branch Product')}
				withSpaceTop
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
				pagination={{
					current: Number(params.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !dataSource,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				bordered
				loading={isFetchingBranchProducts}
			/>

			{selectedBranchProduct && modalType === modals.VIEW && (
				<ViewBranchProductModal
					branchProduct={selectedBranchProduct}
					onClose={() => setModalType(null)}
				/>
			)}

			{selectedBranchProduct && modalType === modals.EDIT && (
				<EditBranchProductsModal
					branchId={getId(branch)}
					branchProduct={selectedBranchProduct}
					onSuccess={refetchBranchProducts}
					onClose={() => setModalType(null)}
				/>
			)}

			{selectedBranchProduct && modalType === modals.ADD && (
				<AddBranchProductBalanceModal
					branchId={getId(branch)}
					branchProduct={selectedBranchProduct}
					onSuccess={refetchBranchProducts}
					onClose={() => setModalType(null)}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	setQueryParams: any;
}

const Filter = ({ setQueryParams }: FilterProps) => {
	const { params } = useQueryParams();
	const {
		data: { productCategories },
		isFetching: isFetchingProductCategories,
	} = useProductCategories({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// METHODS
	const onSearchDebounced = useCallback(
		debounce((keyword) => {
			setQueryParams({ search: keyword });
		}, SEARCH_DEBOUNCE_TIME),
		[params],
	);

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Search" spacing />
				<Input
					prefix={<SearchOutlined />}
					defaultValue={params.search}
					onChange={(event) => onSearchDebounced(event.target.value.trim())}
					allowClear
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Product Category" spacing />
				<Select
					style={{ width: '100%' }}
					value={params.productCategory}
					onChange={(value) => {
						setQueryParams({ productCategory: value });
					}}
					loading={isFetchingProductCategories}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					{productCategories.map(({ name }) => (
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Show Sold In Branch" spacing />
				<Radio.Group
					value={params.isSoldInBranch}
					options={[
						{ label: 'Show All', value: isSoldInBranchOptions.SHOW_ALL },
						{
							label: 'Show Not Sold',
							value: isSoldInBranchOptions.SHOW_NOT_SOLD,
						},
						{
							label: 'Show In Stock',
							value: isSoldInBranchOptions.SHOW_IN_STOCK,
						},
					]}
					onChange={(e) => {
						const { value } = e.target;
						setQueryParams({ isSoldInBranch: value });
					}}
					optionType="button"
				/>
			</Col>
		</Row>
	);
};
