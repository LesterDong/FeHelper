
if( window.location.href.includes('gs-desteslog') ) {
  setInterval( ()=>{
    enhanceEsLog();
  }, 2000 );
}
function enhanceEsLog() {

  console.log('sssss');
  const esDataFetchedTables = $('table.table-details:not(.hasInjected)');
  esDataFetchedTables.each( function() {
    const $table = $( this );
    const $trs = $table.find('tbody tr.ng-scope');
    $trs.each( function() {
      const $tr = $( this );
      const $tds = $tr.find('td');
      const key = $( $tds[0] ).text();
      const value = $( $tds[2] ).text();
      console.log( key, value );
    });
    // 通过Guid获取service request/response/catMsgId
    const catMsgId = '100027244-0a701512-466135-1544853';
    const serviceRequest = '{"head":{"clientId":"12001028110307464175","uid":"M4720161911","clientVersion":856.002,"logId":"f08083d0-3ebb-46ab-b00b-0ab2e5c9ed68","locale":"zh-CN"},"rankingId":0,"districtId":0,"businessInfoList":[{"businessId":"120749547","businessType":"sight","departureCityId":0},{"businessId":"71388335","businessType":"sight","departureCityId":0},{"businessId":"69101963","businessType":"sight","departureCityId":0}],"needAll":true}';
    const serviceResponse = '{"result":0,"rankingItemRankList":[{"businessId":"120749547","businessType":"sight","rankInfoList":[{"rank":4,"rankingId":100700000182,"title":"6大亲子乐园景点","locale":"zh-CN","subTitle":"溜娃休闲好去处","shortTitle":"亲子乐园榜","rankingType":3,"businessType":"sight","rankingVersion":1,"rankingSortScore":150.0,"districtList":[{"id":83,"name":"宁波","enName":"Ningbo","districtType":"CITY"}],"jumpUrlInfo":{"h5Url":"https://m.ctrip.com/webapp/you/cranking/crankingCity/100700000182.html?ishideheader=true&isHideNavBar=YES&skipAb=true","appUrl":"ctrip://wireless/h5?path=cranking&page=index.html#/cranking/crankingCity/100700000182.html&ishideheader=true&isHideNavBar=YES&skipAb=true","commonUrl":"https://m.ctrip.com/webapp/you/cranking/crankingCity/100700000182.html?ishideheader=true&isHideNavBar=YES&skipAb=true"},"labelInfoList":[{"labelId":10007001,"labelName":"高星用户","parentLabelId":10007,"parentLabelName":"适用人群"},{"labelId":10002009,"labelName":"接口分发","parentLabelId":10002,"parentLabelName":"功能标签"},{"labelId":10001034,"labelName":"城市亲子景点","parentLabelId":10001,"parentLabelName":"主题"},{"labelId":10007002,"labelName":"低星用户","parentLabelId":10007,"parentLabelName":"适用人群"},{"labelId":10003005,"labelName":"新口碑榜","parentLabelId":10003,"parentLabelName":"使用场景"},{"labelId":10006001,"labelName":"城市榜","parentLabelId":10006,"parentLabelName":"场景"},{"labelId":10002001,"labelName":"排名接口中输出","parentLabelId":10002,"parentLabelName":"功能标签"},{"labelId":990886,"labelName":"亲子","parentLabelId":990007,"parentLabelName":"人群"},{"labelId":10002002,"labelName":"app内可搜索","parentLabelId":10002,"parentLabelName":"功能标签"},{"labelId":10002005,"labelName":"参与首页分发推荐","parentLabelId":10002,"parentLabelName":"功能标签"}],"coverImageUrl":"https://youimg1.c-ctrip.com/target/0105a12000af9sbg8A781.jpg","extendInfo":{"themeTabName":"亲子乐园","titleWithDistrict":"宁波6大亲子乐园景点","baiduCoverImgUrl":"https://dimg04.c-ctrip.com/images/01041120009u8w0xuC626.jpg","blurCoverImgUrl":"https://dimg04.c-ctrip.com/images/0106y12000aqpzmun97B6.png","themeId":"10001034","rankingNumTopTitle":"6大"},"recommendReason":"六大历史主题区域，37大主题项目，寓教于乐，感受沉浸式、强互动的玩乐新体验。","rankDesc":"宁波6大亲子乐园景点 No.4"}]},{"businessId":"71388335","businessType":"sight","rankInfoList":[{"rank":1,"rankingId":100700000476,"title":"5大亲子乐园景点","locale":"zh-CN","subTitle":"溜娃休闲好去处","shortTitle":"亲子乐园榜","rankingType":3,"businessType":"sight","rankingVersion":1,"rankingSortScore":150.0,"districtList":[{"id":413,"name":"荆州","enName":"Jingzhou","districtType":"CITY"}],"jumpUrlInfo":{"h5Url":"https://m.ctrip.com/webapp/you/cranking/crankingCity/100700000476.html?ishideheader=true&isHideNavBar=YES&skipAb=true","appUrl":"ctrip://wireless/h5?path=cranking&page=index.html#/cranking/crankingCity/100700000476.html&ishideheader=true&isHideNavBar=YES&skipAb=true","commonUrl":"https://m.ctrip.com/webapp/you/cranking/crankingCity/100700000476.html?ishideheader=true&isHideNavBar=YES&skipAb=true"},"labelInfoList":[{"labelId":10007001,"labelName":"高星用户","parentLabelId":10007,"parentLabelName":"适用人群"},{"labelId":10002009,"labelName":"接口分发","parentLabelId":10002,"parentLabelName":"功能标签"},{"labelId":10001034,"labelName":"城市亲子景点","parentLabelId":10001,"parentLabelName":"主题"},{"labelId":10007002,"labelName":"低星用户","parentLabelId":10007,"parentLabelName":"适用人群"},{"labelId":10003005,"labelName":"新口碑榜","parentLabelId":10003,"parentLabelName":"使用场景"},{"labelId":10006001,"labelName":"城市榜","parentLabelId":10006,"parentLabelName":"场景"},{"labelId":10002001,"labelName":"排名接口中输出","parentLabelId":10002,"parentLabelName":"功能标签"},{"labelId":990886,"labelName":"亲子","parentLabelId":990007,"parentLabelName":"人群"},{"labelId":10002002,"labelName":"app内可搜索","parentLabelId":10002,"parentLabelName":"功能标签"},{"labelId":10002005,"labelName":"参与首页分发推荐","parentLabelId":10002,"parentLabelName":"功能标签"}],"coverImageUrl":"https://youimg1.c-ctrip.com/target/0105a12000af9sbg8A781.jpg","extendInfo":{"themeTabName":"亲子乐园","titleWithDistrict":"荆州5大亲子乐园景点","baiduCoverImgUrl":"https://dimg04.c-ctrip.com/images/01041120009u8w0xuC626.jpg","blurCoverImgUrl":"https://dimg04.c-ctrip.com/images/0106y12000aqpzmun97B6.png","themeId":"10001034","rankingNumTopTitle":"5大"},"recommendReason":"酷炫的科技魅力与中华历史文化和神话传说融合，可饱览东方传奇故事的大型高科技主题乐园。","rankDesc":"荆州5大亲子乐园景点 No.1"}]}]}';
    new ServiceMsg( '100031341', 'f08083d0-3ebb-46ab-b00b-0ab2e5c9ed68', '2023-03-06T15:55:59:984+08:00' )
      .build();
    renderCatMsgIdRow( $table, catMsgId );
    renderServiceReqMsg( $table, serviceRequest );
    renderServiceRespMsg( $table, serviceResponse );
    $table.addClass('hasInjected');
  });
}

