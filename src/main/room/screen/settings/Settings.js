// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.SettingsDialog = function(parentElement, consoleControls) {
"use strict";

    var self = this;

    this.show = function (atPage) {
        if (!modal) {
            create();
            setTimeout(function() {
                self.show(atPage);
            }, 0);
            return;
        }

        if (!this.position()) return;

        controlRedefining = null;
        this.setPage(atPage || page);
        modal.classList.add("jt-show");
        modal.classList.add("jt-show");
        visible = true;
        setTimeout(function() {
            modal.focus();
        }, 50);
    };

    this.hide = function () {
        if (!visible) return;
        self.hideLesser();
        Javatari.room.screen.focus();
    };

    this.hideLesser = function () {
        if (Javatari.userPreferences.isDirty) finishPreferences();
        modal.classList.remove("jt-show");
        modal.classList.remove("jt-show");
        visible = false;
    };

    this.setPage = function (pPage) {
        page = pPage;

        var contentPosition = {
            "CONSOLE": "0",
            "PORTS":   "-600px",
            "GENERAL": "-1200px",
            "ABOUT":   "-1800px"
        }[page];
        var selectionPosition = {
            "CONSOLE": "0",
            "PORTS":   "25%",
            "GENERAL": "50%",
            "ABOUT":   "75%"
        }[page];

        if (contentPosition) self["jt-content"].style.left = contentPosition;
        if (selectionPosition) self["jt-menu-selection"].style.left = selectionPosition;

        self["jt-menu-console"].classList.toggle("jt-selected", page === "CONSOLE");
        self["jt-menu-ports"].classList.toggle("jt-selected", page === "PORTS");
        self["jt-menu-general"].classList.toggle("jt-selected", page === "GENERAL");
        self["jt-menu-about"].classList.toggle("jt-selected", page === "ABOUT");

        switch(page) {
            case "ABOUT":
                refreshAboutPage(); break;
            case "PORTS":
                refreshPortsPage();
        }
    };

    this.isVisible = function() {
        return visible;
    };

    this.position = function() {
        var w = parentElement.clientWidth;
        var h = parentElement.clientHeight;
        if (w < 575 || h < 400) {
            this.hide();
            return false;
        }

        modal.style.top =  "" + (((h - jt.SettingsGUI.HEIGHT) / 2) | 0) + "px";
        modal.style.left = "" + (((w - jt.SettingsGUI.WIDTH) / 2) | 0) + "px";

        return true;
    };

    this.controlsModeStateUpdate = function () {
        if (visible && page === "PORTS") refreshPortsPage();
    };

    function create() {
        jt.Util.insertCSS(jt.SettingsGUI.css());
        parentElement.insertAdjacentHTML("beforeend", jt.SettingsGUI.html());

        modal = document.getElementById("jt-modal");

        delete jt.SettingsGUI.html;
        delete jt.SettingsGUI.css;

        setFields();
        setEvents();
    }

    // Automatically set fields for each child element that has the "id" attribute
    function setFields() {
        traverseDOM(modal, function (element) {
            var jtVar = element.id && element.getAttribute && element.getAttribute("jt-var");
            if (jtVar) self[element.id] = element;
        });

        function traverseDOM(element, func) {
            func(element);
            var child = element.childNodes;
            for (var i = 0; i < child.length; i++) traverseDOM(child[i], func);
        }
    }

    function setEvents() {
        // Do not close with taps or clicks inside
        jt.Util.onTapOrMouseDownWithBlock(modal, function() { modal.focus(); });

        // Close with the back button
        jt.Util.onTapOrMouseDownWithBlock(self["jt-back"], self.hide);

        // Several key events
        modal.addEventListener("keydown", function (e) {
            processKeyEvent(e, true);
        });
        modal.addEventListener("keyup", function (e) {
            processKeyEvent(e, false);
        });

        // Tabs
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-console"], function () {
            self.setPage("CONSOLE");
        });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-ports"], function () {
            self.setPage("PORTS");
        });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-general"], function () {
            self.setPage("GENERAL");
        });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-menu-about"], function () {
            self.setPage("ABOUT");
        });

        // Key redefinition
        for (var elem in controlKeysElements) {
            (function(localControl) {
                jt.Util.onTapOrMouseDownWithBlock(self[localControl], function () {
                    keyRedefinitionStart(localControl);
                });
            })(elem);
        }
        for (var kdElem in keypadControlKeysElements) {
            (function(localControl) {
                jt.Util.onTapOrMouseDownWithBlock(self[localControl], function () {
                    keyRedefinitionStart(localControl);
                });
            })(kdElem);
        }
        for (var kgElem in keypadGamepadControlKeysElements) {
            (function(localControl) {
                jt.Util.onTapOrMouseDownWithBlock(self[localControl], function () {
                    keyRedefinitionStart(localControl);
                });
            })(kgElem);
        }
        jt.Util.onTapOrMouseDownWithBlock(self["jt-keypad-input-keyboard"], function() { toggleKeypadInputMode("KEYBOARD"); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-keypad-input-gamepad"], function() { toggleKeypadInputMode("GAMEPAD"); });

        // Controls Actions
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-paddles-mode"], function() { consoleControls.cycleControllerMode(); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-p1-mode"], function() { consoleControls.toggleP1ControlsMode(); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-gamepads-mode"], function() { consoleControls.toggleGamepadMode(); });
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-defaults"], controlsDefaults);
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-revert"], controlsRevert);
    }

    function refreshAboutPage() {
        self["jt-browserinfo"].innerHTML = navigator.userAgent;
    }

    function refreshPortsPage() {
        var paddlesMode = consoleControls.isPaddleMode();
        var keypadMode = consoleControls.isKeypadMode();
        var p1Mode = consoleControls.isP1ControlsMode();

        self["jt-ports-paddles-mode"].innerHTML = "Controllers: " + (paddlesMode ? "PADDLES" : keypadMode ? "KEYPAD" : "JOYSTICKS");
        self["jt-ports-p1-mode"].innerHTML = "Swap Mode: " + (p1Mode ? "SWAPPED" : "NORMAL");
        self["jt-ports-gamepads-mode"].innerHTML = "Gamepads: " + (consoleControls.getGamepadModeDesc());

        // The Keyboard/Keypad Controller's own key assignments only matter
        // (and only make sense to show at all) while it's actually the
        // selected "Controllers:" mode - showing them unconditionally would
        // suggest they're always in effect, when a plain digit keypress
        // does nothing keypad-related at all outside this mode (see
        // DOMConsoleControls' own initKeys, which skips binding them
        // entirely otherwise). The reverse for the joystick/paddle diagram
        // and its own key assignments below - hidden while Keypad mode is
        // selected, both because they're equally inactive then (no
        // joystick/paddle plugged in, in the "one peripheral per port at a
        // time" sense every one of these modes already shares) and to free
        // up the full page for all 12x2 keypad keys to actually fit without
        // needing their own cramped scrolling sub-box - confirmed as a real
        // reported problem when this section had to share the page with the
        // joystick diagram instead.
        self["jt-ports-keypad-section"].style.display = keypadMode ? "" : "none";
        // Only the joystick/paddle DIAGRAM itself hides - the hotkey list
        // and "Controllers:"/"Swap Mode:"/"Gamepads:" toggle buttons above
        // it stay visible regardless of mode (they're global controls, not
        // specific to whichever diagram happens to be showing - hiding them
        // along with the diagram was a real reported bug: it hid the very
        // button needed to switch OUT of Keypad mode again).
        self["jt-ports-joystick-diagram"].style.display = keypadMode ? "none" : "";

        if (paddlesMode) {
            self["jt-control-p1-controller"].style.backgroundPositionY = "-91px";
            self["jt-control-p2-controller"].style.backgroundPositionY = "-91px";
            self["jt-control-p1-up-label"].innerHTML = self["jt-control-p2-up-label"].innerHTML = "+ Speed";
            self["jt-control-p1-down-label"].innerHTML = self["jt-control-p2-down-label"].innerHTML = "- Speed";
        } else {
            self["jt-control-p1-controller"].style.backgroundPositionY = "0";
            self["jt-control-p2-controller"].style.backgroundPositionY = "0";
            self["jt-control-p1-up-label"].innerHTML = self["jt-control-p2-up-label"].innerHTML = "Up";
            self["jt-control-p1-down-label"].innerHTML = self["jt-control-p2-down-label"].innerHTML = "Down";

        }
        self["jt-control-p1-label"].innerHTML = "PLAYER " + (p1Mode ? "2" : "1");
        self["jt-control-p2-label"].innerHTML = "PLAYER " + (p1Mode ? "1" : "2");

        var keys = prefs.joystickKeys;
        for (var controlElem in controlKeysElements) {
            var elem = self[controlElem];
            if (controlElem === controlRedefining) {
                elem.classList.add("jt-redefining");
                elem.classList.remove("jt-undefined");
                elem.innerHTML = "?";
            } else {
                elem.classList.remove("jt-redefining");
                var controlInfo = controlKeysElements[controlElem];
                var keyInfo = keys[controlInfo.player][controlInfo.control];
                if (keyInfo.c === jt.DOMKeys.VK_VOID.c) {
                    elem.classList.add("jt-undefined");
                    elem.innerHTML = "";
                } else {
                    elem.classList.remove("jt-undefined");
                    elem.innerHTML = keyInfo.n;
                }
            }
        }

        // Same rendering, for the Keyboard/Keypad Controller's own 12x2
        // keys (see keypadControlKeysElements' own comment).
        var keypadKeys = prefs.keypadKeys;
        for (var keypadElem in keypadControlKeysElements) {
            var kdElemNode = self[keypadElem];
            if (keypadElem === controlRedefining) {
                kdElemNode.classList.add("jt-redefining");
                kdElemNode.classList.remove("jt-undefined");
                kdElemNode.innerHTML = "?";
            } else {
                kdElemNode.classList.remove("jt-redefining");
                var kdControlInfo = keypadControlKeysElements[keypadElem];
                var kdKeyInfo = keypadKeys[kdControlInfo.player][kdControlInfo.control];
                if (kdKeyInfo.c === jt.DOMKeys.VK_VOID.c) {
                    kdElemNode.classList.add("jt-undefined");
                    kdElemNode.innerHTML = "";
                } else {
                    kdElemNode.classList.remove("jt-undefined");
                    kdElemNode.innerHTML = kdKeyInfo.n;
                }
            }
        }

        // Same rendering again, for the SAME 12x2 keys' gamepad button
        // assignment (see keypadGamepadControlKeysElements' own comment) -
        // a plain button index (a number, or -1 for "unassigned") instead
        // of a {c,n} key object, otherwise the same shape.
        var keypadGamepads = prefs.keypadGamepads;
        for (var gpElem in keypadGamepadControlKeysElements) {
            var gpElemNode = self[gpElem];
            if (gpElem === controlRedefining) {
                gpElemNode.classList.add("jt-redefining");
                gpElemNode.classList.remove("jt-undefined");
                gpElemNode.innerHTML = "?";
            } else {
                gpElemNode.classList.remove("jt-redefining");
                var gpControlInfo = keypadGamepadControlKeysElements[gpElem];
                var gpButtonIndex = keypadGamepads[gpControlInfo.player][gpControlInfo.control];
                if (gpButtonIndex < 0) {
                    gpElemNode.classList.add("jt-undefined");
                    gpElemNode.innerHTML = "";
                } else {
                    gpElemNode.classList.remove("jt-undefined");
                    gpElemNode.innerHTML = "" + gpButtonIndex;
                }
            }
        }

        // Only one of the keypad section's own two sub-views is ever shown
        // at once (see keypadInputMode's own comment) - the modal simply
        // isn't tall enough to show 24 keyboard AND 24 gamepad boxes at the
        // same time without either overlapping the DEFAULTS/REVERT links
        // below or needing its own cramped scrolling sub-box, both
        // confirmed as real reported problems with earlier layouts here.
        self["jt-keypad-keyboard-grids"].style.display = keypadInputMode === "KEYBOARD" ? "" : "none";
        self["jt-keypad-gamepad-grids"].style.display = keypadInputMode === "GAMEPAD" ? "" : "none";
        self["jt-keypad-input-keyboard"].style.textDecoration = keypadInputMode === "KEYBOARD" ? "underline" : "none";
        self["jt-keypad-input-gamepad"].style.textDecoration = keypadInputMode === "GAMEPAD" ? "underline" : "none";
    }

    function processKeyEvent(e, press) {
        var code = jt.DOMKeys.codeForKeyboardEvent(e);
        if (press && code === KEY_ESC) {
            hideOrKeyRedefinitionStop();
            return jt.Util.blockEvent(e);
        } else
            if(controlRedefining) keyRedefinitionTry(e);
    }

    var keyRedefinitionStart = function(control) {
        controlRedefining = control;
        refreshPortsPage();
        if (keypadGamepadControlKeysElements[control]) startGamepadCapture();
    };

    var keyRedefinitonStop = function() {
        controlRedefining = null;
        gamepadCaptureActive = false;
        refreshPortsPage();
    };

    // Gamepad buttons have no DOM keydown/keyup event of their own to hook
    // (the Gamepad API is poll-only, see GamepadConsoleControls.js's own
    // controlsClockPulse) - so redefining one has to actively poll
    // navigator.getGamepads() itself, independent of the emulator's own
    // clock (which may be paused, or simply not ticking gamepad reads at
    // all if no game is running yet - this dialog needs to work either
    // way). First poll only SEEDS the "already held" state without
    // triggering anything - otherwise a button already held down from
    // whatever the user was doing right before opening this box would
    // immediately "redefine" it the instant polling starts, before they
    // ever get a chance to press the ONE button they actually meant.
    var gamepadCaptureActive = false;
    var gamepadPollSeeded = false;
    var gamepadPrevPressed = {};
    var startGamepadCapture = function() {
        gamepadCaptureActive = true;
        gamepadPollSeeded = false;
        gamepadPrevPressed = {};
        requestAnimationFrame(gamepadCapturePoll);
    };
    var gamepadCapturePoll = function() {
        if (!gamepadCaptureActive) return;
        var pads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (var i = 0; i < pads.length; i++) {
            var pad = pads[i];
            if (!pad) continue;
            for (var b = 0; b < pad.buttons.length; b++) {
                var key = i + ":" + b;
                var pressed = pad.buttons[b].pressed || pad.buttons[b].value > 0.5;
                if (gamepadPollSeeded && pressed && !gamepadPrevPressed[key]) {
                    gamepadRedefinitionTry(b);
                    return;
                }
                gamepadPrevPressed[key] = pressed;
            }
        }
        gamepadPollSeeded = true;
        if (gamepadCaptureActive) requestAnimationFrame(gamepadCapturePoll);
    };

    // Same "clear this assignment away from every other key first" safety
    // as clearKeyEverywhere, scoped to prefs.keypadGamepads only - a
    // gamepad button index has no meaningful overlap with a KEYBOARD key
    // code the way clearKeyEverywhere's own cross-map check needs (they're
    // different numbering spaces entirely, a gamepad button 1 and a
    // keyboard keyCode 1 don't mean or collide with each other), so this
    // doesn't need to touch controlKeysElements/keypadControlKeysElements
    // at all.
    var gamepadRedefinitionTry = function (buttonIndex) {
        if (!controlRedefining) return;
        var info = keypadGamepadControlKeysElements[controlRedefining];
        if (!info) return;
        for (var con in keypadGamepadControlKeysElements) {
            if (con === controlRedefining) continue;
            var otherInfo = keypadGamepadControlKeysElements[con];
            if (prefs.keypadGamepads[otherInfo.player][otherInfo.control] === buttonIndex)
                prefs.keypadGamepads[otherInfo.player][otherInfo.control] = -1;
        }
        prefs.keypadGamepads[info.player][info.control] = buttonIndex;
        Javatari.userPreferences.setDirty();
        keyRedefinitonStop();
    };

    // Shared by both controlKeysElements (joystick) and
    // keypadControlKeysElements (keypad) - clears newKey away from EVERY
    // OTHER binding across BOTH maps, not just whichever one
    // controlRedefining itself belongs to. Necessary because both actually
    // share the exact same runtime keyCodeMap (see DOMConsoleControls.js's
    // own initKeys) - a joystick key and a keypad key silently fighting
    // over the same physical key would otherwise just be whichever one
    // initKeys happened to assign last, with no indication in this dialog
    // that anything was wrong.
    var clearKeyEverywhere = function(newKeyCode, exceptControl) {
        var con;
        for (con in controlKeysElements) {
            if (con === exceptControl) continue;
            var info = controlKeysElements[con];
            var keys = prefs.joystickKeys[info.player];
            if (keys[info.control].c === newKeyCode) keys[info.control] = jt.DOMKeys.VK_VOID;
        }
        for (con in keypadControlKeysElements) {
            if (con === exceptControl) continue;
            var kdInfo = keypadControlKeysElements[con];
            var kdKeys = prefs.keypadKeys[kdInfo.player];
            if (kdKeys[kdInfo.control].c === newKeyCode) kdKeys[kdInfo.control] = jt.DOMKeys.VK_VOID;
        }
    };

    var keyRedefinitionTry = function (e) {
        if (!controlRedefining) return;
        var c = jt.DOMKeys.codeForKeyboardEvent(e);
        var n = jt.DOMKeys.nameForKeyboardEventSingle(e);
        if (c === jt.DOMKeys.VK_VOID.c || !n) return;
        var newKey = { c: c, n: n };
        clearKeyEverywhere(newKey.c, controlRedefining);
        var controlInfo = controlKeysElements[controlRedefining];
        if (controlInfo) {
            prefs.joystickKeys[controlInfo.player][controlInfo.control] = newKey;
        } else {
            var kdControlInfo = keypadControlKeysElements[controlRedefining];
            prefs.keypadKeys[kdControlInfo.player][kdControlInfo.control] = newKey;
        }
        Javatari.userPreferences.setDirty();
        keyRedefinitonStop();
    };

    var hideOrKeyRedefinitionStop = function() {
        if (controlRedefining) keyRedefinitonStop();
        else self.hide()
    };

    var controlsDefaults = function () {
        Javatari.userPreferences.setDefaultJoystickKeys();
        Javatari.userPreferences.setDefaultKeypadKeys();
        Javatari.userPreferences.setDefaultKeypadGamepads();
        keyRedefinitonStop();   // will refresh
    };

    var toggleKeypadInputMode = function(mode) {
        keypadInputMode = mode;
        keyRedefinitonStop();   // cancels any in-progress redefinition and refreshes
    };

    var controlsRevert = function () {
        Javatari.userPreferences.load();
        keyRedefinitonStop();   // will refresh
    };

    var finishPreferences = function () {
        Javatari.userPreferences.save();
        consoleControls.applyPreferences();
    };

    var controlKeysElements = {
        "jt-control-p1-button":  { player: 0, control: "button" },
        "jt-control-p1-buttonT": { player: 0, control: "buttonT" },
        "jt-control-p1-up":      { player: 0, control: "up" },
        "jt-control-p1-left":    { player: 0, control: "left" },
        "jt-control-p1-right":   { player: 0, control: "right" },
        "jt-control-p1-down":    { player: 0, control: "down" },
        "jt-control-p2-button":  { player: 1, control: "button" },
        "jt-control-p2-buttonT": { player: 1, control: "buttonT" },
        "jt-control-p2-up":      { player: 1, control: "up" },
        "jt-control-p2-left":    { player: 1, control: "left" },
        "jt-control-p2-right":   { player: 1, control: "right" },
        "jt-control-p2-down":    { player: 1, control: "down" }
    };

    // Same shape as controlKeysElements above, for the 12-key Keyboard/
    // Keypad Controller (see prefs.keypadKeys' own comment in
    // UserPreferences.js) - kept as its own separate map (not merged into
    // controlKeysElements) since it reads/writes a different prefs object
    // (prefs.keypadKeys, not prefs.joystickKeys) - every function below
    // that needs to tell the two apart just checks which map an element id
    // is actually in.
    var keypadControlKeysElements = {};
    for (var kdp = 0; kdp < 2; kdp++) {
        for (var kdk = 1; kdk <= 12; kdk++) {
            keypadControlKeysElements["jt-keypad-p" + kdp + "-k" + kdk] = { player: kdp, control: "k" + kdk };
        }
    }

    // Same shape again, for the SAME 12 keys' gamepad button assignment
    // (prefs.keypadGamepads - a plain gamepad.buttons index per key, see
    // GamepadConsoleControls.js's own updateKeypad) - a real Keyboard/
    // Keypad Controller is at least as often connected through a gamepad-
    // shaped USB adapter as an actual keyboard, so both need to be
    // reachable from here, not just the keyboard side.
    var keypadGamepadControlKeysElements = {};
    for (var kgp = 0; kgp < 2; kgp++) {
        for (var kgk = 1; kgk <= 12; kgk++) {
            keypadGamepadControlKeysElements["jt-keypad-gp" + kgp + "-k" + kgk] = { player: kgp, control: "k" + kgk };
        }
    }


    var controlRedefining = null;
    // Which of the keypad section's own two sub-views (keyboard key boxes
    // vs gamepad button-number boxes) is currently showing - purely a
    // Settings-dialog display choice (see refreshPortsPage), not a runtime
    // behavior toggle: both keyboard AND gamepad input stay simultaneously
    // live at all times whenever Keypad mode itself is on, regardless of
    // which one happens to be visible here.
    var keypadInputMode = "KEYBOARD";

    var modal;
    var page = "CONSOLE";
    var visible = false;

    var prefs = Javatari.userPreferences.current;

    var KEY_ESC = jt.DOMKeys.VK_ESCAPE.c;

};

