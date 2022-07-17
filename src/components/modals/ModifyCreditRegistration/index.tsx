import { Col, message, Modal, Row, Select, Spin } from 'antd';
import { RequestErrors } from 'components';
import {
	Button,
	FieldError,
	FormattedInputNumber,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { SEARCH_DEBOUNCE_TIME } from 'global';
import {
	useAccounts,
	useCreditRegistrationsCreate,
	useCreditRegistrationsEdit,
} from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, getFullName } from 'utils';
import * as Yup from 'yup';

interface ModalProps {
	creditRegistration?: any;
	onSuccess: any;
	onClose: any;
}

export const ModifyCreditRegistrationModal = ({
	creditRegistration,
	onSuccess,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createCreditRegistration,
		isLoading: isCreateLoading,
		error: createError,
	} = useCreditRegistrationsCreate();
	const {
		mutateAsync: editCreditRegistration,
		isLoading: isEditLoading,
		error: editError,
	} = useCreditRegistrationsEdit();

	// METHODS
	const onSubmit = async (formData) => {
		if (creditRegistration) {
			await editCreditRegistration({
				id: creditRegistration.id,
				...formData,
			});
			message.success('Credit account was edited sucessfully.');
		} else {
			await createCreditRegistration(formData);
			message.success('Credit account was created sucessfully.');
		}

		onSuccess();
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
					...convertIntoArray(createError?.errors),
					...convertIntoArray(editError?.errors),
				]}
				withSpaceBottom
			/>

			<CreateCreditRegistrationForm
				creditRegistration={creditRegistration}
				loading={isCreateLoading || isEditLoading}
				onClose={onClose}
				onSubmit={onSubmit}
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

export const CreateCreditRegistrationForm = ({
	creditRegistration,
	loading,
	onSubmit,
	onClose,
}: FormProps) => {
	// STATES
	const [accountSearch, setAccountSearch] = useState('');

	// CUSTOM HOOKS
	const {
		isFetching,
		data: { accounts },
	} = useAccounts({ params: { search: accountSearch } });

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

	const onSearchDebounced = useCallback(
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
								defaultActiveFirstOption={false}
								disabled={creditRegistration !== null}
								filterOption={false}
								notFoundContent={isFetching ? <Spin size="small" /> : null}
								style={{ width: '100%' }}
								value={values.accountId}
								showSearch
								onChange={(value) => {
									setFieldValue('accountId', value);
								}}
								onSearch={onSearchDebounced}
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
								controls={false}
								size="large"
								style={{ width: '100%' }}
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
