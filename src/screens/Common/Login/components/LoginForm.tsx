import { Button, Col, Input, Row } from 'antd';
import { RequestErrors } from 'components';
import { FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
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
		username: Yup.string().required().label('Username').trim(),
		password: Yup.string().required().label('Password').trim(),
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
			{({ values, setFieldValue }) => (
				<Form className="w-100">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Username" spacing />
							<Input
								value={values['username']}
								onChange={(e) => {
									setFieldValue('username', e.target.value);
								}}
							/>
							<ErrorMessage
								name="username"
								render={(error) => <FieldError error={error} withSpaceTop />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Password" spacing />
							<Input.Password
								type="password"
								value={values['password']}
								onChange={(e) => {
									setFieldValue('password', e.target.value);
								}}
							/>
							<ErrorMessage
								name="password"
								render={(error) => <FieldError error={error} withSpaceTop />}
							/>
						</Col>

						<Col span={24}>
							<Button
								className="mt-2"
								htmlType="submit"
								loading={loading}
								type="primary"
								block
							>
								Login
							</Button>
						</Col>
					</Row>
				</Form>
			)}
		</Formik>
	</>
);
