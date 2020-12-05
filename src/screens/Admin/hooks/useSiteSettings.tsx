import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../../../ducks/Admin/site-settings';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import { modifiedCallback } from '../../../utils/function';

const EDIT_SUCCESS_MESSAGE = 'Site settings was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the site settings';

export const useSiteSettings = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const siteSettings = useSelector(selectors.selectSiteSettings());
	const getSiteSettings = useActionDispatch(actions.getSiteSettings);
	const editSiteSettings = useActionDispatch(actions.editSiteSettings);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getSiteSettingsRequest = () => {
		setRecentRequest(types.GET_SITE_SETTINGS);
		getSiteSettings({ callback });
	};

	const editSiteSettingsRequest = (data) => {
		setRecentRequest(types.EDIT_SITE_SETTINGS);
		editSiteSettings({
			...data,
			callback: modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		siteSettings,
		getSiteSettings: getSiteSettingsRequest,
		editSiteSettings: editSiteSettingsRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
