/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../../../components';
import { useBranches } from '../../../hooks/useBranches';
import { formatDateTime } from '../../../utils/function';
import { useFailedTransfers } from '../hooks/useFailedTransfers';
import { NotificationItem } from './components/NotificationItem';
import './style.scss';

const Branches = () => {
	// STATES
	const [notifications, setNotifications] = useState([]);

	// REFS
	const intervalRef = useRef(null);

	// CUSTOM HOOKS
	const { failedTransfers, getFailedTansferCount } = useFailedTransfers();
	const { branches, getBranches } = useBranches();

	// EFFECTS
	useEffect(() => {
		getBranches();
	}, []);

	useEffect(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			branches.forEach(({ id }) => {
				getFailedTansferCount({ branchId: id });
			});
		}, 2500);
	}, [branches]);

	// Effect: Format branches to be rendered in Table
	useEffect(() => {
		const failedTransferNotifications = Object.keys(failedTransfers).map((key) => ({
			message: failedTransfers?.[key]?.count,
			datetime: formatDateTime(failedTransfers?.[key]?.datetime),
		}));

		setNotifications(failedTransferNotifications);
	}, [failedTransfers]);

	return (
		<Container title="Notifications">
			<section className="Notifications">
				{notifications.map(({ message, datetime }) => (
					<NotificationItem message={message} datetime={datetime} />
				))}
			</section>
		</Container>
	);
};

export default Branches;
