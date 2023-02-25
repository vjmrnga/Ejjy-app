import { Spin } from 'antd';
import { Breadcrumb, Content } from 'components';
import { selectors } from 'ducks/requisition-slips';
import { request } from 'global';
import { useRequisitionSlips } from 'hooks/useRequisitionSlips';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useUserStore } from 'stores';
import { OrderSlips } from './components/OrderSlips/OrderSlips';
import { RequestedProducts } from './components/RequestedProducts';
import './style.scss';

interface Props {
	match: any;
}

export const ViewRequisitionSlip = ({ match }: Props) => {
	// VARIABLES
	const requisitionSlipId = match?.params?.id;

	// CUSTOM HOOKS
	const history = useHistory();
	const user = useUserStore((state) => state.user);
	const {
		getRequisitionSlipsById,
		removeRequisitionSlipByBranch,
		status: requisitionSlipsStatus,
	} = useRequisitionSlips();
	const requisitionSlip = useSelector(selectors.selectRequisitionSlip());

	// Effect: Fetch requisition slip
	useEffect(() => {
		fetchRequisitionSlip();
	}, [requisitionSlipId]);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Requisition Slips', link: '/office-manager/requisition-slips' },
			{ name: `#${requisitionSlip?.id}` },
		],
		[requisitionSlip],
	);

	const fetchRequisitionSlip = () => {
		if (requisitionSlipId) {
			removeRequisitionSlipByBranch();
			getRequisitionSlipsById(
				{ id: requisitionSlipId, requestingUserType: user.user_type },
				({ status }) => {
					if (status === request.ERROR) {
						history.replace('/404');
					}
				},
			);
		}
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			className="ViewRequisitionSlip"
			rightTitle={`#${requisitionSlip?.id}`}
			title="[VIEW] F-RS01"
		>
			<Spin
				spinning={requisitionSlipsStatus === request.REQUESTING}
				tip="Fetching requisition slip..."
			>
				{requisitionSlip && (
					<>
						<RequestedProducts requisitionSlip={requisitionSlip} />

						<OrderSlips
							fetchRequisitionSlip={fetchRequisitionSlip}
							requisitionSlip={requisitionSlip}
						/>
					</>
				)}
			</Spin>
		</Content>
	);
};
