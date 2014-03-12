/**
 * Livedoor ReaderのPINにリンクを追加
 * @param link linkのURL
 * @param titlte linkのタイトル
 * @return jQuery.Deferred
 */
var addPin = function(link, title) {
    // API
    var APIURL = "http://reader.livedoor.com/api/pin/add?link=" + encodeURIComponent(link) + "&title=" + encodeURIComponent(title);

    // ajax
    var deferred = jQuery.Deferred();
    jQuery.ajax({
        type: "POST",
        url: APIURL,
        success: deferred.resolve,
        error: deferred.reject
    });
    return deferred.promise();
};

/**
 * ナビゲーションバーのボタンを押下
 */
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        // PIN追加
        var link = tabs[0].url;
        var title = tabs[0].title;
        addPin(link, title)
            .fail(function() {
                // Livedoor Readerのログイン画面を開く
                //chrome.tabs.create({url: "https://member.livedoor.com/login/"});
            })
            .done(function() {
            });
    });
});

