import { Col, Divider, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormSelect,
	Label,
} from '../../../../components/elements';
import { userTypeOptions } from '../../../../global/options';
import { userTypes } from '../../../../global/types';
import { sleep } from '../../../../utils/function';

interface ICreateUser {
	username: string;
	password: string;
	confirm_password: string;
	email: string;
	user_type: string;
	first_name: string;
	last_name: string;
	contact_number?: string;
}

interface Props {
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateUserForm = ({ onSubmit, onClose, loading }: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				username: '',
				password: '',
				confirm_password: '',
				email: '',
				user_type: userTypes.BRANCH_MANAGER,
				first_name: '',
				last_name: '',
				contact_number: null,
			},
			Schema: Yup.object().shape({
				first_name: Yup.string().required().label('First Name'),
				last_name: Yup.string().required().label('Last Name'),
				email: Yup.string().required().email().label('Email'),
				username: Yup.string().required().label('Username'),
				user_type: Yup.string().required().label('User Type'),
				password: Yup.string().required().label('Password'),
				confirm_password: Yup.string()
					.required()
					.oneOf([Yup.ref('password'), null], 'Passwords must match')
					.label('Confirm Password'),
			}),
		}),
		[],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData: ICreateUser, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit({
					...formData,
					confirm_password: undefined,
				});
				resetForm();
			}}
			enableReinitialize
		>
			<Form className="form">
				<Row gutter={[15, 15]}>
					<Col sm={12} xs={24}>
						<FormInputLabel id="first_name" label="First Name" />
						<ErrorMessage
							name="first_name"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col sm={12} xs={24}>
						<FormInputLabel id="last_name" label="Last Name" />
						<ErrorMessage
							name="last_name"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col sm={12} xs={24}>
						<FormInputLabel id="email" label="Email Address" />
						<ErrorMessage
							name="email"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col sm={12} xs={24}>
						<Label label="Type" spacing />
						<FormSelect id="user_type" options={userTypeOptions} />
						<ErrorMessage
							name="user_type"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Divider />

					<Col span={24}>
						<FormInputLabel id="username" label="Username" />
						<ErrorMessage
							name="username"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col sm={12} xs={24}>
						<FormInputLabel id="password" label="Password" type="password" />
						<ErrorMessage
							name="password"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col sm={12} xs={24}>
						<FormInputLabel
							id="confirm_password"
							label="Confirm Password"
							type="password"
						/>
						<ErrorMessage
							name="confirm_password"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

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
						text="Create"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
