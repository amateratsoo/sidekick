import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { Api } from '@shared/types'

// Custom APIs for renderer
export const api: Api = {
  db: {
    habit: {
      findAll: () => ipcRenderer.invoke('db:habit:find-all'),
      create: (args) => ipcRenderer.invoke('db:habit:create', args),
      destroy: (id) => ipcRenderer.invoke('db:habit:destroy', id),
      update: (args) => ipcRenderer.invoke('db:habit:update', args),
      findAllWithTasks: () => ipcRenderer.invoke('db:habit:find-all-with-tasks'),
      findAllCompletedByHabitId: (habitId) =>
        ipcRenderer.invoke('db:habit:find-all-completed-by-habit-id', habitId),
      findCompletedByHabitId: (args) =>
        ipcRenderer.invoke('db:habit:find-completed-by-habit-id', args),
      check: (args) => ipcRenderer.invoke('db:habit:check', args),
      uncheck: (args) => ipcRenderer.invoke('db:habit:uncheck', args)
    },
    task: {
      create: (args) => ipcRenderer.invoke('db:task:create', args),
      findAllByHabitId: (id) => ipcRenderer.invoke('db:task:find-all-by-habit-id', id),
      destroy: (id) => ipcRenderer.invoke('db:task:destroy', id),
      update: (args) => ipcRenderer.invoke('db:task:update', args)
    }
  },
  window: {
    maximize: () => ipcRenderer.invoke('window:maximize'),
    minimize: () => ipcRenderer.invoke('window:minimize'),
    close: () => ipcRenderer.invoke('window:close')
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
contextBridge.exposeInMainWorld('api', api)
