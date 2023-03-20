export default {
    batUrl: 'http://bat.fx.ctripcorp.com/logview/',
    clogUrl: 'http://logging.ctripcorp.com/#/',
    clogPullUrl: 'http://rest.logging.ctripcorp.com/data/logs/',
    soaTestUrl: 'http://canary.ctripcorp.com/#!/soa?state=',
    soaServicesUrl: 'http://ws.soa.fx.ctripcorp.com/management/api/external/soa/getAppServices',
	blueColor: '#33b5e5',
	limeColor: '#01FF70',
    exVersion: chrome.runtime.getManifest && chrome.runtime.getManifest().version || "unKnown",
	folderHeight: 40,	// 内容高度超过此设置时，触发自动折叠
};