import Base64 from "./base64.js";
import LZString from "./lzstring.js";
import ActionTd from "./actiontd.js";
import MessageTd from "./messagetd.js";
import ServiceMsg from "./servicemsg.js";
import constant from "./constant.js";
import { GotoUtil } from './common.js';

export function main() {
  if (window.location.href.includes('gs-desteslog')) {
    setInterval(() => {
      enhanceEsLog();
    }, 5000);
  }
}

const render = {
  render: function ($table, data) {
    if ($table.hasClass('hasInjected')) {
      return;
    }
    if (!data) {
      return;
    }
    renderCatMsgIdRow($table, data);
    renderServiceReqMsg($table, data);
    renderServiceRespMsg($table, data.serviceResponse);
    $table.addClass('hasInjected');
  }
};

function enhanceEsLog() {
  const esDataFetchedTables = $('table.table-details:not(.hasInjected)');
  esDataFetchedTables.each(function () {
    const $table = $(this);
    const $trs = $table.find('tbody tr.ng-scope');
    let appId;
    let clientAppId;
    let guid;
    let timeStamp;
    $trs.each(function () {
      const $tr = $(this);
      const $tds = $tr.find('td');
      const key = $($tds[0]).text();
      const value = $($tds[2]).text();
      if (key === 'CallingAppId') {
        clientAppId = value;
      } else if (key === 'cat_client_appid') {
        appId = value;
      } else if (key === 'Guid') {
        guid = value;
      } else if (key === 'timestamp') {
        timeStamp = value;
      }
    });
    new ServiceMsg($table, appId, guid, timeStamp, clientAppId)
      .getLog(render);
  });
}


function buildSoaTestStateData(serviceInfo, data) {

  let serviceNode = {
    "serviceCode": serviceInfo.serviceCode,
    "serviceName": serviceInfo.serviceName,
    "serviceKey": serviceInfo.serviceKey,
    "serviceType": serviceInfo.serviceType
  };
  let requestHeaders = [
    {
      "enabled": false,
      "key": "cache",
      "value": "reset"
    }
  ];
  let operationNode = {
    "name": data.operation
  }
  let stateObj = new Object();
  stateObj.appId = data.appId;
  stateObj.service = serviceNode;
  stateObj.operation = operationNode;
  stateObj.clientAppId = data.clientAppId;
  stateObj.requestHeaders = requestHeaders;
  stateObj.requestBody = data.serviceRequest;
  stateObj.showAllInstances = true;
  let stateData = Base64.encode(LZString.compress(JSON.stringify(stateObj)));
  return stateData;
}

var renderSoaTest = function (data, callback) {

  const resJson = JSON.parse("{\n" +
    "    \"responseStatus\":\n" +
    "    {\n" +
    "        \"errorCode\": \"success\",\n" +
    "        \"status\": \"success\",\n" +
    "        \"message\": \"\"\n" +
    "    },\n" +
    "    \"services\":\n" +
    "    [\n" +
    "        {\n" +
    "            \"serviceCode\": \"20504\",\n" +
    "            \"serviceName\": \"CRankingSearchService\",\n" +
    "            \"serviceNamespace\": \"http://soa.ctrip.com/23648\",\n" +
    "            \"serviceKey\": \"20504.crankingsearchservice\",\n" +
    "            \"appId\": \"100028785\",\n" +
    "            \"appIds\":\n" +
    "            [\n" +
    "                \"100028785\"\n" +
    "            ]\n" +
    "        }\n" +
    "    ]\n" +
    "}");
  callback(data, resJson);

  // fetch(constant.soaServicesUrl, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     appId: appId
  //   })
  // })
  //   .then(response => response.json())
  //   .then(resJson => {
  //     console.log(resJson);
  //     callback(appId, resJson, requestData);
  //   })
  //   .catch(error => console.error(error));
}

