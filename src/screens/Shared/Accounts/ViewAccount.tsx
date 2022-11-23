import { Spin } from 'antd';
import { Breadcrumb, Content, RequestErrors } from 'components';
import { Box } from 'components/elements';
import { useAccountRetrieve } from 'hooks';
import React, { useCallback } from 'react';
import { convertIntoArray, getFullName } from 'utils';
import { AccountDetails } from './components/ViewAccount/AccountDetails';
import { PointTransactions } from './components/ViewAccount/PointTransactions';

interface Props {
	match: any;
}

export const ViewAccount = ({ match }: Props) => {
	// VARIABLES
	const accountId = match?.params?.id;

	// CUSTOM HOOKS
	const {
		data: account,
		isFetching: isFetchingAccount,
		error: accountErrors,
	} = useAccountRetrieve({
		id: accountId,
		options: {
			enabled: !!accountId,
		},
	});

	// METHODS
	const getBreadcrumbItems = useCallback(
		() => [
			{
				name: 'Accounts',
				link: '/branch-manager/accounts',
			},
			{ name: getFullName(account) },
		],
		[account],
	);

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			title="[VIEW] Account"
		>
			<Spin spinning={isFetchingAccount}>
				<Box padding>
					<RequestErrors
						errors={convertIntoArray(accountErrors)}
						withSpaceBottom
					/>

					{account && <AccountDetails account={account} />}
				</Box>

				{account?.is_point_system_eligible && (
					<PointTransactions account={account} />
				)}
			</Spin>
		</Content>
	);
};
