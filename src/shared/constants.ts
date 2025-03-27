import path from 'node:path'
import fs from 'node:fs/promises'
import { homedir } from 'os'
import { randomUUID, type UUID } from 'node:crypto'

const pathToDb = path.join(homedir(), 'sidekick', 'dev.db')

// Ensure the directory exists before creating the file
async function ensureDbFileExists(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(pathToDb), { recursive: true })
    await fs.open(pathToDb, 'a') // 'a' ensures file is created if it doesn't exist but doesn't truncate
  } catch (error) {
    console.error('Failed to create DB file: ', error)
  }
}

ensureDbFileExists()

export { pathToDb }
export const generateUUID = (): UUID => randomUUID()
