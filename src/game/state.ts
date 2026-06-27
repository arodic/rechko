import { Storage } from '@io-gui/core'

export const $CookiesRequired = Storage({key: 'cookiesRequired', value: true, storage: 'local'})
export const $CookiesImprovement = Storage({key: 'cookiesImprovement', value: true, storage: 'local'})
export const $CookiesAnalitics = Storage({key: 'cookiesAnalitics', value: true, storage: 'local'})

export const $ShowGDPR = Storage({key: 'showGDPR', value: true, storage: 'local'})
export const $ShowHelp = Storage({key: 'showHelp', value: false})
export const $ShowStats = Storage({key: 'showStats', value: false})
export const $ShowSettings = Storage({key: 'showSettings', value: false})

export const $HardMode = Storage({key: 'hardMode', value: false, storage: 'local'})
export const $ColorblindMode = Storage({key: 'colorblindMode', value: false, storage: 'local'})
