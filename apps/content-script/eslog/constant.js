export default {
    batUrl: 'http://bat.fx.ctripcorp.com/logview/',
    clogPullUrl: 'http://rest.logging.ctripcorp.com/data/logs/',
    soaTestUrl: 'http://canary.ctripcorp.com/#!/soa?state=',
    soaServicesUrl: 'http://canary.ctripcorp.com/api/soa/services?appId=',
	blueColor: '#33b5e5',
	limeColor: '#01FF70',
    exVersion: chrome.runtime.getManifest && chrome.runtime.getManifest().version || "unKnown",
	folderHeight: 40,	// 内容高度超过此设置时，触发自动折叠
};