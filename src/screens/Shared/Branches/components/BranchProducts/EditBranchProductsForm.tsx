import { Col, Divider, Typography } from 'antd';
import { Form, Formik } from 'formik';
import { booleanOptions } from 'global/options';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { DetailsRow, DetailsSingle } from '../../../../../components';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormRadioButton,
	Label,
} from '../../../../../components/elements';
import {
	productCheckingTypes,
	unitOfMeasurementTypes,
} from '../../../../../global/types';
import { formatMoneyField, sleep } from '../../../../../utils/function';

const { Text } = Typography;

const checkingTypesOptions = [
	{
		id: productCheckingTypes.DAILY,
		label: 'Daily',
		value: productCheckingTypes.DAILY,
	},
	{
		id: productCheckingTypes.RANDOM,
		label: 'Random',
		value: productCheckingTypes.RANDOM,
	},
];

interface Props {
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
	isCurrentBalanceVisible: boolean;
}

export const EditBranchProductsForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
	isCurrentBalanceVisible,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				checking: branchProduct?.is_daily_checked
					? productCheckingTypes.DAILY
					: productCheckingTypes.RANDOM,
				type: branchProduct?.product?.type,
				unit_of_measurement: branchProduct?.product?.unit_of_measurement,
				reorder_point: branchProduct?.reorder_point,
				max_balance: branchProduct?.max_balance,
				price_per_piece: branchProduct?.price_per_piece,
				discounted_price_per_piece1: branchProduct?.discounted_price_per_piece1,
				discounted_price_per_piece2: branchProduct?.discounted_price_per_piece2,
				price_per_bulk: branchProduct?.price_per_bulk,
				discounted_price_per_bulk1: branchProduct?.discounted_price_per_bulk1,
				discounted_price_per_bulk2: branchProduct?.discounted_price_per_bulk2,
				current_balance: branchProduct?.current_balance,
				is_shown_in_scale_list: branchProduct.is_shown_in_scale_list,
				is_sold_in_branch: branchProduct.is_sold_in_branch,
			},
			Schema: Yup.object().shape({
				checking: Yup.string().required().label('Checking'),
				reorder_point: Yup.number()
					.required()
					.min(0)
					.max(65535)
					.label('Reorder Point'),
				max_balance: Yup.number()
					.required()
					.min(0)
					.max(65535)
					.label('Max Balance'),
				price_per_piece: Yup.number()
					.required()
					.min(0)
					.label('Price per Piece'),
				discounted_price_per_piece1: Yup.number()
					.required()
					.min(0)
					.label('Discounted Price per Piece 1'),
				discounted_price_per_piece2: Yup.number()
					.required()
					.min(0)
					.label('Discounted Price per Piece 2'),
				price_per_bulk: Yup.number().required().min(0).label('Price per Bulk'),
				discounted_price_per_bulk1: Yup.number()
					.required()
					.min(0)
					.label('Discounted Price per Bulk 1'),
				discounted_price_per_bulk2: Yup.number()
					.required()
					.min(0)
					.label('Discounted Price per Bulk 2'),
				current_balance: Yup.number().nullable().min(0).max(65535),
			}),
		}),
		[branchProduct],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				let data = branchProduct;
				if (formData.is_sold_in_branch) {
					data = {
						...formData,
						id: branchProduct?.id,
						is_daily_checked: formData.checking === productCheckingTypes.DAILY,
						is_randomly_checked:
							formData.checking === productCheckingTypes.RANDOM,
					};
				}

				onSubmit(
					{
						...data,
						id: branchProduct?.id,
						is_sold_in_branch: formData.is_sold_in_branch,
					},
					resetForm,
				);
			}}
			enableReinitialize
		>
			{({ values, errors, touched, setFieldValue }) => (
				<Form className="form">
					<DetailsRow>
						<DetailsSingle
							label="Barcode"
							value={branchProduct?.product?.barcode}
						/>

						<DetailsSingle
							label="Textcode"
							value={branchProduct?.product?.textcode}
						/>

						<DetailsSingle label="Name" value={branchProduct?.product?.name} />

						<Col sm={12} xs={24}>
							<Label label="Checking" spacing />
							<FormRadioButton
								id="checking"
								items={checkingTypesOptions}
								disabled={!values.is_sold_in_branch}
							/>
							{errors.checking && touched.checking ? (
								<FieldError error={errors.checking} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="Include In Scale" spacing />
							<FormRadioButton
								id="is_shown_in_scale_list"
								items={booleanOptions}
								disabled={!values.is_sold_in_branch}
							/>
							{errors.is_shown_in_scale_list &&
							touched.is_shown_in_scale_list ? (
								<FieldError error={errors.is_shown_in_scale_list} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<Label label="In Stock" spacing />
							<FormRadioButton id="is_sold_in_branch" items={booleanOptions} />
							{errors.is_sold_in_branch && touched.is_sold_in_branch ? (
								<FieldError error={errors.is_sold_in_branch} />
							) : null}
						</Col>

						<Divider dashed>QUANTITY</Divider>

						<Col sm={12} xs={24}>
							<FormInputLabel
								min={0}
								type="number"
								id="reorder_point"
								label="Reorder Point"
								disabled={!values.is_sold_in_branch}
							/>
							{errors.reorder_point && touched.reorder_point ? (
								<FieldError error={errors.reorder_point} />
							) : null}
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="max_balance"
								label="Max Balance"
								disabled={!values.is_sold_in_branch}
							/>
							{errors.max_balance && touched.max_balance ? (
								<FieldError error={errors.max_balance} />
							) : null}
						</Col>

						{isCurrentBalanceVisible && (
							<Col sm={12} xs={24}>
								<FormInputLabel
									type="number"
									id="current_balance"
									label="Current Balance"
									step={
										branchProduct.product.unit_of_measurement ===
										unitOfMeasurementTypes.WEIGHING
											? '.001'
											: null
									}
									disabled={!values.is_sold_in_branch}
								/>
								{errors.current_balance && touched.current_balance ? (
									<FieldError error={errors.current_balance} />
								) : null}
							</Col>
						)}

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="price_per_piece"
								label="Price (Piece)"
								step=".01"
								onBlur={(event) =>
									formatMoneyField(event, setFieldValue, 'price_per_piece')
								}
								disabled={!values.is_sold_in_branch}
								withPesoSign
							/>
							{errors.price_per_piece && touched.price_per_piece ? (
								<FieldError error={errors.price_per_piece} />
							) : null}
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="discounted_price_per_piece1"
								label="Discounted Price per Piece 1"
								step=".01"
								onBlur={(event) =>
									formatMoneyField(
										event,
										setFieldValue,
										'discounted_price_per_piece1',
									)
								}
								disabled={!values.is_sold_in_branch}
								withPesoSign
							/>
							{errors.discounted_price_per_piece1 &&
							touched.discounted_price_per_piece1 ? (
								<FieldError error={errors.discounted_price_per_piece1} />
							) : null}
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="discounted_price_per_piece2"
								label="Discounted Price per Piece 2"
								step=".01"
								onBlur={(event) =>
									formatMoneyField(
										event,
										setFieldValue,
										'discounted_price_per_piece2',
									)
								}
								disabled={!values.is_sold_in_branch}
								withPesoSign
							/>
							{errors.discounted_price_per_piece2 &&
							touched.discounted_price_per_piece2 ? (
								<FieldError error={errors.discounted_price_per_piece2} />
							) : null}
						</Col>

						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="price_per_bulk"
								label="Price (Bulk)"
								step=".01"
								onBlur={(event) =>
									formatMoneyField(event, setFieldValue, 'price_per_bulk')
								}
								disabled={!values.is_sold_in_branch}
								withPesoSign
							/>
							{errors.price_per_bulk && touched.price_per_bulk ? (
								<FieldError error={errors.price_per_bulk} />
							) : null}
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="discounted_price_per_bulk1"
								label="Discounted Price per Bulk 1"
								step=".01"
								onBlur={(event) =>
									formatMoneyField(
										event,
										setFieldValue,
										'discounted_price_per_bulk1',
									)
								}
								disabled={!values.is_sold_in_branch}
								withPesoSign
							/>
							{errors.discounted_price_per_bulk1 &&
							touched.discounted_price_per_bulk1 ? (
								<FieldError error={errors.discounted_price_per_bulk1} />
							) : null}
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="discounted_price_per_bulk2"
								label="Discounted Price per Bulk 2"
								step=".01"
								onBlur={(event) =>
									formatMoneyField(
										event,
										setFieldValue,
										'discounted_price_per_bulk2',
									)
								}
								disabled={!values.is_sold_in_branch}
								withPesoSign
							/>
							{errors.discounted_price_per_bulk2 &&
							touched.discounted_price_per_bulk2 ? (
								<FieldError error={errors.discounted_price_per_bulk2} />
							) : null}
						</Col>
					</DetailsRow>

					<Divider />

					<div className="custom-footer">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							classNames="mr-10"
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text={branchProduct ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
