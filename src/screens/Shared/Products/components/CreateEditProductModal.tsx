import { message, Modal } from 'antd';
import React from 'react';
import { FieldInfo } from '../../../../components/elements';
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
	onSuccess: any;
	onFetchPendingTransactions: any;
	onClose: any;
}

export const CreateEditProductModal = ({
	product,
	productCategories,
	onSuccess,
	onFetchPendingTransactions,
	onClose,
}: Props) => {
	// VARIABLES
	const title = (
		<>
			<span>{product ? '[Edit] Product' : '[Create] Product'}</span>
			<span className="ModalTitleMainInfo">{product?.name}</span>
		</>
	);

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
			className="CreateEditProduct Modal__large ModalLarge__scrollable"
			title={title}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={convertIntoArray(productsErrors)}
				withSpaceBottom
			/>

			{product && (
				<FieldInfo
					message="Tick the checkboxes if you want to carry over the update to all the
				branches."
					withSpaceBottom
				/>
			)}

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
