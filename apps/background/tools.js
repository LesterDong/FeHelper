let toolMap = {
    "json-format":
    {
        "name": "JSON美化工具",
        "tips": "页面自动检测并格式化、手动格式化、乱码解码、排序、BigInt、编辑、下载、皮肤定制等",
        "contentScriptJs": true,
        "contentScriptCss": true,
        "systemInstalled": true,
        "menuConfig":
        [
            {
                "icon": "⒥",
                "text": "JSON格式化",
                "contexts":
                [
                    "page",
                    "selection",
                    "editable"
                ]
            }
        ]
    },
    "json-diff":
    {
        "name": "JSON比对工具",
        "tips": "支持两个JSON内容的自动键值比较，并高亮显示差异点，同时也能判断JSON是否合法",
        "menuConfig":
        [
            {
                "icon": "☷",
                "text": "JSON比对器"
            }
        ]
    },
    "qr-code":
    {
        "name": "二维码/解码",
        "tips": "支持自定义颜色和icon的二维码生成器，并且支持多种模式的二维码解码，包括截图后粘贴解码",
        "contentScriptJs": true,
        "menuConfig":
        [
            {
                "icon": "▣",
                "text": "二维码生成器",
                "contexts":
                [
                    "page",
                    "selection",
                    "editable",
                    "link",
                    "image"
                ]
            },
            {
                "icon": "◈",
                "text": "二维码解码器",
                "contexts":
                [
                    "image"
                ]
            }
        ]
    },
    "en-decode":
    {
        "name": "信息编码转换",
        "tips": "支持多格式的信息编解码，如Unicode、UTF-8、UTF-16、URL、Base64、MD5、Hex、Gzip等",
        "menuConfig":
        [
            {
                "icon": "♨",
                "text": "字符串编解码",
                "contexts":
                [
                    "page",
                    "selection",
                    "editable"
                ]
            }
        ]
    },
    "code-beautify":
    {
        "name": "代码美化工具",
        "tips": "支持多语言的代码美化，包括 Javascript、CSS、HTML、XML、SQL，且会陆续支持更多格式",
        "contentScriptJs": true,
        "contentScriptCss": true,
        "menuConfig":
        [
            {
                "icon": "✡",
                "text": "代码美化工具",
                "contexts":
                [
                    "page",
                    "selection",
                    "editable"
                ]
            }
        ]
    },
    "chatgpt":
    {
        "name": "ChatGPT工具",
        "tips": "由OpenAI强力支撑的超智能对话工具，可以让它帮你写代码、查资料、做分析、甚至帮你画一幅画",
        "menuConfig":
        [
            {
                "icon": "㊙",
                "text": "ChatGPT工具"
            }
        ]
    },
    "timestamp":
    {
        "name": "时间(戳)转换",
        "tips": "本地化时间与时间戳之间的相互转换，支持秒/毫秒、支持世界时区切换、各时区时钟展示等",
        "menuConfig":
        [
            {
                "icon": "♖",
                "text": "时间(戳)转换"
            }
        ]
    },
    "regexp":
    {
        "name": "JS正则表达式",
        "tips": "正则校验工具，默认提供一些工作中常用的正则表达式，支持内容实时匹配并高亮显示结果",
        "menuConfig":
        [
            {
                "icon": "✙",
                "text": "JS正则表达式"
            }
        ]
    },
    "trans-radix":
    {
        "name": "进制转换工具",
        "tips": "支持2进制到36进制数据之间的任意转换，比如：10进制转2进制，8进制转16进制，等等",
        "menuConfig":
        [
            {
                "icon": "❖",
                "text": "进制转换工具"
            }
        ]
    },
    "crontab":
    {
        "name": "Crontab工具",
        "tips": "一个简易的Crontab生成工具，支持随机生成Demo，编辑过程中，分时日月周会高亮提示",
        "menuConfig":
        [
            {
                "icon": "½",
                "text": "Crontab工具"
            }
        ]
    }
};

export default toolMap;