function renderServiceReqMsg( $table, reqMsg ) {
  const $tr = addRow( $table, 'ServiceRequest' );
  // 创建并返回 message td
  const messageTd = new MessageTd( $tr.find('td:eq(2)') );
  // 报文折叠
  const foldAction = messageTd.enableFold( reqMsg );
  const formatAction = messageTd.enableFormat();

  // 按钮
  const $actionTd = $tr.find('td:eq(1)');

  const actionTd = new ActionTd( $actionTd, {
    iconTitle: '格式化',
    iconClass: 'icon-code',
    onClick: function(){
      formatAction.format();
      foldAction.unfold();
    }
  });
  actionTd.render();
}

function renderServiceRespMsg( $table, respMsg ) {
  const $tr = addRow( $table, 'ServiceResponse' );
  // 创建并返回 message td
  const messageTd = new MessageTd( $tr.find('td:eq(2)') );
  // 报文折叠
  const foldAction = messageTd.enableFold( respMsg );
  const formatAction = messageTd.enableFormat();

  // 按钮
  const $actionTd = $tr.find('td:eq(1)');

  const actionTd = new ActionTd( $actionTd, {
    iconTitle: '格式化',
    iconClass: 'icon-code',
    onClick: function(){
      formatAction.format();
      foldAction.unfold();
    }
  });
  actionTd.render();
}

function renderCatMsgIdRow( $table, catMsgId ) {
  const $tr = addRow( $table, 'CatMsgId' );
  const $valueTd = $tr.find('td:eq(2)');
  const $actionTd = $tr.find('td:eq(1)');
  $valueTd.text( catMsgId );
  // 创建 bat td
  const batTd = new BatTd( $valueTd );

  // 跳转Bat
  const catAction = batTd.enableCat( catMsgId );

  const actionTd = new ActionTd( $actionTd, {
    iconTitle: '跳转Bat',
    iconClass: 'icon-share',
    onClick: function() {
      catAction.call();
    }
  });
  actionTd.render();
}

