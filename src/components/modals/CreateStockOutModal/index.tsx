import { Col, Modal, Row, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE } from 'global';
import { useUsers } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray, getFullName } from 'utils/function';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel, Label } from '../../elements';

interface Props {
	onSubmit: any;
	onClose: any;
}

export const CreateStockOutModal = ({ onSubmit, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching,
		error,
	} = useUsers({
		params: {
			page: 1,
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				supplierName: '',
				supplierAddress: '',
				supplierTin: '',
				encodedById: null,
				overallRemarks: '',
			},
			schema: Yup.object().shape({
				supplierName: Yup.string().required().label('Supplier Name'),
				supplierAddress: Yup.string().required().label('Supplier Address'),
				supplierTin: Yup.string().required().label('Supplier TIN'),
				encodedById: Yup.number().nullable().required().label('Encoded By Id'),
				overallRemarks: Yup.string().required().label('Overall Remarks'),
			}),
		}),
		[],
	);

	return (
		<Modal
			title="Stock Out Details"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
			width={600}
		>
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

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
								<FormInputLabel id="supplierName" label="Supplier Name" />
								<ErrorMessage
									name="supplierName"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
							<Col span={24}>
								<FormInputLabel id="supplierAddress" label="Supplier Address" />
								<ErrorMessage
									name="supplierAddress"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
							<Col span={24}>
								<FormInputLabel id="supplierTin" label="Supplier TIN" />
								<ErrorMessage
									name="supplierTin"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
							<Col span={24}>
								<Label id="encodedById" label="Encoded By" spacing />
								<Select
									size="large"
									style={{ width: '100%' }}
									value={values.encodedById}
									onChange={(value) => {
										setFieldValue('encodedById', value);
									}}
									optionFilterProp="children"
									filterOption={(input, option) =>
										option.children
											.toString()
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
									disabled={isFetching}
									showSearch
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
								<Label id="overallRemarks" label="Overall Remarks" />
								<TextArea
									rows={2}
									onChange={(e) => {
										setFieldValue('overallRemarks', e.target.value);
									}}
								/>
								<ErrorMessage
									name="supplierTin"
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
		</Modal>
	);
};
