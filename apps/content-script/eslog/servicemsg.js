import constant from "./constant.js";

export default class ServiceMsg {
    constructor($table, appId, catMsgId, timeStamp, clientAppId) {
        this.catMsgId = catMsgId;
        this.appId = appId;
        this.timeStamp = timeStamp;
        this.$table = $table;
        this.clientAppId = clientAppId;
    }
    getLog(callback) {

        function buidContextData(logData, clientAppId, startTime, endTime) {
            console.log("clog=>", logData);
            const logs = logData.logs;
            if (logs && logs.length > 1) {
                let serviceRequest = logs.find(log => log.title === 'INFO-servicerequest');
                let serviceResponse = logs.find(log => log.title === 'INFO-serviceresponse');
                let appId = logs[1].appId;
                let catMsgIdAttr = logs[1].attributes.find(attr => attr.key === "cat-msg-id");
                let operationAttr = logs[1].attributes.find(attr => attr.key === "ServiceCode");
                let catMsgId = catMsgIdAttr ? catMsgIdAttr.value : '';
                if (!catMsgIdAttr || !serviceRequest || !serviceResponse) {
                    return;
                }
                const result = {
                    "appId": appId,
                    "clientAppId": clientAppId,
                    "catMsgId": catMsgIdAttr.value,
                    "serviceRequest": serviceRequest.message,
                    "serviceResponse": serviceResponse.message,
                    "operation": operationAttr.value,
                    "startTime": startTime,
                    "endTime": endTime
                }
                return result;
            }
        }

        let url = constant.clogPullUrl + this.appId;
        let d = moment(this.timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        let startTime = d.add(-30, 'seconds').format('YYYY-MM-DD%20HH:mm:ss');
        let endTime = d.add(60, 'seconds').format('YYYY-MM-DD%20HH:mm:ss');
        url = url + '?fromDate=' + startTime + '&toDate=' + endTime + '&logLevel=1'
            + '&tagKey=cat-msg-id&tagValue=' + this.catMsgId
            + '&tagKey=id&tagValue=servicerequest,serviceresponse';
        console.log('log req url:' + url);
        let $table = this.$table;
        let clientAppId = this.clientAppId;
        $.get({
            url: url,
            dataType: 'json',
            crossDomain: true,
            success: function (logData) {
                let data = buidContextData(logData, clientAppId, startTime, endTime);
                if (data) {
                    callback.render($table, data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            }
        });

    }
}