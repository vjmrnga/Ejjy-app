import branchesSagas from './branches';
import productsSagas from './products';

export const officeManagerSagas = [...branchesSagas, ...productsSagas];
