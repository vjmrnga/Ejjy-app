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

		fetchFailedTransferNotifications();

		intervalRef.current = setInterval(() => {
			fetchFailedTransferNotifications();
		}, 5000);

		return () => {
			clearInterval(intervalRef.current);
		};
	}, [branches]);

	// Effect: Format branches to be rendered in Table
	useEffect(() => {
		const failedTransferNotifications = Object.keys(failedTransfers)
			.filter((key) => failedTransfers?.[key]?.count > 0)
			.map((key) => ({
				message: (
					<b>
						{`${failedTransfers?.[key]?.branchName} has ${failedTransfers?.[key]?.count} failed transfers.`}
					</b>
				),
				datetime: formatDateTime(failedTransfers?.[key]?.datetime),
			}));

		setNotifications(failedTransferNotifications);
	}, [failedTransfers]);

	const fetchFailedTransferNotifications = () => {
		branches.forEach(({ id, name }) => {
			getFailedTansferCount({ branchId: id, branchName: name });
		});
	};

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
