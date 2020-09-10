import { Modal } from 'antd';
import React from 'react';
import { FieldError } from '../../../../../components/elements';
import { Option } from '../../../../../components/elements/Select/Select';
import { CreateEditBranchProductsForm } from './CreateEditBranchProductsForm';

interface Props {
	visible: boolean;
	branchId: number;
	branchProduct: any;
	productOptions: Option[];
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreateEditBranchProductsModal = ({
	branchId,
	branchProduct,
	productOptions,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => {
	return (
		<Modal
			title={branchProduct ? 'Edit Branch' : 'Create Branch'}
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
				productOptions={productOptions}
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
