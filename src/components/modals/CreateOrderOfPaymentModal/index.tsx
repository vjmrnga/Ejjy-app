import { Col, message, Modal, Row, Select, Spin } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, FormInputLabel, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { orderOfPaymentPurposes, SEARCH_DEBOUNCE_TIME } from 'global';
import { useAccounts, useOrderOfPaymentsCreate } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import { convertIntoArray, getFullName, sleep } from 'utils/function';
import * as Yup from 'yup';

interface ModalProps {
	transaction?: any;
	onSuccess: any;
	onClose: any;
}

export const CreateOrderOfPaymentModal = ({
	transaction,
	onSuccess,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		mutateAsync: createOrderOfPayment,
		isLoading,
		error,
	} = useOrderOfPaymentsCreate();

	// METHODS
	const onCreate = async (formData) => {
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

		message.success('Order of Payment successfully created.');
	};

	return (
		<Modal
			className="CreateOrderOfPaymentModal"
			title="[Create] Order of Payment"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<CreateOrderOfPaymentForm
				transaction={transaction}
				loading={isLoading}
				onSubmit={onCreate}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	transaction?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateOrderOfPaymentForm = ({
	transaction,
	loading,
	onSubmit,
	onClose,
}: FormProps) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);
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
				payorId: '',
				amount: '',
				purpose: '',
				purposeOthers: '',
				chargeSalesInvoice: transaction?.id,
			},
			schema: Yup.object().shape(
				{
					payorId: Yup.number().required().label('Payor'),
					amount: Yup.number().required().label('Amount'),
					purpose: Yup.string().required().label('Purpose'),
					purposeOthers: Yup.string().when('purpose', {
						is: orderOfPaymentPurposes.OTHERS,
						then: Yup.string().required().label('Purpose Description'),
					}),
					chargeSalesInvoice: Yup.string().nullable(),
				},
				[],
			),
		}),
		[transaction],
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
			onSubmit={async (formData) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[15, 15]}>
						<Col span={24}>
							<Label label="Payor" spacing />
							<Select
								style={{ width: '100%' }}
								filterOption={false}
								defaultActiveFirstOption={false}
								onSearch={onSearchDebounced}
								notFoundContent={isFetching ? <Spin size="small" /> : null}
								value={values.payorId}
								onChange={(value) => {
									setFieldValue('payorId', value);
								}}
								showSearch
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
							<FormInputLabel type="number" id="amount" label="Amount" />
							<ErrorMessage
								name="amount"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<Label id="purpose" label="Purpose" spacing />
							<Select
								style={{ width: '100%' }}
								value={values.purpose}
								onChange={(value) => {
									setFieldValue('purpose', value);
									setFieldValue('purposeOthers', '');
								}}
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.children
										.toString()
										.toLowerCase()
										.indexOf(input.toLowerCase()) >= 0
								}
								showSearch
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
							<FormInputLabel
								id="chargeSalesInvoice"
								label="Charge Sales Invoice # (Optional)"
								disabled={transaction !== null}
							/>
							<ErrorMessage
								name="chargeSalesInvoice"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							classNames="mr-10"
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text="Create"
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
