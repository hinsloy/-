const { session, ipcMain, net } = require('electron');
const { autoUpdater } = require("electron-updater");

let mainEvent;

const update = () => {
  bindMainListener();

  ipcMain.on('update-check', (event, arg) => {
    mainEvent = event;
    autoUpdater.checkForUpdates(event);
  });
};

function bindMainListener() {
  autoUpdater.on('checking-for-update', () => {});

  autoUpdater.on('update-available', (info) => {
    mainEvent.sender.send('update-available', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    mainEvent.sender.send('update-not-available', info);
  });

  autoUpdater.on('error', (err) => {
    mainEvent.sender.send('update-error', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = `Downloading...${progressObj.bytesPerSecond}, ${progressObj.percent}%, ${progressObj.transferred}/${progressObj.total}`;
    mainEvent.sender.send('download-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
    mainEvent.sender.send('update-downloaded', info);
  });
};

module.exports = update;