function addRow( $table, key ) {
  const $tr = $('<tr ng-repeat="_source_row in event.kibana._source_array track by $index" ng-class-odd="\'odd\'" class="ng-scope" style="color: rgb(1, 255, 112);">');
  const $td0 = $('<td style="word-wrap:break-word" ng-bind="_source_row.key" class="ng-binding">');
  $td0.text( key );
  const $td1 = $('<td style="white-space:nowrap">');
  const $td2 = $('<td ng-if="!panel.localTime || panel.timeField != _source_row.key" style="white-space:pre-wrap;word-wrap:break-word" ng-bind-html="_source_row.value|columnFormat:_source_row.key:event:this.panel.columnFormats|noXml|stringify" class="ng-binding ng-scope">');
  $tr.append( $td0 ).append( $td1 ).append( $td2 );
  $table.append( $tr );
  return $tr;
}


function _submitForm( action, args, method, flag ) {
  var $form = $( '<form style=\'display:none;\' id=\'esform\' action=\'' + action + '\' method=\'' + method + '\' ' + ( flag ? 'target=\'_blank\'' : '' ) + '></form>' );

  for( const key in args ) {
    $('<input />').attr( 'name', key ).val( args[key] ).appendTo( $form );
  }
  $form.appendTo( document.body ).submit();
}

const GotoUtil = {
  getMethod: function( url, args, flag = true ){
    _submitForm( url, args, 'GET', flag );
  },

  postMethod: function( url, args, flag = true ){
    _submitForm( url, args, 'POST', flag );
  }
};

class SuperTd {
  constructor( $el ) {
    this.$el = $el;
  }
}

class MessageTd extends SuperTd {
  constructor( $el ) {
    super( $el );
    this.flag = {};
  }

  enableFold( message ) {
    this.flag.enableFold = true;

    const $content = $('<div class=\'content\'></div>').text( message );
    const $wrapper = $('<div></div>').append( $content );
    const $trigger = $('<a style=\'display:block;font-size:12px;\'></a>');

    function fold() {
      $wrapper.addClass('es-wrapper-folder');
      $trigger.text('更多...');
    }

    function unfold() {
      $wrapper.removeClass('es-wrapper-folder');
      $trigger.text('收起...');
    }

    this.$el.empty().append( $wrapper );

    const height = $content.innerHeight();

    if( height > 40 ) {
      $wrapper.addClass('es-wrapper-folder');

      this.$el.append( $trigger.text('更多...').click( function () {
        if( $trigger.text() === '更多...' ) {
          unfold();
        } else {
          fold();
        }
      }) );
    }

    return {
      fold,
      unfold
    };
  }

  enableFormat() {
    this.flag.enableFormat = true;

    const $content = this.flag.enableFold ? this.$el.find('div.content') : this.$el;
    const contentText = $content.text();
    const fileFormat = contentText[0] === '<' ? 'xml' : 'json';

    function format() {
      if( fileFormat === 'json' ) {
        $content.text( JSON.stringify( JSON.parse( $content.text() ), null, 4 ) );
      }
    }

    return {
      format
    };
  }
}
class ServiceMsg {
  constructor( appId, guid, timeStamp ) {
    this.guid = guid;
    this.appId = appId;
    this.timeStamp = timeStamp;
  }
  build( callback ) {
    let url = 'http://10.58.131.129/data/logs/' + this.appId;
    const d = moment( this.timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ' );
    const startTime = d.add( -120, 'seconds' ).format('YYYY-MM-DD%20HH:mm:ss');
    const endTime = d.add( 120, 'seconds' ).format('YYYY-MM-DD%20HH:mm:ss');
    url = url + '?fromDate=' + startTime + '&toDate=' + endTime + '&logLevel=1'
              + '&tagKey=Guid&tagValue=' + this.guid
              + '&tagKey=id&tagValue=servicerequest,serviceresponse';

    $.get({
      url: url,
      dataType: 'json',
      crossDomain: true,
      success: function( logDataXml ) {
        this.parse( logDataXml );
        callback();
        console.log( logDataXml );
      },
      error: function( jqXHR, textStatus, errorThrown ) {
        console.log( textStatus + ': ' + errorThrown );
      }
    });
  }

  parse( logDataXml ) {
    console.log( logDataXml );
  }

}


class BatTd extends SuperTd {
  constructor( $el ) {
    super( $el );
  }

  enableCat( messageId ) {
    const url = 'http://bat.fx.ctripcorp.com/logview/' + messageId;

    function call() {
      GotoUtil.postMethod( url );
    }

    return {
      call
    };
  }
}

class ActionTd {
  constructor( $el, option ) {
    this.$el = $el;
    this.option = _.extend({
      iconClass: '',
      iconTitle: '',
      onClick: function(){}
    }, option );
  }

  render() {
    const actionCount = this.$el.find('i').length;
    const $icon = $( `<i class='${ this.option.iconClass } pointer' title='${ this.option.iconTitle }'></i>` );

    if( actionCount > 0 && actionCount % 3 === 0 ) {
      this.$el.append('<br />');
    }

    $icon.click( this.option.onClick );

    this.$el.append(' ').append( $icon );
  }
}