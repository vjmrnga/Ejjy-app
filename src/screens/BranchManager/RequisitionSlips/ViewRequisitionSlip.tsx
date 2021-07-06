import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Container } from '../../../components';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useRequisitionSlips } from '../../../hooks/useRequisitionSlips';
import { OrderSlips } from './components/OrderSlips/OrderSlips';
import { RequestedProducts } from './components/RequestedProducts';
import './style.scss';

interface Props {
	match: any;
}

const ViewRequisitionSlip = ({ match }: Props) => {
	// VARIABLES
	const requisitionSlipId = match?.params?.id;

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		requisitionSlip,
		getRequisitionSlipsById,
		removeRequisitionSlipByBranch,
		status: requisitionSlipsStatus,
	} = useRequisitionSlips();

	// Effect: Fetch requisition slip
	useEffect(() => {
		removeRequisitionSlipByBranch();
		getRequisitionSlipsById(
			{
				id: requisitionSlipId,
				requestingUserType: user.user_type,
			},
			({ status }) => {
				if (status === request.ERROR) {
					history.replace('/404');
				}
			},
		);
	}, []);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Requisition Slips', link: '/requisition-slips' },
			{ name: `#${requisitionSlip?.id}` },
		],
		[requisitionSlip],
	);

	return (
		<Container
			title="[VIEW] F-RS01"
			rightTitle={`#${requisitionSlip?.id}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<section className="ViewRequisitionSlip">
				<RequestedProducts
					requisitionSlip={requisitionSlip}
					requisitionSlipStatus={requisitionSlipsStatus}
				/>

				<OrderSlips requisitionSlipId={requisitionSlipId} />
			</section>
		</Container>
	);
};

export default ViewRequisitionSlip;
