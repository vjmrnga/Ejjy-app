import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, message, Modal, Radio, Row } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { discountTypes } from 'global';
import {
	useDiscountOptionCreate,
	useDiscountOptionEdit,
	useSiteSettings,
} from 'hooks';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { convertIntoArray, getId } from 'utils';
import * as Yup from 'yup';
import { RequestErrors } from '../..';
import { FieldError, Label } from '../../elements';

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
			await editDiscountOption({
				...formData,
				id: getId(discountOption),
			});
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
	const { data: siteSettings } = useSiteSettings();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				name: discountOption?.name || '',
				code: discountOption?.code || '',
				type: discountOption?.type || discountTypes.AMOUNT,
				percentage: discountOption?.percentage || undefined,
				isSpecialDiscount: discountOption?.is_special_discount || false,
				// isVatInclusive:
				// 	siteSettings.tax_type === taxTypes.NVAT
				// 		? true
				// 		: !!discountOption?.is_vat_inclusive,
				isVatInclusive: false,
				additionalFields: discountOption?.additional_fields?.split(',') || [],
			},
			Schema: Yup.object().shape({
				name: Yup.string().required().max(75).label('Name').trim(),
				code: Yup.string().required().max(4).label('Code').trim(),
				type: Yup.string().required().label('Type').trim(),
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
				isSpecialDiscount: Yup.boolean().required().label('SC/PWD'),
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
						<Col lg={12} span={24}>
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

						<Col lg={12} span={24}>
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

						<Col lg={12} span={24}>
							<Label id="isSpecialDiscount" label="Discount Type" spacing />
							<Radio.Group
								options={[
									{ label: 'Regular', value: false },
									{ label: 'SC/PWD', value: true },
								]}
								optionType="button"
								value={values.isSpecialDiscount}
								onChange={(e) => {
									const { value } = e.target;
									setFieldValue('isSpecialDiscount', value);
								}}
							/>
						</Col>

						<Col lg={12} span={24}>
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
							<Col lg={12} span={24}>
								<Input
									type="number"
									value={values.percentage}
									onChange={(e) => {
										setFieldValue('percentage', e.target.value);
									}}
								/>
								<ErrorMessage
									name="percentage"
									render={(error) => <FieldError error={error} />}
								/>
							</Col>
						)}

						<Col span={24}>
							<Divider />

							<Row align="bottom" gutter={[16, 16]} justify="center">
								{values.additionalFields.map((field, index) => (
									<>
										<Col span={21}>
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
											span={3}
										>
											<Button
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
							<Button
								className="d-block mt-4 mx-auto"
								type="link"
								onClick={() => {
									const { additionalFields } = values;
									additionalFields.push('');

									setFieldValue('additionalFields', additionalFields);
								}}
							>
								+ Add Field
							</Button>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button disabled={isLoading} htmlType="button" onClick={onClose}>
							Cancel
						</Button>
						<Button htmlType="submit" loading={isLoading} type="primary">
							{discountOption ? 'Edit' : 'Create'}
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};
