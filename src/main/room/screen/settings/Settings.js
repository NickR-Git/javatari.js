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

        // Controls Actions
        jt.Util.onTapOrMouseDownWithBlock(self["jt-ports-paddles-mode"], function() { consoleControls.togglePaddleMode(); });
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
        var p1Mode = consoleControls.isP1ControlsMode();

        self["jt-ports-paddles-mode"].innerHTML = "Controllers: " + (paddlesMode ? "PADDLES" : "JOYSTICKS");
        self["jt-ports-p1-mode"].innerHTML = "Swap Mode: " + (p1Mode ? "SWAPPED" : "NORMAL");
        self["jt-ports-gamepads-mode"].innerHTML = "Gamepads: " + (consoleControls.getGamepadModeDesc());

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
    };

    var keyRedefinitonStop = function() {
        controlRedefining = null;
        refreshPortsPage();
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
        keyRedefinitonStop();   // will refresh
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


    var controlRedefining = null;

    var modal;
    var page = "CONSOLE";
    var visible = false;

    var prefs = Javatari.userPreferences.current;

    var KEY_ESC = jt.DOMKeys.VK_ESCAPE.c;

};

