import { Col, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../../components/elements';
import { sleep } from 'utils';

interface Props {
	branch: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditBranchForm = ({
	branch,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				name: branch?.name || '',
				online_url: branch?.online_url || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(50).label('Name'),
				online_url: Yup.string().required().max(75).label('Online URL'),
			}),
		}),
		[branch],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);
				onSubmit({
					...formData,
					id: branch?.id,
				});
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form">
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<FormInputLabel id="name" label="Name" />
							{errors.name && touched.name ? (
								<FieldError error={errors.name} />
							) : null}
						</Col>

						<Col span={24}>
							<FormInputLabel id="online_url" label="Online URL" />
							{errors.online_url && touched.online_url ? (
								<FieldError error={errors.online_url} />
							) : null}
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text={branch ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
