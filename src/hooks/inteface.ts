import { UseQueryOptions } from 'react-query';

export interface Query {
	id?: number;
	params?: any;
	options?: UseQueryOptions;
}
