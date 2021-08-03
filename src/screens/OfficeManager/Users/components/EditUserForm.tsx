/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-wrap-multilines */
import { HomeOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Divider, Tabs } from 'antd';
import { ErrorMessage, Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
	Button,
	FieldError,
	FieldWarning,
	FormSelect,
	Label,
} from '../../../../components/elements';
import { Option } from '../../../../components/elements/Select/Select';
import { NO_BRANCH_ID } from '../../../../global/constants';
import { userTypeOptions } from '../../../../global/options';
import { sleep } from '../../../../utils/function';

const TABS = {
	branch: 'branch',
	userType: 'userType',
};

interface Props {
	user: any;
	branchOptions: Option[];
	onEditUserBranch: any;
	onEditUserType: any;
	onClose: any;
	loading: boolean;
}

export const EditUserForm = ({
	user,
	branchOptions,
	onEditUserBranch,
	onEditUserType,
	onClose,
	loading,
}: Props) => {
	// STATES
	const [isSubmitting, setSubmitting] = useState(false);
	const [currentActiveKey, setCurrentActiveKey] = useState(TABS.branch);

	// METHODS
	useEffect(() => {
		setCurrentActiveKey(TABS.branch);
	}, [user]);

	const getFormDetails = useCallback(
		() => ({
			DefaultValues: {
				branchId: user?.branch?.id || branchOptions?.[0]?.value,
				newUserType: user.user_type,
			},
			Schema: Yup.object().shape({
				branchId: Yup.number(),
				newUserType: Yup.string(),
			}),
		}),
		[user, branchOptions],
	);

	return (
		<Formik
			initialValues={getFormDetails().DefaultValues}
			validationSchema={getFormDetails().Schema}
			onSubmit={async (formData, { resetForm }) => {
				setSubmitting(true);
				await sleep(500);
				setSubmitting(false);

				if (currentActiveKey === TABS.branch) {
					onEditUserBranch(
						{ id: user?.id, branchId: formData.branchId },
						resetForm,
					);
				} else if (currentActiveKey === TABS.userType) {
					onEditUserType(
						{ id: user?.id, newUserType: formData.newUserType },
						resetForm,
					);
				}
			}}
			enableReinitialize
		>
			<Form>
				<FieldWarning
					message={
						<span>
							You can only edit the user type if selected user&apos;s current
							branch is <b>&quot;No Branch&quot;</b>
						</span>
					}
					withSpaceBottom
				/>
				<Tabs
					activeKey={currentActiveKey}
					type="card"
					onTabClick={(key) => {
						setCurrentActiveKey(key);
					}}
				>
					<Tabs.TabPane
						key={TABS.branch}
						tab={
							<span>
								<HomeOutlined />
								Branch
							</span>
						}
					>
						<Label label="Branch" spacing />
						<FormSelect id="branchId" options={branchOptions} />
						<ErrorMessage
							name="branchId"
							render={(error) => <FieldError error={error} />}
						/>
					</Tabs.TabPane>

					{user?.branch?.id === NO_BRANCH_ID && (
						<Tabs.TabPane
							key={TABS.userType}
							tab={
								<span>
									<UserSwitchOutlined />
									User Type
								</span>
							}
						>
							<Label label="Type" spacing />
							<FormSelect id="newUserType" options={userTypeOptions} />
							<ErrorMessage
								name="newUserType"
								render={(error) => <FieldError error={error} />}
							/>
						</Tabs.TabPane>
					)}
				</Tabs>

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
						text="Edit"
						variant="primary"
						loading={loading || isSubmitting}
					/>
				</div>
			</Form>
		</Formik>
	);
};
