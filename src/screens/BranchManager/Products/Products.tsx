import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Content, TableHeader } from '../../../components';
import { Box, ButtonLink } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranchProducts } from '../../../hooks/useBranchProducts';
import { getBranchProductStatus } from '../../../utils/function';
import { ViewProductModal } from './components/ViewProductModal';

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'RS ID', dataIndex: 'requisitionSlip' },
];

export const Products = () => {
	// STATES
	const [data, setData] = useState([]);
	const [viewBranchProductModalVisible, setViewBranchProductModalVisible] =
		useState(false);
	const [selectedBranchProduct, setSelectedBranchProduct] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		branchProducts,
		pageCount,
		pageSize,
		currentPage,
		getBranchProducts,
		status,
	} = useBranchProducts();

	// METHODS
	useEffect(() => {
		getBranchProducts({ branchId: user?.branch?.id, page: 1 });
	}, []);

	// Effect: Format branch products to be rendered in Table
	useEffect(() => {
		const formattedBranchProducts = branchProducts.map((branchProduct) => {
			const {
				product: { barcode, textcode, name },
				requisition_slip,
				product_status,
			} = branchProduct;

			const product = {
				...branchProduct?.product,
				max_balance: branchProduct?.max_balance,
				reorder_point: branchProduct?.reorder_point,
				price_per_piece: branchProduct?.price_per_piece,
				price_per_bulk: branchProduct?.price_per_bulk,
				allowable_spoilage: branchProduct?.allowable_spoilage,
				is_daily_checked: branchProduct?.is_daily_checked,
				is_vat_exempted: branchProduct?.is_vat_exempted,
			};

			return {
				_textcode: textcode,
				_barcode: barcode,
				barcode: (
					<ButtonLink
						text={barcode || textcode}
						onClick={() => onView(product)}
					/>
				),
				name,
				status: getBranchProductStatus(product_status),
				requisitionSlip: requisition_slip ? (
					<Link
						to={`/branch-manager/requisition-slips/${requisition_slip?.id}`}
					>
						{requisition_slip?.id}
					</Link>
				) : (
					EMPTY_CELL
				),
			};
		});

		setData(formattedBranchProducts);
	}, [branchProducts]);

	const onView = (branchProduct) => {
		setSelectedBranchProduct(branchProduct);
		setViewBranchProductModalVisible(true);
	};

	const onPageChange = (page, newPageSize) => {
		getBranchProducts(
			{ branchId: user?.branch?.id, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<Content title="Products">
			<Box>
				<TableHeader title="Products" buttonName="Create Branch Product" />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
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

				<ViewProductModal
					product={selectedBranchProduct}
					visible={viewBranchProductModalVisible}
					onClose={() => setViewBranchProductModalVisible(false)}
				/>
			</Box>
		</Content>
	);
};
