import { Col, Input, Row, Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { useBranches } from 'hooks';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	branchId: string;
	localApiUrl: string;
	onlineApiUrl: string;
	onSubmit: any;
	onClose: any;
}

export const AppSettingsForm = ({
	branchId,
	localApiUrl,
	onlineApiUrl,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [baseURL, setBaseURL] = useState(onlineApiUrl || localApiUrl);

	// CUSTOM HOOKS
	const {
		data: { branches },
		isFetching: isFetchingBranches,
	} = useBranches({
		params: { baseURL },
	});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId: branchId || '',
				localApiUrl: localApiUrl || '',
				onlineApiUrl: onlineApiUrl || '',
			},
			Schema: Yup.object().shape({
				branchId: Yup.string().required().label('Branch'),
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
			enableReinitialize
			onSubmit={(values) => {
				onSubmit(values);
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Local API URL" spacing />
							<Input
								name="localApiUrl"
								size="large"
								value={values['localApiUrl']}
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
								size="large"
								value={values['onlineApiUrl']}
								onBlur={(e) => {
									setBaseURL(e.target.value);
								}}
								onChange={(e) => {
									setFieldValue('onlineApiUrl', e.target.value);
								}}
								onFocus={(e) => {
									setBaseURL(e.target.value);
								}}
							/>
							<ErrorMessage
								name="onlineApiUrl"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label label="Branch" spacing />
							<Select
								allowClear={false}
								className="w-100"
								filterOption={(input, option) =>
									option.children
										.toString()
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								loading={isFetchingBranches}
								optionFilterProp="children"
								size="large"
								value={values.branchId ? Number(values.branchId) : undefined}
								showSearch
								onChange={(value) => {
									setFieldValue('branchId', value);
								}}
							>
								{branches.map((branch) => (
									<Select.Option key={branch.id} value={branch.id}>
										{branch.name}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="branchId"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button text="Cancel" type="button" onClick={onClose} />
						<Button text="Submit" type="submit" variant="primary" />
					</div>
				</Form>
			)}
		</Formik>
	);
};
