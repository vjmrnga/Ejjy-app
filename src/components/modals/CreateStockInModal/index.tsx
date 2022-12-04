import { Col, Modal, Row, Select } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE } from 'global';
import { useUsers } from 'hooks';
import React from 'react';
import { convertIntoArray, filterOption, getFullName } from 'utils';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel, Label } from '../../elements';

const formDetails = {
	defaultValues: {
		supplierName: '',
		supplierAddress: '',
		supplierTin: '',
		encodedById: null,
		checkedById: null,
	},
	schema: Yup.object().shape({
		supplierName: Yup.string().required().label('Supplier Name'),
		supplierAddress: Yup.string().required().label('Supplier Address'),
		supplierTin: Yup.string().required().label('Supplier TIN'),
		encodedById: Yup.number().nullable().required().label('Encoded By Id'),
		checkedById: Yup.number().nullable().required().label('Checked By Id'),
	}),
};

interface Props {
	onSubmit: any;
	onClose: any;
}

export const CreateStockInModal = ({ onSubmit, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	// METHODS

	return (
		<Modal
			footer={null}
			title="Stock In Details"
			width={600}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors errors={convertIntoArray(userError)} withSpaceBottom />

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
									disabled={isFetchingUsers}
									filterOption={(input, option) =>
										option.children
											.toString()
											.toLowerCase()
											.indexOf(input.toLowerCase()) >= 0
									}
									optionFilterProp="children"
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
								<Label id="checkedById" label="Checked By" spacing />
								<Select
									className="w-100"
									disabled={isFetchingUsers}
									filterOption={filterOption}
									optionFilterProp="children"
									value={values.checkedById}
									showSearch
									onChange={(value) => {
										setFieldValue('checkedById', value);
									}}
								>
									{users.map((user) => (
										<Select.Option key={user.id} value={user.id}>
											{getFullName(user)}
										</Select.Option>
									))}
								</Select>
								<ErrorMessage
									name="checkedById"
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
