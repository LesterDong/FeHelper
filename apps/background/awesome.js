
let Awesome = (() => {

    const TOOL_NAME_TPL = 'DYNAMIC_TOOL:#TOOL-NAME#';
    const TOOL_CONTENT_SCRIPT_TPL = 'DYNAMIC_TOOL:CS:#TOOL-NAME#';
    const TOOL_CONTENT_SCRIPT_CSS_TPL = 'DYNAMIC_TOOL:CS:CSS:#TOOL-NAME#';

    /**
     * 管理本地存储
     */
    let StorageMgr = (() => {

        let get = keyArr => {
            return new Promise((resolve, reject) => {
                chrome.storage.local.get(keyArr, result => {
                    resolve(typeof keyArr === 'string' ? result[keyArr] : result);
                });
            });
        };


        let getSync = async (keyArr) => {
            return await (new Promise((resolve, reject) => {
                chrome.storage.local.get(keyArr, result => {
                    resolve(typeof keyArr === 'string' ? result[keyArr] : result);
                });
            }));
        };

        let set = (items, values) => {
            return new Promise((resolve, reject) => {
                if (typeof items === 'string') {
                    let tmp = {};
                    tmp[items] = values;
                    items = tmp;
                }
                chrome.storage.local.set(items, () => {
                    resolve();
                });
            });
        };

        let remove = keyArr => {
            return new Promise((resolve, reject) => {
                keyArr = [].concat(keyArr);
                chrome.storage.local.remove(keyArr, () => {
                    resolve();
                });
            });
        };

        return {get, set, remove,getSync};
    })();

    /**
     * 获取工具的content-script
     * @param toolName
     * @param cssMode
     */
    let getContentScript = (toolName, cssMode) => {
        return StorageMgr.get(cssMode ? TOOL_CONTENT_SCRIPT_CSS_TPL.replace('#TOOL-NAME#', toolName)
            : TOOL_CONTENT_SCRIPT_TPL.replace('#TOOL-NAME#', toolName));
    };

    /**
     * 获取工具的html模板
     * @param toolName
     * @returns {*}
     */
    let getToolTpl = (toolName) => StorageMgr.get(TOOL_NAME_TPL.replace('#TOOL-NAME#', toolName));

    /**
     * 工具排序管理器
     * @type {{get, set}}
     */
    let SortToolMgr = (() => {
        const TOOLS_CUSTOM_SORT = 'TOOLS_CUSTOM_SORT';

        let get = async () => {
            let cache = await StorageMgr.getSync(TOOLS_CUSTOM_SORT);

            return [].concat(JSON.parse(cache || '[]')).filter(t => !!t);
        };

        let set = (newSortArray) => {
            let obj = {};
            obj[TOOLS_CUSTOM_SORT] = JSON.stringify([].concat(newSortArray || []).filter(t => !!t));
            chrome.storage.local.set(obj);
        };

        return {get, set};
    })();


    return {
        StorageMgr,
        getContentScript,
        getToolTpl,
        SortToolMgr
    }
})();

export default Awesome;
