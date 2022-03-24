import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInput,
	Label,
} from '../../../../components/elements';
import { sleep } from '../../../../utils/function';

interface Props {
	localIpAddress: string;
	onSubmit: any;
	onClose: any;
}

export const SettingUrlForm = ({
	localIpAddress,
	onSubmit,
	onClose,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				localIpAddress: localIpAddress || '',
			},
			Schema: Yup.object().shape({
				localIpAddress: Yup.string().required().label('Local API URL'),
			}),
		}),
		[localIpAddress],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
				resetForm();
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form">
					<Label id="localIpAddress" label="Local API URL" spacing />
					<FormInput id="localIpAddress" />
					{errors.localIpAddress && touched.localIpAddress ? (
						<FieldError error={errors.localIpAddress} />
					) : null}

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isSubmitting}
						/>
						<Button
							type="submit"
							text="Submit"
							variant="primary"
							loading={isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
