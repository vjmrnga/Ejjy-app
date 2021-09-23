import React, { useEffect, useRef, useState } from 'react';
import { Content } from '../../../components';
import { CashieringCard } from '../../../components/CashieringCard/CashieringCard';
import { FieldError } from '../../../components/elements';
import { request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranches } from '../../../hooks/useBranches';
import { useNetwork } from '../../../hooks/useNetwork';
import { BackupServerUrlForm } from './components/BackupServerUrlForm';
import { MachineReportTable } from './components/MachineReportTable';
import './style.scss';

const NETWORK_INTERVAL_MS = 5000;

export const Dashboard = () => {
	// STATES
	const [hasInternetConnection, setHasInternetConnection] = useState(null);
	const [isFirstTimeRequest, setIsFirstTimeRequest] = useState(true);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { branch, getBranch, status: branchStatus } = useBranches();
	const { testBranchConnection } = useNetwork();

	// REFS
	const networkIntervalRef = useRef(null);

	// METHODS
	useEffect(() => {
		getBranch(user?.branch?.id);

		const fn = () => {
			testBranchConnection({ branchId: user?.branch?.id }, ({ status }) => {
				if (status === request.SUCCESS) {
					setHasInternetConnection(true);
				} else if (status === request.ERROR) {
					setHasInternetConnection(false);
				}

				if (status !== request.REQUESTING && isFirstTimeRequest) {
					setIsFirstTimeRequest(false);
				}
			});
		};
		fn();
		networkIntervalRef.current = setInterval(fn, NETWORK_INTERVAL_MS);

		return () => {
			clearInterval(networkIntervalRef.current);
		};
	}, []);

	return (
		<Content className="Dashboard" title="Dashboard">
			{hasInternetConnection === false && (
				<FieldError error="Cannot reach branch's API" withSpaceBottom />
			)}

			<CashieringCard
				branchId={user?.branch?.id}
				disabled={!hasInternetConnection}
				loading={isFirstTimeRequest}
			/>

			<BackupServerUrlForm
				branch={branch}
				loading={branchStatus === request.REQUESTING}
			/>

			<MachineReportTable />
		</Content>
	);
};
