
export let GotoUtil = {
    getMethod: function (url, args, flag = true) {
        _submitForm(url, args, 'GET', flag);
    },

    postMethod: function (url, args, flag = true) {
        _submitForm(url, args, 'POST', flag);
    }
};

function _submitForm(action, args, method, flag) {
    var $form = $('<form style=\'display:none;\' id=\'esform\' action=\'' + action + '\' method=\'' + method + '\' ' + (flag ? 'target=\'_blank\'' : '') + '></form>');

    for (const key in args) {
        $('<input />').attr('name', key).val(args[key]).appendTo($form);
    }
    $form.appendTo(document.body).submit();
}