import { Col, Input, Row, Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE } from 'global';
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
	const [baseURL, setBaseURL] = useState(null);

	// CUSTOM HOOKS
	const {
		data: { branches },
		isFetching: isFetchingBranches,
	} = useBranches({
		params: {
			baseURL,
			pageSize: MAX_PAGE_SIZE,
		},
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
								onFocus={(e) => {
									setBaseURL(e.target.value);
								}}
								onBlur={(e) => {
									setBaseURL(e.target.value);
								}}
								onChange={(e) => {
									setFieldValue('onlineApiUrl', e.target.value);
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
								className="w-100"
								filterOption={(input, option) =>
									option.children
										.toString()
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								optionFilterProp="children"
								value={values.branchId}
								size="large"
								allowClear={false}
								showSearch
								onChange={(value) => {
									setFieldValue('branchId', value);
								}}
								loading={isFetchingBranches}
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
						<Button type="button" text="Cancel" onClick={onClose} />
						<Button type="submit" text="Submit" variant="primary" />
					</div>
				</Form>
			)}
		</Formik>
	);
};
