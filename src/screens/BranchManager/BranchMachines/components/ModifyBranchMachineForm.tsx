import { Col } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { DetailsRow } from '../../../../components';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../components/elements';
import { sleep } from '../../../../utils/function';

interface Props {
	branchMachine?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyBranchMachineForm = ({
	branchMachine,
	loading,
	onSubmit,
	onClose,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: branchMachine?.id || null,
				name: branchMachine?.name || '',
				server_url: branchMachine?.server_url || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(30).label('Name'),
				server_url: Yup.string().required().max(50).label('Server URL'),
			}),
		}),
		[branchMachine],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);

				onSubmit(formData);
				setSubmitting(false);
			}}
			enableReinitialize
		>
			<Form className="form">
				<DetailsRow>
					<Col xs={24}>
						<FormInputLabel id="name" label="Name" />
						<ErrorMessage
							name="name"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>

					<Col xs={24}>
						<FormInputLabel id="server_url" label="Server URL" />
						<ErrorMessage
							name="server_url"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</DetailsRow>

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
						text={branchMachine ? 'Edit' : 'Create'}
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
