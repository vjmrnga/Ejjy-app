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
import { useAccounts } from '../../../../../hooks';
import { getFullName, sleep } from '../../../../../utils/function';

const formDetails = {
	defaultValues: {
		accountId: '',
		creditLimit: '',
	},
	schema: Yup.object().shape(
		{
			accountId: Yup.number().required().label('Account'),
			creditLimit: Yup.number().required().label('Credit Limit'),
		},
		[],
	),
};

interface Props {
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const CreateCreditRegistrationForm = ({
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
