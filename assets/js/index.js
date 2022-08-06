import { Application } from '@hotwired/stimulus'

import ColorSchemeController from "./controllers/color_scheme_controller"

window.Stimulus = Application.start()
Stimulus.register("color-scheme", ColorSchemeController)

console.log('JS Loaded')

// Enable Stimulus debug mode in development
/* eslint-disable no-undef */
// Stimulus.debug = process.env.NODE_ENV === 'development'
/* eslint-enable no-undef */
