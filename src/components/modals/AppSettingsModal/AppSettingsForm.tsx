import { Col, Input, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	localApiUrl: any;
	onlineApiUrl: any;
	onSubmit: any;
	onClose: any;
}

export const AppSettingsForm = ({
	localApiUrl,
	onlineApiUrl,
	onSubmit,
	onClose,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				localApiUrl: localApiUrl || '',
				onlineApiUrl: onlineApiUrl || '',
			},
			Schema: Yup.object().shape({
				localApiUrl: Yup.string().required().label('Local API URL'),
				onlineApiUrl: Yup.string().required().label('Online API URL'),
			}),
		}),
		[localApiUrl, onlineApiUrl],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(values) => {
				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Local API URL" spacing />
							<Input
								name="localApiUrl"
								value={values['localApiUrl']}
								size="large"
								onChange={(e) => {
									setFieldValue('localApiUrl', e.target.value);
								}}
							/>
							<ErrorMessage
								name="localApiUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Online API URL" spacing />
							<Input
								name="onlineApiUrl"
								value={values['onlineApiUrl']}
								size="large"
								onChange={(e) => {
									setFieldValue('onlineApiUrl', e.target.value);
								}}
							/>
							<ErrorMessage
								name="onlineApiUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button type="button" text="Cancel" onClick={onClose} />
						<Button type="submit" text="Submit" variant="primary" />
					</div>
				</Form>
			)}
		</Formik>
	);
};
