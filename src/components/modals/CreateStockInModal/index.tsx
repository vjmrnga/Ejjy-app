import { Button, Col, Input, Modal, Row, Select } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE } from 'global';
import { useUsers } from 'hooks';
import React from 'react';
import { convertIntoArray, filterOption, getFullName } from 'utils';
import * as Yup from 'yup';
import { FieldError, Label } from '../../elements';

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
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateStockInModal = ({ isLoading, onSubmit, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<Modal
			footer={null}
			title="Stock In Details"
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
								<Label label="Supplier Name" spacing />
								<Input
									name="supplierName"
									value={values['supplierName']}
									onChange={(e) => {
										setFieldValue('supplierName', e.target.value);
									}}
								/>
								<ErrorMessage
									name="supplierName"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>

							<Col span={24}>
								<Label label="Supplier Address" spacing />
								<Input
									name="supplierAddress"
									value={values['supplierAddress']}
									onChange={(e) => {
										setFieldValue('supplierAddress', e.target.value);
									}}
								/>
								<ErrorMessage
									name="supplierAddress"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
							<Col span={24}>
								<Label label="Supplier TIN" spacing />
								<Input
									name="supplierTin"
									value={values['supplierTin']}
									onChange={(e) => {
										setFieldValue('supplierTin', e.target.value);
									}}
								/>
								<ErrorMessage
									name="supplierTin"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
							<Col span={24}>
								<Label id="encodedById" label="Encoded By" spacing />
								<Select
									className="w-100"
									disabled={isFetchingUsers}
									filterOption={filterOption}
									optionFilterProp="children"
									value={values['encodedById']}
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
									value={values['checkedById']}
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
};
