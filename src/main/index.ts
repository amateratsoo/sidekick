import { app, shell, ipcMain, BrowserWindow } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon5.png?asset'

import { db } from './database/controllers'
import { InsertableHabit, InsertableTask, UpdateableHabit, UpdateableTask } from '@shared/types'

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

  /*********************************************************
   *
   *  IPC handlers
   *
   *********************************************************/

  /**
   * *******************
   *
   * db endpoints
   *
   * *******************
   */

  /**
   * *******************
   *
   * ✍️ habit
   *
   * *******************
   */
  ipcMain.handle('db:habit:find-all', async () => await db.habit.findAll())
  ipcMain.handle('db:habit:find-all-with-tasks', async () => await db.habit.findAllWithTasks())
  ipcMain.handle('db:habit:create', async (_, args: InsertableHabit) => await db.habit.create(args))
  ipcMain.handle('db:habit:destroy', async (_, id: string) => await db.habit.destroy(id))
  ipcMain.handle(
    'db:habit:update',
    async (
      _,
      args: {
        id: string
        valuesToUpdate: UpdateableHabit
      }
    ) => await db.habit.update(args)
  )
  ipcMain.handle('db:habit:find-all-with-tasks', async () => await db.habit.findAllWithTasks())
  ipcMain.handle(
    'db:habit:find-all-completed-by-habit-id',
    async (_, habitId: string) => await db.habit.findAllCompletedByHabitId(habitId)
  )
  ipcMain.handle(
    'db:habit:find-completed-by-habit-id',
    async (
      _,
      args: {
        habitId: string
        date?: string
      }
    ) => await db.habit.findCompletedByHabitId(args)
  )
  ipcMain.handle(
    'db:habit:check',
    async (
      _,
      args: {
        habitId: string
        date?: string
      }
    ) => await db.habit.check(args)
  )
  ipcMain.handle(
    'db:habit:uncheck',
    async (
      _,
      args: {
        habitId: string
        date?: string
      }
    ) => await db.habit.uncheck(args)
  )

  /**
   * *******************
   *
   * ✅ tasks
   *
   * *******************
   */
  ipcMain.handle('db:task:create', async (_, args: InsertableTask) => await db.task.create(args))
  ipcMain.handle(
    'db:task:find-all-by-habit-id',
    async (_, habitId: string) => await db.task.findAllByHabitId(habitId)
  )
  ipcMain.handle('db:task:destroy', async (_, id: string) => await db.task.destroy(id))
  ipcMain.handle(
    'db:task:update',
    async (
      _,
      args: {
        id: string
        valuesToUpdate: UpdateableTask
      }
    ) => await db.task.update(args)
  )

  /**
   * *******************
   *
   * window title bar buttons
   *
   * *******************
   */
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
