chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        chrome.tabs.executeScript(null, {
            "code": "alert('" + tabs[0].url + "')"
        });
    });
});
