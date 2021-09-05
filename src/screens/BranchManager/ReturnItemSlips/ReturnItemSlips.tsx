/* eslint-disable no-underscore-dangle */
import { Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Content, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { ViewReturnItemSlipModal } from '../../../components/modals/ViewReturnItemSlipModal';
import { FulfillReturnItemSlipModal } from './components/FulfillReturnItemSlipModal';
import { ReturnItemSlipsReceive } from './components/ReturnItemSlipsReceive';
import { ReturnItemSlipsSent } from './components/ReturnItemSlipsSent';
import './style.scss';

const tabs = {
	RECEIVE: 'RECEIVE',
	SENT: 'SENT',
};

const modals = {
	VIEW: 0,
	FULFILL: 1,
};

export const ReturnItemSlips = () => {
	// STATES
	const [activeTab, setActiveTab] = useState(tabs.RECEIVE);
	const [selectedReturnItemSlip, setSelectedReturnItemSlip] = useState(null);
	const [modalType, setModalType] = useState(null);

	// REFS
	const returnItemSlipsReceiveRef = useRef(null);

	// CUSTOM HOOKS
	const history = useHistory();

	// METHODS
	const onOpenModal = (returnItemSlip, type) => {
		setModalType(type);
		setSelectedReturnItemSlip(returnItemSlip);
	};

	return (
		<Content className="ReturnItemSlips" title="Return Item Slips">
			<Box>
				<TableHeader
					buttonName="Create Return Item Slip"
					onCreate={() => {
						history.push('/branch-manager/return-item-slips/create');
					}}
				/>

				<Tabs
					className="ReturnItemSlips_tabs PaddingHorizontal PaddingVertical"
					type="card"
					defaultActiveKey={activeTab}
					onTabClick={setActiveTab}
				>
					<Tabs.TabPane key={tabs.RECEIVE} tab="Receive">
						<ReturnItemSlipsReceive
							ref={returnItemSlipsReceiveRef}
							selectReturnItemSlip={(returnItemSlip) => {
								onOpenModal(returnItemSlip, modals.VIEW);
							}}
							onFulfill={(returnItemSlip) => {
								onOpenModal(returnItemSlip, modals.FULFILL);
							}}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane key={tabs.SENT} tab="Sent">
						<ReturnItemSlipsSent
							selectReturnItemSlip={(returnItemSlip) => {
								onOpenModal(returnItemSlip, modals.VIEW);
							}}
						/>
					</Tabs.TabPane>
				</Tabs>

				{modalType === modals.VIEW && selectedReturnItemSlip && (
					<ViewReturnItemSlipModal
						returnItemSlip={selectedReturnItemSlip}
						onClose={() => onOpenModal(null, null)}
					/>
				)}

				{modalType === modals.FULFILL && selectedReturnItemSlip && (
					<FulfillReturnItemSlipModal
						returnItemSlip={selectedReturnItemSlip}
						onSuccess={() => returnItemSlipsReceiveRef.current?.refreshList()}
						onClose={() => onOpenModal(null, null)}
					/>
				)}
			</Box>
		</Content>
	);
};
