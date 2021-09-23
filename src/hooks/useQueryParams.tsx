import * as queryString from 'query-string';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
	page?: number | string;
	pageSize?: number | string;
	onQueryParamChange?: any;
}

export const useQueryParams = ({
	page: currentPage,
	pageSize: currentPageSize,
	onQueryParamChange,
}: Props = {}) => {
	const history = useHistory();

	useEffect(() => {
		onChange();
	}, [history.location]);

	const setQueryParams = (param, shouldResetPage = false) => {
		const params = queryString.parse(history.location.search);

		if (shouldResetPage) {
			params.page = '1';
		}

		history.push(
			queryString.stringifyUrl({
				url: '',
				query: {
					...params,
					...param,
				},
			}),
		);
	};

	const onChange = () => {
		const params = queryString.parse(history.location.search);
		const pageSize = params.pageSize || currentPageSize;
		const page = params.page || currentPage;

		if (onQueryParamChange) {
			onQueryParamChange({ ...params, page, pageSize });
		}
	};

	return { setQueryParams, refreshList: onChange };
};
