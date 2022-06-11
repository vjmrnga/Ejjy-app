import { message, Modal } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { MAX_PAGE_SIZE } from 'global';
import {
	useBranchProductEdit,
	useBranchProductRetrieve,
	usePointSystemTags,
	useProductCreate,
	useProductEdit,
} from 'hooks';
import { IProductCategory } from 'models';
import React, { useState } from 'react';
import { convertIntoArray } from 'utils';
import { ModifyProductForm } from './ModifyProductForm';

interface Props {
	product: any;
	productCategories: IProductCategory[];
	onClose: any;
}

export const ModifyProductModal = ({
	product,
	productCategories,
	onClose,
}: Props) => {
	// STATES
	const [isCurrentBalanceVisible, setIsCurrentBalanceVisible] = useState(false);

	// CUSTOM HOOKS
	const { data: branchProduct, isFetching: isFetchingBranchProduct } =
		useBranchProductRetrieve({
			id: product?.id,
			options: {
				enabled: product !== null,
			},
		});
	const {
		data: { pointSystemTags },
		isFetching: isFetchingPointSystemTags,
	} = usePointSystemTags({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		mutateAsync: editBranchProduct,
		isLoading: isEditingBranchProduct,
		error: editBranchProductError,
	} = useBranchProductEdit();
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
	const onSubmit = async (formData) => {
		if (product) {
			await editProduct({
				id: product?.id,
				...formData,
			});
			await editBranchProduct({
				id: branchProduct?.id,
				...formData,
			});
			message.success('Product was edited successfully');
		} else {
			await createProduct(formData);
			message.success('Product was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			className="ModifyProduct Modal__large ModalLarge__scrollable"
			title={
				<>
					<span>{product ? '[Edit] Product' : '[Create] Product'}</span>
					<span className="ModalTitleMainInfo">{product?.name}</span>
				</>
			}
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createError?.errors),
					...convertIntoArray(editError?.errors),
					...convertIntoArray(editBranchProductError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyProductForm
				branchProduct={branchProduct}
				isCurrentBalanceVisible={isCurrentBalanceVisible}
				loading={
					isCreating ||
					isEditing ||
					isEditingBranchProduct ||
					isFetchingBranchProduct ||
					isFetchingPointSystemTags
				}
				onClose={onClose}
				onSubmit={onSubmit}
				product={product}
				productCategories={productCategories}
				pointSystemTags={pointSystemTags}
			/>
		</Modal>
	);
};
