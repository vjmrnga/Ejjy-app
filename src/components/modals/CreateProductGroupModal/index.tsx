import { Button, Col, Input, Modal, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { FieldError, Label } from '../../elements';

const formDetails = {
	defaultValues: {
		name: '',
	},
	schema: Yup.object().shape({
		name: Yup.string().required().label('Name'),
	}),
};

interface Props {
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateProductGroupModal = ({
	isLoading,
	onSubmit,
	onClose,
}: Props) => (
	<Modal
		footer={null}
		title="Product Group Details"
		centered
		closable
		visible
		onCancel={onClose}
	>
		<Formik
			initialValues={formDetails.defaultValues}
			validationSchema={formDetails.schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Name" spacing />
							<Input
								value={values['name']}
								onChange={(e) => {
									setFieldValue('name', e.target.value);
								}}
							/>
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button disabled={isLoading} htmlType="button" onClick={onClose}>
							Cancel
						</Button>
						<Button htmlType="submit" loading={isLoading} type="primary">
							Submit
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	</Modal>
);
