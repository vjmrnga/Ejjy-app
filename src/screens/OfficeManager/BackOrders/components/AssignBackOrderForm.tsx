import { Select } from 'antd';
import { RequestErrors } from 'components';
import { Button, FieldError, Label } from 'components/elements';
import { ErrorMessage, Form, Formik } from 'formik';
import { request } from 'global';
import React, { useCallback, useEffect, useState } from 'react';
import { convertIntoArray, sleep } from 'utils';
import * as Yup from 'yup';

interface Props {
	backOrder: any;
	onSubmit: any;
	onClose: any;
	loading: boolean;
}

export const AssignBackOrderForm = ({
	backOrder,
	onSubmit,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);

	// CUSTOM HOOKS
	// const {
	// 	users,
	// 	getOnlineUsers,
	// 	status: usersStatus,
	// 	errors: usersErrors,
	// } = useUsers();

	// METHODS

	useEffect(() => {
		// TODO: Requires refactoring once this feature is revisited
		// getOnlineUsers(
		// 	{
		// 		// NOTE: Currently the temporary 'bodega' is the main branch
		// 		branchId: MAIN_BRANCH_ID,
		// 		userType: userTypes.BRANCH_MANAGER,
		// 		page: 1,
		// 		pageSize: MAX_PAGE_SIZE,
		// 	},
		// 	true,
		// );
	}, []);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				receiver_id: backOrder?.receiver?.id,
			},
			Schema: Yup.object().shape({
				receiver_id: Yup.number().nullable().required().label('Receiver'),
			}),
		}),
		[backOrder],
	);

	return (
		<>
			{/* <RequestErrors errors={convertIntoArray(usersErrors)} withSpaceBottom />

			<Formik
				initialValues={getFormDetails().DefaultValues}
				validationSchema={getFormDetails().Schema}
				onSubmit={async (formData) => {
					setSubmitting(true);
					await sleep(500);
					setSubmitting(false);

					onSubmit(formData);
				}}
			>
				{({ values, setFieldValue }) => (
					<Form>
						<Label label="Receiver (User)" spacing />
						<Select
							className="w-100"
							disabled={usersStatus === request.REQUESTING}
							loading={usersStatus === request.REQUESTING}
							value={values.receiver_id}
							onChange={(value) => setFieldValue('receiver_id', value)}
						>
							{users.map((user) => (
								<Select.Option key={user.id} value={user.id}>
									{getFullName(user)}
								</Select.Option>
							))}
						</Select>
						<ErrorMessage
							name="receiver_id"
							render={(error) => <FieldError error={error} />}
						/>

						<div className="ModalCustomFooter">
							<Button
								disabled={
									loading || isSubmitting || usersStatus === request.REQUESTING
								}
								text="Cancel"
								type="button"
								onClick={onClose}
							/>
							<Button
								disabled={usersStatus === request.REQUESTING}
								loading={loading || isSubmitting}
								text="Assign"
								type="submit"
								variant="primary"
							/>
						</div>
					</Form>
				)}
			</Formik> */}
		</>
	);
};
