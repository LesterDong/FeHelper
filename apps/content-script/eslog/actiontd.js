export default class ActionTd {
    constructor($el, option) {
      this.$el = $el;
      this.option = _.extend({
        iconClass: '',
        iconTitle: '',
        onClick: function () { }
      }, option);
    }
  
    render() {
      const actionCount = this.$el.find('i').length;
      const $icon = $(`<i class='${this.option.iconClass} pointer' title='${this.option.iconTitle}'></i>`);
  
      if (actionCount > 0 && actionCount % 3 === 0) {
        this.$el.append('<br />');
      }
  
      $icon.click(this.option.onClick);
  
      this.$el.append(' ').append($icon);
    }
  }