import { Modal } from 'antd';
import React from 'react';
import { FieldError } from '../../../../../components/elements';
import { CreateEditBranchProductsForm } from './CreateEditBranchProductsForm';

interface Props {
	visible: boolean;
	branchName: string;
	branchId: number;
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreateEditBranchProductsModal = ({
	branchId,
	branchName,
	branchProduct,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => {
	return (
		<Modal
			title={`${branchProduct ? '[EDIT]' : '[CREATE]'} Product Details (${branchName})`}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<CreateEditBranchProductsForm
				branchId={branchId}
				branchProduct={branchProduct}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={loading}
			/>
		</Modal>
	);
};

CreateEditBranchProductsModal.defaultProps = {
	loading: false,
};
