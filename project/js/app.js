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
        success: function(data, status, xhr) {
            var statusCode = xhr.status;
            if (xhr.responseText == "Not Authorized") { statusCode = 401; }
            else if (xhr.responseText["ErrorCode"] == 401) { statusCode = 401; }
            (statusCode == 401) ? deferred.reject() : deferred.resolve();
        },
        error: function(xhr, exception) {
            var statusCode = xhr.status;
            if (xhr.responseText == "Not Authorized") { statusCode = 401; }
            else if (xhr.responseText["ErrorCode"] == 401) { statusCode = 401; }
            (statusCode == 401) ? deferred.reject() : deferred.resolve();
        }
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
                chrome.tabs.create({url: "https://member.livedoor.com/login/"});
                // notification
                chrome.notifications.create(title,
                                            { type: "basic", title: "ピンの追加に失敗しました", message: "もう一度、ログインし直してください", iconUrl:"icons/icon48.png" },
                                            function(id) { });
            })
            .done(function() {
                // notification
                chrome.notifications.create(title,
                                            { type: "basic", title: "ピンを追加しました", message: title + "\n" + link, iconUrl:"icons/icon48.png" },
                                            function(id) { });
            });
    });
});
