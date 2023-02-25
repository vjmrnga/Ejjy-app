import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { useBalanceAdjustmentLogCreate } from 'hooks';
import React from 'react';
import { useUserStore } from 'stores';
import { convertIntoArray } from 'utils';
import { CreateBalanceAdjustmentLogForm } from './CreateBalanceAdjustmentLogForm';

interface Props {
	branchProduct: any;
	onSuccess: any;
	onClose: any;
}

export const CreateBalanceAdjustmentLogModal = ({
	branchProduct,
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const user = useUserStore((state) => state.user);
	const {
		mutateAsync: createBalanceAdjustmentLog,
		isLoading: isCreatingBalanceAdjustmentLog,
		error: createBalanceAdjustmentLogError,
	} = useBalanceAdjustmentLogCreate();

	// METHODS
	const handleSubmit = async (formData) => {
		await createBalanceAdjustmentLog({
			branchProductId: branchProduct.id,
			creatingUserId: user.id,
			newBalance: formData.newBalance,
		});
		message.success('Balance adjustment log was created successfully.');

		onSuccess();
		onClose();
	};

	return (
		<Modal
			footer={null}
			title={
				<>
					<span>Bal Adjustment</span>
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
				errors={convertIntoArray(createBalanceAdjustmentLogError?.errors)}
				withSpaceBottom
			/>

			<CreateBalanceAdjustmentLogForm
				branchProduct={branchProduct}
				loading={isCreatingBalanceAdjustmentLog}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
