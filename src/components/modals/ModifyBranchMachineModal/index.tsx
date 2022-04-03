import { Col, message, Modal, Radio, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { discountTypes } from 'global';
import { useDiscountOptionsCreate, useDiscountOptionsEdit } from 'hooks';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils/function';
import * as Yup from 'yup';
import { RequestErrors } from '../..';
import { Button, FieldError, FormInputLabel, Label } from '../../elements';

interface ModalProps {
	discountOption: any;
	onClose: any;
}

export const ModifyDiscountOptionModal = ({
	discountOption,
	onClose,
}: ModalProps) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: createDiscountOption,
		isLoading: isCreateLoading,
		error: createError,
	} = useDiscountOptionsCreate();
	const {
		mutateAsync: editDiscountOption,
		isLoading: isEditLoading,
		error: editError,
	} = useDiscountOptionsEdit();

	// METHODS
	const onSubmit = async (formData) => {
		if (discountOption) {
			await editDiscountOption(formData);
			message.success('Discount option was edited successfully.');
		} else {
			await createDiscountOption(formData);
			message.success('Discount option was created successfully.');
		}

		onClose();
	};

	return (
		<Modal
			title={`${discountOption ? '[Edit]' : '[Create]'} Discount Option`}
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

			<ModifyDiscountOptionForm
				discountOption={discountOption}
				loading={isCreateLoading || isEditLoading}
				onSubmit={onSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	discountOption?: any;
	loading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyDiscountOptionForm = ({
	discountOption,
	loading,
	onSubmit,
	onClose,
}: FormProps) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: discountOption?.id || undefined,
				name: discountOption?.name || '',
				type: discountOption?.type || discountTypes.AMOUNT,
				percentage: discountOption?.percentage || undefined,
				isVatInclusive: discountOption?.is_vat_inclusive || false,
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(75).label('Name'),
				type: Yup.string().required().label('Type'),
				percentage: Yup.number()
					.nullable()
					.when('type', {
						is: discountTypes.PERCENTAGE,
						then: Yup.number()
							.required()
							.min(1)
							.max(99.99)
							.test(
								'two-decimal-digits-only',
								'Must be two decimal digits only.',
								function test(value) {
									const valueString = _.toString(value);

									const decimalDigits =
										valueString.split('.')?.[1]?.length || 0;

									return decimalDigits <= 2;
								},
							)
							.label('Percentage'),
					}),
				isVatInclusive: Yup.boolean().required().label('Is VAT Inclusive?'),
			}),
		}),
		[discountOption],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(formData) => {
				onSubmit(formData);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form className="form">
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12}>
							<FormInputLabel id="name" label="Name" />
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col xs={24} sm={12}>
							<Label id="isVatInclusive" label="Is VAT Inclusive?" spacing />
							<Radio.Group
								value={values.isVatInclusive}
								options={[
									{ label: 'Yes', value: true },
									{ label: 'No', value: false },
								]}
								onChange={(e) => {
									const { value } = e.target;
									setFieldValue('isVatInclusive', value);
								}}
								optionType="button"
							/>
						</Col>

						<Col xs={24} sm={12}>
							<Label id="type" label="Type" spacing />
							<Radio.Group
								value={values.type}
								options={[
									{ label: 'Amount', value: discountTypes.AMOUNT },
									{ label: 'Percentage', value: discountTypes.PERCENTAGE },
								]}
								onChange={(e) => {
									const { value } = e.target;
									setFieldValue('type', value);
									setFieldValue('percentage', undefined);
								}}
								optionType="button"
							/>
						</Col>

						{values.type === discountTypes.PERCENTAGE && (
							<Col xs={24} sm={12}>
								<FormInputLabel
									type="number"
									id="percentage"
									label="Percentage"
								/>
								<ErrorMessage
									name="percentage"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						)}
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
							text={discountOption ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
