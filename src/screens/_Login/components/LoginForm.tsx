import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../../components/elements';
import { sleep } from '../../../utils/function';
import '../style.scss';

export interface IFormValues {
	username: string;
	password: string;
}

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
	console.log('errors', errors);
	return (
		<>
			<div className="errors">
				{errors.map((error, index) => (
					<FieldError key={index} error={error} />
				))}
			</div>

			<Formik
				initialValues={FormDetails.DefaultValues}
				validationSchema={FormDetails.Schema}
				onSubmit={async (values: IFormValues) => {
					setIsSubmitting(true);
					await sleep(500);
					setIsSubmitting(false);
					onSubmit(values);
				}}
			>
				{({ errors, touched }) => (
					<Form className="form">
						<div className="input-field">
							<FormInputLabel id="username" label="Username" />
							{errors.username && touched.username ? <FieldError error={errors.username} /> : null}
						</div>

						<div className="input-field">
							<FormInputLabel type="password" id="password" label="Password" />
							{errors.password && touched.password ? <FieldError error={errors.password} /> : null}
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
