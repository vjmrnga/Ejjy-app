import { Account } from 'ejjy-global';

export type Payor = {
	account: Account;
	credit_limit: string;
	id: number;
	online_id: number;
	total_balance: string;
};
