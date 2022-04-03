import { Col, Row, Select, Typography } from 'antd';
import { Button, FieldError, Label } from 'components/elements';
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

export const PriceMarkdownForm = ({
	branchProduct,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				type: branchProduct?.price_markdown?.type || markdownTypes.REGULAR,
			},
			Schema: Yup.object().shape({
				type: Yup.string().label('Type'),
			}),
		}),
		[branchProduct],
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
					<Row>
						<Col span={24}>
							<Label id="type" label="Type" spacing />
							<Select
								style={{ width: '100%' }}
								value={values.type}
								onChange={(value) => {
									setFieldValue('type', value);
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
