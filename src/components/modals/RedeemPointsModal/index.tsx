import { Col, Divider, message, Modal, Row } from 'antd';
import { RequestErrors } from 'components/RequestErrors/RequestErrors';
import { ErrorMessage, Form, Formik } from 'formik';
import { useAccountRedeemPoints } from 'hooks';
import { useUserAuthenticate } from 'hooks/useUsers';
import React, { useCallback } from 'react';
import { convertIntoArray } from 'utils/function';
import * as Yup from 'yup';
import { Button, FieldError, FormInputLabel } from '../../elements';

interface Props {
	account: any;
	onSuccess: any;
	onClose: any;
}

export const RedeemPointsModal = ({ account, onSuccess, onClose }: Props) => {
	// CUSTOM HOOKS
	const {
		mutateAsync: redeemPoints,
		isLoading: isRedeemingPoints,
		error: redeemPointsError,
	} = useAccountRedeemPoints();

	const {
		mutateAsync: authenticateUser,
		isLoading: isAuthenticating,
		error: authenticateUserError,
	} = useUserAuthenticate();

	// METHODS
	const getFormDetails = useCallback(
		() => ({
			defaultValues: {
				username: '',
				password: '',
				points: '',
				remarks: '',
			},
			schema: Yup.object().shape({
				username: Yup.string().required().label('Username'),
				password: Yup.string().required().label('Password'),
				points: Yup.number()
					.min(0)
					.max(Number(account.total_points_balance))
					.required()
					.label('Points'),
				remarks: Yup.string().required().label('Remarks'),
			}),
		}),
		[account],
	);

	const onSubmit = async (formData) => {
		const { data } = await authenticateUser({
			login: formData.username,
			password: formData.password,
		});

		await redeemPoints({
			id: account.id,
			redeemAuthorizerId: data.id,
			redeemedPoints: formData.points,
			redeemRemarks: formData.remarks,
		});

		message.success('Points redeemed successfully.');

		onSuccess();
		onClose();
	};

	return (
		<Modal
			title="Redeem Points"
			footer={null}
			onCancel={onClose}
			visible
			centered
			closable
			width={600}
		>
			<RequestErrors
				errors={[
					...convertIntoArray(authenticateUserError?.errors),
					...convertIntoArray(redeemPointsError?.errors),
				]}
				withSpaceBottom
			/>

			<Formik
				initialValues={getFormDetails().defaultValues}
				validationSchema={getFormDetails().schema}
				onSubmit={(formData) => {
					onSubmit(formData);
				}}
			>
				<Form>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<FormInputLabel id="username" label="Authorizer's Username" />
							<ErrorMessage
								name="username"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
						<Col span={24}>
							<FormInputLabel
								type="password"
								id="password"
								label="Authorizer's Password"
							/>
							<ErrorMessage
								name="password"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Divider dashed />

						<Col span={24}>
							<FormInputLabel
								disabled={account.total_points_balance === 0}
								type="number"
								id="points"
								label={`Points (Balance: ${account.total_points_balance})`}
							/>
							<ErrorMessage
								name="points"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>

						<Col span={24}>
							<FormInputLabel id="remarks" label="Remarks" />
							<ErrorMessage
								name="remarks"
								render={(error) => <FieldError error={error} />}
							/>
						</Col>
					</Row>

					<div className="ModalCustomFooter">
						<Button
							type="button"
							text="Cancel"
							onClick={onClose}
							disabled={isRedeemingPoints || isAuthenticating}
						/>
						<Button
							type="submit"
							text="Redeem"
							variant="primary"
							loading={isRedeemingPoints || isAuthenticating}
						/>
					</div>
				</Form>
			</Formik>
		</Modal>
	);
};
