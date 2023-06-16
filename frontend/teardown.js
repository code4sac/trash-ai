import rimraf from 'rimraf'
import os from 'os'
import path from 'path'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function () {
    console.log('Teardown Puppeteer')
    await global.__BROWSER_GLOBAL__.close()
    console.log(`DIR ${DIR}`)
    // rimraf.sync(DIR)
}
