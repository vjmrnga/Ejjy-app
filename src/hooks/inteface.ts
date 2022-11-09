import { UseMutationOptions, UseQueryOptions } from 'react-query';

export interface Query {
	id?: number;
	key?: string;
	params?: any;
	options?: UseQueryOptions;
}

export interface Mutate {
	options?: UseMutationOptions;
}
