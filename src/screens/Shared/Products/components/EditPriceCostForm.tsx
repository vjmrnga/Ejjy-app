import { Col, Divider, Row, Spin, Typography } from 'antd';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, FieldSuccess, FormInputLabel } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { sleep } from '../../../../utils/function';

const { Title } = Typography;

interface Props {
	product: any;
	branches: any;
	branchResponse: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const EditPriceCostForm = ({
	product,
	branches,
	branchResponse,
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
		branchResponse?.forEach((status, index) => {
			formRef?.current?.setFieldError(`${index}.status`, status);
		});
	}, [formRef, branchResponse, branches]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: branches.map(({ id }) => ({
				branchId: id,
				cost_per_piece: '',
				cost_per_bulk: '',
				price_per_piece: '',
				price_per_bulk: '',
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
			{({ errors: formErrors, touched: formTouched }) => (
				<Form className="form">
					{branches.map(({ id, name }, index) => {
						const errors: any = formErrors[index];
						const touched: any = formTouched[index];

						return (
							<Spin spinning={branchResponse?.[index] === request.REQUESTING}>
								<Row key={id} gutter={[15, 15]}>
									<Col span={24}>
										<Title level={4}>{name}</Title>

										{errors?.status === request.ERROR && (
											<FieldError error="An error occurred while updating branch product." />
										)}
										{errors?.status === request.SUCCESS && (
											<FieldSuccess message="Successfully updated branch product." />
										)}
									</Col>
									<Col sm={12} xs={24}>
										<FormInputLabel
											min={0}
											type="number"
											id={`${index}.cost_per_piece`}
											label="Cost (Piece)"
											step=".001"
										/>
										{errors?.cost_per_piece && touched?.cost_per_piece ? (
											<FieldError error={errors?.cost_per_piece} />
										) : null}
									</Col>

									<Col sm={12} xs={24}>
										<FormInputLabel
											min={0}
											type="number"
											id={`${index}.cost_per_bulk`}
											label="Cost (Bulk)"
											step=".001"
										/>
										{errors?.cost_per_bulk && touched?.cost_per_bulk ? (
											<FieldError error={errors?.cost_per_bulk} />
										) : null}
									</Col>

									<Col sm={12} xs={24}>
										<FormInputLabel
											min={0}
											type="number"
											id={`${index}.price_per_piece`}
											label="Price (Piece)"
											step=".001"
										/>
										{errors?.price_per_piece && touched?.price_per_piece ? (
											<FieldError error={errors?.price_per_piece} />
										) : null}
									</Col>

									<Col sm={12} xs={24}>
										<FormInputLabel
											min={0}
											type="number"
											id={`${index}.price_per_bulk`}
											label="Price (Bulk)"
											step=".001"
										/>
										{errors?.price_per_bulk && touched?.price_per_bulk ? (
											<FieldError error={errors?.price_per_bulk} />
										) : null}
									</Col>

									{index !== branches.length - 1 && <Divider />}
								</Row>
							</Spin>
						);
					})}

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
