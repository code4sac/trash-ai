// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
    // **optional** default: `{}`
    // override vscode settings part
    // Notice: It only affects the settings used by Vetur.
    settings: {
        'vetur.format.defaultFormatter': 'prettier',
        'vetur.useWorkspaceDependencies': true,
        'vetur.experimental.templateInterpolationService': true,
    },
}
