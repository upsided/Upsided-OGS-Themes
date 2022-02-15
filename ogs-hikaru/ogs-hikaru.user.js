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
    function setup() {
        console.log("[ogs 8-bit style] setting up");

        var whitestone = new Image;
        var blackstone = new Image;
        var shade = new Image;

        // TEMPORARY files until they're uploaded to github
        whitestone.src = "https://dl.dropboxusercontent.com/s/5ot3s02rejed3yl/white_stone_shadow.svg?dl=1"
        blackstone.src = "https://dl.dropboxusercontent.com/s/ixxg4bz62n9vqax/black_stone_raw.svg?dl=1"
        shade.src = "https://dl.dropboxusercontent.com/s/8cxrevkyykvajqb/white_stone_shadow.svg?dl=1"

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
                shadow_ctx.drawImage(shade, cx - radius * 0.95, cy - radius * 0.95, radius * 2.05, radius * 2.2)

            ctx.drawImage(whitestone, cx - radius * 0.97, cy - radius * 0.97, radius * 1.97, radius * 1.97)
        };

        GoThemes.black.Glass.prototype.placeBlackStone = function (ctx, shadow_ctx, stone, cx, cy, radius) {

            if (shadow_ctx != undefined)
                shadow_ctx.drawImage(shade, cx - radius * 0.95, cy - radius * 0.95, radius * 2.05, radius * 2.2)

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

    function clickCrazy() {
        // have to brute force click stuff to force a redraw
        // b/c I don't know how to call a board redraw directly
        let blah = document.querySelectorAll("[title='Plain']")
        const BRUTE = 3 // sadly, seems like < 50 times doesn't work

        for (let i = 0; i < BRUTE; i++) {
            for (let b of blah) simulateMouseClick(b)
        }

        blah = document.querySelectorAll("[title='Kaya']")
        for (let i = 0; i < BRUTE; i++) {
            for (let b of blah) simulateMouseClick(b)
        }

        blah = document.querySelectorAll("[title='Glass']")

        for (let i = 0; i < BRUTE; i++) {
            for (let b of blah) simulateMouseClick(b)
        }

        blah = document.getElementById("board-canvas")
        console.log(blah)

        for (let i = 0; i < BRUTE; i++) blah.dispatchEvent(new Event('resize'))
    }


    // set up the mutation observer
    // altho this should be installed with @run-at idle, I still saw the code run prior to these globals being available, so just watch the page for updates until they are present
    var observer = new MutationObserver(function (mutations, me) {
        if (typeof data !== "undefined" && typeof GoThemes !== "undefined") {
            setup();
            setTimeout(clickCrazy, 1000)
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
