import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../components/elements';
import { sleep } from '../../../../utils/function';

interface Props {
	productCategory: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditProductCategoryForm = ({
	productCategory,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				name: productCategory?.name || '',
				priority_level: 1000,
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
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(
					{
						...formData,
						id: productCategory?.id,
					},
					resetForm,
				);
			}}
			enableReinitialize
		>
			<Form className="form">
				<FormInputLabel id="name" label="Name" />
				<ErrorMessage
					name="name"
					render={(error) => <FieldError error={error} />}
				/>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						classNames="mr-10"
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text={productCategory ? 'Edit' : 'Create'}
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
