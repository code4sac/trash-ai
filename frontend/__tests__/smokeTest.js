/* eslint-disable no-undef */
const timeout = 12000
const url = 'http://localhost:5150/'

describe(
    'Smoke test for Trash-AI',
    () => {
        let page
        beforeAll(async () => {
            page = await global.__BROWSER__.newPage()
            await page.setViewport({
                width: 1536,
                height: 960,
            })
            await page.goto(url)
        }, timeout)

        afterAll(async () => {
            await page.close()
        })

        it('should load without error', async () => {
            const text = await page.evaluate(() => document.body.textContent)
            expect(text).toContain('Trash AI')
        })

        it(
            'should show samples when prompted',
            async () => {
                // Open actions menu
                const openActionsBtn = await page.waitForSelector(
                    '#actions-button-test-id',
                )
                await openActionsBtn.click()
                await page.waitForTimeout(1000)

                // Click Show Samples
                const showSamplesBtn = await page.waitForSelector(
                    '#show-samples-test-id',
                )
                await showSamplesBtn.click()
                await page.waitForTimeout(2000)

                // Navigate to Summary page
                const summaryBtn = await page.waitForSelector(
                    '#summary-tab-test-id',
                )
                await summaryBtn.click()
                await page.waitForTimeout(500)

                // Check if navigations was successful
                current_url = await page.url()
                expect(current_url).toBe(`${url}summary/detections`)

                // Check if results are displayed
                const drinkCanImg = await page.waitForSelector(
                    'a[href="/detection/Drink%20can"]',
                )
                await drinkCanImg.click()
                await page.waitForTimeout(500)

                // Check if navigation happened
                current_url = await page.url()
                expect(current_url).toBe(`${url}detection/Drink%20can`)

                // Navigate to image view page
                const sampleImg = await page.waitForSelector(
                    'div[id="sample01.jpg-test-id"]',
                )
                await sampleImg.click()
                await page.waitForTimeout(500)

                // Check if navigation happened
                current_url = await page.url()
                expect(current_url).toBe(`${url}image/0/image`)

                // Check if the image is loaded
                const canvasImg = await page.waitForSelector('#canvasparent')

                // Check of the images classes are loaded
                const drinkCanClass = await page.waitForSelector(
                    'a[href="/detection/Drink%20can"]',
                )

                const paperCupClass = await page.waitForSelector(
                    'a[href="/detection/Paper%20cup"]',
                )

                // Check of the image and metadata tabs are loaded
                const imageTab = await page.waitForSelector(
                    '#image-tab-test-id',
                )

                const metadataTab = await page.waitForSelector(
                    '#meta-tab-test-id',
                )
                metadataTab.click()
                await page.waitForTimeout(500)

                // Check is exif data is displayed
                const exifData = await page.waitForSelector('#exifData-test-id')
                // Check if metadata is displayed
                const metaData = await page.waitForSelector('#metaData-test-id')
                await page.waitForTimeout(500)
            },
            timeout,
        )
    },
    timeout,
)
