import { Col, Divider, Row, Spin, Typography } from 'antd';
import { FetchButtonIcon } from 'components';
import {
	Button,
	FieldError,
	FieldSuccess,
	FieldWarning,
	FormattedInputNumber,
	FormInputLabel,
	Label,
} from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { request } from 'global';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { sleep } from 'utils/function';
import * as Yup from 'yup';

const { Title } = Typography;

interface Props {
	product: any;
	branches: any;
	branchResponse: any;
	onFetchBranchProduct: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const EditPriceCostForm = ({
	product,
	branches,
	branchResponse,
	onFetchBranchProduct,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// REFS
	const formRef = useRef(null);

	// METHODS
	useEffect(() => {
		branchResponse?.forEach((response, index) => {
			formRef?.current?.setFieldError(`${index}.response`, response);
		});
	}, [formRef, branchResponse, branches]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: branches.map((branch) => ({
				branchId: branch.id,
				cost_per_piece: branch?.cost_per_piece?.toFixed(2) || '',
				cost_per_bulk: branch?.cost_per_bulk?.toFixed(2) || '',
				price_per_piece: branch?.price_per_piece?.toFixed(2) || '',
				price_per_bulk: branch?.price_per_bulk?.toFixed(2) || '',
				loading: request.NONE,
			})),
			Schema: Yup.array()
				.of(
					Yup.object().shape({
						cost_per_piece: Yup.number().min(0).label('Cost per Piece'),
						cost_per_bulk: Yup.number().min(0).label('Cost Per Bulk'),
						price_per_piece: Yup.number().min(0).label('Price per Piece'),
						price_per_bulk: Yup.number().min(0).label('Price per Bulk'),
					}),
				)
				.compact(),
		}),
		[branches],
	);

	const renderInputField = ({ name, label, values, setFieldValue }) => (
		<>
			<Label id={name} label={label} spacing />
			<FormattedInputNumber
				size="large"
				value={_.get(values, name)}
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
			innerRef={formRef}
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (values) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				onSubmit(values);
			}}
			enableReinitialize
		>
			{({ errors: formErrors, values, setFieldValue }) => (
				<Form className="form">
					{branches.map(({ id, name }, index) => {
						const errors: any = formErrors[index];

						return (
							<Spin
								tip={branchResponse?.[index]?.message}
								spinning={[
									branchResponse?.[index]?.updateStatus,
									branchResponse?.[index]?.fetchStatus,
								].includes(request.REQUESTING)}
							>
								<Row key={id} gutter={[15, 15]}>
									<Col span={24}>
										<div className="header">
											<Title className="branch-name" level={4}>
												{name}
											</Title>
											<FetchButtonIcon
												type="button"
												tooltip="Fetch Product Price and Cost"
												onClick={() => {
													onFetchBranchProduct(id, index);
												}}
											/>
										</div>

										{errors?.response?.updateStatus === request.ERROR && (
											<FieldError error="An error occurred while updating branch product." />
										)}
										{errors?.response?.updateStatus === request.SUCCESS && (
											<FieldSuccess message="Successfully updated branch product." />
										)}
										{errors?.response?.fetchStatus === request.ERROR && (
											<FieldError error="An error occurred while fetching branch product." />
										)}

										{errors?.response?.warnings?.map((warnings) => (
											<FieldWarning message={warnings} />
										))}
									</Col>
									<Col sm={12} xs={24}>
										{renderInputField({
											name: `${index}.cost_per_piece`,
											label: 'Cost (Piece)',
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: `${index}.cost_per_bulk`,
											label: 'Cost (Bulk)',
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: `${index}.price_per_piece`,
											label: 'Price (Piece)',
											setFieldValue,
											values,
										})}
									</Col>

									<Col sm={12} xs={24}>
										{renderInputField({
											name: `${index}.price_per_bulk`,
											label: 'Price (Bulk)',
											setFieldValue,
											values,
										})}
									</Col>

									{index !== branches.length - 1 && <Divider />}
								</Row>
							</Spin>
						);
					})}

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={loading || isSubmitting}
						/>
						<Button
							type="submit"
							text={product ? 'Edit' : 'Create'}
							variant="primary"
							loading={loading || isSubmitting}
						/>
					</div>
				</Form>
			)}
		</Formik>
	);
};
