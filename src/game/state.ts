import { IoStorage } from 'io-gui';

export const $CookiesRequired = IoStorage({key: 'cookiesRequired', value: true, storage: 'local'});
export const $CookiesImprovement = IoStorage({key: 'cookiesImprovement', value: true, storage: 'local'});
export const $CookiesAnalitics = IoStorage({key: 'cookiesAnalitics', value: true, storage: 'local'});

export const $ShowGDPR = IoStorage({key: 'showGDPR', value: true, storage: 'local'});
export const $ShowHelp = IoStorage({key: 'showHelp', value: false});
export const $ShowStats = IoStorage({key: 'showStats', value: false});
export const $ShowSettings = IoStorage({key: 'showSettings', value: false});

export const $HardMode = IoStorage({key: 'hardMode', value: false, storage: 'local'});
export const $ColorblindMode = IoStorage({key: 'colorblindMode', value: false, storage: 'local'});