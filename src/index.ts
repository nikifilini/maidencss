#!/usr/bin/env node
import fs from 'fs-extra'
import * as path from 'path'

import { ColorsProcessor } from './colors'
import { ImportsProcessor } from './imports'
import { SpacingsProcessor } from './spacings'
import { Schema } from './types'

const coolImport = require('@nikifilini/maiden-config-loader')

async function main() {
  const root = process.cwd()
  let schema: Schema
  if (fs.existsSync(path.join(root, 'schema.maiden.js'))) {
    schema = require(path.join(root, 'schema.maiden.js'))
  } else if (fs.existsSync(path.join(root, 'schema.maiden.ts'))) {
    schema = await coolImport(root, 'schema.maiden.ts', 'schema.maiden.mjs')
  } else {
    throw new Error('Config not found')
  }
  const outDir = path.join(root, schema.out)

  await fs.ensureDir(outDir)

  console.log('Generating spacings...')
  const spacingsGenerator = new SpacingsProcessor(schema)
  console.log('Generating colors...')
  const colorsGenerator = new ColorsProcessor(schema)
  console.log('Generating imports...')
  const importsGenerator = new ImportsProcessor(schema)
  console.log()

  console.log('Writing imports...')
  await fs.writeFile(path.join(outDir, 'index.css'), importsGenerator.content)
  console.log('Writing spacings...')
  await fs.writeFile(
    path.join(outDir, 'spacings.css'),
    spacingsGenerator.content,
  )
  console.log('Writing colors...')
  await fs.writeFile(path.join(outDir, 'colors.css'), colorsGenerator.content)
  console.log('Done!')
}

if (require.main === module) {
  main()
}

export * from './utils'
export * from './functions'
