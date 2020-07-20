// BLACK or WHITE

// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

// Below is our diff list
diffs = ["Easy", "Normal", "Hard", "Extreme", "XD"]

// Standard promise stuff

function success(){
    console.log("Promise finished successfully.")
}

function error(error){
    console.log(error)
}

// Load CSS
document.body.append(htmlToElement('<link rel="stylesheet" href="' + browser.runtime.getURL("inject.css") + '">'))

// Get the side bar to inject options into
var sidebar = document.evaluate( "/html/body/main/aside/nav[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

//sidebar.append(htmlToElement('<a class="item " title="BLACK or WHITE" id="BoWconfig"><img src="' + browser.runtime.getURL("icon48.png") + '"></img></a>'))

// Make sidebar have a lil scroll thing

sidebar.classList.add("specialScroll")

// Add filter elements

sidebar.append(htmlToElement('<a class="item " title="Toggle Easy" id="BoW-Easy"><img src="/assets/img/difficultyEasy.svg" style="width:32px"></img></a>'))

sidebar.append(htmlToElement('<a class="item " title="Toggle Normal" id="BoW-Normal"><img src="/assets/img/difficultyNormal.svg" style="width:32px"></img></a>'))

sidebar.append(htmlToElement('<a class="item " title="Toggle Hard" id="BoW-Hard"><img src="/assets/img/difficultyHard.svg" style="width:32px"></img></a>'))

sidebar.append(htmlToElement('<a class="item " title="Toggle Expert" id="BoW-Extreme"><img src="/assets/img/difficultyExtreme.svg" style="width:32px"></img></a>'))

sidebar.append(htmlToElement('<a class="item " title="Toggle XD" id="BoW-XD"><img src="/assets/img/difficultyXD.svg" style="width:32px"></img></a>'))

sidebar.append(htmlToElement('<a class="item " title="Toggle hiding/fading items" id="BoW-visibility"><img src="' + browser.runtime.getURL("mi-visibility.svg") + '" style="width:32px"></img></a>'))

sidebar.append(htmlToElement('<div class="BW-Header">FILTER</div>'))

// Filtering itself

function filterList(enabledDiffs){
    //var songLists = document.getElementsByClassName("song-list")
    songs = document.getElementsByClassName("song-item")

    // Iterate over found lists (Homepage)
    for (var song = 0; song < songs.length; song++) {
        //console.log(songs[song])

        var songData = {
            diffs: []
        }
        
        //console.log(songs[song].getElementsByClassName("song-difficulties")[0].children)

        // process diffs
        var currentDiffs = songs[song].getElementsByClassName("song-difficulties")[0].children



        for (var diff = 0; diff < currentDiffs.length; diff++) {
            // change to true/false
            songData.diffs[diff] = (currentDiffs[diff].className === "active")
            //console.log(currentDiffs[diff].className === "active")
            //console.log(songData.diffs[diff])
        }

        //console.log(songData.diffs)

        /* process whether to display it */
        for (var diff = 0; diff < diffs.length; diff++) {
            //console.log("Checking diff!")
            //console.log(!(songData.diffs[diff] && enabledDiffs[diffs[diff] + "Enabled"]))
            if (!(songData.diffs[diff] && enabledDiffs[diffs[diff] + "Enabled"])) {
                //console.log("UNAVAILABLE")
                //console.log(songs[song])
                if (enabledDiffs["visibilityEnabled"]){
                    songs[song].style.display = "initial"
                    songs[song].style.opacity = 0.2
                } else {
                    songs[song].style.display = "none"
                }
                //console.log("done")
            } else {
                if (enabledDiffs["visibilityEnabled"]){
                    songs[song].style.display = "initial"
                    songs[song].style.opacity = 1
                } else {
                    songs[song].style.display = "initial"
                }
                break
            }
        }
    }
}

function updateFiltering(){
    //console.log("TEST")

    let get = browserGetter(null, e => {filterList(e)})
}

// Icon updating

function updateDiffIcon(diff){
    let get = browserGetter(diff + "Enabled", function(input) { visualUpdate(input, diff) })
    
}

function visualUpdate(value, diff){
    //console.log("VISUAL UPDATE")

    if (value[diff + "Enabled"]) {
        //console.log(diff)
        //console.log("ENABLED")
        document.getElementById("BoW-" + diff).style.opacity = 1
    } else {
        document.getElementById("BoW-" + diff).style.opacity = 0.1
        //console.log(diff)
        //console.log("DISABLED")
    }
}

// Icon toggling

function toggleSetValue(currentValue, setting){

    var obj = {}
    //ting] = !currentValue

    // Enable at first
    if (currentValue[setting + "Enabled"] === null || currentValue[setting + "Enabled"] === {}){
        currentValue[setting + "Enabled"] = false 
    }

    //console.log(currentValue[setting + "Enabled"])

    let set = browserSetter({
        [setting + "Enabled"]:!currentValue[setting + "Enabled"]
    }, function(input) { updateDiffIcon(setting); updateFiltering() })

}

function toggleDiff(setting){
    //console.log(setting)

    let get = browserGetter(setting + "Enabled", function(input) { toggleSetValue(input, setting) })
}

function initIcon(diff) {
    document.getElementById("BoW-" + diff).addEventListener("click", function() { toggleDiff(diff) }, false);
    console.log("updating...")
    updateDiffIcon(diff)
}

// Load icons

for (var i = 0; i < diffs.length; i++){
    initIcon(diffs[i])
}

console.log("initiated")

initIcon("visibility")

updateFiltering()

function browserGetter(value, runFunction) {
    try{
        browser.storage.local.get(value)
        .then(runFunction)
    }
    catch{
        browser.storage.local.get(value, runFunction)
    }
}

function browserSetter(value, runFunction) {
    try{
        browser.storage.local.set(value)
        .then(runFunction)
    }
    catch{
        browser.storage.local.set(value, runFunction)
    }
}