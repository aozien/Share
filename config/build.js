import esbuild from 'esbuild'
import * as common from './common.js'
import {unlink} from 'node:fs'
import {join} from 'node:path'


esbuild
    .build(common.build)
    .then((result) => {
      // Remove development resources from non-development builds
      if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
        unlink(join(common.buildDir, 'mockServiceWorker.js'), (err) => console.log(err))
      }

      console.log('Build succeeded.')
    })
    .catch(() => process.exit(1))
