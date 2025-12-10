/**
 * Theme dictionary - all themes defined in one place
 * Main themes use Audio (for looping support)
 * 
 * Theme uses Audio (for looping support)
 * 
 * @returns {Object} - The ThemeDict object.
 * 
 * @since abstract--JP
 */

export interface Theme {
    type: string;
    path: string;
}

export interface ThemeItem {
    readonly [key: string]: Theme;
}

export const ThemeDict: ThemeItem = Object.freeze({
    firstTheme: {
        type: 'audio',
        path: '/music and sounds/Superboy.mp3'
        // royalty free music purchased and licensed from dl-sounds.com to joshua payne 11:10pm 6/19/18
    }
} as const);

