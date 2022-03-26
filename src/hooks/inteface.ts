import { UseMutationOptions, UseQueryOptions } from 'react-query';

export interface Query {
	id?: number;
	params?: any;
	options?: UseQueryOptions;
}

export interface Mutate {
	options?: UseMutationOptions;
}
