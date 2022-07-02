import { Col, Form, Input, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, Label } from 'components/elements';
import { ErrorMessage, Formik } from 'formik';
import { useProductCategoryCreate, useProductCategoryEdit } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import React, { useCallback } from 'react';
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
	const {
		mutateAsync: createProductCategory,
		isLoading: isCreating,
		error: createError,
	} = useProductCategoryCreate();
	const {
		mutateAsync: editProductCategory,
		isLoading: isEditing,
		error: editError,
	} = useProductCategoryEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (productCategory) {
			await editProductCategory(formData);
			message.success('Product category was edited successfully');
		} else {
			await createProductCategory(formData);
			message.success('Product category was created successfully');
		}

		onClose();
	};

	return (
		<Modal
			title={`${productCategory ? '[Edit]' : '[Create]'} Product Category`}
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
				]}
				withSpaceBottom
			/>

			<ModifyProductCategoryForm
				productCategory={productCategory}
				isLoading={isCreating || isEditing}
				onSubmit={handleSubmit}
				onClose={onClose}
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
	// CUSTOM HOOKS
	const { user } = useAuth();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: productCategory?.id || null,
				name: productCategory?.name || '',
				priorityLevel: productCategory?.priority_level || 1000,
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(50).label('Name'),
			}),
		}),
		[productCategory],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col xs={24}>
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
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							text={productCategory ? 'Edit' : 'Create'}
							variant="primary"
							loading={isLoading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
