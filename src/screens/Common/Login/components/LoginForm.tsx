import { RequestErrors } from 'components';
import { Button, FieldError, FormInputLabel } from 'components/elements';
import { Form, Formik } from 'formik';
import React from 'react';
import { convertIntoArray } from 'utils';
import * as Yup from 'yup';
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

interface Props {
	errors: string[];
	loading: boolean;
	onSubmit: any;
}

export const LoginForm = ({ errors, loading, onSubmit }: Props) => (
	<>
		<RequestErrors errors={convertIntoArray(errors)} withSpaceBottom />

		<Formik
			initialValues={FormDetails.DefaultValues}
			validationSchema={FormDetails.Schema}
			onSubmit={(formData) => {
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
						<FormInputLabel id="password" label="Password" type="password" />
						{formErrors.password && touched.password ? (
							<FieldError error={formErrors.password} />
						) : null}
					</div>

					<Button
						loading={loading}
						text="Login"
						type="submit"
						variant="secondary"
						block
					/>
				</Form>
			)}
		</Formik>
	</>
);
