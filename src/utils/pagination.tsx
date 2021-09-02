import { message } from 'antd';
import { cloneDeep } from 'lodash';
import { NOT_FOUND_INDEX } from '../global/constants';

/**
 * generates a new cached data
 * @param {Object[]} existingData - the existing array of data
 * @param {Object[]} toBeAddedData - an array of to be added data
 * @param {Number} index - the first index in the existing data where we
 *                         start adding the new data
 * @return {Object[]} an array of updated cached data
 */
export const generateNewCachedData = ({
	existingData,
	toBeAddedData,
	index,
}) => {
	// if the existing data is null, create a new empty array,
	// otherwise, copy the contents of the existing data
	const newCachedData = existingData === null ? [] : [...existingData];

	// loop through all the items in the toBeAdded data and insert
	// them to their respective positions
	for (let i = 0; i < toBeAddedData.length; i += 1) {
		newCachedData[index + i] = toBeAddedData[i];
	}

	return newCachedData;
};

/**
 * checks if there's already a cached data at a specified index
 * @param {Object[]} existingData - the existing array of data
 * @param {Number} index - the index to be checked
 * @return {Boolean} true if there is already a cached data at the
 *                   specified index
 */
export const indexHasCachedData = ({ existingData, index }) =>
	existingData && existingData[index] != null;

/**
 * retrieves the current data for the specified page
 * @param {Object[]} data - the existing array of data
 * @param {Number} currentPage - the current page of the pagination
 * @param {Number} pageSize - the size per page of the pagination. This is
 *                            needed in order to determine how many elements
 *                            we need to return
 * @return {Object[]} the current data for the specified page
 */
export const getDataForCurrentPage = ({ data, currentPage, pageSize }) => {
	const offset = (currentPage - 1) * pageSize;

	return data ? data.slice(offset, offset + pageSize) : null;
};

export const addInCachedData = ({ data, item }) => [item, ...data];

export const updateInCachedData = ({ data, item }) => {
	const index = data.findIndex((d) => d?.id === item.id);

	if (index !== NOT_FOUND_INDEX) {
		const clonedData = cloneDeep(data);
		clonedData[index] = item;

		return clonedData;
	}

	return data;
};

export const removeInCachedData = ({ data, item }) =>
	data.filter(({ id }) => id !== item.id);

/**
 * configure the pagination when sending the request
 * @param {object} requestData - the payload for request
 * @param {boolean} shouldReset - for forcing to reset the cached pagination data
 * @param {object} data - the needed data and methods
 */
export const executePaginatedRequest = (
	requestData,
	shouldReset = false,
	data,
) => {
	const {
		requestAction,
		requestType,
		errorMessage,
		allData,
		pageSize,
		executeRequest,
		setAllData,
		setPageCount,
		setCurrentPage,
		setPageSize,
	} = data;
	let currentPageSize = pageSize;
	const { page, pageSize: newPageSize } = requestData;

	if (newPageSize !== pageSize && newPageSize) {
		currentPageSize = newPageSize;
	}

	setCurrentPage(page);

	if (
		!indexHasCachedData({
			existingData: allData,
			index: (page - 1) * currentPageSize,
		}) ||
		shouldReset
	) {
		executeRequest(
			{ ...requestData, pageSize: currentPageSize },
			{
				onSuccess: ({ data: { results: toBeAddedData, count } }) => {
					if (shouldReset) {
						setAllData([]);
					}

					setAllData((currentAllData) =>
						generateNewCachedData({
							existingData: currentAllData,
							toBeAddedData,
							index: (page - 1) * currentPageSize,
						}),
					);

					setPageCount(count);
					setPageSize(currentPageSize);
				},
				onError: () => message.error(errorMessage),
			},
			requestAction,
			requestType,
		);
	}
};
