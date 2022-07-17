import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { useBalanceAdjustmentLogCreate } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import React from 'react';
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
	// VARIABLES
	const title = (
		<>
			<span>Bal Adjustment</span>
			<span className="ModalTitleMainInfo">{branchProduct?.product?.name}</span>
		</>
	);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		mutateAsync: createBalanceAdjustmentLog,
		isLoading: isCreating,
		error: createError,
	} = useBalanceAdjustmentLogCreate();

	// METHODS
	const onSubmit = async (formData) => {
		await createBalanceAdjustmentLog({
			branchProductId: branchProduct.id,
			creatingUserId: user.id,
			newBalance: formData.newBalance,
		});
		message.success('Balance adjustment log was created sucessfully.');

		onSuccess();
		onClose();
	};

	return (
		<Modal
			footer={null}
			title={title}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(createError?.errors)}
				withSpaceBottom
			/>

			<CreateBalanceAdjustmentLogForm
				branchProduct={branchProduct}
				loading={isCreating}
				onClose={onClose}
				onSubmit={onSubmit}
			/>
		</Modal>
	);
};
