import { isEmpty } from 'lodash';
import * as queryString from 'query-string';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
	page?: number | string;
	pageSize?: number | string;
	debounceTime?: number;
	onParamsCheck?: any;
	onQueryParamChange?: any;
}

const useQueryParams = ({
	page: currentPage,
	pageSize: currentPageSize,
	debounceTime = 500,
	onParamsCheck,
	onQueryParamChange,
}: Props = {}) => {
	const history = useHistory();
	const params = queryString.parse(history.location.search);

	useEffect(() => {
		const newParams = onParamsCheck?.(params);

		if (!isEmpty(newParams)) {
			history.replace(
				queryString.stringifyUrl({
					url: '',
					query: {
						...newParams,
						...params,
					},
				}),
			);
		}
	}, []);

	const handleChange = () => {
		const pageSize = params.pageSize || currentPageSize;
		const page = params.page || currentPage;

		if (onQueryParamChange) {
			onQueryParamChange({ ...params, page, pageSize });
		}
	};

	const debouncedOnChange = useDebouncedCallback(handleChange, debounceTime);

	useEffect(() => {
		debouncedOnChange();
	}, [history.location.search]);

	/**
	 * @param param
	 * @param options
	 */
	const setQueryParams = (
		param,
		{ shouldResetPage = false, shouldIncludeCurrentParams = true } = {},
	) => {
		const currentParams = queryString.parse(history.location.search);

		history.push(
			queryString.stringifyUrl({
				url: '',
				query: {
					...(shouldIncludeCurrentParams ? currentParams : {}),
					...(shouldResetPage ? { page: 1 } : {}),
					...param,
				},
			}),
		);
	};

	return { params, setQueryParams, refreshList: handleChange };
};

export default useQueryParams;
