import { Divider, Modal } from 'antd';
import { SHOW_HIDE_SHORTCUT } from 'global/constants';
import React, { useEffect, useState } from 'react';
import { confirmPassword, getKeyDownCombination } from 'utils/function';
import { DetailsSingle } from '../../../../../components';
import { DetailsRow } from '../../../../../components/Details/DetailsRow';
import { FieldError } from '../../../../../components/elements';
import { request, unitOfMeasurementTypes } from '../../../../../global/types';
import { useAuth } from '../../../../../hooks/useAuth';
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
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		editBranchProductBalance,
		status: branchProductStatus,
		errors,
		reset,
	} = useBranchProducts();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const onAddBranchProductBalance = (value) => {
		editBranchProductBalance(
			{
				branchId: branch?.id,
				addedBalance: value.balance,
				productId: branchProduct.id,
				updatingUserId: user.id,
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

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key) && visible) {
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

	const handleClose = () => {
		setIsCurrentBalanceVisible(false);
		onClose();
	};

	return (
		<Modal
			className="AddBranchProductBalanceModal"
			title="Supplier Delivery"
			visible={visible}
			footer={null}
			onCancel={handleClose}
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
				{isCurrentBalanceVisible && (
					<DetailsSingle
						label="Current Balance"
						value={
							branchProduct?.product?.unit_of_measurement ===
							unitOfMeasurementTypes.WEIGHING
								? Number(branchProduct?.current_balance).toFixed(3)
								: branchProduct?.current_balance
						}
					/>
				)}
			</DetailsRow>

			<Divider dashed />

			<AddBranchProductBalanceForm
				onSubmit={onAddBranchProductBalance}
				onClose={handleClose}
				loading={branchProductStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
