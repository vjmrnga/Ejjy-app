import { Col, Divider, Row } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, InputLabel } from '../../../../components/elements';
import { sleep } from '../../../../utils/function';

interface ICreateBranch {
	id?: number;
	name: string;
}

interface Props {
	branch: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const CreateEditBranchForm = ({ branch, onSubmit, onClose, loading }: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				name: branch?.name || '',
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(50).label('Name'),
			}),
		}),
		[branch],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values: ICreateBranch) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				values.id = branch?.id;
				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ errors, touched }) => (
				<Form className="form">
					<Row>
						<Col span={24}>
							<InputLabel id="name" label="Name" />
							{errors.name && touched.name ? <FieldError error={errors.name} /> : null}
						</Col>
					</Row>

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							classNames="mr-10"
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
