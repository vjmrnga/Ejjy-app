import { Divider, Modal } from 'antd';
import React from 'react';
import { DetailsSingle } from '../../../../../components';
import { DetailsRow } from '../../../../../components/Details/DetailsRow';
import { FieldError } from '../../../../../components/elements';
import { request } from '../../../../../global/types';
import { useBranchProducts } from '../../../../../hooks/useBranchProducts';
import '../../style.scss';
import { AddBranchProductBalanceForm } from './AddBranchProductBalanceForm';

interface Props {
	branch: any;
	branchProduct: any;
	updateItemInPagination: any;
	visible: boolean;
	onClose: any;
}

export const AddBranchProductBalanceModal = ({
	branch,
	branchProduct,
	updateItemInPagination,
	visible,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		editBranchProductBalance,
		status: branchProductStatus,
		errors,
		reset,
	} = useBranchProducts();

	// METHODS
	const onAddBranchProductBalance = (value) => {
		editBranchProductBalance(
			{
				branchId: branch?.id,
				addedBalance: value.balance,
				productId: branchProduct.id,
			},
			({ status, data }) => {
				if (status === request.SUCCESS) {
					updateItemInPagination(data);
					reset();
					onClose();
				}
			},
		);
	};

	return (
		<Modal
			className="AddBranchProductBalanceModal"
			title="Add Balance"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
			destroyOnClose
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<DetailsRow>
				<DetailsSingle
					label="Barcode"
					value={
						branchProduct?.product?.barcode || branchProduct?.product?.textcode
					}
				/>
				<DetailsSingle label="Name" value={branchProduct?.product?.name} />
				<DetailsSingle label="Max Balance" value={branchProduct?.max_balance} />
				<DetailsSingle
					label="Current Balance"
					value={branchProduct?.current_balance}
				/>
			</DetailsRow>

			<Divider dashed />

			<AddBranchProductBalanceForm
				onSubmit={onAddBranchProductBalance}
				onClose={onClose}
				loading={branchProductStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
