import { useState } from 'react';
import { actions } from '../ducks/site-settings';
import { request } from '../global/types';
import { modifiedCallback, modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

const EDIT_SUCCESS_MESSAGE = 'Site settings was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the site settings';

export const useSiteSettings = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// ACTIONS
	const getSiteSettingsAction = useActionDispatch(actions.getSiteSettings);
	const editSiteSettingsAction = useActionDispatch(actions.editSiteSettings);

	const getSiteSettings = (data, extraCallback = null) => {
		getSiteSettingsAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const editSiteSettings = (data, extraCallback = null) => {
		editSiteSettingsAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	return {
		getSiteSettings,
		editSiteSettings,
		status,
		errors,
	};
};
