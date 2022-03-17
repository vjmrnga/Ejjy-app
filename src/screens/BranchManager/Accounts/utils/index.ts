export const getAccountName = (account) => {
	const name = [
		account?.first_name,
		account?.middle_name,
		account?.last_name,
	].filter(Boolean);

	return name.join(' ');
};
