// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

Javatari.userPreferences = { };

Javatari.userPreferences.currentVersion = 1;
Javatari.userPreferences.compatibleVersions = new Set([ 1 ]);

Javatari.userPreferences.defaults = function() {
"use strict";

    var k = jt.DOMKeys;

    return {

        joystickKeys: [
            {
                left:    k.VK_LEFT,
                up:      k.VK_UP,
                right:   k.VK_RIGHT,
                down:    k.VK_DOWN,
                button:  k.VK_SPACE,
                buttonT: k.VK_DELETE
            }, {
                left:    k.VK_F,
                up:      k.VK_T,
                right:   k.VK_H,
                down:    k.VK_G,
                button:  k.VK_A,
                buttonT: k.VK_PERIOD
            }
        ],

        // Keyboard/Keypad Controller - 12 keys per port, numbered the same
        // 1,2,3/4,5,6/7,8,9/*,0,# reading order ConsoleControls' own
        // KEYPAD0_KEY_N/KEYPAD1_KEY_N constants document, same array shape
        // (index 0 = Player 1's own keys, index 1 = Player 2's, subject to
        // the same P1 Controls swap every other per-player preference here
        // already goes through) and same remapping mechanism (see Settings.js's
        // own keyRedefinitionTry) as joystickKeys above - just 12 keys
        // instead of 4 directions + 2 buttons. Player 1 defaults to the
        // plain top-row number keys (free to bind here: every existing use
        // of these same physical keys elsewhere in this file requires
        // CONTROL or ALT); Player 2 defaults to the numeric keypad, since a
        // second physical Keyboard/Keypad Controller is far more likely to
        // be operated from there than by fighting Player 1 for the same
        // top-row keys.
        keypadKeys: [
            {
                k1: k.VK_1, k2: k.VK_2, k3: k.VK_3,
                k4: k.VK_4, k5: k.VK_5, k6: k.VK_6,
                k7: k.VK_7, k8: k.VK_8, k9: k.VK_9,
                k10: k.VK_MINUS, k11: k.VK_0, k12: k.VK_EQUALS
            }, {
                k1: k.VK_NUM_1, k2: k.VK_NUM_2, k3: k.VK_NUM_3,
                k4: k.VK_NUM_4, k5: k.VK_NUM_5, k6: k.VK_NUM_6,
                k7: k.VK_NUM_7, k8: k.VK_NUM_8, k9: k.VK_NUM_9,
                k10: k.VK_NUM_MULTIPLY, k11: k.VK_NUM_0, k12: k.VK_NUM_PLUS
            }
        ],

        joystickGamepads: [
            {
                button:        0,
                buttonT:       1,
                // Disabled (-1 = never matches any real gamepad.buttons
                // index, see Joystick.getButtonDigital in
                // GamepadConsoleControls.js) - these defaults collided
                // directly with a Keyboard/Keypad Controller USB adapter's
                // own button layout (buttons 1-12, see that same file's
                // updateKeypad), toggling Select/Reset and pausing the game
                // instead of registering keypad key presses, confirmed as a
                // real reported bug. Keypad mode's own updateKeypad() path
                // never reaches this file's prefs at all regardless (it
                // returns before select/reset/pause/fastSpeed/slowSpeed are
                // ever read) - disabled here too anyway, at the user's own
                // explicit direction, as a second, independent layer: an
                // ordinary gamepad used for Player controls (keypad mode
                // OFF) no longer has ANY of its buttons double as
                // console-wide shortcuts by default either.
                select:        -1,
                reset:         -1,
                pause:         -1,
                fastSpeed:     -1,
                slowSpeed:     -1,
                device:        -1,  // -1 = auto
                xAxis:         0,
                xAxisSig:      1,
                yAxis:         1,
                yAxisSig:      1,
                paddleAxis:    0,
                paddleAxisSig: 1,
                paddleCenter:  0.3,
                paddleSens:    0.75,
                deadzone:      0.3
            }, {
                button:        0,
                buttonT:       1,
                // Disabled (-1 = never matches any real gamepad.buttons
                // index, see Joystick.getButtonDigital in
                // GamepadConsoleControls.js) - these defaults collided
                // directly with a Keyboard/Keypad Controller USB adapter's
                // own button layout (buttons 1-12, see that same file's
                // updateKeypad), toggling Select/Reset and pausing the game
                // instead of registering keypad key presses, confirmed as a
                // real reported bug. Keypad mode's own updateKeypad() path
                // never reaches this file's prefs at all regardless (it
                // returns before select/reset/pause/fastSpeed/slowSpeed are
                // ever read) - disabled here too anyway, at the user's own
                // explicit direction, as a second, independent layer: an
                // ordinary gamepad used for Player controls (keypad mode
                // OFF) no longer has ANY of its buttons double as
                // console-wide shortcuts by default either.
                select:        -1,
                reset:         -1,
                pause:         -1,
                fastSpeed:     -1,
                slowSpeed:     -1,
                device:        -1,  // -1 = auto
                xAxis:         0,
                xAxisSig:      1,
                yAxis:         1,
                yAxisSig:      1,
                paddleAxis:    0,
                paddleAxisSig: 1,
                paddleCenter:  0.3,
                paddleSens:    0.75,
                deadzone:      0.3
            }
        ],

        touch: {
            directionalBig: false
        },

        hapticFeedback: true,
        turboFireSpeed: 6,

        vSynch: 1,                         // on
        crtFilter: -1,                     // auto

        audioBufferBase: -1,               // auto

        netPlaySessionName: "",
        netPlayNick: ""

    };
};

