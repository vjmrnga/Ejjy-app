import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../components/elements';
import { RequestErrors } from '../../../components/RequestErrors/RequestErrors';
import { convertIntoArray, sleep } from '../../../utils/function';
import '../style.scss';

const FormDetails = {
	DefaultValues: {
		username: '',
		password: '',
	},
	Schema: Yup.object().shape({
		username: Yup.string().required('Username is required'),
		password: Yup.string().required('Password is required'),
	}),
};

interface ILoginForm {
	errors: string[];
	onSubmit: any;
	loading: boolean;
}

export const LoginForm = ({ loading, errors, onSubmit }: ILoginForm) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	return (
		<>
			<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

			<Formik
				initialValues={FormDetails.DefaultValues}
				validationSchema={FormDetails.Schema}
				onSubmit={async (formData) => {
					setIsSubmitting(true);
					await sleep(500);
					setIsSubmitting(false);
					onSubmit(formData);
				}}
			>
				{({ errors: formErrors, touched }) => (
					<Form className="form">
						<div className="input-field">
							<FormInputLabel id="username" label="Username" />
							{formErrors.username && touched.username ? (
								<FieldError error={formErrors.username} />
							) : null}
						</div>

						<div className="input-field">
							<FormInputLabel type="password" id="password" label="Password" />
							{formErrors.password && touched.password ? (
								<FieldError error={formErrors.password} />
							) : null}
						</div>

						<Button
							type="submit"
							text="Login"
							variant="secondary"
							loading={loading || isSubmitting}
							block
						/>
					</Form>
				)}
			</Formik>
		</>
	);
};
