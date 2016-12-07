(function() {

    "use strict";

    // 定数
    const GET = 'GET';
    const POST = 'POST';
    const PUT = 'PUT';
    const DELETE = 'DELETE';

    /*
     * API情報
     * [追加時の注意点]
     * - GETはクエリパラメータ形式
     * - GET以外はJSON形式
     */
    var configs = {
        apis: [{
            name: 'Get Record',
            method: GET,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/202331474#step1',
                en: 'https://developer.kintone.io/hc/en-us/articles/213149287/#getrecord'
            },
            params: 'app=(APP_ID)&id=(RECORD_ID)'
        }, {
            name: 'Get Records',
            method: GET,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/records.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/records.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/202331474#step2',
                en: 'https://developer.kintone.io/hc/en-us/articles/213149287/#getrecords'
            },
            params: 'app=(APP_ID)&query=updated_datetime > "2016-11-01T09:30:00-0800" and updated_datetime <　"2016-12-07T18:30:00-0800" order by $id asc limit 10 offset 0&fields[0]=$id&fields[1]=(FIELD_CODE)'
        }, {
            name: 'Add Record',
            method: POST,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/202166160#step1',
                en: 'https://developer.kintone.io/hc/en-us/articles/212494628/#addrecord'
            },
            params: '{"app": "(APP_ID)", "record": {"(FIELD_CODE)": {"value": "(FIELD_VALUE)"}, "(FIELD_CODE_OF_TABLE)": {"value": [{"value": {"(FIELD_CODE)": {"value": "(FIELD_VALUE)"}}}]}}}'
        }, {
            name: 'Add Records',
            method: POST,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/records.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/records.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/202166160#step2',
                en: 'https://developer.kintone.io/hc/en-us/articles/212494628/#addrecords'
            },
            params: '{"app": "(APP_ID)","records":  [{"(FIELD_CODE_1)": {"value": "(FIELD_VALUE)"}, "(FIELD_CODE_2)": {"value": "(FIELD_VALUE)"}}, {"(FIELD_CODE_1)": {"value": "(FIELD_VALUE)"}, "(FIELD_CODE_2)": {"value": "(FIELD_VALUE)"}}]}'
        }, {
            name: 'Update Record',
            method: PUT,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/201941784#step1',
                en: 'https://developer.kintone.io/hc/en-us/articles/213149027/#updaterecord'
            },
            params: '{"app": "(APP_ID)","id": "(RECORD_ID)","record": {"(FIELD_CODE)": {"value": "(FIELD_VALUE)"}}}'
        }, {
            name: 'Update Records',
            method: PUT,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/records.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/records.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/201941784#step2',
                en: 'https://developer.kintone.io/hc/en-us/articles/213149027/#updaterecords'
            },
            params: '{"app": "(APP_ID)","records": [{"id": "(RECORD_ID)","record": {"(FIELD_CODE)": {"value": "(FIELD_VALUE)"}, "(FIELD_CODE)": {"value": "(FIELD_VALUE)"}}}, {"id": "(RECORD_ID)", "record": {"(FIELD_CODE)": {"value": "(FIELD_VALUE)"}, "(FIELD_CODE)": {"value": "(FIELD_VALUE)"}}}]}'
        }, {
            name: 'Delete Records',
            method: DELETE,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/records.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/records.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/201941794',
                en: 'https://developer.kintone.io/hc/en-us/articles/212494558/#deleterecords'
            },
            params: '{"app": "(APP_ID)", "ids": ["(RECORD_ID)", "(RECORD_ID)"], "revisions": ["(REVISION_NUMBER)", "(REVISION_NUMBER)"]}'
        }, {
            name: 'Update Assignees',
            method: PUT,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record/assignees.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record/assignees.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/208243696',
                en: 'https://developer.kintone.io/hc/en-us/articles/219563427#updateassignees'
            },
            params: '{"app": "(APP_ID)","id": "(RECORD_ID)","assignees": ["user2"],"revision": "(REVISION_NUMBER)"}'
        }, {
            name: 'Get Comments',
            method: GET,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record/comments.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record/comments.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/208242326',
                en: 'https://developer.kintone.io/hc/en-us/articles/219105188#getcomments'
            },
            params: 'app=(APP_ID)&record=(RECORD_ID)'
        }, {
            name: 'Add Comment',
            method: POST,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record/comment.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record/comment.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/209758903',
                en: 'https://developer.kintone.io/hc/en-us/articles/219501367#addcomment'
            },
            params: '{"app": "(APP_ID)","record": "(RECORD_ID)","comment": {"text": "This comment is from the Administrator. \\nPlease check!","mentions": [{"code": "user16","type": "USER"},{"code": "Global Sales_1BNZeQ","type": "ORGANIZATION"},{"code": "APAC Taskforce_DJrvzu","type": "GROUP"}]}}'
        }, {
            name: 'Delete Comment',
            method: DELETE,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record/comment.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record/comment.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/209758703',
                en: 'https://developer.kintone.io/hc/en-us/articles/219562607#deletecomment'
            },
            params: '{"app": "(APP_ID)","record": "(RECORD_ID)","comment": "(COMMENT_ID)"}'
        }, {
            name: 'Update Status',
            method: PUT,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/record/status.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/record/status.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/204791550#anchor_changeRecordStatus',
                en: 'https://developer.kintone.io/hc/en-us/articles/213149747#statusofrecord'
            },
            params: '{"app": "(APP_ID)","id": "(RECORD_ID)","action": "Submit","assignee": "user2","revision": "(REVISION_NUMBER)"}'
        }, {
            name: 'Update Multiple Statuses',
            method: PUT,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/records/status.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/records/status.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/204791550#anchor_changeRecordStatusBulk',
                en: 'https://developer.kintone.io/hc/en-us/articles/213149747#statusofrecords'
            },
            params: '{"app": "(APP_ID)", "records": [ {"id": "(RECORD_ID)", "action": "Submit", "assignee": "user2", "revision": "(REVISION_NUMBER)"}, {"id": "(RECORD_ID)", "action": "Confirm"}]}'
        }, {
            name: 'Get App',
            method: GET,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/app.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/app.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/202931674#step1',
                en: 'https://developer.kintone.io/hc/en-us/articles/212494888/#getapp'
            },
            params: 'id=(APP_ID)'
        }, {
            name: 'Get Apps',
            method: GET,
            normal: 'https://(サブドメイン名).cybozu.com/k/v1/apps.json',
            guest: 'https://(サブドメイン名).cybozu.com/k/guest/(スペースのID)/v1/apps.json',
            docs: {
                ja: 'https://cybozudev.zendesk.com/hc/ja/articles/202931674#step2',
                en: 'https://developer.kintone.io/hc/en-us/articles/212494888/#getapps'
            },
            params: 'name=test&ids[0]=(APP_ID)&ids[1]=(APP_ID)'
        }],
        domains: ['.cybozu.com', '.kintone.com']
    };

    var vm = new Vue({
        el: '#app',
        data: {
            form: {
                subdomain: '',
                domain: configs.domains[0],
                api: configs.apis[0].name,
                method: configs.apis[0].method,
                isGuest: false,
                spaceId: '',
                url: '',
                authType: 'user',
                user: '',
                password: '',
                token: '',
                params: '',
                response: ''
            },
            domains: configs.domains,
            apis: configs.apis,
            api: configs.apis[0],
            isSending: false
        },
        computed: {
            // API対象のMethodに設定
            method: function() {
                return this.api.method;
            },
            // メソッド一覧
            methods: function() {
                return this.apis.map(function(api) {
                    return api.method;
                }).filter(function(api, index, self) {
                    return self.indexOf(api) === index;
                });
            },
            // リファレンスのリンク
            docs: function() {
                return this.api.docs[this.form.domain == configs.domains[0] ? 'ja' : 'en'];
            },
            // URLを生成する
            url: function() {
                var temp = (this.form.isGuest) ? this.api.guest : this.api.normal;
                var url = temp.replace("(サブドメイン名)", this.form.subdomain).replace(configs.domains[0], this.form.domain).replace("(スペースのID)", this.form.spaceId);
                this.form.url = url;
                return url;
            },
            // Sampleリクエスト
            sample: function() {
                if (this.form.method === GET) {
                    return this.api.params;
                }
                return JSON.stringify(JSON.parse(this.api.params), null, "    ");
            }
        },
        methods: {
            // リクエスト送信
            send: function() {
                var _this = this;
                _this.isSending = true;

                var port = chrome.runtime.connect({
                    name: chrome.runtime.id
                });
                // @see background.js#chrome.runtime.onMessage.addListener
                port.postMessage(this.form);
                port.onMessage.addListener(function(res) {
                    // レスポンスを整形して表示
                    _this.form.response = JSON.stringify(res, null, "    ");
                    // レスポンスが同じ場合、高速過ぎるので、遅延表示させる
                    setTimeout(function() {
                        _this.isSending = false;
                    }, 500);
                });
            },
            // 指定しているAPI情報を取得
            _getApiInfo: function() {
                var _this = this;
                return this.apis.filter(function(api) {
                    return api.name === _this.form.api;
                })[0];
            },
            // リクエストボディの初期値を設定する
            changeApi: function() {
                // APIを設定
                this.api = this._getApiInfo();
                // Methodを設定
                this.form.method = this.api.method;
                // Sampleを設定
                try {
                    this.form.sample = (this.form.method === GET) ? this.api.params : JSON.stringify(JSON.parse(this.api.params), null, "    ");
                } catch(e) {
                    this.form.response = "Runtime Error.(Sample Request body)";
                }
            }
        }
    });

})();
