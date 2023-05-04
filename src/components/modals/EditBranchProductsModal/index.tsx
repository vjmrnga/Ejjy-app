import { Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { SHOW_HIDE_SHORTCUT } from 'global';
import { useBranchProductEdit } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	confirmPassword,
	convertIntoArray,
	getKeyDownCombination,
} from 'utils';
import { EditBranchProductsForm } from './EditBranchProductsForm';

interface Props {
	branchId: any;
	branchProduct: any;
	onSuccess: any;
	onClose: any;
}

export const EditBranchProductsModal = ({
	branchId,
	branchProduct,
	onSuccess,
	onClose,
}: Props) => {
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const {
		mutateAsync: editBranchProduct,
		isLoading: isEditingBranchProduct,
		error: editBranchProductError,
	} = useBranchProductEdit();

	// METHODS
	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleSubmit = async (formData) => {
		// await editBranchProduct({
		// 	...formData,
		// 	...product,
		// 	branchId,
		// });
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

	return (
		<Modal
			className="Modal__large ModalLarge__scrollable"
			footer={null}
			title={
				<>
					<span>{branchProduct ? '[Edit]' : '[Create]'} Branch Product</span>
					<span className="ModalTitleMainInfo">
						{branchProduct.product.name}
					</span>
				</>
			}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(editBranchProductError?.errors)}
				withSpaceBottom
			/>

			<EditBranchProductsForm
				branchProduct={branchProduct}
				isCurrentBalanceVisible={isCurrentBalanceVisible}
				isLoading={isEditingBranchProduct}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
