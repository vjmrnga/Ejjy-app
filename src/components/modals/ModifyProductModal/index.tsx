import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { MAX_PAGE_SIZE } from 'global';
import {
	useAuth,
	usePointSystemTags,
	useProductCreate,
	useProductEdit,
} from 'hooks';
import React from 'react';
import { convertIntoArray, getId } from 'utils';
import { ModifyProductForm } from './ModifyProductForm';

interface Props {
	product: any;
	onClose: any;
}

export const ModifyProductModal = ({ product, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		data: { pointSystemTags },
		isFetching: isFetchingPointSystemTags,
	} = usePointSystemTags({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const { user } = useAuth();
	const {
		mutateAsync: createProduct,
		isLoading: isCreating,
		error: createError,
	} = useProductCreate();
	const {
		mutateAsync: editProduct,
		isLoading: isEditing,
		error: editError,
	} = useProductEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (product) {
			await editProduct({
				...formData,
				id: getId(product),
				actingUserId: getId(user),
			});
			message.success('Product was edited successfully');
		} else {
			await createProduct({
				...formData,
				actingUserId: getId(user),
			});
			message.success('Product was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			className="ModifyProduct Modal__large ModalLarge__scrollable"
			footer={null}
			title={
				<>
					<span>{product ? '[Edit] Product' : '[Create] Product'}</span>
					<span className="ModalTitleMainInfo">{product?.name}</span>
				</>
			}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createError?.errors),
					...convertIntoArray(editError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyProductForm
				isLoading={isCreating || isEditing || isFetchingPointSystemTags}
				pointSystemTags={pointSystemTags}
				product={product}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};
