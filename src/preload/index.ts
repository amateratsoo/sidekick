import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import type { Api } from '@shared/types'

// Custom APIs for renderer
export const api: Api = {
  db: {
    habit: {
      findAll: () => ipcRenderer.invoke('db:habit:find-all'),
      createHabit: (args) => ipcRenderer.invoke('db:habit:create-habit', args)
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
