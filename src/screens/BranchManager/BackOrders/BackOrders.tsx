/* eslint-disable no-underscore-dangle */
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Content, TableHeader, ViewBackOrderModal } from '../../../components';
import { Box } from '../../../components/elements';
import { MAIN_BRANCH_ID } from '../../../global/constants';
import { useAuth } from '../../../hooks/useAuth';
import { BackOrdersReceive } from './components/BackOrdersReceive';
import { BackOrdersSent } from './components/BackOrdersSent';
import { FulfillBackOrderModal } from './components/FulfillBackOrderModal';
import './style.scss';

const modals = {
	VIEW: 0,
	FULFILL: 1,
};

export const BackOrders = () => {
	// STATES
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);
	const [modalType, setModalType] = useState(null);

	// REFS
	const backOrdersReceiveRef = useRef(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();

	// METHODS
	const onOpenModal = (backOrder, type) => {
		setModalType(type);
		setSelectedBackOrder(backOrder);
	};

	return (
		<Content className="BackOrders" title="Back Orders">
			<Box>
				{user?.branch?.id !== MAIN_BRANCH_ID && (
					// NOTE: Only managers not from Main branch can create back order
					<TableHeader
						buttonName="Create Back Order"
						onCreate={() => history.push('/branch-manager/back-orders/create')}
					/>
				)}

				{user?.branch?.id !== MAIN_BRANCH_ID ? (
					// NOTE: Only managers not from Main branch can create back order
					<BackOrdersSent
						selectBackOrder={(backOrder) => {
							onOpenModal(backOrder, modals.VIEW);
						}}
					/>
				) : (
					// NOTE: Only managers from Main branch can receive back orders
					<BackOrdersReceive
						ref={backOrdersReceiveRef}
						selectBackOrder={(backOrder) => {
							onOpenModal(backOrder, modals.VIEW);
						}}
						onFulfill={(backOrder) => {
							onOpenModal(backOrder, modals.FULFILL);
						}}
					/>
				)}

				{modalType === modals.VIEW && selectedBackOrder && (
					<ViewBackOrderModal
						backOrder={selectedBackOrder}
						onClose={() => onOpenModal(null, null)}
					/>
				)}

				{modalType === modals.FULFILL && selectedBackOrder && (
					<FulfillBackOrderModal
						backOrder={selectedBackOrder}
						onSuccess={() => backOrdersReceiveRef.current?.refreshList()}
						onClose={() => onOpenModal(null, null)}
					/>
				)}
			</Box>
		</Content>
	);
};
