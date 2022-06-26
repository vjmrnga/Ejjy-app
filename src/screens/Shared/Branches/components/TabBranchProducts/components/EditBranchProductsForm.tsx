/* eslint-disable no-confusing-arrow */
import { Col, Divider, Typography } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import { isInteger } from 'lodash';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { DetailsRow, DetailsSingle } from '../../../../../../components';
import {
	Button,
	FieldError,
	FormInputLabel,
	FormRadioButton,
	Label,
} from '../../../../../../components/elements';
import {
	booleanOptions,
	checkingTypesOptions,
} from '../../../../../../global/options';
import {
	productCheckingTypes,
	unitOfMeasurementTypes,
} from '../../../../../../global/types';
import { sleep } from 'utils';

const { Text } = Typography;

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
				price_per_piece: branchProduct?.price_per_piece?.toFixed(2) || '',
				markdown_price_per_piece1:
					branchProduct?.markdown_price_per_piece1?.toFixed(2) || '',
				markdown_price_per_piece2:
					branchProduct?.markdown_price_per_piece2?.toFixed(2) || '',
				price_per_bulk: branchProduct?.price_per_bulk?.toFixed(2) || '',
				markdown_price_per_bulk1:
					branchProduct?.markdown_price_per_bulk1?.toFixed(2) || '',
				markdown_price_per_bulk2:
					branchProduct?.markdown_price_per_bulk2?.toFixed(2) || '',
				current_balance: branchProduct?.current_balance,
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
				markdown_price_per_piece1: Yup.number()
					.required()
					.min(0)
					.label('Wholesale Price (piece)'),
				markdown_price_per_piece2: Yup.number()
					.required()
					.min(0)
					.label('Special Price (piece)'),
				price_per_bulk: Yup.number().required().min(0).label('Price per Bulk'),
				markdown_price_per_bulk1: Yup.number()
					.required()
					.min(0)
					.label('Wholesale Price (bulk)'),
				markdown_price_per_bulk2: Yup.number()
					.required()
					.min(0)
					.label('Special Price (bulk)'),
				current_balance: isCurrentBalanceVisible
					? Yup.number()
							.required()
							.min(0)
							.test(
								'is-whole-number',
								'Non-weighing items require whole number quantity.',
								(value) =>
									branchProduct?.product?.unit_of_measurement ===
									unitOfMeasurementTypes.NON_WEIGHING
										? isInteger(Number(value))
										: true,
							)
							.label('Current Balance')
					: undefined,
			}),
		}),
		[branchProduct, isCurrentBalanceVisible],
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

						// NOTE: Hidden fields must be visible in order to be saved.
						current_balance: isCurrentBalanceVisible
							? formData.current_balance
							: undefined,
					},
					resetForm,
				);
			}}
			enableReinitialize
		>
			{({ values }) => (
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
							<ErrorMessage
								name="checking"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<Label label="In Stock" spacing />
							<FormRadioButton id="is_sold_in_branch" items={booleanOptions} />
							<ErrorMessage
								name="is_sold_in_branch"
								render={(error) => <FieldError error={error} />}
							/>
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
							<ErrorMessage
								name="reorder_point"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="max_balance"
								label="Max Balance"
								disabled={!values.is_sold_in_branch}
							/>
							<ErrorMessage
								name="max_balance"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider dashed>
							MONEY
							<br />
							<Text mark>(must be in 2 decimal places)</Text>
						</Divider>

						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								id="price_per_piece"
								label="Price (Piece)"
								disabled={!values.is_sold_in_branch}
								isMoney
							/>
							<ErrorMessage
								name="price_per_piece"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								id="markdown_price_per_piece1"
								label="Wholesale Price (piece)"
								disabled={!values.is_sold_in_branch}
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_piece1"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="markdown_price_per_piece2"
								label="Special Price (piece)"
								step=".01"
								disabled={!values.is_sold_in_branch}
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_piece2"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="price_per_bulk"
								label="Price (Bulk)"
								disabled={!values.is_sold_in_branch}
								isMoney
							/>
							<ErrorMessage
								name="price_per_bulk"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="markdown_price_per_bulk1"
								label="Wholesale Price (bulk)"
								disabled={!values.is_sold_in_branch}
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_bulk1"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col md={8} sm={12} xs={24}>
							<FormInputLabel
								type="number"
								id="markdown_price_per_bulk2"
								label="Special Price (bulk)"
								step=".01"
								disabled={!values.is_sold_in_branch}
								isMoney
							/>
							<ErrorMessage
								name="markdown_price_per_bulk2"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						{isCurrentBalanceVisible && (
							<>
								<Divider dashed>HIDDEN FIELDS</Divider>

								<Col sm={12} xs={24}>
									<FormInputLabel
										type="number"
										id="current_balance"
										label="Current Balance"
										isWholeNumber={
											branchProduct.product.unit_of_measurement ===
											unitOfMeasurementTypes.NON_WEIGHING
										}
										disabled={!values.is_sold_in_branch}
									/>
									<ErrorMessage
										name="current_balance"
										render={(error) => <FieldError error={error} />}
									/>
								</Col>
							</>
						)}
					</DetailsRow>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
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
