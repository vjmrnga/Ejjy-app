import { MutateOptions, UseQueryOptions } from 'react-query';

export interface Query {
	id?: number;
	params?: any;
	options?: UseQueryOptions;
}

export interface Mutate {
	options?: MutateOptions;
}