function renderServiceReqMsg($table, data) {
  const $tr = addRow($table, 'ServiceRequest');
  // 创建并返回 message td
  const messageTd = new MessageTd($tr.find('td:eq(2)'));

  // 报文折叠
  const foldAction = messageTd.enableFold(data.serviceRequest);
  const formatAction = messageTd.enableFormat();

  // 按钮
  const $actionTd = $tr.find('td:eq(1)');

  const actionTd = new ActionTd($actionTd, {
    iconTitle: '格式化',
    iconClass: 'icon-code',
    onClick: function () {
      formatAction.format();
      foldAction.unfold();
    }
  });
  actionTd.render();

  renderSoaTest(data, function (data, serviceData) {
    console.log(serviceData);

    if (!serviceData.services || serviceData.services.length === 0) {
      return;
    }
    const stateData = buildSoaTestStateData(serviceData.services[0], data);
    const soaTestUrl = constant.soaTestUrl + stateData;
    let actionTd = new ActionTd($actionTd, {
      iconTitle: '跳转堡垒测试',
      iconClass: 'icon-plane',
      onClick: function () {
        GotoUtil.getMethod(soaTestUrl);
      }
    });
    actionTd.render();
  });
}

function renderServiceRespMsg($table, respMsg) {
  const $tr = addRow($table, 'ServiceResponse');
  // 创建并返回 message td
  const messageTd = new MessageTd($tr.find('td:eq(2)'));
  // 报文折叠
  const foldAction = messageTd.enableFold(respMsg);
  const formatAction = messageTd.enableFormat();

  // 按钮
  const $actionTd = $tr.find('td:eq(1)');

  const actionTd = new ActionTd($actionTd, {
    iconTitle: '格式化',
    iconClass: 'icon-code',
    onClick: function () {
      formatAction.format();
      foldAction.unfold();
    }
  });
  actionTd.render();
}

function buildClogUrl(data) {

  const startTime = data.startTime.replace('%20', '_');
  const endTime = data.endTime.replace('%20', '_')
  const param = {
    fromDate: startTime,
    toDate: endTime,
    app: data.appId,
    changed: 'title,message,hostSearch,source,relevanceApps,eliminateSources,logType,selectedFrameworkProducts,chartEx,logEx,app,tags,fromDate,toDate,navigatorFromDate,navigatorToDate,visibility,ts',
    navigatorFromDate: startTime,
    navigatorToDate: endTime,
    visibility: '0,1,0,1,1,1,-1,-1,-1,-1,-1,-1,-1',
    tags: encodeURIComponent('cat-msg-id=' + data.catMsgId)
  };
  const pairs = Object.entries(param);
  const subUrl = pairs.map(pair => pair.join('=')).join('~'); // format: "key1=value1~key2=value2~key3=value3
  return constant.clogUrl + '?' + subUrl;
}

function renderCatMsgIdRow($table, data) {
  const $tr = addRow($table, 'CatMsgId');
  const $valueTd = $tr.find('td:eq(2)');
  const $actionTd = $tr.find('td:eq(1)');
  $valueTd.text(data.catMsgId);

  // 跳转Bat
  const batUrl = constant.batUrl + data.catMsgId;
  let actionTd = new ActionTd($actionTd, {
    iconTitle: '跳转Bat',
    iconClass: 'icon-share',
    onClick: function () {
      GotoUtil.getMethod(batUrl);
    }
  });
  actionTd.render();
  const clogUrl = buildClogUrl(data);
  // 跳转clog
  actionTd = new ActionTd($actionTd, {
    iconTitle: '跳转Clog',
    iconClass: 'icon-road',
    onClick: function () {
      GotoUtil.getMethod(clogUrl);
    }
  });
  actionTd.render();
}

function addRow($table, key) {
  const $tr = $('<tr ng-repeat="_source_row in event.kibana._source_array track by $index" ng-class-odd="\'odd\'" class="ng-scope" style="color: rgb(1, 255, 112);">');
  const $td0 = $('<td style="word-wrap:break-word" ng-bind="_source_row.key" class="ng-binding">');
  $td0.text(key);
  const $td1 = $('<td style="white-space:nowrap">');
  const $td2 = $('<td ng-if="!panel.localTime || panel.timeField != _source_row.key" style="white-space:pre-wrap;word-wrap:break-word" ng-bind-html="_source_row.value|columnFormat:_source_row.key:event:this.panel.columnFormats|noXml|stringify" class="ng-binding ng-scope">');
  $tr.append($td0).append($td1).append($td2);
  $table.append($tr);
  return $tr;
}
