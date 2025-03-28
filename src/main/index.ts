import { app, shell, BrowserWindow, ipcMain, BaseWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { db } from './database/controllers'
import { InsertableHabit } from '@shared/types'

// feature flags
const blurred_window = false

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    fullscreenable: true,
    frame: false,
    center: true,
    backgroundColor: `rgba(9, 9, 11, ${blurred_window ? 0.6 : 1})`,
    title: 'Sidekick',
    // for mac blur effect
    ...(blurred_window ? { vibrancy: 'under-window' } : {}),
    visualEffectState: 'active',

    // ****
    // for windows 11 blur effect
    // NOTE: electron has devious bugs related to `backgroundMaterial`
    // for instance, we can't maximize a window if it's mica
    ...(blurred_window ? { backgroundMaterial: 'mica' } : {}),
    // ****
    titleBarStyle: process.platform == 'darwin' ? 'hidden' : 'default',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' || process.platform === 'win32' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.handle('db:habit:find-all', async () => await db.habit.findAll())
  ipcMain.handle(
    'db:habit:create-habit',
    async (_, args: InsertableHabit) => await db.habit.createHabit(args)
  )
  ipcMain.handle('window:close', () => mainWindow?.close())
  ipcMain.handle('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()

      return
    }

    mainWindow?.maximize()
  })
  ipcMain.handle('window:minimize', () => mainWindow?.minimize())

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
