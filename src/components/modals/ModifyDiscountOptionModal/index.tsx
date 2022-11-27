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
import { discountTypes, taxTypes } from 'global';
import {
	useDiscountOptionCreate,
	useDiscountOptionEdit,
	useSiteSettingsRetrieve,
} from 'hooks';
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
		isLoading: isCreatingDiscountOption,
		error: createDiscountOptionError,
	} = useDiscountOptionCreate();
	const {
		mutateAsync: editDiscountOption,
		isLoading: isEditingDiscountOption,
		error: editDiscountOptionError,
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
			footer={null}
			title={`${discountOption ? '[Edit]' : '[Create]'} Discount Option`}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(createDiscountOptionError?.errors),
					...convertIntoArray(editDiscountOptionError?.errors),
				]}
				withSpaceBottom
			/>

			<ModifyDiscountOptionForm
				discountOption={discountOption}
				isLoading={isCreatingDiscountOption || isEditingDiscountOption}
				onClose={onClose}
				onSubmit={handleSubmit}
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
	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettingsRetrieve();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				id: discountOption?.id || undefined,
				name: discountOption?.name || '',
				code: discountOption?.code || '',
				type: discountOption?.type || discountTypes.AMOUNT,
				percentage: discountOption?.percentage || undefined,
				isSpecialDiscount: discountOption?.is_special_discount || false,
				isVatInclusive:
					siteSettings.tax_type === taxTypes.NVAT
						? true
						: !!discountOption?.is_vat_inclusive,
				additionalFields: discountOption?.additional_fields?.split(',') || [],
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(75).label('Name'),
				code: Yup.string().required().max(4).label('Code'),
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
				isSpecialDiscount: Yup.boolean().required().label('Special Discount'),
				isVatInclusive: Yup.boolean().required().label('VAT Inclusive'),

				additionalFields: Yup.array()
					.of(Yup.string().required().label('Field'))
					.notRequired(),
			}),
		}),
		[discountOption, siteSettings],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			enableReinitialize
			onSubmit={(formData) => {
				onSubmit({
					...formData,
					additionalFields:
						formData.additionalFields.length > 0
							? formData.additionalFields.join(',')
							: undefined,
				});
			}}
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col sm={12} xs={24}>
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

						<Col sm={12} xs={24}>
							<Label label="Code" spacing />
							<Input
								name="code"
								value={values['code']}
								onChange={(e) => {
									setFieldValue('code', e.target.value);
								}}
							/>
							<ErrorMessage
								name="code"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label id="isSpecialDiscount" label="Special Discount" spacing />
							<Radio.Group
								options={[
									{ label: 'Yes', value: true },
									{ label: 'No', value: false },
								]}
								optionType="button"
								value={values.isSpecialDiscount}
								onChange={(e) => {
									const { value } = e.target;
									setFieldValue('isSpecialDiscount', value);
								}}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label id="isVatInclusive" label="VAT Inclusive" spacing />
							<Radio.Group
								disabled={siteSettings.tax_type === taxTypes.NVAT}
								options={[
									{ label: 'Yes', value: true },
									{ label: 'No', value: false },
								]}
								optionType="button"
								value={values.isVatInclusive}
								onChange={(e) => {
									const { value } = e.target;
									setFieldValue('isVatInclusive', value);
								}}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label id="type" label="Type" spacing />
							<Radio.Group
								options={[
									{ label: 'Amount', value: discountTypes.AMOUNT },
									{ label: 'Percentage', value: discountTypes.PERCENTAGE },
								]}
								optionType="button"
								value={values.type}
								onChange={(e) => {
									const { value } = e.target;
									setFieldValue('type', value);
									setFieldValue('percentage', undefined);
								}}
							/>
						</Col>

						{values.type === discountTypes.PERCENTAGE && (
							<Col sm={12} xs={24}>
								<FormInputLabel
									id="percentage"
									label="Percentage"
									type="number"
								/>
								<ErrorMessage
									name="percentage"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						)}

						<Col xs={24}>
							<Divider />

							<Row align="bottom" gutter={[16, 16]} justify="center">
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
											className="d-flex align-center justify-center pb-1"
											xs={3}
										>
											<AntdButton
												icon={<CloseOutlined />}
												shape="circle"
												size="small"
												type="primary"
												danger
												onClick={() => {
													const { additionalFields } = values;
													additionalFields.splice(index, 1);

													setFieldValue('additionalFields', additionalFields);
												}}
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
							disabled={isLoading}
							text="Cancel"
							type="button"
							onClick={onClose}
						/>
						<Button
							loading={isLoading}
							text={discountOption ? 'Edit' : 'Create'}
							type="submit"
							variant="primary"
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
