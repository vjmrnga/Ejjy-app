import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { NetworkService } from 'services';
import { getLocalApiUrl } from 'utils';

export const useNetwork = ({ options }: Query) =>
	useQuery<any>(
		['useNetwork'],
		() => NetworkService.test(getLocalApiUrl()),
		options,
	);

export default useNetwork;
