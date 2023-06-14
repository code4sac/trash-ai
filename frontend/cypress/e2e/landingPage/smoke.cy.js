/* eslint-disable no-undef */
describe('Smoke test for Trash-AI', () => {

    it('Check if the page loads', () => {
        cy.visit('https://www.trashai.org/')
    })

    it('Check if show samples works', () => {
        // Navigate to page
        cy.visit('http://localhost:5150/')

        // Open actions menu
        cy.get('#actions-button-test-id').click()

        cy.intercept(
            'http://localhost:5150/samples/sample01.jpg',
            cy.spy().as('upload-samples-request'),
        )

        // Click Show Samples
        cy.get('#show-samples-test-id').click()

        // Check if samples uploaded
        cy.get('@upload-samples-request').should('have.been.calledOnce')

        // Navigate to Summary page
        cy.get('#menu-button-test-id').click()
        cy.get('#summary-tab-test-id').click()

        // Check if navigation happened
        cy.url().should('eq', 'http://localhost:5150/summary/detections')

        // Check if results are displayed
        cy.get("#drink-can-test-id")

        // Open image viewer
        cy.get("#Drink can-test-id").click()

        // Check if navigation happened
        cy.url().should('eq', 'http://localhost:5150/detection/Drink%20can')

        // Navigate to image view page
        cy.get("#sample01.jpg-test-id").click()

        // Check if navigation happened
        cy.url().should('eq', 'http://localhost:5150/image/0/image')

        // Check if the image is loaded
        cy.get("#canvasparent")

        // Switch to the Metadata tab
        cy.get("#meta-tab-test-id").click()

    })
  })