import { Modal } from 'antd';
import React from 'react';
import { FieldError } from '../../../../components/elements';
import { CreateEditProductForm } from './CreateEditProductForm';

interface Props {
	visible: boolean;
	product: any;
	onSubmit: any;
	onClose: any;
	errors: string[];
	loading: boolean;
}

export const CreateEditProductModal = ({
	product,
	visible,
	onSubmit,
	onClose,
	errors,
	loading,
}: Props) => {
	return (
		<Modal
			className="CreateEditProductModal"
			title={product ? 'Edit Product' : 'Add Product'}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			{errors.map((error, index) => (
				<FieldError key={index} error={error} />
			))}

			<CreateEditProductForm
				product={product}
				onSubmit={onSubmit}
				onClose={onClose}
				loading={loading}
			/>
		</Modal>
	);
};

CreateEditProductModal.defaultProps = {
	loading: false,
};