Javatari.userPreferences.load = function() {
    var prefs;

    // Load from Local Storage
    try {
        prefs = JSON.parse(localStorage.javatari4prefs || "{}");
        // Migrations from old to new version control fields
        if (prefs.version) delete prefs.version;
    } catch(e) {
        // Give up
    }

    // Absent or incompatible version
    if (!prefs || !Javatari.userPreferences.compatibleVersions.has(prefs.prefsVersion)) {
        // Create new empty preferences and keep settings as possible
        var oldPrefs = prefs;
        prefs = {};
        if (oldPrefs) {
            // Migrations
        }
    }

    // Fill missing properties with defaults
    var defs = Javatari.userPreferences.defaults();
    for (var pref in defs)
        if (prefs[pref] === undefined) prefs[pref] = defs[pref];

    prefs.prefsVersion = Javatari.userPreferences.currentVersion;

    // Update current preferences
    if (!Javatari.userPreferences.current) Javatari.userPreferences.current = {};
    var cur = Javatari.userPreferences.current;
    for (pref in prefs) cur[pref] = prefs[pref];

    Javatari.userPreferences.isDirty = false;
};

Javatari.userPreferences.setDefaultJoystickKeys = function() {
    Javatari.userPreferences.current.joystickKeys = Javatari.userPreferences.defaults().joystickKeys;
    Javatari.userPreferences.setDirty();
};

Javatari.userPreferences.setDefaultKeypadKeys = function() {
    Javatari.userPreferences.current.keypadKeys = Javatari.userPreferences.defaults().keypadKeys;
    Javatari.userPreferences.setDirty();
};

Javatari.userPreferences.save = function() {
    if (!Javatari.userPreferences.isDirty) return;

    try {
        Javatari.userPreferences.current.javatariVersion = Javatari.VERSION;
        localStorage.javatari4prefs = JSON.stringify(Javatari.userPreferences.current);
        Javatari.userPreferences.isDirty = false;

        jt.Util.log("Preferences saved!");
    } catch (e) {
        // give up
    }
};

Javatari.userPreferences.setDirty = function() {
    Javatari.userPreferences.isDirty = true;
};
