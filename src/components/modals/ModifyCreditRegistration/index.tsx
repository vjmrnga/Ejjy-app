import { Col, message, Modal, Row, Select, Spin } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, FormInputLabel, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { SEARCH_DEBOUNCE_TIME } from 'global';
import {
	useAccounts,
	useCreditRegistrationsCreate,
	useCreditRegistrationsEdit,
} from 'hooks';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, getFullName } from 'utils/function';
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
			message.success('Credit registration was edited sucessfully.');
		} else {
			await createCreditRegistration(formData);
			message.success('Credit registration was created sucessfully.');
		}

		onSuccess();
		onClose();
	};

	return (
		<Modal
			className="CreateCreditRegistrationModal"
			title="[Create] Credit Registration"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createError),
					...convertIntoArray(editError),
				]}
				withSpaceBottom
			/>

			<CreateCreditRegistrationForm
				creditRegistration={creditRegistration}
				loading={isCreateLoading || isEditLoading}
				onSubmit={onSubmit}
				onClose={onClose}
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
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[15, 15]}>
						<Col span={24}>
							<Label label="Account" spacing />
							<Select
								style={{ width: '100%' }}
								filterOption={false}
								defaultActiveFirstOption={false}
								onSearch={onSearchDebounced}
								notFoundContent={isFetching ? <Spin size="small" /> : null}
								value={values.accountId}
								onChange={(value) => {
									setFieldValue('accountId', value);
								}}
								disabled={creditRegistration !== null}
								showSearch
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
							<FormInputLabel
								type="number"
								id="creditLimit"
								label="Credit Limit"
							/>
							<ErrorMessage
								name="creditLimit"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={loading}
						/>
						<Button
							type="submit"
							text="Create"
							variant="primary"
							loading={loading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
