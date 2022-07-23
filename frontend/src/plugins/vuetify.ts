// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import type { ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Global CSS has to be imported
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const LightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#FFFFFF',
        primary: '#0185FF',
        secondary: '#A5D0F3',
        accent: '#CCCED1',
        accent2: '#BDBDBD',
        success: '#1D9722',
        error: '#FF6B6B',
        warning: '#F9A825',
        info: '#3F51B5',
    },
}

const DarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#1D1D1D',
        primary: '#0185FF',
        secondary: '#A5D0F3',
        accent: '#CCCED1',
        accent2: '#BDBDBD',
        success: '#1D9722',
        error: '#FF6B6B',
        warning: '#F9A825',
        info: '#3F51B5',
    },
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: LightTheme,
            dark: DarkTheme,
        },
    },
})

export default vuetify
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
