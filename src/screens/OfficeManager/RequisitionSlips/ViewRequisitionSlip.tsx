import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Breadcrumb, Container } from '../../../components';
import { selectors } from '../../../ducks/requisition-slips';
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
		getRequisitionSlipsById,
		removeRequisitionSlipByBranch,
		status: requisitionSlipStatus,
	} = useRequisitionSlips();
	const requisitionSlip = useSelector(selectors.selectRequisitionSlip());

	// Effect: Fetch requisition slip
	useEffect(() => {
		fetchRequisitionSlip();
	}, [requisitionSlipId]);

	const getBreadcrumbItems = useCallback(
		() => [
			{ name: 'Requisition Slips', link: '/requisition-slips' },
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
		<Container
			title="[VIEW] F-RS01"
			rightTitle={`#${requisitionSlip?.id}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			loading={requisitionSlipStatus === request.REQUESTING}
			loadingText="Fetching requisition slip..."
		>
			<section className="ViewRequisitionSlip">
				<RequestedProducts
					requisitionSlip={requisitionSlip}
					requisitionSlipStatus={requisitionSlipStatus}
				/>

				<OrderSlips
					fetchRequisitionSlip={fetchRequisitionSlip}
					requisitionSlip={requisitionSlip}
				/>
			</section>
		</Container>
	);
};

export default ViewRequisitionSlip;
