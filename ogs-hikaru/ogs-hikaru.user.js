// ==UserScript==
// @name         ogs hikaru
// @version      0.1
// @description  anime-style theme for OGS, based off of michiakig's code, replaces glass stones & kaya board with hikaru theme
// @author       upsided
// @match        https://online-go.com/*
// @run-at       document-idle
// @namespace https://github.com/upsided/Upsided-OGS-Themes
// ==/UserScript==

(function () {
    const TIMEOUT = 1000 // time before fake-clicking everything

    function setup() {

        console.log("[ogs hikaru] setting up");

        var whitestone = new Image;
        var blackstone = new Image;
        var shade = new Image;

        whitestone.src = "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_white_stone_raw.svg"
        blackstone.src = "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_black_stone_raw.svg"
        shade.src = "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_stone_shadow.svg"

        document.querySelector("[title='Kaya']").style.backgroundImage = "url(\"https://github.com/upsided/Upsided-Sabaki-Themes/raw/main/hikaru/board.svg\")";

        GoThemes.board.Kaya.prototype.getBackgroundCSS = function () {
            return {
                "background-image": "url('https://github.com/upsided/Upsided-Sabaki-Themes/raw/main/hikaru/board.svg')",
                "background-color": "#000",
                "background-size": "cover"
            }
        }

        GoThemes.white.Glass.prototype.placeWhiteStone = function (ctx, shadow_ctx, stone, cx, cy, radius) {

            if (shadow_ctx != undefined)
                shadow_ctx.drawImage(shade, cx - radius * 0.85, cy - radius * 0.85, radius * 2, radius * 2.1)

            ctx.drawImage(whitestone, cx - radius * 0.97, cy - radius * 0.97, radius * 1.97, radius * 1.97)
        };

        GoThemes.black.Glass.prototype.placeBlackStone = function (ctx, shadow_ctx, stone, cx, cy, radius) {

            if (shadow_ctx != undefined)
                shadow_ctx.drawImage(shade, cx - radius * 0.85, cy - radius * 0.85, radius * 2, radius * 2.1)

            ctx.drawImage(blackstone, cx - radius * 0.97, cy - radius * 0.97, radius * 1.97, radius * 1.97)

        };

        console.log("[ogs hikaru] done");
    };

    const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
    function simulateMouseClick(element) {
        mouseClickEvents.forEach(mouseEventType =>
            element.dispatchEvent(
                new MouseEvent(mouseEventType, {
                    //view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1
                })
            )
        );
    }

    function mashCoordinates() {
        let c = document.getElementsByClassName("ogs-coordinates")
        if (c.length > 0) {
            for (let i = 0; i < 6; i++)
                simulateMouseClick(c[0])
            //console.log("mashed some coordinates")

        }
        //setTimeout(mashCoordinates, TIMEOUT) // causes too much lag
    }

    function clickCrazy() {
        // have to brute force click stuff to force a redraw
        // b/c I don't know how to call a board redraw directly
        let blah = document.querySelectorAll("[title='Plain']")
        const BRUTE = 5 //

        for (let b = 0; b < BRUTE; b++) {
            // click the kaya & glass stone settings, because that's where
            // we placed the theme

            blah = document.querySelectorAll("[title='Kaya']")
            for (let b of blah) simulateMouseClick(b)

            blah = document.querySelectorAll("[title='Glass']")
            for (let b of blah) simulateMouseClick(b)

            mashCoordinates() // launches a repeating timer

        }

    }

    var setupDone = false
    // set up the mutation observer
    // altho this should be installed with @run-at idle, I still saw the code run prior to these globals being available, so just watch the page for updates until they are present
    var observer = new MutationObserver(function (mutations, me) {
        if (typeof data !== "undefined" && typeof GoThemes !== "undefined") {
            if (!setupDone) {
                setup();
                setTimeout(clickCrazy, TIMEOUT)
                setupDone = true
            }
            me.disconnect(); // stop observing
        } else {
            console.log("[ogs hikaru] data or GoThemes not found, waiting...");
        }
    });

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
