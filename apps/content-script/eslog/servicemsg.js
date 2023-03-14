import constant from "./constant.js";

export default class ServiceMsg {
    constructor($table, appId, guid, timeStamp) {
        this.guid = guid;
        this.appId = appId;
        this.timeStamp = timeStamp;
        this.$table = $table;
    }
    getLog(callback) {

        function parse(logData) {
            console.log(logData);
            const logs = logData.logs;
            if (logs && logs.length > 1) {
                let serviceResponse = logs[0].message;
                let serviceRequest = logs[1].message;
                let catMsgIdAttr = logs[1].attributes.filter(function (attr) {
                    return attr.key === "cat-msg-id";
                });
                let catMsgId = catMsgIdAttr && catMsgIdAttr.length > 0 ? catMsgIdAttr[0].value : '';
                if (catMsgId === '') {
                    return;
                }
                const result = {
                    "catMsgId": catMsgId,
                    "serviceRequest": serviceRequest,
                    "serviceResponse": serviceResponse
                }
                return result;
            }
        }

        let url = constant.clogPullUrl + this.appId;
        let d = moment(this.timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
        let startTime = d.add(-30, 'seconds').format('YYYY-MM-DD%20HH:mm:ss');
        let endTime = d.add(60, 'seconds').format('YYYY-MM-DD%20HH:mm:ss');
        url = url + '?fromDate=' + startTime + '&toDate=' + endTime + '&logLevel=1'
            + '&tagKey=Guid&tagValue=' + this.guid
            + '&tagKey=id&tagValue=servicerequest,serviceresponse';
        console.log('log req url:' + url);
        let $table = this.$table;
        let appId = this.appId;
        $.get({
            url: url,
            dataType: 'json',
            crossDomain: true,
            success: function (logData) {
                let data = parse(logData);
                if (data) {
                    callback.render($table, data.catMsgId, data.serviceRequest, data.serviceResponse, appId);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            }
        });

    }
}