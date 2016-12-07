(function() {

    "use strict";

    // 定数
    const USER = 'user';
    const GET = 'GET';

    /**
     * 拡張アイコン押下時の挙動
     */
    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.create({
            url: 'main.html'
        });
    });

    /**
     * kintoneへリクエストを送信し、main.jsへ返す
     */
    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(request) {

            // エラーチェック
            var error = hasError(port, request);
            if (error) {
                return port.postMessage(error);
            }

            // リクエスト送信
            try {
                $.ajax({
                    url: (request.method === GET) ? request.url + '?' + encodeURI(request.params) : request.url,
                    type: request.method,
                    dataType: 'json',
                    timeout: 10000,
                    headers: createHeaders(request),
                    data: createRequestBody(request),
                    success: function(res) {
                        port.postMessage(res);
                    },
                    error: function(res) {
                        port.postMessage(res);
                    }
                });
            } catch (e) {
                port.postMessage("Sending failed.");
            }

        });
    });

    // エラーチェック
    function hasError(port, request) {
        // ポートチェック
        if (port.name != chrome.runtime.id) {
            return "Runtime error.";
        }
        // サブドメインチェック
        if (!request.subdomain) {
            return "Invalid subdomain.";
        }
        // URLチェック
        if (!request.url) {
            return "Invalid URL.";
        }
        // ユーザーIDチェック
        if (request.authType === "user" && !request.user) {
            return "Invalid user.";
        }
        // パスワードチェック
        if (request.authType === "user" && !request.password) {
            return "Invalid password.";
        }
        // APIトークンチェック
        if (request.authType === "token" && !request.token) {
            return "Invalid API token.";
        }
        // リクエストボディチェック
        if (!request.params) {
            return "Invalid Request body.";
        }
        // リクエストボディのJSONパースチェック
        try {
            if (request.method !== GET) {
                JSON.parse(request.params);
            }
        } catch (e) {
            return "Invalid JSON strings in Request body.";
        }

        return "";
    }

    // Base64エンコード
    function encode(user, password) {
        return window.btoa(user + ':' + password);
    }

    // リクエストヘッダを生成
    function createHeaders(request) {
        var headers = {};
        if (request.method !== GET) {
            headers['Content-Type'] = 'application/json';
        }
        if (request.authType === USER) {
            headers['X-Cybozu-Authorization'] = encode(request.user, request.password);
        } else {
            headers['X-Cybozu-API-Token'] = request.token;
        }
        return headers;
    }

    // リクエストボディを生成
    function createRequestBody(request) {
        // GETの場合は、URLパラメータで送信する為、リクエストボディはなし。
        return request.method === GET ? '' : request.params;
    }

})();
