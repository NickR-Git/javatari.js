// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.ConsoleControls = {

    // CAUTION: cannot use 0 or falsy values for controls

    JOY0_UP: 11, JOY0_DOWN: 12, JOY0_LEFT: 13, JOY0_RIGHT: 14, JOY0_BUTTON: 15,
    JOY1_UP: 21, JOY1_DOWN: 22, JOY1_LEFT: 23, JOY1_RIGHT: 24, JOY1_BUTTON: 25,
    PADDLE0_BUTTON: 41, PADDLE1_BUTTON: 42,
    PADDLE0_POSITION: 16384, PADDLE1_POSITION: 16384 + 512,		    // Value controls (not press). Value will be from 380 (Left) to 190 (Center) to 0 (Right); -1 = disconnected, won't charge POTs

    // Keyboard/Keypad Controller - 12 keys per port, numbered in the same
    // reading order the real physical 3x4 grid is wired in: 1,2,3 / 4,5,6 /
    // 7,8,9 / *,0,#, i.e. KEYPAD0_KEY_10 is "*", _11 is "0", _12 is "#" -
    // matches vcs-game-maker's own KEYPAD_KEY_OPTIONS numbering exactly, so
    // key N here is key N there. Port 0 and Port 1 are two independent
    // physical peripherals, same as JOY0_*/JOY1_* above - which physical
    // keyboard keys drive which port is purely a DOMConsoleControls mapping
    // choice, same as joystick keys.
    KEYPAD0_KEY_1: 61, KEYPAD0_KEY_2: 62, KEYPAD0_KEY_3: 63,
    KEYPAD0_KEY_4: 64, KEYPAD0_KEY_5: 65, KEYPAD0_KEY_6: 66,
    KEYPAD0_KEY_7: 67, KEYPAD0_KEY_8: 68, KEYPAD0_KEY_9: 69,
    KEYPAD0_KEY_10: 70, KEYPAD0_KEY_11: 71, KEYPAD0_KEY_12: 72,
    KEYPAD1_KEY_1: 73, KEYPAD1_KEY_2: 74, KEYPAD1_KEY_3: 75,
    KEYPAD1_KEY_4: 76, KEYPAD1_KEY_5: 77, KEYPAD1_KEY_6: 78,
    KEYPAD1_KEY_7: 79, KEYPAD1_KEY_8: 80, KEYPAD1_KEY_9: 81,
    KEYPAD1_KEY_10: 82, KEYPAD1_KEY_11: 83, KEYPAD1_KEY_12: 84,

    POWER: 51, BLACK_WHITE: 52, SELECT: 53, RESET: 54,
    DIFFICULTY0: 55, DIFFICULTY1: 56,
    POWER_OFF: 57, POWER_FRY: 58,

    CARTRIDGE_FORMAT: 91,

    DEBUG: 101, TRACE: 102, SHOW_INFO: 103, NO_COLLISIONS: 104, PAUSE: 105, PAUSE_AUDIO_ON: 106, FRAME: 107,
    FAST_SPEED: 111, SLOW_SPEED: 112, INC_SPEED: 113, DEC_SPEED: 114, NORMAL_SPEED: 115, MIN_SPEED: 116,

    VIDEO_STANDARD: 123, VSYNCH: 124,

    DEFAULTS: 130,

    SAVE_STATE_0: 256 + 0, SAVE_STATE_1: 256 + 1, SAVE_STATE_2: 256 + 2, SAVE_STATE_3: 256 + 3, SAVE_STATE_4: 256 + 4, SAVE_STATE_5: 256 + 5,
    SAVE_STATE_6: 256 + 6, SAVE_STATE_7: 256 + 7, SAVE_STATE_8: 256 + 8, SAVE_STATE_9: 256 + 9, SAVE_STATE_10: 256 + 10, SAVE_STATE_11: 256 + 11, SAVE_STATE_12: 256 + 12,
    LOAD_STATE_0: 512 + 0, LOAD_STATE_1: 512 + 1, LOAD_STATE_2: 512 + 2, LOAD_STATE_3: 512 + 3, LOAD_STATE_4: 512 + 4, LOAD_STATE_5: 512 + 5,
    LOAD_STATE_6: 512 + 6, LOAD_STATE_7: 512 + 7, LOAD_STATE_8: 512 + 8, LOAD_STATE_9: 512 + 9, LOAD_STATE_10: 512 + 10, LOAD_STATE_11: 512 + 11, LOAD_STATE_12: 512 + 12,

    SAVE_STATE_FILE: 201

};
