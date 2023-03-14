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

var callback = {
  render: function ($table, catMsgId, serviceRequest, serviceResponse, appId) {
    if ($table.hasClass('hasInjected')) {
      return;
    }
    renderCatMsgIdRow($table, catMsgId);
    renderServiceReqMsg($table, serviceRequest, appId);
    renderServiceRespMsg($table, serviceResponse);
    $table.addClass('hasInjected');
  }
};

function enhanceEsLog() {
  const esDataFetchedTables = $('table.table-details:not(.hasInjected)');
  esDataFetchedTables.each(function () {
    const $table = $(this);
    const $trs = $table.find('tbody tr.ng-scope');
    let appId;
    let guid;
    let timeStamp;
    $trs.each(function () {
      const $tr = $(this);
      const $tds = $tr.find('td');
      const key = $($tds[0]).text();
      const value = $($tds[2]).text();
      if (key === 'cat_client_appid') {
        appId = value;
      } else if (key === 'Guid') {
        guid = value;
      } else if (key === 'timestamp') {
        timeStamp = value;
      }
    });
    new ServiceMsg($table, appId, guid, timeStamp)
      .getLog(callback);
  });
}

function getServiceInfo(appId, callback) {
  axios.get(constant.soaServicesUrl + appId,
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
    })
    .then(function (response) {
      console.log(response.data);
      if (!response.data.services || response.data.services.length === 0) {
        return;
      }
      callback(response.data.services[0]);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function buildSoaTestStateData(appId, serviceInfo, requestBodyStr) {

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

  let stateObj = new Object();
  stateObj.appId = appId;
  stateObj.service = serviceNode;
  stateObj.requestHeaders = requestHeaders;
  stateObj.requestBody = requestBodyStr;
  stateObj.showAllInstances = true;
  let stateData = Base64.encode(LZString.compress(JSON.stringify(stateObj)));
  console.log('stateData:' + stateData);
  return stateData;
}
function renderServiceReqMsg($table, requestData, appId) {
  const $tr = addRow($table, 'ServiceRequest');
  // 创建并返回 message td
  const messageTd = new MessageTd($tr.find('td:eq(2)'));

  getServiceInfo(appId, function (appId, serviceInfo, requestData) {
    // 跳转堡垒
    // const stateData = '456C4oKGw6HgpKDimKDiuJDhhoDgs6jhjIHpoI7sloHrgoDgtIjMuOCpoOGOgOa4guWgjOa5ouqBk_SPpOCwoOO2rOS0rOiAjsKs7KCA64yT4pWO6oyA54mgy5nvhIDFi_q0gOSKtMW75ICH5oCM7K6l56Wgwrrti6vqgLLpk7bhjZvkvKDhqZzogY-kkKDOmumAh_SEjeSAkeuan_qBtuq0gemGieumpeiOu_C_teOIiOa0kOWauOaGsemmheq6rOaMveq2owrqroThioDhlpjjlJjgoIDivonilLkj6ICr66Sp4qaA0rnhoK-ilKniiIDjmqjjpK7poIDkgI3rpLzIvumgmOyUiTXprofrtJjjtIDWk_CkpeWji_SeveSUqei1gOK6ieKriO6Uq_i2jeGUs_Cgk_aUmOyeuu6mqeiQgj3fmuC_qOqJsuK4h_yygeyBoOGAguWQuOKPqdag57Gq4pCu4KWS6KaU64ec5JqK4Lyn6bKK5oCC7KuR5oKq4LS26L2O6YqJ5pOh4oG6642V6qmn5YOx7bGI5oCA3ZLoo43tgIDgo5nospDim5vql4jkhrLppKzvmYfjjpLMmeeFluGMvuaiq_S6sMuQ54Gk5bKi44y16Yit4ZqQ66CP5Ji06q6b6pygx5zphrrWuOWPg_6UqeeAguO5jeeavOiXjeWci_aqjui5l_O-i_SOgGXmoa3mpb-kl5LioILnjqDngYLDse2HneWCk_2DhuuRoeqmgOCgpc6A56OQ6aCQ5qKc5ImF4o6s66CG6JOY7LGn6o2p6IW06LC_6IiU7KWB5q2U6ICA';
    const stateData = buildSoaTestStateData(appId, serviceInfo, requestData);
    const soaTestUrl = constant.soaTestUrl + stateData;
    let actionTd = new ActionTd($actionTd, {
      iconTitle: '跳转堡垒测试',
      iconClass: 'icon-share',
      onClick: function () {
        GotoUtil.getMethod(soaTestUrl);
      }
    });
    actionTd.render();
  });

  // 报文折叠
  const foldAction = messageTd.enableFold(requestData);
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

function renderCatMsgIdRow($table, catMsgId) {
  const $tr = addRow($table, 'CatMsgId');
  const $valueTd = $tr.find('td:eq(2)');
  const $actionTd = $tr.find('td:eq(1)');
  $valueTd.text(catMsgId);

  // 跳转Bat
  const batUrl = constant.batUrl + catMsgId;
  let actionTd = new ActionTd($actionTd, {
    iconTitle: '跳转Bat',
    iconClass: 'icon-share',
    onClick: function () {
      GotoUtil.getMethod(batUrl);
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
