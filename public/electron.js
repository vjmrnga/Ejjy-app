const { app, BrowserWindow, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const kill = require('tree-kill');
const isDev = require('electron-is-dev');
const log = require('electron-log');
const path = require('path');
const { spawn } = require('child_process');

//-------------------------------------------------------------------
// Auto Updater
//-------------------------------------------------------------------
autoUpdater.autoDownload = false;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------------------------------------------------------
// Initialization
//-------------------------------------------------------------------
let mainWindow;
let splashScreen;
function createWindow() {
	let resetDB = null;
	if (isDev) {
		resetDB = require('./resetDB.js');
	} else {
		resetDB = require('../build/resetDB.js');
	}

	// Splash screen
	splash = new BrowserWindow({
		width: 800,
		height: 600,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
	});
	splash.loadURL(`file://${__dirname}/splash.html`);

	// Main screen
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});

	setTimeout(() => {
		mainWindow.loadURL(
			isDev
				? 'http://localhost:3005'
				: `file://${path.join(__dirname, '../build/index.html')}`,
		);
	}, 8000);

	mainWindow.once('ready-to-show', () => {
		splash.destroy();
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
		splashScreen = null;
	});

	// Migrate and run API
	startServer();

	// Set Menu
	const menu = Menu.getApplicationMenu().items;
	menu.push({
		label: 'Development',
		submenu: [
			{
				label: 'Reset Database',
				click: () => {
					mainWindow.setProgressBar(1);
					if (spawnRun) {
						kill(spawnRun.pid);
					}

					setTimeout(() => {
						const result = resetDB();
						mainWindow.setProgressBar(-1);

						if (result) {
							const choice = dialog.showMessageBoxSync(mainWindow, {
								type: 'info',
								title: 'Success',
								buttons: ['Close'],
								message:
									'Database was reset successfully. Click button below to restart the app.',
								cancelId: -1,
							});

							if (choice === 0) {
								app.relaunch();
								app.exit();
							}
						}
					}, 1000);
				},
			},
		],
	});
	Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

//-------------------------------------------------------------------
// Server
//-------------------------------------------------------------------
let spawnRun = null;
function startServer() {
	if (!isDev) {
		const apiPath = path.join(process.resourcesPath, 'api');
		spawn('python', ['manage.py', 'migrate'], {
			cwd: apiPath,
			detached: false,
		});
		spawnRun = spawn('python', ['manage.py', 'runserver', '0.0.0.0:8000'], {
			cwd: apiPath,
			detached: false,
		});

		logStatus('API: Started');

		mainWindow.once('closed', () => {
			kill(spawnRun.pid);
		});
	}
}

//-------------------------------------------------------------------
// Set single instance
//-------------------------------------------------------------------
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// Someone tried to run a second instance, we should focus our window.
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	// Load the rest of the app, etc...
	app.on('ready', createWindow);
}

//-------------------------------------------------------------------
// Check for updates
//
// We must only perform auto update in Windows OS
//-------------------------------------------------------------------
function logStatus(text) {
	log.info(text);
	mainWindow.webContents.send('message', text);
}
if (process.platform === 'win32') {
	autoUpdater.on('checking-for-update', () => {
		logStatus('Checking for update...');
	});

	autoUpdater.on('update-available', (info) => {
		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Software Update',
				message: `EJJY Inventory App ${info.version} is available. Please press the button below to download the update.`,
				buttons: ['Download Update'],
				cancelId: -1,
			})
			.then(({ response }) => {
				if (response === 0) {
					autoUpdater.downloadUpdate();
				}
			});
	});

	autoUpdater.on('update-not-available', (info) => {
		logStatus('Update not available');
	});

	autoUpdater.on('error', (err) => {
		logStatus('Error in auto-updater: ' + err);
	});

	autoUpdater.on('download-progress', (progress) => {
		mainWindow.setProgressBar(Number(progress.percent) / 100);

		let log_message = 'Download speed: ' + progress.bytesPerSecond;
		log_message = log_message + ' - Downloaded ' + progress.percent + '%';
		log_message =
			log_message + ' (' + progress.transferred + '/' + progress.total + ')';
		logStatus(log_message);
	});

	autoUpdater.on('update-downloaded', (info) => {
		logStatus('Update downloaded');

		dialog
			.showMessageBox(mainWindow, {
				type: 'info',
				title: 'Software Update',
				message: 'EJJY Inventory App is successfully updated.',
				buttons: ['Install Update'],
				cancelId: -1,
			})
			.then(({ response }) => {
				if (response === 0) {
					autoUpdater.quitAndInstall();
				}
			});
	});

	app.on('ready', function () {
		autoUpdater.checkForUpdates();
	});
}
