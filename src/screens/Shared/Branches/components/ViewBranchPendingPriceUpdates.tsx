import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { convertIntoArray } from 'utils';
import {
	RequestErrors,
	TableActions,
	TableHeader,
} from '../../../../components';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useBranchProductPendingPriceUpdates } from '../../../../hooks/useBranchProductPendingPriceUpdates';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Old Price', dataIndex: 'old_price' },
	{ title: 'New Price', dataIndex: 'new_price' },
	{ title: 'Action', dataIndex: 'action' },
];

interface Props {
	branchId: any;
}

export const ViewBranchPendingPriceUpdates = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		pendingPriceUpdates,
		pageCount,
		currentPage,
		pageSize,

		listBranchProductPendingPriceUpdates,
		applyBranchProductPendingPriceUpdate,
		status: branchProductPendingPriceUpdatesStatus,
		errors: branchProductPendingPriceUpdatesErrors,
	} = useBranchProductPendingPriceUpdates();

	// METHODS
	useEffect(() => {
		listBranchProductPendingPriceUpdates({ branchId, page: 1, pageSize });
	}, []);

	useEffect(() => {
		setData(
			pendingPriceUpdates.map((pendingPriceUpdate) => {
				const {
					id,
					branch_product: { product, price_per_piece },
					new_price,
				} = pendingPriceUpdate;

				return {
					name: product.name,
					old_price: Number(price_per_piece).toFixed(2),
					new_price: Number(new_price).toFixed(2),
					action: (
						<TableActions
							onApprove={() => {
								applyBranchProductPendingPriceUpdate(
									{
										id,
										branchId,
									},
									({ status }) => {
										if (status === request.SUCCESS) {
											listBranchProductPendingPriceUpdates(
												{
													branchId,
													page: 1,
												},
												true,
											);
										}
									},
								);
							}}
						/>
					),
				};
			}),
		);
	}, [pendingPriceUpdates]);

	const handlePageChange = (page, newPageSize) => {
		listBranchProductPendingPriceUpdates(
			{ branchId, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<div>
			<TableHeader title="Pending Price Updates" />

			<RequestErrors
				errors={convertIntoArray(branchProductPendingPriceUpdatesErrors)}
			/>

			<Table
				columns={columns}
				dataSource={data}
				loading={branchProductPendingPriceUpdatesStatus === request.REQUESTING}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: handlePageChange,
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				scroll={{ x: 650 }}
				bordered
			/>
		</div>
	);
};
