import { message, Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { request } from '../../../../global/types';
import { useProducts } from '../../../../hooks/useProducts';
import { IProductCategory } from '../../../../models';
import { convertIntoArray } from '../../../../utils/function';
import '../style.scss';
import { CreateEditProductForm } from './CreateEditProductForm';

interface Props {
	product: any;
	productCategories: IProductCategory[];
	visible: boolean;
	onSuccess: any;
	onFetchPendingTransactions: any;
	onClose: any;
}

export const CreateEditProductModal = ({
	product,
	productCategories,
	visible,
	onSuccess,
	onFetchPendingTransactions,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		createProduct,
		editProduct,
		status: productsStatus,
		errors: productsErrors,
		reset,
	} = useProducts();

	// METHODS
	const onCreateProduct = (data, resetForm) => {
		createProduct(data, ({ status: requestStatus, response }) => {
			if (requestStatus === request.SUCCESS) {
				if (response?.pending_database_transactions?.length) {
					onPendingTransactions();
				}

				onSuccess();
				resetForm();

				reset();
				onClose();
			}
		});
	};

	const onEditProduct = (data, resetForm) => {
		editProduct(data, ({ status: requestStatus, response }) => {
			if (requestStatus === request.SUCCESS) {
				if (response?.pending_database_transactions?.length) {
					onPendingTransactions();
				}

				onSuccess();
				resetForm();

				reset();
				onClose();
			}
		});
	};

	const onPendingTransactions = () => {
		message.warning(
			'We found an error while updating the product details in local branch. Please check the pending transaction table below.',
		);
		onFetchPendingTransactions();
	};

	return (
		<Modal
			className="CreateEditProductModal modal-large"
			title={product ? 'Edit Product' : 'Create Product'}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<RequestErrors
				errors={convertIntoArray(productsErrors)}
				withSpaceBottom
			/>
			<CreateEditProductForm
				product={product}
				productCategories={productCategories}
				onSubmit={product ? onEditProduct : onCreateProduct}
				onClose={onClose}
				loading={productsStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
