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
	addItemInPagination: any;
	updateItemInPagination: any;
	onFetchPendingTransactions: any;
	onClose: any;
}

export const CreateEditProductModal = ({
	product,
	productCategories,
	visible,
	addItemInPagination,
	updateItemInPagination,
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
	const onCreateProduct = (data, onSuccess) => {
		createProduct(data, ({ status: requestStatus, response }) => {
			if (requestStatus === request.SUCCESS) {
				if (response?.pending_database_transactions?.length) {
					onPendingTransactions();
				}

				addItemInPagination(data);
				reset();
				onSuccess();
				onClose();
			}
		});
	};

	const onEditProduct = (data, onSuccess) => {
		editProduct(data, ({ status: requestStatus, response }) => {
			if (requestStatus === request.SUCCESS) {
				if (response?.pending_database_transactions?.length) {
					onPendingTransactions();
				}

				updateItemInPagination(data);
				reset();
				onSuccess();
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
