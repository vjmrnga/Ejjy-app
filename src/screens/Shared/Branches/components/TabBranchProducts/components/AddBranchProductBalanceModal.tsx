import { Divider, Modal } from 'antd';
import { DetailsSingle, RequestErrors } from 'components';
import { DetailsRow } from 'components/Details/DetailsRow';
import { request, SHOW_HIDE_SHORTCUT } from 'global';
import { useAuth } from 'hooks/useAuth';
import { useBranchProducts } from 'hooks/useBranchProducts';
import React, { useEffect, useState } from 'react';
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
	const { user } = useAuth();
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

	const onAddBranchProductBalance = (data) => {
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

			<DetailsRow>
				<DetailsSingle label="Barcode" value={branchProduct.product.barcode} />
				<DetailsSingle
					label="Textcode"
					value={branchProduct.product.textcode}
				/>
				<DetailsSingle label="Name" value={branchProduct.product.name} />
				<DetailsSingle
					label="Max Balance"
					value={formatQuantity({
						unitOfMeasurement: branchProduct.product.unit_of_measurement,
						quantity: branchProduct.max_balance,
					})}
				/>
				{isCurrentBalanceVisible && (
					<DetailsSingle
						label="Current Balance"
						value={formatQuantity({
							unitOfMeasurement: branchProduct.product.unit_of_measurement,
							quantity: branchProduct.current_balance,
						})}
					/>
				)}
			</DetailsRow>

			<Divider dashed />

			<AddBranchProductBalanceForm
				branchProduct={branchProduct}
				loading={branchProductsStatus === request.REQUESTING}
				onClose={handleClose}
				onSubmit={onAddBranchProductBalance}
			/>
		</Modal>
	);
};
