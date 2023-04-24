import { Col, message, Modal, Row, Select, Spin } from 'antd';
import { RequestErrors } from 'components';
import {
	Button,
	FieldError,
	FormattedInputNumber,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { MAX_PAGE_SIZE, SEARCH_DEBOUNCE_TIME } from 'global';
import {
	useAccounts,
	useCreditRegistrationCreate,
	useCreditRegistrationEdit,
} from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, getFullName, getId } from 'utils';
import * as Yup from 'yup';

interface ModalProps {
	creditRegistration?: any;
	onClose: any;
}

export const ModifyCreditRegistrationModal = ({
	creditRegistration,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createCreditRegistration,
		isLoading: isCreatingCreditRegistration,
		error: createCreditRegistrationError,
	} = useCreditRegistrationCreate();
	const {
		mutateAsync: editCreditRegistration,
		isLoading: isEditingCreditRegistration,
		error: editCreditRegistrationError,
	} = useCreditRegistrationEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (creditRegistration) {
			await editCreditRegistration({
				id: getId(creditRegistration),
				...formData,
			});
			message.success('Credit account was edited successfully.');
		} else {
			await createCreditRegistration(formData);
			message.success('Credit account was created successfully.');
		}

		onClose();
	};

	return (
		<Modal
			footer={null}
			title={`${creditRegistration ? '[Edit]' : '[Create]'} Credit Account`}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createCreditRegistrationError?.errors),
					...convertIntoArray(editCreditRegistrationError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyCreditRegistrationForm
				creditRegistration={creditRegistration}
				loading={isCreatingCreditRegistration || isEditingCreditRegistration}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</Modal>
	);
};

interface FormProps {
	creditRegistration?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyCreditRegistrationForm = ({
	creditRegistration,
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
			withCreditRegistration: false,
		},
	});

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				accountId: creditRegistration?.account?.id || '',
				creditLimit: creditRegistration?.credit_limit || '',
			},
			schema: Yup.object().shape({
				accountId: Yup.number().required().label('Account'),
				creditLimit: Yup.number().required().label('Credit Limit'),
			}),
		}),
		[creditRegistration],
	);

	const handleSearchDebounced = useCallback(
		debounce((search) => {
			setAccountSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Formik
			initialValues={getFormDetails().defaultValues}
			validationSchema={getFormDetails().schema}
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
								disabled={creditRegistration !== null}
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

						<Col span={24}>
							<Label label="Credit Limit" spacing />
							<FormattedInputNumber
								className="w-100"
								controls={false}
								value={values['creditLimit']}
								onChange={(value) => {
									setFieldValue('creditLimit', value);
								}}
							/>
							<ErrorMessage
								name="creditLimit"
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
							text={creditRegistration ? 'Edit' : 'Create'}
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
