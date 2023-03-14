import SuperTd from './supertd.js';

export default class MessageTd extends SuperTd {
  constructor($el) {
    super($el);
    this.flag = {};
  }

  enableFold(message) {
    this.flag.enableFold = true;
    const $content = $("<div class='content'></div>").text(message);
    const $wrapper = $("<div></div>").append($content);
    const $trigger = $("<a style='display:block;font-size:12px;'></a>");

    this.$el.empty().append($wrapper);

    const height = $content.innerHeight();

    if (height > 40) {
      $wrapper.addClass('es-wrapper-folder');
      this.$el.append($trigger.text("更多...").click(function () {
        if ($trigger.text() === "更多...") {
          unfold();
        } else {
          fold();
        }
      }));
    }

    function fold() {
      $wrapper.addClass('es-wrapper-folder');
      $trigger.text("更多...");
    }

    function unfold() {
      $wrapper.removeClass("es-wrapper-folder");
      $trigger.text("收起...");
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
    const fileFormat = contentText[0] === "<" ? "xml" : "json";

    function format() {
      if (fileFormat === "json") {
        $content.text(JSON.stringify(JSON.parse($content.text()), null, 4));
      }
    }

    return {
      format
    }
  }
}
