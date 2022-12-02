import { Col, message, Modal, Row, Select, Spin } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE, SEARCH_DEBOUNCE_TIME } from 'global';
import { useAccounts, useSupplierRegistrationCreate } from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, getFullName } from 'utils';
import * as Yup from 'yup';

interface ModalProps {
	onClose: any;
}

export const CreateSupplierRegistrationModal = ({ onClose }: ModalProps) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createSupplierRegistration,
		isLoading: isCreatingSupplierRegistration,
		error: createSupplierRegistrationError,
	} = useSupplierRegistrationCreate();

	// METHODS
	const handleSubmit = async (formData) => {
		await createSupplierRegistration(formData);
		message.success('Supplier account was created sucessfully.');

		onClose();
	};

	return (
		<Modal
			footer={null}
			title="[Create] Supplier Account"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={convertIntoArray(createSupplierRegistrationError?.errors)}
				withSpaceBottom
			/>

			<CreateSupplierRegistrationForm
				loading={isCreatingSupplierRegistration}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

interface FormProps {
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

const formDetails = {
	defaultValues: {
		accountId: '',
	},
	schema: Yup.object().shape({
		accountId: Yup.number().required().label('Account'),
	}),
};

export const CreateSupplierRegistrationForm = ({
	loading,
	onSubmit,
	onClose,
}: FormProps) => {
	// STATES
	const [accountSearch, setAccountSearch] = useState('');

	// CUSTOM HOOKS
	const {
		data: { accounts },
		isFetching: isFetchingAccounts,
	} = useAccounts({
		params: {
			pageSize: MAX_PAGE_SIZE,
			search: accountSearch,
			withSupplierRegistration: false,
		},
	});

	// METHODS
	const handleSearchDebounced = useCallback(
		debounce((search) => {
			setAccountSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Formik
			initialValues={formDetails.defaultValues}
			validationSchema={formDetails.schema}
			enableReinitialize
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Account" spacing />
							<Select
								className="w-100"
								defaultActiveFirstOption={false}
								filterOption={false}
								notFoundContent={
									isFetchingAccounts ? <Spin size="small" /> : null
								}
								value={values['accountId']}
								showSearch
								onChange={(value) => {
									setFieldValue('accountId', value);
								}}
								onSearch={handleSearchDebounced}
							>
								{accounts.map((account) => (
									<Select.Option key={account.id} value={account.id}>
										{getFullName(account)}
									</Select.Option>
								))}
							</Select>
							<ErrorMessage
								name="accountId"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							disabled={loading}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							loading={loading}
							text="Create"
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
