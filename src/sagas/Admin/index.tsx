import failedTransfersSagas from './failed-transfers';
import logsSagas from './logs';

export const adminSagas = [...failedTransfersSagas, ...logsSagas];
