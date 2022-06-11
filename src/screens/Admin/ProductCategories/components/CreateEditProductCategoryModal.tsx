import { Modal } from 'antd';
import React from 'react';
import { RequestErrors } from '../../../../components';
import { request } from '../../../../global/types';
import { useProductCategories } from '../../../../hooks/useProductCategories';
import { convertIntoArray } from 'utils';
import { CreateEditProductCategoryForm } from './CreateEditProductCategoryForm';

interface Props {
	visible: boolean;
	productCategory: any;
	onClose: any;
	onSuccess: any;
}

export const CreateEditProductCategoryModal = ({
	productCategory,
	visible,
	onSuccess,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const {
		createProductCategory,
		editProductCategory,
		status: productCategoriesStatus,
		errors,
		reset,
	} = useProductCategories();

	// METHODS
	const onCreate = (data, resetForm) => {
		createProductCategory(data, ({ status }) => {
			if (status === request.SUCCESS) {
				reset();
				resetForm();
				onClose();
				onSuccess();
			}
		});
	};

	const onEdit = (data, resetForm) => {
		editProductCategory(data, ({ status }) => {
			if (status === request.SUCCESS) {
				reset();
				resetForm();
				onClose();
				onSuccess();
			}
		});
	};

	return (
		<Modal
			title={
				productCategory
					? '[Edit] Product Category'
					: '[Create] Product Category'
			}
			visible={visible}
			footer={null}
			onCancel={onClose}
			centered
			closable
		>
			<RequestErrors
				className="PaddingHorizontal"
				errors={convertIntoArray(errors)}
				withSpaceBottom
			/>

			<CreateEditProductCategoryForm
				productCategory={productCategory}
				onSubmit={productCategory ? onEdit : onCreate}
				onClose={onClose}
				loading={productCategoriesStatus === request.REQUESTING}
			/>
		</Modal>
	);
};
