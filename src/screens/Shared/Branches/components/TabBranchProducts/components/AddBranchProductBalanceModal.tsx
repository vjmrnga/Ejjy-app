import { Descriptions, Divider, Modal } from 'antd';
import { RequestErrors } from 'components';
import { request, SHOW_HIDE_SHORTCUT } from 'global';
import { useBranchProducts } from 'hooks/useBranchProducts';
import React, { useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	confirmPassword,
	convertIntoArray,
	formatQuantity,
	getKeyDownCombination,
} from 'utils';
import '../../../style.scss';
import { AddBranchProductBalanceForm } from './AddBranchProductBalanceForm';

interface Props {
	branchId: any;
	branchProduct: any;
	onSuccess: any;
	onClose: any;
}

export const AddBranchProductBalanceModal = ({
	branchId,
	branchProduct,
	onSuccess,
	onClose,
}: Props) => {
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const {
		editBranchProductBalance,
		status: branchProductsStatus,
		errors: branchProductsErrors,
	} = useBranchProducts();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleSubmit = (data) => {
		editBranchProductBalance(
			{
				branchId,
				addedBalance: data.balance,
				productId: branchProduct.product.id,
				updatingUserId: user.id,
			},
			({ status }) => {
				if (status === request.SUCCESS) {
					onSuccess();
					onClose();
				}
			},
		);
	};

	const handleKeyDown = (event) => {
		const key = getKeyDownCombination(event);

		if (SHOW_HIDE_SHORTCUT.includes(key)) {
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
			className="AddBranchProductBalance"
			footer={null}
			title="Supplier Delivery"
			centered
			closable
			destroyOnClose
			visible
			onCancel={handleClose}
		>
			<RequestErrors
				errors={convertIntoArray(branchProductsErrors)}
				withSpaceBottom
			/>

			<Descriptions bordered>
				<Descriptions.Item label="Barcode">
					{branchProduct.product.barcode}
				</Descriptions.Item>
				<Descriptions.Item label="Textcode">
					{branchProduct.product.textcode}
				</Descriptions.Item>
				<Descriptions.Item label="Name">
					{branchProduct.product.name}
				</Descriptions.Item>
				<Descriptions.Item label="Max Balance">
					{formatQuantity({
						unitOfMeasurement: branchProduct.product.unit_of_measurement,
						quantity: branchProduct.max_balance,
					})}
				</Descriptions.Item>
				{isCurrentBalanceVisible && (
					<Descriptions.Item label="Current Balance">
						{formatQuantity({
							unitOfMeasurement: branchProduct.product.unit_of_measurement,
							quantity: branchProduct.current_balance,
						})}
					</Descriptions.Item>
				)}
			</Descriptions>

			<Divider dashed />

			<AddBranchProductBalanceForm
				branchProduct={branchProduct}
				loading={branchProductsStatus === request.REQUESTING}
				onClose={handleClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
