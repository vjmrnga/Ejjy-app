import { Modal } from 'antd';
import React from 'react';
import { FieldError, Label } from '../../../../components/elements';
import { CreatePurchaseRequestForm } from './CreatePurchaseRequestForm';

interface Props {
	visible: boolean;
	branchProducts: any;
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreatePurchaseRequestModal = ({
	branchProducts,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => {
	return (
		<Modal
			className="CreatePurchaseRequestModal"
			title="[CREATE] F-RS1"
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<Label label="Products" />
			<CreatePurchaseRequestForm
				branchProducts={branchProducts}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={loading}
			/>
		</Modal>
	);
};

CreatePurchaseRequestModal.defaultProps = {
	loading: false,
};
