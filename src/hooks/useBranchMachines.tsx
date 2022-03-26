import { actions, selectors, types } from 'ducks/branch-machines';
import { IS_APP_LIVE, request } from 'global';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { BranchMachinesService, ONLINE_API_URL } from 'services';
import { getLocalIpAddress, modifiedExtraCallback } from 'utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useBranchMachines = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [warnings, setWarnings] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// SELECTORS
	const branchMachines = useSelector(selectors.selectBranchMachines());

	// ACTIONS
	const getBranchMachinesAction = useActionDispatch(actions.getBranchMachines);
	const getBranchMachineAction = useActionDispatch(actions.getBranchMachine);
	const retrieveBranchMachineSalesAction = useActionDispatch(
		actions.retrieveBranchMachineSales,
	);
	const retrieveBranchMachineSalesAllAction = useActionDispatch(
		actions.retrieveBranchMachineSalesAll,
	);

	// METHODS
	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
		warnings: callbackWarnings = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
		setWarnings(callbackWarnings);
	};

	const getBranchMachines = (branchId = null) => {
		setRecentRequest(types.GET_BRANCH_MACHINES);
		getBranchMachinesAction({ branchId, callback });
	};

	const getBranchMachine = (id, extraCallback = null) => {
		setRecentRequest(types.RETRIEVE_BRANCH_MACHINE_SALES);
		getBranchMachineAction({
			id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const retrieveBranchMachineSales = (data, extraCallback = null) => {
		setRecentRequest(types.RETRIEVE_BRANCH_MACHINE_SALES);
		retrieveBranchMachineSalesAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const retrieveBranchMachineSalesAll = (data, extraCallback = null) => {
		setRecentRequest(types.RETRIEVE_BRANCH_MACHINE_SALES_ALL);
		retrieveBranchMachineSalesAllAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	return {
		branchMachines,
		getBranchMachines,
		getBranchMachine,
		retrieveBranchMachineSales,
		retrieveBranchMachineSalesAll,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};

export const useBranchMachinesCreate = () =>
	useMutation(({ name, serverUrl, posTerminal }: any) =>
		BranchMachinesService.create(
			{
				name,
				server_url: serverUrl,
				pos_terminal: posTerminal,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		),
	);

export const useBranchMachinesEdit = () =>
	useMutation(({ id, name, serverUrl, posTerminal }: any) =>
		BranchMachinesService.edit(
			id,
			{
				name,
				server_url: serverUrl,
				pos_terminal: posTerminal,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		),
	);
