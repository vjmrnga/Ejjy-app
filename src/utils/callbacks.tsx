export const onCallback =
	(callback, onSuccess = null, onError = null) =>
	(response) => {
		callback(response);

		if (onSuccess && response?.status === request.SUCCESS) {
			onSuccess(response);
		}

		if (onError && response?.status === request.ERROR) {
			onError(response);
		}
	};

export const modifiedCallback =
	(callback, successMessage, errorMessage, extraCallback = null) =>
	(response) => {
		showMessage(response?.status, successMessage, errorMessage);
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};

export const modifiedExtraCallback =
	(callback, extraCallback = null) =>
	(response) => {
		callback(response);
		if (extraCallback) {
			extraCallback(response);
		}
	};
