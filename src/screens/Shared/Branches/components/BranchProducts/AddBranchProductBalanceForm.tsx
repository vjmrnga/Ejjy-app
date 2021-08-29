import { Col, Row } from 'antd';
import { Form, Formik, ErrorMessage } from 'formik';
import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FormInputLabel,
} from '../../../../../components/elements';
import { sleep } from '../../../../../utils/function';

interface Props {
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const AddBranchProductBalanceForm = ({
	onSubmit,
	onClose,
	loading,
}: Props) => {
	const [isSubmitting, setSubmitting] = useState(false);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				balance: '',
			},
			Schema: Yup.object().shape({
				// eslint-disable-next-line newline-per-chained-call
				balance: Yup.number().required().min(1).max(65535).label('Balance'),
			}),
		}),
		[],
	);

	return (
		<Formik
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
			<Form className="form">
				<Row gutter={[15, 15]}>
					<Col span={24}>
						<FormInputLabel type="number" id="balance" label="Qty Delivered" />
						<ErrorMessage
							name="balance"
							render={(error) => <FieldError error={error} />}
						/>
					</Col>
				</Row>

				<div className="ModalCustomFooter">
					<Button
						type="button"
						text="Cancel"
						onClick={onClose}
						classNames="mr-10"
						disabled={loading || isSubmitting}
					/>
					<Button
						type="submit"
						text="Add"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
