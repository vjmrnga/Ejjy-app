import { Col, Input, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { useProductCategoryCreate, useProductCategoryEdit } from 'hooks';
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
			footer={null}
			title={`${productCategory ? '[Edit]' : '[Create]'} Product Category`}
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

			<ModifyProductCategoryForm
				isLoading={isCreating || isEditing}
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
				name: Yup.string().required().max(50).label('Name'),
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
							disabled={isLoading}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							loading={isLoading}
							text={productCategory ? 'Edit' : 'Create'}
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
