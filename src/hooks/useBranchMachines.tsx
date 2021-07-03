import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	actions,
	selectors,
	types,
} from '../ducks/OfficeManager/branch-machines';
import { request } from '../global/types';
import { modifiedCallback, modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

const CREATE_SUCCESS_MESSAGE = 'Branch machine was created successfully';
const CREATE_ERROR_MESSAGE =
	'An error occurred while creating the branch machine';

const EDIT_SUCCESS_MESSAGE = 'Branch machine was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the branch machine';

export const useBranchMachines = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [warnings, setWarnings] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const branchMachines = useSelector(selectors.selectBranchMachines());

	const getBranchMachinesAction = useActionDispatch(actions.getBranchMachines);
	const createBranchMachineAction = useActionDispatch(
		actions.createBranchMachine,
	);
	const editBranchMachineAction = useActionDispatch(actions.editBranchMachine);

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

	const getBranchMachines = (branchId) => {
		setRecentRequest(types.GET_BRANCH_MACHINES);
		getBranchMachinesAction({ branchId, callback });
	};

	const createBranchMachine = (product, extraCallback = null) => {
		setRecentRequest(types.CREATE_BRANCH_MACHINE);
		createBranchMachineAction({
			...product,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					CREATE_SUCCESS_MESSAGE,
					CREATE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	const editBranchMachine = (product, extraCallback = null) => {
		setRecentRequest(types.EDIT_BRANCH_MACHINE);
		editBranchMachineAction({
			...product,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	return {
		branchMachines,
		getBranchMachines,
		createBranchMachine,
		editBranchMachine,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
