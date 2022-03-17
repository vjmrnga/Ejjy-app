import { Col, Row, Select, Spin } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
	Label,
} from '../../../../../components/elements';
import { SEARCH_DEBOUNCE_TIME } from '../../../../../global/constants';
import { orderOfPaymentPurposes } from '../../../../../global/types';
import { useAccounts } from '../../../../../hooks';
import { sleep } from '../../../../../utils/function';
import { getAccountName } from '../../utils';

const formDetails = {
	defaultValues: {
		payorId: '',
		amount: '',
		purpose: '',
		purposeOthers: '',
		chargeSalesInvoice: '',
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
		},
		[],
	),
};

interface Props {
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateOrderOfPaymentForm = ({
	loading,
	onSubmit,
	onClose,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);
	const [accountSearch, setAccountSearch] = useState('');

	// CUSTOM HOOKS
	const {
		isFetching,
		data: { accounts },
	} = useAccounts({ params: { search: accountSearch } });

	// METHODS

	const onSearchDebounced = useCallback(
		debounce((search) => {
			setAccountSearch(search);
		}, SEARCH_DEBOUNCE_TIME),
		[],
	);

	return (
		<Formik
			initialValues={formDetails.defaultValues}
			validationSchema={formDetails.schema}
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
										{getAccountName(account)}
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
