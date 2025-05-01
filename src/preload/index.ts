import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { Api } from '@shared/types'

// Custom APIs for renderer
export const api: Api = {
  db: {
    habit: {
      findAll: () => ipcRenderer.invoke('db:habit:find-all'),
      create: (args) => ipcRenderer.invoke('db:habit:create', args),
      destroy: (id) => ipcRenderer.invoke('db:task:destroy', id),
      update: (args) => ipcRenderer.invoke('db:habit:update', args),
      findAllWithRelations: () => ipcRenderer.invoke('db:find-all-with-relations')
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
