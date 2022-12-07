import { Button, Col, Input, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components';
import { FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { useProductCategoryCreate, useProductCategoryEdit } from 'hooks';
import React, { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';

interface Props {
	productCategory: any;
	onClose: any;
}

export const ModifyProductCategoryModal = ({
	productCategory,
	onClose,
}: Props) => {
	// CUSTOM HOOKS
	const queryClient = useQueryClient();
	const {
		mutateAsync: createProductCategory,
		isLoading: isCreatingProductCategory,
		error: createProductCategoryError,
	} = useProductCategoryCreate();
	const {
		mutateAsync: editProductCategory,
		isLoading: isEditingProductCategory,
		error: editProductCategoryError,
	} = useProductCategoryEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (productCategory) {
			await editProductCategory(formData);
			queryClient.invalidateQueries('useProductCategories');
			message.success('Product category was edited successfully');
		} else {
			await createProductCategory(formData);
			message.success('Product category was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			footer={null}
			title={`${productCategory ? '[Edit]' : '[Create]'} Product Category`}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createProductCategoryError?.errors),
					...convertIntoArray(editProductCategoryError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyProductCategoryForm
				isLoading={isCreatingProductCategory || isEditingProductCategory}
				productCategory={productCategory}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

interface FormProps {
	productCategory: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyProductCategoryForm = ({
	productCategory,
	isLoading,
	onSubmit,
	onClose,
}: FormProps) => {
	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: productCategory?.id || null,
				name: productCategory?.name || '',
				priorityLevel: productCategory?.priority_level || 1000,
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().label('Name'),
			}),
		}),
		[productCategory],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Name" spacing />
							<Input
								name="name"
								value={values['name']}
								onChange={(e) => {
									setFieldValue('name', e.target.value);
								}}
							/>
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							disabled={isLoading}
							htmlType="button"
							size="large"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							htmlType="submit"
							loading={isLoading}
							size="large"
							type="primary"
						>
							{productCategory ? 'Edit' : 'Create'}
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
