import { Col, Modal, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE } from 'global';
import { useUsers } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray, getFullName } from 'utils';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../elements';

interface Props {
	onSubmit: any;
	onClose: any;
}

export const CreateStockOutModal = ({ onSubmit, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isUsersFetching,
		error: usersError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				encodedById: null,
				overallRemarks: '',
			},
			schema: Yup.object().shape({
				encodedById: Yup.number().nullable().required().label('Encoded By Id'),
				overallRemarks: Yup.string().required().label('Overall Remarks'),
			}),
		}),
		[],
	);

	return (
		<Modal
			footer={null}
			title="Stock Out Details"
			width={600}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors errors={convertIntoArray(usersError)} withSpaceBottom />

			<Formik
				initialValues={getFormDetails().defaultValues}
				validationSchema={getFormDetails().schema}
				onSubmit={(formData) => {
					onSubmit(formData);
				}}
			>
				{({ values, setFieldValue }) => (
					<Form>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<Label id="encodedById" label="Encoded By" spacing />
								<Select
									disabled={isUsersFetching}
									filterOption={(input, option) =>
										option.children
											.toString()
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
									optionFilterProp="children"
									size="large"
									style={{ width: '100%' }}
									value={values.encodedById}
									showSearch
									onChange={(value) => {
										setFieldValue('encodedById', value);
									}}
								>
									{users.map((user) => (
										<Select.Option key={user.id} value={user.id}>
											{getFullName(user)}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="encodedById"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
							<Col span={24}>
								<Label id="overallRemarks" label="Overall Remarks" spacing />
								<TextArea
									rows={2}
									onChange={(e) => {
										setFieldValue('overallRemarks', e.target.value);
									}}
								/>
								<ErrorMessage
									name="overallRemarks"
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
		</Modal>
	);
};
