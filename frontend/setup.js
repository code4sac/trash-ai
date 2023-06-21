import puppeteer from 'puppeteer'
import fs from 'fs'
import mkdirp from 'mkdirp'
import os from 'os'
import path from 'path'

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function () {
    console.log('Setup Puppeteer')
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--window-size=1920,1080'],
    })
    // This global is not available inside tests but only in global teardown
    global.__BROWSER_GLOBAL__ = browser
    // Instead, we expose the connection details via file system to be used in tests
    mkdirp.sync(DIR)

    console.log(`DIR ${DIR}`)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
