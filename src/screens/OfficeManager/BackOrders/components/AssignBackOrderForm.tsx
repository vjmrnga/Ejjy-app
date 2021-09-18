import { Select } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Button, FieldError, Label } from '../../../../components/elements';
import { RequestErrors } from '../../../../components/RequestErrors/RequestErrors';
import { MAIN_BRANCH_ID, MAX_PAGE_SIZE } from '../../../../global/constants';
import { request, userTypes } from '../../../../global/types';
import { useUsers } from '../../../../hooks/useUsers';
import { convertIntoArray, sleep } from '../../../../utils/function';

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
	const {
		users,
		getOnlineUsers,
		status: usersStatus,
		errors: usersErrors,
	} = useUsers();

	// METHODS

	useEffect(() => {
		getOnlineUsers(
			{
				// NOTE: Currently the temporary 'bodega' is the main branch
				branchId: MAIN_BRANCH_ID,
				userType: userTypes.BRANCH_MANAGER,
				page: 1,
				pageSize: MAX_PAGE_SIZE,
			},
			true,
		);
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
			<RequestErrors errors={convertIntoArray(usersErrors)} withSpaceBottom />

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
							style={{ width: '100%' }}
							value={values.receiver_id}
							loading={usersStatus === request.REQUESTING}
							disabled={usersStatus === request.REQUESTING}
							onChange={(value) => setFieldValue('receiver_id', value)}
						>
							{users.map(({ id, first_name, last_name }) => (
								<Select.Option value={id}>
									{`${first_name} ${last_name}`}
								</Select.Option>
							))}
						</Select>
						<ErrorMessage
							name="receiver_id"
							render={(error) => <FieldError error={error} />}
						/>

						<div className="ModalCustomFooter">
							<Button
								type="button"
								text="Cancel"
								onClick={onClose}
								classNames="mr-10"
								disabled={
									loading || isSubmitting || usersStatus === request.REQUESTING
								}
							/>
							<Button
								type="submit"
								text="Assign"
								variant="primary"
								disabled={usersStatus === request.REQUESTING}
								loading={loading || isSubmitting}
							/>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};
