import { Col, Divider, Row, Select, Typography } from 'antd';
import {
	Button,
	FieldError,
	FormattedInputNumber,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { markdownTypes } from 'global';
import React, { useCallback } from 'react';
import * as Yup from 'yup';

interface Props {
	branchProduct: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const PricesForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				type: branchProduct?.price_markdown?.type || markdownTypes.REGULAR,
				costPerPiece: branchProduct?.cost_per_piece || '',
				costPerBulk: branchProduct?.cost_per_bulk || '',
				pricePerPiece: branchProduct?.price_per_piece || '',
				pricePerBulk: branchProduct?.price_per_bulk || '',
			},
			Schema: Yup.object().shape({
				type: Yup.string().label('Current Sales Price Type'),
				costPerPiece: Yup.number().min(0).label('Cost (Piece)'),
				costPerBulk: Yup.number().min(0).label('Cost (Bulk)'),
				pricePerPiece: Yup.number().min(0).label('Regular Price (Piece)'),
				pricePerBulk: Yup.number().min(0).label('Regular Price (Bulk)'),
			}),
		}),
		[branchProduct],
	);

	const renderInputField = ({ name, label, values, setFieldValue }) => (
		<>
			<Label id={name} label={label} spacing />
			<FormattedInputNumber
				size="large"
				value={values[name]}
				controls={false}
				style={{ width: '100%' }}
				onChange={(value) => {
					setFieldValue(name, value);
				}}
			/>
			<ErrorMessage
				name={name}
				render={(error) => <FieldError error={error} />}
			/>
		</>
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={(values) => {
				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ values, setFieldValue }) => (
				<Form>
					<Row gutter={[16, 16]}>
						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'costPerPiece',
								label: 'Cost (Piece)',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'costPerBulk',
								label: 'Cost (Bulk)',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'pricePerPiece',
								label: 'Regular Price (Piece)',
								setFieldValue,
								values,
							})}
						</Col>

						<Col sm={12} xs={24}>
							{renderInputField({
								name: 'pricePerBulk',
								label: 'Regular Price (Bulk)',
								setFieldValue,
								values,
							})}
						</Col>

						<Divider />

						<Col span={24}>
							<Label id="type" label="Current Sales Price Type" spacing />
							<Select
								style={{ width: '100%' }}
								value={values.type}
								onChange={(value) => {
									setFieldValue('type', value);
								}}
								size="large"
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
									key={markdownTypes.REGULAR}
									value={markdownTypes.REGULAR}
								>
									Regular
								</Select.Option>
								<Select.Option
									key={markdownTypes.WHOLESALE}
									value={markdownTypes.WHOLESALE}
								>
									Wholesale
								</Select.Option>
								<Select.Option
									key={markdownTypes.SPECIAL}
									value={markdownTypes.SPECIAL}
								>
									Special
								</Select.Option>
							</Select>

							<ErrorMessage
								name="type"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
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
							text="Submit"
							variant="primary"
							loading={loading}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
