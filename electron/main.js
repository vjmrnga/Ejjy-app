const { app, BrowserWindow, Menu, MenuItem } = require('electron');
const path = require('path');

let isDev = process.env.APP_DEV ? process.env.APP_DEV.trim() == 'true' : false;
isDev = true;

let mainWindow;
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});

	const startURL = isDev
		? 'http://localhost:3005'
		: `file://${path.join(__dirname, '../build/index.html')}`;
	mainWindow.loadURL(startURL);

	mainWindow.once('ready-to-show', () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// Remove menu
	const menu = new Menu();

	// if (isDev) {
	menu.append(
		new MenuItem({
			label: 'Dev',
			submenu: [{ role: 'toggleDevTools' }, { role: 'forceReload' }],
		}),
	);
	// }

	Menu.setApplicationMenu(menu);
}

// Set single instance
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

	// Create myWindow, load the rest of the app, etc...
	app.on('ready', createWindow);
}
