/**
 * FeJson后台运行程序
 * @author zhaoxianlie
 */


import MSG_TYPE from '../static/js/common.js';
import Settings from '../options/settings.js';
import Awesome from './awesome.js';
import InjectTools from './inject-tools.js';
import toolMap from './tools.js';


let BgPageInstance = (function () {

    let FeJson = {
        notifyTimeoutId: -1
    };

    // 黑名单页面
    let blacklist = [
        /^https:\/\/chrome\.google\.com/
    ];

    /**
     * 文本格式，可以设置一个图标和标题
     * @param {Object} options
     * @config {string} type notification的类型，可选值：html、text
     * @config {string} icon 图标
     * @config {string} title 标题
     * @config {string} message 内容
     */
    let notifyText = function (options) {
        let notifyId = 'FeJson-notify-id';

        clearTimeout(FeJson.notifyTimeoutId);
        if (options.closeImmediately) {
            return chrome.notifications.clear(notifyId);
        }

        if (!options.icon) {
            options.icon = "static/img/fe-48.png";
        }
        if (!options.title) {
            options.title = "温馨提示";
        }
        chrome.notifications.create(notifyId, {
            type: 'basic',
            title: options.title,
            iconUrl: chrome.runtime.getURL(options.icon),
            message: options.message
        });

        FeJson.notifyTimeoutId = setTimeout(() => {
            chrome.notifications.clear(notifyId);
        }, parseInt(options.autoClose || 3000, 10));

    };

    // 像页面注入css脚本
    let _injectContentCss = function (tabId, toolName, isDevTool) {
        if (isDevTool) {
            Awesome.getContentScript(toolName, true)
                .then(css => {
                    InjectTools.inject(tabId, { css })
                });
        } else {
            InjectTools.inject(tabId, { files: [`${toolName}/content-script.css`] });
        }
    };


    // 往当前页面直接注入脚本，不再使用content-script的配置了
    let _injectContentScripts = function (tabId) {

        // FH工具脚本注入
        // 注入js
        let jsTools = Object.keys(toolMap)
            .filter(tool => !tools[tool]._devTool
                && (tools[tool].contentScriptJs || tools[tool].contentScript));
        let jsCodes = [];
        jsTools.forEach((t, i) => {
            let func = `window['${t.replace(/-/g, '')}ContentScript']`;
            jsCodes.push(`(()=>{let func=${func};func&&func();})()`);
        });
        let jsFiles = jsTools.map(tool => `${tool}/content-script.js`);
        InjectTools.inject(tabId, { files: jsFiles, js: jsCodes.join(';') });
    };

    /**
     * 动态运行工具
     * @param configs
     * @config tool 工具名称
     * @config withContent 默认携带的内容
     * @config query 请求参数
     * @config noPage 无页面模式
     * @constructor
     */
    chrome.DynamicToolRunner = async function (configs) {

        let tool = configs.tool || configs.page;
        let withContent = configs.withContent;
        let activeTab = null;
        let query = configs.query;

        // 如果是noPage模式，则表名只完成content-script的工作，直接发送命令即可
        if (configs.noPage) {
            let toolFunc = tool.replace(/-/g, '');
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                let found = tabs.some(tab => {
                    if (/^(http(s)?|file):\/\//.test(tab.url) && blacklist.every(reg => !reg.test(tab.url))) {
                        let codes = `window['${toolFunc}NoPage'] && window['${toolFunc}NoPage'](${JSON.stringify(tab)});`;
                        InjectTools.inject(tab.id, { js: codes });
                        return true;
                    }
                    return false;
                });
                if (!found) {
                    notifyText({
                        message: '抱歉，此工具无法在当前页面使用！'
                    });
                }
            });
            return;
        }

        chrome.tabs.query({ currentWindow: true }, function (tabs) {

            activeTab = tabs.filter(tab => tab.active)[0];

            Settings.getOptions((opts) => {
                let isOpened = false;
                let tabId;

                // 允许在新窗口打开
                if (String(opts['FORBID_OPEN_IN_NEW_TAB']) === 'true') {
                    let reg = new RegExp("^chrome.*\\/" + tool + "\\/index.html" + (query ? "\\?" + query : '') + "$", "i");
                    for (let i = 0, len = tabs.length; i < len; i++) {
                        if (reg.test(tabs[i].url)) {
                            isOpened = true;
                            tabId = tabs[i].id;
                            break;
                        }
                    }
                }

                if (!isOpened) {
                    chrome.tabs.create({
                        url: `/${tool}/index.html` + (query ? "?" + query : ''),
                        active: true
                    }).then(tab => { FeJson[tab.id] = { content: withContent }; });
                } else {
                    chrome.tabs.update(tabId, { highlighted: true }).then(tab => {
                        FeJson[tab.id] = { content: withContent };
                        chrome.tabs.reload(tabId);
                    });
                }

            });

        });
    };

    // 捕获当前页面可视区域
    let _captureVisibleTab = function (callback) {
        chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, uri => {
            callback && callback(uri);
        });
    };

    let _addScreenShotByPages = function (params, callback) {
        chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 }, uri => {
            callback({ params, uri });
        });
    };

    let _showScreenShotResult = function (data) {
        chrome.DynamicToolRunner({
            tool: 'screenshot',
            withContent: data
        });
    };

    let _colorPickerCapture = function (params) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
                let js = `window.colorpickerNoPage(${JSON.stringify({
                    setPickerImage: true,
                    pickerImage: dataUrl
                })})`;
                InjectTools.inject(tabs[0].id, { js });
            });
        });
    };

    let _codeBeautify = function (params) {
        if (['javascript', 'css'].includes(params.fileType)) {
            Awesome.StorageMgr.get('JS_CSS_PAGE_BEAUTIFY').then(val => {
                if (val !== '0') {
                    let js = `window._codebutifydetect_('${params.fileType}')`;
                    InjectTools.inject(params.tabId, { js });
                }
            });
        }
    };

    /**
     * 接收来自content_scripts发来的消息
     */
    let _addExtensionListener = function () {

        chrome.runtime.onMessage.addListener(function (request, sender, callback) {
            // 如果发生了错误，就啥都别干了
            if (chrome.runtime.lastError) {
                console.log('chrome.runtime.lastError:', chrome.runtime.lastError);
                return true;
            }
            // 打开动态工具页面
            else if (request.type === MSG_TYPE.OPEN_DYNAMIC_TOOL) {
                chrome.DynamicToolRunner(request);
                callback && callback();
            }
            // 打开其他页面
            else if (request.type === MSG_TYPE.OPEN_PAGE) {
                chrome.DynamicToolRunner({
                    tool: request.page
                });
                callback && callback();
            }
            // 任何事件，都可以通过这个钩子来完成
            else if (request.type === MSG_TYPE.DYNAMIC_ANY_THING) {
                switch (request.thing) {
                    case 'save-options':
                        notifyText({
                            message: '配置修改已生效，请继续使用!',
                            autoClose: 2000
                        });
                        break;
                    case 'request-jsonformat-options':
                        Awesome.StorageMgr.get(request.params).then(result => {
                            Object.keys(result).forEach(key => {
                                if (['MAX_JSON_KEYS_NUMBER', 'JSON_FORMAT_THEME'].includes(key)) {
                                    result[key] = parseInt(result[key]);
                                } else {
                                    result[key] = (result[key] !== 'false');
                                }
                            });
                            callback && callback(result);
                        });
                        return true; // 这个返回true是非常重要的！！！要不然callback会拿不到结果
                    case 'save-jsonformat-options':
                        Awesome.StorageMgr.set(request.params).then(() => {
                            callback && callback();
                        });
                        return true;
                    case 'toggle-jsonformat-options':
                        Awesome.StorageMgr.get('JSON_TOOL_BAR_ALWAYS_SHOW').then(result => {
                            let show = result !== false;
                            Awesome.StorageMgr.set('JSON_TOOL_BAR_ALWAYS_SHOW', !show).then(() => {
                                callback && callback(!show);
                            });
                        });
                        return true; // 这个返回true是非常重要的！！！要不然callback会拿不到结果
                    case 'code-beautify':
                        _codeBeautify(request.params);
                        break;
                    case 'close-beautify':
                        Awesome.StorageMgr.set('JS_CSS_PAGE_BEAUTIFY', 0);
                        break;
                    case 'qr-decode':
                        chrome.DynamicToolRunner({
                            withContent: request.params.uri,
                            tool: 'qr-code',
                            query: `mode=decode`
                        });
                        break;
                    case 'request-page-content':
                        request.params = FeJson[request.tabId];
                        delete FeJson[request.tabId];
                        break;
                    case 'set-page-timing-data':
                        chrome.DynamicToolRunner({
                            tool: 'page-timing',
                            withContent: request.wpoInfo
                        });
                        break;
                    case 'color-picker-capture':
                        _colorPickerCapture(request.params);
                        break;
                    case 'add-screen-shot-by-pages':
                        _addScreenShotByPages(request.params, callback);
                        return true;
                    case 'page-screenshot-done':
                        _showScreenShotResult(request.params);
                        break;
                    case 'inject-content-css':
                        _injectContentCss(sender.tab.id, request.tool, !!request.devTool);
                        break;
                }
                callback && callback(request.params);
            } else {
                callback && callback();
            }

            return true;
        });


        // 每开一个窗口，都向内容脚本注入一个js，绑定tabId
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

            if (String(changeInfo.status).toLowerCase() === "complete") {

                if (/^(http(s)?|file):\/\//.test(tab.url) && blacklist.every(reg => !reg.test(tab.url))) {
                    InjectTools.inject(tabId, { js: `window.__FH_TAB_ID__=${tabId};` });
                    _injectContentScripts(tabId);
                }
            }
        });
    };


    /**
     * 初始化
     */
    let _init = function () {
        _addExtensionListener();
    };

    return {
        pageCapture: _captureVisibleTab,
        init: _init
    };
})();

BgPageInstance.init();
