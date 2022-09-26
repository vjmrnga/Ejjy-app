import { Col, Input, message, Modal, Row, Select, Spin } from 'antd';
import { RequestErrors } from 'components';
import {
	Button,
	FieldError,
	FormattedInputNumber,
	FormInputLabel,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { orderOfPaymentPurposes, SEARCH_DEBOUNCE_TIME } from 'global';
import {
	useAccounts,
	useCheckInvoiceValidity,
	useOrderOfPaymentsCreate,
} from 'hooks';
import { useAuth } from 'hooks/useAuth';
import _, { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatInPeso,
	getFullName,
} from 'utils';
import * as Yup from 'yup';

interface ModalProps {
	payor: any;
	transaction?: any;
	onSuccess: any;
	onClose: any;
}

export const CreateOrderOfPaymentModal = ({
	payor,
	transaction,
	onSuccess,
	onClose,
}: ModalProps) => {
	// STATES
	const [invoiceValidityError, setInvoiceValidityError] = useState(null);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		mutateAsync: createOrderOfPayment,
		isLoading: isCreating,
		error: createError,
	} = useOrderOfPaymentsCreate();
	const {
		mutateAsync: checkInvoiceValidity,
		isLoading: isChecking,
		error: checkInvoiceValidityError,
	} = useCheckInvoiceValidity();

	// METHODS
	const onCreate = async (formData) => {
		if (invoiceValidityError) {
			setInvoiceValidityError(null);
		}

		if (formData.chargeSalesTransactionId) {
			const response = await checkInvoiceValidity({
				orNumber: formData.chargeSalesTransactionId,
			});

			if (response.data === false) {
				setInvoiceValidityError(
					'Inputted invoice number is invalid or does not exist.',
				);
				return;
			}
		}

		await createOrderOfPayment({
			createdById: user.id,
			payorId: formData.payorId,
			amount: formData.amount,
			purpose: formData.purpose,
			extraDescription:
				formData.purpose === orderOfPaymentPurposes.OTHERS
					? formData.purposeOthers
					: undefined,
			chargeSalesTransactionId: formData.chargeSalesTransactionId || undefined,
		});
		onSuccess();
		onClose();

		message.success('Order of Payment was created successfully');
	};

	return (
		<Modal
			className="CreateOrderOfPaymentModal"
			footer={null}
			title="[Create] Order of Payment"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createError?.errors, 'Create'),
					...convertIntoArray(
						checkInvoiceValidityError?.errors,
						'Invoice Validity',
					),
					invoiceValidityError,
				]}
				withSpaceBottom
			/>

			<CreateOrderOfPaymentForm
				loading={isCreating || isChecking}
				payor={payor}
				transaction={transaction}
				onClose={onClose}
				onSubmit={onCreate}
			/>
		</Modal>
	);
};

interface FormProps {
	payor: any;
	transaction?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateOrderOfPaymentForm = ({
	payor,
	transaction,
	loading,
	onSubmit,
	onClose,
}: FormProps) => {
	// STATES
	const [accountSearch, setAccountSearch] = useState('');
	const [maxAmount, setMaxAmount] = useState(0);

	// CUSTOM HOOKS
	const {
		isFetching: isFetchingAccount,
		data: { accounts },
	} = useAccounts({ params: { search: accountSearch } });

	// METHODS
	useEffect(() => {
		const amount = Number(transaction?.total_amount || payor?.total_balance);

		if (amount) {
			setMaxAmount(amount);
		}
	}, [payor, transaction]);

	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				payorId: payor.account.id,
				amount: transaction?.total_amount || '',
				purpose: transaction ? orderOfPaymentPurposes.FULL_PAYMENT : null,
				purposeOthers: '',
				chargeSalesTransactionId: transaction?.id,
			},
			schema: Yup.object().shape(
				{
					payorId: Yup.number().required().label('Payor'),
					amount: Yup.number().required().min(1).max(maxAmount).label('Amount'),
					purpose: Yup.string().required().nullable().label('Purpose'),
					purposeOthers: Yup.string().when('purpose', {
						is: orderOfPaymentPurposes.OTHERS,
						then: Yup.string().required().label('Purpose Description'),
					}),
					chargeSalesTransactionId: Yup.string().trim().nullable(),
				},
				[],
			),
		}),
		[maxAmount, transaction],
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
				onSubmit({
					...formData,
					chargeSalesTransactionId: _.trim(formData.chargeSalesTransactionId),
				});
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Label label="Payor" spacing />
							<Select
								defaultActiveFirstOption={false}
								disabled={payor !== null}
								filterOption={false}
								notFoundContent={
									isFetchingAccount ? <Spin size="small" /> : null
								}
								style={{ width: '100%' }}
								value={values.payorId}
								showSearch
								onChange={(value) => {
									setFieldValue('payorId', value);
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
								name="payorId"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label
								label={`Amount (Total: ${formatInPeso(maxAmount)})`}
								spacing
							/>
							<FormattedInputNumber
								className="w-100"
								controls={false}
								value={values['amount']}
								onChange={(value) => {
									setFieldValue('amount', value);
								}}
							/>
							<ErrorMessage
								name="amount"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="purpose" label="Purpose" spacing />
							<Select
								className="w-100"
								filterOption={filterOption}
								optionFilterProp="children"
								value={values.purpose}
								showSearch
								onChange={(value) => {
									setFieldValue('purpose', value);
									setFieldValue('purposeOthers', '');
								}}
							>
								<Select.Option
									key={orderOfPaymentPurposes.FULL_PAYMENT}
									value={orderOfPaymentPurposes.FULL_PAYMENT}
								>
									Full Payment
								</Select.Option>
								<Select.Option
									key={orderOfPaymentPurposes.PARTIAL_PAYMENT}
									value={orderOfPaymentPurposes.PARTIAL_PAYMENT}
								>
									Partial Payment
								</Select.Option>
								<Select.Option
									key={orderOfPaymentPurposes.OTHERS}
									value={orderOfPaymentPurposes.OTHERS}
								>
									Others
								</Select.Option>
							</Select>

							<ErrorMessage
								name="purpose"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{values.purpose === orderOfPaymentPurposes.OTHERS && (
							<Col span={24}>
								<FormInputLabel id="purposeOthers" label="Purpose Descripton" />
								<ErrorMessage
									name="purposeOthers"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						)}

						<Col span={24}>
							<Label
								id="chargeSalesTransactionId"
								label="Charge Sales Invoice # (Optional)"
								spacing
							/>
							<Input
								value={values['chargeSalesTransactionId']}
								onChange={(e) => {
									setFieldValue('chargeSalesTransactionId', e.target.value);
								}}
							/>
							<ErrorMessage
								name="chargeSalesTransactionId"
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
