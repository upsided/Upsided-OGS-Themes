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
    const TIMEOUT = 2000 // time before forced redraw. Set to later if your board doesn't refresh; earlier if the lag bugs you.

    /* edit "theme" variable to your liking.

    Stones are an array of stone image URLS that will be randomly selected to place on the board.
    Shadows are the same, and correspond to the stone images. If a single shadow is provided for a stone, it will be used for all stones of that color (obvs)

    "Bounds" are the bounding boxes of the stones/shadows, and also correspond to the stone lists. Stones/shadow images will scale to fit these boxes.
    Bounds are defined by a pair of xy coordinates, where 0,0 is the location of the intersection. [-1,-1] is upper left, [1,1] is bottom right.
    A box that encompases the whole square is "[-1,-1, 1, 1]"

    You can go further down/right  by about 1.3 with shadows, but not with stones.

    */

    var theme = {
        "boardImage": "https://raw.githubusercontent.com/upsided/Upsided-Sabaki-Themes/main/hikaru/board.svg",

        "whiteStones": [
            "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_white_stone_raw_25pc.svg"
        ],

        "blackStones": [
            "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_black_stone_raw_25pc.svg",

        ],

        "whiteShadows": [
            "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_stone_shadow.svg"
        ],

        "blackShadows": [
            "https://raw.githubusercontent.com/upsided/Upsided-OGS-Themes/main/ogs-hikaru/hikaru_stone_shadow.svg"
        ],

        "blackStoneBounds": [ // left, top, right, bottom. This shuffles them up. If you don't like this, remove all but the first one.
            [-4*0.97, -4*0.97, 4*0.97, 4*0.97], // weird bounds for a pre-scaled mini SVG stone to work around Firefox SVG clipping bug
            // [-0.95, -0.95, 0.95, 0.95],
            // [-1, -1, 0.94, 0.94]
        ],

        "whiteStoneBounds": [
            [-4*0.97, -4*0.97, 4*0.97, 4*0.97],
            // [-0.95, -0.95, 0.99, 0.99],
            // [-1, -1, 0.94, 0.94]
        ],

        "blackShadowBounds": [
            [-.88, -.88, 1.1, 1.25],
            // [-0.83, -0.83, 1.02, 1.12],
            // [-0.88, -0.88, .97, 1.07]
        ],

        "whiteShadowBounds": [
            [-.88, -.88, 1.1, 1.25],
            // [-0.83, -0.83, 1.02, 1.12],
            // [-0.88, -0.88, .97, 1.07]
        ]

        // TODO: more board options here like line color, label color, etc.
    }

    function setup() {

        console.log("[ogs hikaru] setting up");

        // images
        var whitestones = []
        var blackstones = []
        var whiteshadows = []
        var blackshadows = []

        // populate images
        for (let w of theme.whiteStones) {
            let i = new Image;
            i.src = w
            whitestones.push(i)
        }

        for (let b of theme.blackStones) {
            let i = new Image;
            i.src = b
            blackstones.push(i)
        }

        for (let ws of theme.whiteShadows) {
            let i = new Image;
            i.src = ws
            whiteshadows.push(i)
        }

        for (let bs of theme.blackShadows) {
            let i = new Image;
            i.src = bs
            blackshadows.push(i)
        }


        //setup background image
        const divs = document.querySelectorAll("div");
        for (let d of divs) {
            const bi = d.style["background-image"];
            if (bi && bi["background-image"] && bi["background-image"].search("kaya") > -1) {
                d.style.backgroundImage = `url("${theme.boardImage}")`;
            }
        }

        GoThemes.board.Kaya.prototype.getBackgroundCSS = function () {
            return {
                "background-image": `url("${theme.boardImage}")`,
                "background-color": "#000",
                "background-size": "cover"
            }
        }


        // draw custom white stone
        GoThemes.white.Glass.prototype.placeWhiteStone = function (ctx, shadow_ctx, stone, cx, cy, radius) {

            //random by position
            let rando = Math.floor(cx*31 + cy*29)

            if (shadow_ctx != undefined && whiteshadows.length > 0){
                let img = whiteshadows[rando%whiteshadows.length]
                let box = theme.whiteShadowBounds[rando % theme.whiteShadowBounds.length]

                shadow_ctx.drawImage(img, cx + radius * box[0], cy + radius * box[1],  radius * (box[2]-box[0]), radius * (box[3]-box[1]))

            }

            let img = whitestones[rando % whitestones.length]
            let box = theme.whiteStoneBounds[rando % theme.whiteStoneBounds.length]

            ctx.drawImage(img, cx + radius * box[0], cy + radius * box[1],  radius * (box[2]-box[0]), radius * (box[3]-box[1]))
        };

        //draw custom black stone
        GoThemes.black.Glass.prototype.placeBlackStone = function (ctx, shadow_ctx, stone, cx, cy, radius) {

            //random by position
            let rando = Math.floor(cx*31 + cy*29)

            if (shadow_ctx != undefined && blackshadows.length > 0){
                let img = blackshadows[rando%blackshadows.length]
                let box = theme.blackShadowBounds[rando % theme.blackShadowBounds.length]

                shadow_ctx.drawImage(img, cx + radius * box[0], cy + radius * box[1],  radius * (box[2]-box[0]), radius * (box[3]-box[1]))

            }

            let img = blackstones[rando % blackstones.length]
            let box = theme.blackStoneBounds[rando % theme.blackStoneBounds.length]

            ctx.drawImage(img, cx + radius * box[0], cy + radius * box[1],  radius * (box[2]-box[0]), radius * (box[3]-box[1]))

        };

        console.log("[ogs hikaru] done");
    };


    // touch ogs's preferences object to point to our hack, and to trigger a redraw
    function triggerRedraw(){
        preferences.set("goban-theme-board", "Kaya")
        preferences.set("goban-theme-white", "Glass")
        preferences.set("goban-theme-black", "Glass")
    }


    var setupDone = false

    // set up the mutation observer
    // altho this should be installed with @run-at idle, I still saw the code run prior to these globals being available, so just watch the page for updates until they are present
    var observer = new MutationObserver(function (mutations, me) {
        if (typeof data !== "undefined" && typeof GoThemes !== "undefined") {
            if (!setupDone) {
                setup();
                setTimeout(triggerRedraw, TIMEOUT)
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
