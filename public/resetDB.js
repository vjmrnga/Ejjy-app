const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const { resolve } = require('path');
const isDev = require('electron-is-dev');
const window = require('electron').BrowserWindow;
const log = require('electron-log');
const { dialog } = require('electron');

const API_PATH = isDev
	? resolve('api')
	: path.join(process.resourcesPath, 'api');

const SQLITE_DB_NAME = 'db.sqlite3';
const SQLITE_CLEAN_DB_NAME = 'db-clean.sqlite3';
const SQLITE_STANDALONE_DB_NAME = 'db-carmen.sqlite3';

function logStatus(text) {
	log.info(text);

	const focusedWindow = window.getFocusedWindow();
	if (focusedWindow) {
		focusedWindow.webContents.send('message', text);
	}
}

function resetDB(backupDatabaseName) {
	// Append the timestamp to sqlite db
	const sqliteDatabasePath = path.join(API_PATH, SQLITE_DB_NAME);
	if (fs.existsSync(sqliteDatabasePath)) {
		const dbName = 'db-' + dayjs().format('DDMMYYYYHHmmss') + '.sqlite3';
		const newSqliteDbName = path.join(API_PATH, dbName);

		fs.renameSync(sqliteDatabasePath, newSqliteDbName);
		logStatus(`[RESET]: Renamed ${SQLITE_DB_NAME} into ${dbName}`);
	} else {
		dialog.showMessageBoxSync(window.getFocusedWindow(), {
			type: 'error',
			title: 'Error',
			buttons: ['Close'],
			message: 'SQLite Database was not found.',
			cancelId: -1,
		});
	}

	// Check if clean sqlite db exists and rename to sqlite db name
	const sqliteBackupDatabasePath = path.join(API_PATH, backupDatabaseName);
	if (fs.existsSync(sqliteBackupDatabasePath)) {
		const newSqliteDbName = path.join(API_PATH, SQLITE_DB_NAME);

		fs.copyFileSync(sqliteBackupDatabasePath, newSqliteDbName);
		logStatus(
			`[RESET]: Renamed ${sqliteBackupDatabasePath} into ${newSqliteDbName}`,
		);
	} else {
		dialog.showMessageBoxSync(window.getFocusedWindow(), {
			type: 'error',
			title: 'Error',
			buttons: ['Close'],
			message: 'A clean SQLite Database was not found.',
			cancelId: -1,
		});

		return false;
	}

	return true;
}

function resetClean() {
	return resetDB(SQLITE_CLEAN_DB_NAME);
}

function resetStandalone() {
	return resetDB(SQLITE_STANDALONE_DB_NAME);
}

module.exports = {
	resetClean,
	resetStandalone,
};
