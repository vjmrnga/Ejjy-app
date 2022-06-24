import { CloseOutlined } from '@ant-design/icons';
import {
	Button as AntdButton,
	Col,
	Divider,
	Input,
	message,
	Modal,
	Radio,
	Row,
} from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { discountTypes } from 'global';
import { useDiscountOptionCreate, useDiscountOptionEdit } from 'hooks';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils';
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
		isLoading: isCreating,
		error: createError,
	} = useDiscountOptionCreate();
	const {
		mutateAsync: editDiscountOption,
		isLoading: isEditing,
		error: editError,
	} = useDiscountOptionEdit();

	// METHODS
	const handleSubmit = async (formData) => {
		if (discountOption) {
			await editDiscountOption(formData);
			message.success('Discount option was edited successfully');
		} else {
			await createDiscountOption(formData);
			message.success('Discount option was created successfully');
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
					...convertIntoArray(createError?.errors),
					...convertIntoArray(editError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyDiscountOptionForm
				discountOption={discountOption}
				isLoading={isCreating || isEditing}
				onSubmit={handleSubmit}
				onClose={onClose}
			/>
		</Modal>
	);
};

interface FormProps {
	discountOption?: any;
	isLoading: boolean;
	onSubmit: any;
	onClose: any;
}

export const ModifyDiscountOptionForm = ({
	discountOption,
	isLoading,
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
				isVatInclusive: discountOption?.is_vat_inclusive || true,
				additionalFields: discountOption?.additional_fields?.split(',') || [],
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
				isVatInclusive: Yup.boolean().required().label('VAT Inclusive'),
				additionalFields: Yup.array()
					.of(Yup.string().required().label('Field'))
					.notRequired(),
			}),
		}),
		[discountOption],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(formData) => {
				onSubmit({
					...formData,
					additionalFields:
						formData.additionalFields.length > 0
							? formData.additionalFields.join(',')
							: '',
				});
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col xs={24}>
							<Label label="Name" spacing />
							<Input
								name="name"
								value={values['name']}
								onChange={(e) => {
									setFieldValue('name', e.target.value);
								}}
							/>
							<ErrorMessage
								name="name"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col xs={24} sm={12}>
							<Label id="isVatInclusive" label="VAT Inclusive" spacing />
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

						<Col xs={24}>
							<Divider />

							<Row gutter={[16, 16]} justify="center" align="bottom">
								{values.additionalFields.map((field, index) => (
									<>
										<Col xs={21}>
											<Label label={`Field ${index + 1}`} spacing />
											<Input
												name={`additionalFields.${index}`}
												value={field}
												onChange={(e) => {
													setFieldValue(
														`additionalFields.${index}`,
														e.target.value,
													);
												}}
											/>
											<ErrorMessage
												name={`additionalFields.${index}`}
												render={(error) => <FieldError error={error} />}
											/>
										</Col>
										<Col
											xs={3}
											className="d-flex align-center justify-center pb-1"
										>
											<AntdButton
												size="small"
												type="primary"
												shape="circle"
												icon={<CloseOutlined />}
												onClick={() => {
													const { additionalFields } = values;
													additionalFields.splice(index, 1);

													setFieldValue('additionalFields', additionalFields);
												}}
												danger
											/>
										</Col>
									</>
								))}
							</Row>
							<AntdButton
								className="d-block mt-4 mx-auto"
								type="link"
								onClick={() => {
									const { additionalFields } = values;
									additionalFields.push('');

									setFieldValue('additionalFields', additionalFields);
								}}
							>
								+ Add Field
							</AntdButton>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isLoading}
						/>
						<Button
							type="submit"
							text={discountOption ? 'Edit' : 'Create'}
							variant="primary"
							loading={isLoading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
