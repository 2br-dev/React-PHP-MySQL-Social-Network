'use strict';

(function (global) {
	'use strict';

	global.console = global.console || {};
	var con = global.console,
	    prop,
	    method,
	    empty = {},
	    dummy = function dummy() {},
	    properties = 'memory'.split(','),
	    methods = 'assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn'.split(',');
	while (prop = properties.pop()) {
		if (!con[prop]) con[prop] = empty;
	}while (method = methods.pop()) {
		if (!con[method]) con[method] = dummy;
	}
})(typeof window === 'undefined' ? undefined : window);

!function () {
	function e(e, t) {
		var n = 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 14px;' + (e ? "font-weight: bold;" : "") + "color: " + t + ";";
		return n;
	}

	if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
		console.log("%c♥ %c✰ %cCELEBRO.CMS %c✰ %c http://cms.celebro.ru %c♥", e(!0, "#f00"), e(!0, "#af55e2"), e(!0, "#777"), e(!0, "#af55e2"), e(!0, "#557de2"), e(!0, "#f00"));
	} else {
		console.log('celebro.cms http://cms.celebro.ru');
	}
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jb25zb2xlLmpzIl0sIm5hbWVzIjpbImdsb2JhbCIsImNvbnNvbGUiLCJjb24iLCJwcm9wIiwibWV0aG9kIiwiZW1wdHkiLCJkdW1teSIsInByb3BlcnRpZXMiLCJzcGxpdCIsIm1ldGhvZHMiLCJwb3AiLCJ3aW5kb3ciLCJlIiwidCIsIm4iLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxVQUFTQSxNQUFULEVBQWlCO0FBQ2pCOztBQUNBQSxRQUFPQyxPQUFQLEdBQWlCRCxPQUFPQyxPQUFQLElBQWtCLEVBQW5DO0FBQ0EsS0FBSUMsTUFBTUYsT0FBT0MsT0FBakI7QUFBQSxLQUNDRSxJQUREO0FBQUEsS0FDT0MsTUFEUDtBQUFBLEtBRUNDLFFBQVEsRUFGVDtBQUFBLEtBR0NDLFFBQVEsU0FBUkEsS0FBUSxHQUFXLENBQUUsQ0FIdEI7QUFBQSxLQUlDQyxhQUFhLFNBQVNDLEtBQVQsQ0FBZSxHQUFmLENBSmQ7QUFBQSxLQUtDQyxVQUFXLHVNQUFELENBQTBNRCxLQUExTSxDQUFnTixHQUFoTixDQUxYO0FBTUEsUUFBT0wsT0FBT0ksV0FBV0csR0FBWCxFQUFkO0FBQWdDLE1BQUksQ0FBQ1IsSUFBSUMsSUFBSixDQUFMLEVBQWdCRCxJQUFJQyxJQUFKLElBQVlFLEtBQVo7QUFBaEQsRUFDQSxPQUFPRCxTQUFTSyxRQUFRQyxHQUFSLEVBQWhCO0FBQStCLE1BQUksQ0FBQ1IsSUFBSUUsTUFBSixDQUFMLEVBQWtCRixJQUFJRSxNQUFKLElBQWNFLEtBQWQ7QUFBakQ7QUFDQSxDQVhELEVBV0csT0FBT0ssTUFBUCxLQUFrQixXQUFsQixlQUF1Q0EsTUFYMUM7O0FBYUEsQ0FBQyxZQUFXO0FBQ1IsVUFBU0MsQ0FBVCxDQUFXQSxDQUFYLEVBQWNDLENBQWQsRUFBaUI7QUFDYixNQUFJQyxJQUFJLGtGQUFrRkYsSUFBSSxvQkFBSixHQUEyQixFQUE3RyxJQUFtSCxTQUFuSCxHQUErSEMsQ0FBL0gsR0FBbUksR0FBM0k7QUFDQSxTQUFPQyxDQUFQO0FBQ0g7O0FBRUosS0FBSUMsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsR0FBa0NDLE9BQWxDLENBQTBDLFFBQTFDLElBQXNELENBQUMsQ0FBM0QsRUFBOEQ7QUFDN0RqQixVQUFRa0IsR0FBUixDQUFZLHdEQUFaLEVBQXNFUCxFQUFFLENBQUMsQ0FBSCxFQUFNLE1BQU4sQ0FBdEUsRUFBcUZBLEVBQUUsQ0FBQyxDQUFILEVBQU0sU0FBTixDQUFyRixFQUF1R0EsRUFBRSxDQUFDLENBQUgsRUFBTSxNQUFOLENBQXZHLEVBQXNIQSxFQUFFLENBQUMsQ0FBSCxFQUFNLFNBQU4sQ0FBdEgsRUFBd0lBLEVBQUUsQ0FBQyxDQUFILEVBQU0sU0FBTixDQUF4SSxFQUEwSkEsRUFBRSxDQUFDLENBQUgsRUFBTSxNQUFOLENBQTFKO0FBQ0EsRUFGRCxNQUdLO0FBQ0pYLFVBQVFrQixHQUFSLENBQVksbUNBQVo7QUFDQTtBQUNELENBWkEsRUFBRCIsImZpbGUiOiJfY29uc29sZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihnbG9iYWwpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRnbG9iYWwuY29uc29sZSA9IGdsb2JhbC5jb25zb2xlIHx8IHt9O1xuXHR2YXIgY29uID0gZ2xvYmFsLmNvbnNvbGUsXG5cdFx0cHJvcCwgbWV0aG9kLFxuXHRcdGVtcHR5ID0ge30sXG5cdFx0ZHVtbXkgPSBmdW5jdGlvbigpIHt9LFxuXHRcdHByb3BlcnRpZXMgPSAnbWVtb3J5Jy5zcGxpdCgnLCcpLFxuXHRcdG1ldGhvZHMgPSAoJ2Fzc2VydCxjbGVhcixjb3VudCxkZWJ1ZyxkaXIsZGlyeG1sLGVycm9yLGV4Y2VwdGlvbixncm91cCxncm91cENvbGxhcHNlZCxncm91cEVuZCxpbmZvLGxvZyxtYXJrVGltZWxpbmUscHJvZmlsZSxwcm9maWxlcyxwcm9maWxlRW5kLHNob3csdGFibGUsdGltZSx0aW1lRW5kLHRpbWVsaW5lLHRpbWVsaW5lRW5kLHRpbWVTdGFtcCx0cmFjZSx3YXJuJykuc3BsaXQoJywnKTtcblx0d2hpbGUgKHByb3AgPSBwcm9wZXJ0aWVzLnBvcCgpKSBpZiAoIWNvbltwcm9wXSkgY29uW3Byb3BdID0gZW1wdHk7XG5cdHdoaWxlIChtZXRob2QgPSBtZXRob2RzLnBvcCgpKSBpZiAoIWNvblttZXRob2RdKSBjb25bbWV0aG9kXSA9IGR1bW15O1xufSkodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93KTtcblxuIWZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGUoZSwgdCkge1xuICAgICAgICB2YXIgbiA9ICdmb250LWZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO2ZvbnQtc2l6ZTogMTRweDsnICsgKGUgPyBcImZvbnQtd2VpZ2h0OiBib2xkO1wiIDogXCJcIikgKyBcImNvbG9yOiBcIiArIHQgKyBcIjtcIjtcbiAgICAgICAgcmV0dXJuIG5cbiAgICB9XG5cdFxuXHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJjaHJvbWVcIikgPiAtMSkge1xuXHRcdGNvbnNvbGUubG9nKFwiJWPimaUgJWPinLAgJWNDRUxFQlJPLkNNUyAlY+KcsCAlYyBodHRwOi8vY21zLmNlbGVicm8ucnUgJWPimaVcIiwgZSghMCwgXCIjZjAwXCIpLCBlKCEwLCBcIiNhZjU1ZTJcIiksIGUoITAsIFwiIzc3N1wiKSwgZSghMCwgXCIjYWY1NWUyXCIpLCBlKCEwLCBcIiM1NTdkZTJcIiksIGUoITAsIFwiI2YwMFwiKSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Y29uc29sZS5sb2coJ2NlbGVicm8uY21zIGh0dHA6Ly9jbXMuY2VsZWJyby5ydScpXG5cdH1cbn0oKTsiXX0=

'use strict';

var cp = function ($) {
    var data = [];

    var notify_timeout, _notify;

    return {
        addTemplate: function addTemplate(e) {
            $('#addtemplate').find('input').attr('disabled', false);
            $('#addtemplate').toggle();
        },
        addTemplateFile: function addTemplateFile(tid) {
            var name = $('#template_name').val(),
                file = $('#template_file').val();

            $.ajax({
                url: '/' + ADMIN_DIR + '/ajax/structure/',
                type: "post",
                data: {
                    act: "ajaxAddTemplate",
                    name: name,
                    file: file
                },
                success: function success(response) {
                    if (response.length) {
                        var select = [];

                        for (var x in response) {
                            var _data = response[x];
                            var selected = tid == _data.id ? ' selected' : '';

                            select.push('<option value="' + _data.id + '"' + selected + '>' + _data.name + '</option>');
                        }

                        $('#select_field').html('<select name="stc_tid" id="templates_list">' + select.join('') + '</select>');
                        selectize('#templates_list');
                    }

                    $('#addtemplate').find('input').attr('disabled', true);
                    $('#addtemplate').hide();
                },
                dataType: "JSON"
            });
        },


        dropdown: function dropdown() {
            $('.trigger-dropdown').on('click', function () {
                var dd = $(this).data('toggle');
                $('#dropdown-' + dd).toggle();
            });
        },

        cleditor: function cleditor() {
            if (typeof jQuery.cleditor !== 'undefined') {
                $(".redactor_cleditor").cleditor();
            }
        },

        notify: function notify(text, status) {
            clearTimeout(notify_timeout);

            if (!$('body').find('.notify-message').length) {
                _notify = $('<div class="notify notify-message">' + text + '</div>');

                $('body').append(_notify);

                setTimeout(function () {
                    _notify.addClass('animate');
                }, 10);
            }

            notify_timeout = setTimeout(function () {

                _notify.removeClass('animate');

                setTimeout(function () {

                    _notify.remove();
                }, 300);
            }, 2500);
        },

        fileChange: function fileChange(element) {
            var filename = element.value;

            if (filename.lastIndexOf('\\')) {
                var i = filename.lastIndexOf('\\') + 1;
            } else {
                var i = filename.lastIndexOf('/') + 1;
            }
            filename = filename.slice(i);

            $(element).closest('.file--upload').find('.file--upload-placehoder').html(filename);
        },

        binding: function binding(name, element) {
            $('input[name="' + name + '"]').on('keyup', function () {
                if (this.value != '') {
                    $('input[name="' + element + '"]').val(transliterate(this.value, URL_TRANSLATE));
                }
            });
        },

        saveSettings: function saveSettings(id, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var arr = {},
                block = '#settings-container-toggle-' + id;

            $(block).find('input, select').each(function () {
                var type = $(this).attr('type'),
                    name = $(this).attr('name'),
                    value = $(this).val();

                if (typeof name !== 'undefined') {
                    if (type !== 'radio' && type !== 'checkbox' || $(this).is(':checked') === true) {
                        name = name.replace('SETTINGS_', '');
                        arr[name] = value;
                    }
                }
            });

            $.post('/' + ADMIN_DIR + '/structure/saveSettings/', { 'arr': arr }, function (data) {

                if (data.result == 1) {
                    cp.notify('Сохранено', 'success');
                }
            }, 'JSON');

            return !1;
        },

        removeSettings: function removeSettings(id, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            if (cp.dialog("Вы дейсвительно хотите удалить блок?")) {
                $.post('/' + ADMIN_DIR + '/structure/removeSettings/', { 'id': id }, function (data) {
                    if (data.result == 1) {
                        $('#settings-' + id).remove();
                        $('#breadcrumbs-' + id).remove();
                        $('#container-' + id).remove();
                        $('#emptysplash-' + id).remove();
                    }
                }, 'JSON');
            }

            return !1;
        },

        arrLength: function arrLength(obj) {
            var i = 0;
            for (var x in obj) {
                if (obj.hasOwnProperty(x)) i++;
            }return i;
        },

        loadSettings: function loadSettings(val, id, item) {
            var arr = { 1: 'type', 2: 'item', 3: 'mode' },
                prev = '',
                action = '',
                mode = '',
                lvl = 1,
                next,
                block = 'cnt_' + item + '-' + id;

            if (item == 'type') {
                lvl = 1;
                action = val;
            } else if (item == 'item') {
                lvl = 2;
                action = $('#cnt_' + arr[1] + '-' + id).find('option:selected').val();
                mode = val;
            } else if (item == 'mode') {
                lvl = 3;
                action = $('#cnt_' + arr[2] + '-' + id).find('option:selected').val();
                mode = val;
            }

            next = lvl + 1;

            for (var xx = next; xx <= 4; xx++) {
                if ($('#block-lvl' + xx + '-' + id).length > 0) {
                    $('#block-lvl' + xx + '-' + id).remove();
                }
            }

            $.post('/' + ADMIN_DIR + '/structure/loadSettings/', { 'action': action, 'mode': mode }, function (data) {
                if (typeof data !== 'undefined' && cp.arrLength(data) > 0) {
                    var select = [],
                        hash = 'cnt_' + arr[next] + '-' + id,
                        block = 'cnt_item-' + id + '-type';

                    select.push('<div class="block-settings-select-block lvl' + next + '" id="block-lvl' + next + '-' + id + '">');
                    select.push('<select name="SETTINGS_' + arr[next] + '_' + id + '" id="' + hash + '" onchange="cp.loadSettings(this.value, ' + id + ', \'' + arr[next] + '\');">');

                    select.push(' <option value="" selected>Выбрать</option>');

                    for (var system in data) {
                        select.push('<option value="' + system + '">' + data[system] + '</option>');
                    }

                    select.push('</select>');
                    select.push('</div>');

                    $('#block-settings-select-block-' + id).append(select.join(''));

                    selectize('#' + hash);
                }
            }, 'JSON');
        },

        toggleModule: function toggleModule(element, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var path = $(element).attr('href');

            $(element).append('<i class="loading"></i>');

            $.post(path, function (data) {
                if (data.status === true) {
                    if ($(element).hasClass('icon-eye-off')) {
                        $(element).removeClass('icon-eye-off').addClass('icon-eye').html('');
                    } else {
                        $(element).removeClass('icon-eye').addClass('icon-eye-off').html('');
                    }
                }
            }, 'JSON');

            return !1;
        },

        toggleSettings: function toggleSettings(element, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var href = $(element).attr('href').substr(1);

            $(element).toggleClass('block-settings-open');
            $("#" + href).toggle();

            return !1;
        },

        tableToggle: function tableToggle(id, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var hash = window.location.pathname.replace(/\//g, "|"),
                PATH_HASH = md5(hash);
            var cookie_toggle = id + '_toogle_' + PATH_HASH;

            if (typeof e == 'undefined') {
                if (typeof $.cookie(cookie_toggle) == 'undefined') {
                    $("#" + id + " th .table_hdr").removeClass('table_u').addClass('table_d');
                    $("#" + id + " tr:not(.th)").hide();
                }
            } else {
                $("#" + id + " th .table_hdr").toggleClass('table_u').toggleClass('table_d');
                $("#" + id + " tr:not(.th)").toggle();

                if ($("#" + id + " tr:not(.th)").is(':visible')) {
                    $.cookie(cookie_toggle, 'show', { expires: 30, path: '/' });
                } else {
                    $.removeCookie(cookie_toggle, { path: '/' });
                }
            }

            return !1;
        },

        tableToggleList: function tableToggleList() {
            var hash = window.location.pathname.replace(/\//g, "|"),
                PATH_HASH = md5(hash);

            if ($('.table-toggle-trigger').length > 0) {
                $('.table-toggle-trigger').each(function () {
                    var id = this.id,
                        cookie_toggle = id + '_toogle_' + PATH_HASH;

                    if (typeof $.cookie(cookie_toggle) !== 'undefined') {
                        $("#" + id + " th .table_hdr").addClass('table_u').removeClass('table_d');
                        $("#" + id + " tr:not(.th)").show();
                    } else {
                        $("#" + id + " th .table_hdr").removeClass('table_u').addClass('table_d');
                        $("#" + id + " tr:not(.th)").hide();
                    }
                });
            }
        },

        addBlock: function addBlock(parent, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var order = 10;

            if ($('#cont_data').find('.block-settings-order-input').length) {
                var temp = [];
                $('#cont_data').find('.block-settings-order-input').each(function () {
                    temp.push($(this).find('input').val());
                });

                if (temp.length) {
                    order = temp.max() + 10;
                }
            }

            $.post('/' + ADMIN_DIR + '/structure/getNewId/', { 'parent': parent, 'order': order }, function (newitem) {

                var row = ['<tr id="settings-' + newitem + '">', '<td class="settings-row">', '<div class="settings-container clearfix">', '<a href="#" onclick="return cp.removeSettings(' + newitem + ', event);" class="block-settings-link block-settings-remove"><i class="icon icon-delete"></i>Удалить блок</a>', '<a href="#settings-container-toggle-' + newitem + '" onclick="return cp.toggleSettings(this, event);" class="block-settings-link block-settings-title block-settings-open">', '<span class="block-settings-title-drop"><i class="icon icon-cog"></i></span>', '<span class="block-settings-title-text">Настройки блока</span>', '</a>', '<div class="settings-container-toggle opened" id="settings-container-toggle-' + newitem + '">', '<div class="block-settings-ln block-settings-visible clearfix">', '<div class="option-group option-combo option-simple">', '<label><input type="radio" name="SETTINGS_visible_' + newitem + '" value="1" checked="checked"><span class="option">Активен</span></label>', '<label class="disallow"><input type="radio" name="SETTINGS_visible_' + newitem + '" value="0"><span class="option">Не активен</span></label>', '</div>', '</div>', '<div class="block-settings-ln block-settings-order clearfix">', '<div class="block-settings-order-input">', '<input name="SETTINGS_ord_' + newitem + '" value="' + order + '" placeholder="Порядок">', '</div>', '</div>', '<div class="block-settings-ln block-settings-select clearfix" id="block-settings-select-block-' + newitem + '">', '<div class="block-settings-select-block lvl1" id="block-lvl1-' + newitem + '">', '<select name="SETTINGS_type_' + newitem + '" id="cnt_type-' + newitem + '" onchange="cp.loadSettings(this.value, ' + newitem + ', \'type\');"><option value="" selected>Выбрать</option><option value="redactor">Визуальный редактор</option><option value="editor">Редактор кода</option><option value="module">Модуль</option><option value="zone">Зона</option><option value="block">Блок</option><option value="banner">Баннер</option><option value="search">Поиск</option></select>', '</div>', '</div>', '<div class="block-settings-ln block-settings-system clearfix">', '<div class="block-settings-system-input">', '<input name="SETTINGS_system_' + newitem + '" value="" placeholder="Системное имя">', '</div>', '</div>', '<div class="block-settings-buttons clearfix">', '<a href="#" onclick="return cp.saveSettings(' + newitem + ', event);" class="button button-purple block-settings-save"><i class="icon icon-check-square"></i>Сохранить</a>', '</div>', '</div>', '</div>', '</td>', '</tr>'];

                $('#cont_data').find('tbody').append(row.join(''));

                selectize();
            });

            return !1;
        },

        dialog: function dialog(text) {
            return confirm(text);
        },

        indexation: function indexation(e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            if (cp.dialog('Начать индексацию?')) {
                $('#indexation-good').hide();
                $('#loader').fadeIn();

                var iurl = '/' + ADMIN_DIR + '/search/indexer/';

                $.ajax({
                    url: iurl,
                    type: 'get',
                    data: {
                        start: 0
                    },
                    success: function success(data) {
                        if (data != "good") {
                            $.get(iurl, {
                                start: data
                            });
                        } else {
                            $("#loader").fadeOut();
                            $("#indexation-good").show();
                        }
                    },
                    error: function error(response) {}
                });
            }
        },

        push: function push(item) {
            data.push(item);
        },

        pop: function pop() {
            return data.pop();
        },

        length: function length() {
            return data.length;
        }
    };
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jcC5qcyJdLCJuYW1lcyI6WyJjcCIsIiQiLCJkYXRhIiwibm90aWZ5X3RpbWVvdXQiLCJub3RpZnkiLCJhZGRUZW1wbGF0ZSIsImUiLCJmaW5kIiwiYXR0ciIsInRvZ2dsZSIsImFkZFRlbXBsYXRlRmlsZSIsInRpZCIsIm5hbWUiLCJ2YWwiLCJmaWxlIiwiYWpheCIsInVybCIsIkFETUlOX0RJUiIsInR5cGUiLCJhY3QiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJsZW5ndGgiLCJzZWxlY3QiLCJ4Iiwic2VsZWN0ZWQiLCJpZCIsInB1c2giLCJodG1sIiwiam9pbiIsInNlbGVjdGl6ZSIsImhpZGUiLCJkYXRhVHlwZSIsImRyb3Bkb3duIiwib24iLCJkZCIsImNsZWRpdG9yIiwialF1ZXJ5IiwidGV4dCIsInN0YXR1cyIsImNsZWFyVGltZW91dCIsImFwcGVuZCIsInNldFRpbWVvdXQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVtb3ZlIiwiZmlsZUNoYW5nZSIsImVsZW1lbnQiLCJmaWxlbmFtZSIsInZhbHVlIiwibGFzdEluZGV4T2YiLCJpIiwic2xpY2UiLCJjbG9zZXN0IiwiYmluZGluZyIsInRyYW5zbGl0ZXJhdGUiLCJVUkxfVFJBTlNMQVRFIiwic2F2ZVNldHRpbmdzIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImFyciIsImJsb2NrIiwiZWFjaCIsImlzIiwicmVwbGFjZSIsInBvc3QiLCJyZXN1bHQiLCJyZW1vdmVTZXR0aW5ncyIsImRpYWxvZyIsImFyckxlbmd0aCIsIm9iaiIsImhhc093blByb3BlcnR5IiwibG9hZFNldHRpbmdzIiwiaXRlbSIsInByZXYiLCJhY3Rpb24iLCJtb2RlIiwibHZsIiwibmV4dCIsInh4IiwiaGFzaCIsInN5c3RlbSIsInRvZ2dsZU1vZHVsZSIsInBhdGgiLCJoYXNDbGFzcyIsInRvZ2dsZVNldHRpbmdzIiwiaHJlZiIsInN1YnN0ciIsInRvZ2dsZUNsYXNzIiwidGFibGVUb2dnbGUiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiUEFUSF9IQVNIIiwibWQ1IiwiY29va2llX3RvZ2dsZSIsImNvb2tpZSIsImV4cGlyZXMiLCJyZW1vdmVDb29raWUiLCJ0YWJsZVRvZ2dsZUxpc3QiLCJzaG93IiwiYWRkQmxvY2siLCJwYXJlbnQiLCJvcmRlciIsInRlbXAiLCJtYXgiLCJuZXdpdGVtIiwicm93IiwiY29uZmlybSIsImluZGV4YXRpb24iLCJmYWRlSW4iLCJpdXJsIiwic3RhcnQiLCJnZXQiLCJmYWRlT3V0IiwiZXJyb3IiLCJwb3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBTSxVQUFTQyxDQUFULEVBQVk7QUFDcEIsUUFBSUMsT0FBTyxFQUFYOztBQUVBLFFBQUlDLGNBQUosRUFBb0JDLE9BQXBCOztBQUVBLFdBQU87QUFFSEMsbUJBRkcsdUJBRVVDLENBRlYsRUFFYTtBQUNaTCxjQUFFLGNBQUYsRUFBa0JNLElBQWxCLENBQXVCLE9BQXZCLEVBQWdDQyxJQUFoQyxDQUFxQyxVQUFyQyxFQUFpRCxLQUFqRDtBQUNBUCxjQUFFLGNBQUYsRUFBa0JRLE1BQWxCO0FBQ0gsU0FMRTtBQU9IQyx1QkFQRywyQkFPY0MsR0FQZCxFQU9tQjtBQUNsQixnQkFBSUMsT0FBT1gsRUFBRSxnQkFBRixFQUFvQlksR0FBcEIsRUFBWDtBQUFBLGdCQUNJQyxPQUFPYixFQUFFLGdCQUFGLEVBQW9CWSxHQUFwQixFQURYOztBQUdBWixjQUFFYyxJQUFGLENBQU87QUFDSEMscUJBQUssTUFBTUMsU0FBTixHQUFrQixrQkFEcEI7QUFFSEMsc0JBQU0sTUFGSDtBQUdIaEIsc0JBQU07QUFDRmlCLHlCQUFLLGlCQURIO0FBRUZQLDBCQUFNQSxJQUZKO0FBR0ZFLDBCQUFNQTtBQUhKLGlCQUhIO0FBUUhNLHlCQUFTLGlCQUFTQyxRQUFULEVBQW1CO0FBQ3hCLHdCQUFJQSxTQUFTQyxNQUFiLEVBQXFCO0FBQ2pCLDRCQUFNQyxTQUFTLEVBQWY7O0FBRUEsNkJBQUksSUFBSUMsQ0FBUixJQUFhSCxR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VThDLElBQVY7QUFDSCxTQTVjRTs7QUE4Y0gyQyxhQUFLLGVBQ0w7QUFDSSxtQkFBT2xILEtBQUtrSCxHQUFMLEVBQVA7QUFDSCxTQWpkRTs7QUFtZEg5RixnQkFBUSxrQkFBVztBQUNmLG1CQUFPcEIsS0FBS29CLE1BQVo7QUFDSDtBQXJkRSxLQUFQO0FBdWRILENBNWRXLENBNGRWZSxNQTVkVSxDQUFaIiwiZmlsZSI6Il9jcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNwID0gKGZ1bmN0aW9uKCQpIHtcbiAgICB2YXIgZGF0YSA9IFtdO1xuXG4gICAgdmFyIG5vdGlmeV90aW1lb3V0LCBub3RpZnk7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIGFkZFRlbXBsYXRlIChlKSB7XG4gICAgICAgICAgICAkKCcjYWRkdGVtcGxhdGUnKS5maW5kKCdpbnB1dCcpLmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnI2FkZHRlbXBsYXRlJykudG9nZ2xlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkVGVtcGxhdGVGaWxlICh0aWQpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCgnI3RlbXBsYXRlX25hbWUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBmaWxlID0gJCgnI3RlbXBsYXRlX2ZpbGUnKS52YWwoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvYWpheC9zdHJ1Y3R1cmUvJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdDogXCJhamF4QWRkVGVtcGxhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHggaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2VbeF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSAodGlkID09IGRhdGEuaWQpID8gJyBzZWxlY3RlZCcgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPG9wdGlvbiB2YWx1ZT1cIicrZGF0YS5pZCsnXCInK3NlbGVjdGVkKyc+JytkYXRhLm5hbWUrJzwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzZWxlY3RfZmllbGQnKS5odG1sKCc8c2VsZWN0IG5hbWU9XCJzdGNfdGlkXCIgaWQ9XCJ0ZW1wbGF0ZXNfbGlzdFwiPicrc2VsZWN0LmpvaW4oJycpKyc8L3NlbGVjdD4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGl6ZSgnI3RlbXBsYXRlc19saXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKCcjYWRkdGVtcGxhdGUnKS5maW5kKCdpbnB1dCcpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNhZGR0ZW1wbGF0ZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZHJvcGRvd246IGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgICQoJy50cmlnZ2VyLWRyb3Bkb3duJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgZGQgPSAkKHRoaXMpLmRhdGEoJ3RvZ2dsZScpO1xuICAgICAgICAgICAgICAgICQoJyNkcm9wZG93bi0nICsgZGQpLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlZGl0b3I6IGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoalF1ZXJ5LmNsZWRpdG9yKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJChcIi5yZWRhY3Rvcl9jbGVkaXRvclwiKS5jbGVkaXRvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKHRleHQsIHN0YXR1cylcbiAgICAgICAge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KG5vdGlmeV90aW1lb3V0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCEkKCdib2R5JykuZmluZCgnLm5vdGlmeS1tZXNzYWdlJykubGVuZ3RoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5vdGlmeSA9ICQoJzxkaXYgY2xhc3M9XCJub3RpZnkgbm90aWZ5LW1lc3NhZ2VcIj4nICsgdGV4dCArICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQobm90aWZ5KTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgbm90aWZ5LmFkZENsYXNzKCdhbmltYXRlJyk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub3RpZnlfdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub3RpZnkucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICBub3RpZnkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0sIDMwMCk7XG5cbiAgICAgICAgICAgIH0sIDI1MDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbGVDaGFuZ2U6IGZ1bmN0aW9uKGVsZW1lbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGVsZW1lbnQudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChmaWxlbmFtZS5sYXN0SW5kZXhPZignXFxcXCcpKXtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IGZpbGVuYW1lLmxhc3RJbmRleE9mKCdcXFxcJykrMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLycpKzE7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUuc2xpY2UoaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLmZpbGUtLXVwbG9hZCcpLmZpbmQoJy5maWxlLS11cGxvYWQtcGxhY2Vob2RlcicpLmh0bWwoZmlsZW5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgYmluZGluZzogZnVuY3Rpb24obmFtZSwgZWxlbWVudClcbiAgICAgICAge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgICAgICBpZiAodGhpcy52YWx1ZSAhPSAnJylcblx0XHQgICAgICAgIHtcblx0XHQgICAgICAgIFx0JCgnaW5wdXRbbmFtZT1cIicgKyBlbGVtZW50ICsgJ1wiXScpLnZhbCh0cmFuc2xpdGVyYXRlKHRoaXMudmFsdWUsIFVSTF9UUkFOU0xBVEUpKTtcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2F2ZVNldHRpbmdzOiBmdW5jdGlvbihpZCwgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodHlwZW9mIGUgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gITE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhcnIgPSB7fSwgYmxvY2sgPSAnI3NldHRpbmdzLWNvbnRhaW5lci10b2dnbGUtJyArIGlkO1xuXG4gICAgICAgICAgICAkKGJsb2NrKS5maW5kKCdpbnB1dCwgc2VsZWN0JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJCh0aGlzKS5hdHRyKCd0eXBlJyksIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKSwgdmFsdWUgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihuYW1lKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlICE9PSAncmFkaW8nICYmIHR5cGUgIT09ICdjaGVja2JveCcgfHwgJCh0aGlzKS5pcygnOmNoZWNrZWQnKSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgnU0VUVElOR1NfJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJC5wb3N0KCcvJyArIEFETUlOX0RJUiArICcvc3RydWN0dXJlL3NhdmVTZXR0aW5ncy8nLCB7ICdhcnInOiBhcnIgfSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoZGF0YS5yZXN1bHQgPT0gMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNwLm5vdGlmeSgn0KHQvtGF0YDQsNC90LXQvdC+JywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sICdKU09OJyk7XG5cbiAgICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVTZXR0aW5nczogZnVuY3Rpb24oaWQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3AuZGlhbG9nKFwi0JLRiyDQtNC10LnRgdCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINCx0LvQvtC6P1wiKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkLnBvc3QoJy8nICsgQURNSU5fRElSICsgJy9zdHJ1Y3R1cmUvcmVtb3ZlU2V0dGluZ3MvJywgeyAnaWQnOiBpZCB9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEucmVzdWx0ID09IDEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzZXR0aW5ncy0nK2lkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNicmVhZGNydW1icy0nK2lkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjb250YWluZXItJytpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjZW1wdHlzcGxhc2gtJytpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAnSlNPTicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyTGVuZ3RoOiBmdW5jdGlvbihvYmopXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBpPTA7XG4gICAgICAgICAgICBmb3IgKHZhciB4IGluIG9iaikgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eSh4KSkgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZFNldHRpbmdzOiBmdW5jdGlvbih2YWwsIGlkLCBpdGVtKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgYXJyID0geyAxOiAndHlwZScsIDI6ICdpdGVtJywgMzogJ21vZGUnIH0sIHByZXYgPSAnJywgYWN0aW9uID0gJycsIG1vZGUgPSAnJywgbHZsID0gMSwgbmV4dCwgYmxvY2sgPSAnY250XycgKyBpdGVtICsgJy0nICsgaWQ7XG5cbiAgICAgICAgICAgIGlmKGl0ZW0gPT0gJ3R5cGUnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGx2bCA9IDE7XG4gICAgICAgICAgICAgICAgYWN0aW9uID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpdGVtID09ICdpdGVtJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsdmwgPSAyO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICQoJyNjbnRfJyArIGFyclsxXSArICctJyArIGlkKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBtb2RlID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpdGVtID09ICdtb2RlJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsdmwgPSAzO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICQoJyNjbnRfJyArIGFyclsyXSArICctJyArIGlkKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBtb2RlID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXh0ID0gbHZsICsgMTtcblxuICAgICAgICAgICAgZm9yKHZhciB4eCA9IG5leHQ7IHh4IDw9IDQ7IHh4ICsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCQoJyNibG9jay1sdmwnICsgeHggKyAnLScgKyBpZCkubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNibG9jay1sdmwnICsgeHggKyAnLScgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLnBvc3QoJy8nICsgQURNSU5fRElSICsgJy9zdHJ1Y3R1cmUvbG9hZFNldHRpbmdzLycsIHsgJ2FjdGlvbic6IGFjdGlvbiwgJ21vZGUnOiBtb2RlIH0sIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YoZGF0YSkgIT09ICd1bmRlZmluZWQnICYmIGNwLmFyckxlbmd0aChkYXRhKSA+IDApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gW10sIGhhc2ggPSAnY250XycgKyBhcnJbbmV4dF0gKyAnLScgKyBpZCwgYmxvY2sgPSAnY250X2l0ZW0tJyArIGlkICsgJy10eXBlJztcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKCc8ZGl2IGNsYXNzPVwiYmxvY2stc2V0dGluZ3Mtc2VsZWN0LWJsb2NrIGx2bCcgKyBuZXh0ICsgJ1wiIGlkPVwiYmxvY2stbHZsJyArIG5leHQgKyAnLScgKyBpZCArICdcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnB1c2goJzxzZWxlY3QgbmFtZT1cIlNFVFRJTkdTXycgKyBhcnJbbmV4dF0gKyAnXycgKyBpZCArICdcIiBpZD1cIicgKyBoYXNoICsgJ1wiIG9uY2hhbmdlPVwiY3AubG9hZFNldHRpbmdzKHRoaXMudmFsdWUsICcgKyBpZCArICcsIFxcJycgKyBhcnJbbmV4dF0gKyAnXFwnKTtcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKCcgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkPtCS0YvQsdGA0LDRgtGMPC9vcHRpb24+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3lzdGVtIGluIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKCc8b3B0aW9uIHZhbHVlPVwiJyArIHN5c3RlbSArICdcIj4nICsgZGF0YVtzeXN0ZW1dICsgJzwvb3B0aW9uPicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnB1c2goJzwvc2VsZWN0PicpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkKCcjYmxvY2stc2V0dGluZ3Mtc2VsZWN0LWJsb2NrLScgKyBpZCkuYXBwZW5kKHNlbGVjdC5qb2luKCcnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aXplKCcjJytoYXNoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sICdKU09OJyk7XG4gICAgICAgICAgIFxuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZU1vZHVsZTogZnVuY3Rpb24oZWxlbWVudCwgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodHlwZW9mIGUgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gITE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXRoID0gJChlbGVtZW50KS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKCc8aSBjbGFzcz1cImxvYWRpbmdcIj48L2k+Jyk7XG5cbiAgICAgICAgICAgICQucG9zdChwYXRoLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSB0cnVlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoZWxlbWVudCkuaGFzQ2xhc3MoJ2ljb24tZXllLW9mZicpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdpY29uLWV5ZS1vZmYnKS5hZGRDbGFzcygnaWNvbi1leWUnKS5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2ljb24tZXllJykuYWRkQ2xhc3MoJ2ljb24tZXllLW9mZicpLmh0bWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgJ0pTT04nKTtcblxuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZVNldHRpbmdzOiBmdW5jdGlvbihlbGVtZW50LCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKGVsZW1lbnQpLmF0dHIoJ2hyZWYnKS5zdWJzdHIoMSk7XG5cbiAgICAgICAgICAgICQoZWxlbWVudCkudG9nZ2xlQ2xhc3MoJ2Jsb2NrLXNldHRpbmdzLW9wZW4nKTtcbiAgICAgICAgICAgICQoXCIjXCIraHJlZikudG9nZ2xlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgfSxcblxuICAgICAgICB0YWJsZVRvZ2dsZTogZnVuY3Rpb24oaWQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgXCJ8XCIpLCBQQVRIX0hBU0ggPSBtZDUoaGFzaCk7XG4gICAgICAgICAgICB2YXIgY29va2llX3RvZ2dsZSA9IGlkICsgJ190b29nbGVfJyArIFBBVEhfSEFTSDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodHlwZW9mKGUpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoJC5jb29raWUoY29va2llX3RvZ2dsZSkpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0aCAudGFibGVfaGRyXCIpLnJlbW92ZUNsYXNzKCd0YWJsZV91JykuYWRkQ2xhc3MoJ3RhYmxlX2QnKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0cjpub3QoLnRoKVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoXCIjXCIraWQrXCIgdGggLnRhYmxlX2hkclwiKS50b2dnbGVDbGFzcygndGFibGVfdScpLnRvZ2dsZUNsYXNzKCd0YWJsZV9kJyk7XG4gICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0cjpub3QoLnRoKVwiKS50b2dnbGUoKTsgICBcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCQoXCIjXCIraWQrXCIgdHI6bm90KC50aClcIikuaXMoJzp2aXNpYmxlJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZShjb29raWVfdG9nZ2xlLCAnc2hvdycsIHsgZXhwaXJlczogMzAsIHBhdGg6ICcvJyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY29va2llX3RvZ2dsZSwgeyBwYXRoOiAnLycgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdGFibGVUb2dnbGVMaXN0OiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCBcInxcIiksIFBBVEhfSEFTSCA9IG1kNShoYXNoKTtcblxuICAgICAgICAgICAgaWYoJCgnLnRhYmxlLXRvZ2dsZS10cmlnZ2VyJykubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKCcudGFibGUtdG9nZ2xlLXRyaWdnZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuaWQsIGNvb2tpZV90b2dnbGUgPSBpZCArICdfdG9vZ2xlXycgKyBQQVRIX0hBU0g7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoJC5jb29raWUoY29va2llX3RvZ2dsZSkpICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0aCAudGFibGVfaGRyXCIpLmFkZENsYXNzKCd0YWJsZV91JykucmVtb3ZlQ2xhc3MoJ3RhYmxlX2QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIraWQrXCIgdHI6bm90KC50aClcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0aCAudGFibGVfaGRyXCIpLnJlbW92ZUNsYXNzKCd0YWJsZV91JykuYWRkQ2xhc3MoJ3RhYmxlX2QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIraWQrXCIgdHI6bm90KC50aClcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkQmxvY2s6IGZ1bmN0aW9uIChwYXJlbnQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb3JkZXIgPSAxMDtcblxuICAgICAgICAgICAgaWYoJCgnI2NvbnRfZGF0YScpLmZpbmQoJy5ibG9jay1zZXR0aW5ncy1vcmRlci1pbnB1dCcpLmxlbmd0aClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFtdO1xuICAgICAgICAgICAgICAgICQoJyNjb250X2RhdGEnKS5maW5kKCcuYmxvY2stc2V0dGluZ3Mtb3JkZXItaW5wdXQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaCgkKHRoaXMpLmZpbmQoJ2lucHV0JykudmFsKCkpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpZih0ZW1wLmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyID0gdGVtcC5tYXgoKSArIDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5wb3N0KCcvJyArIEFETUlOX0RJUiArICcvc3RydWN0dXJlL2dldE5ld0lkLycsIHsgJ3BhcmVudCc6IHBhcmVudCwgJ29yZGVyJzogb3JkZXIgfSwgZnVuY3Rpb24obmV3aXRlbSkge1xuICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gW1xuICAgICAgICAgICAgICAgICAgICAnPHRyIGlkPVwic2V0dGluZ3MtJyArIG5ld2l0ZW0gKyAnXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJzZXR0aW5ncy1yb3dcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2V0dGluZ3MtY29udGFpbmVyIGNsZWFyZml4XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgb25jbGljaz1cInJldHVybiBjcC5yZW1vdmVTZXR0aW5ncygnICsgbmV3aXRlbSArICcsIGV2ZW50KTtcIiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWxpbmsgYmxvY2stc2V0dGluZ3MtcmVtb3ZlXCI+PGkgY2xhc3M9XCJpY29uIGljb24tZGVsZXRlXCI+PC9pPtCj0LTQsNC70LjRgtGMINCx0LvQvtC6PC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI3NldHRpbmdzLWNvbnRhaW5lci10b2dnbGUtJyArIG5ld2l0ZW0gKyAnXCIgb25jbGljaz1cInJldHVybiBjcC50b2dnbGVTZXR0aW5ncyh0aGlzLCBldmVudCk7XCIgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1saW5rIGJsb2NrLXNldHRpbmdzLXRpdGxlIGJsb2NrLXNldHRpbmdzLW9wZW5cIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiYmxvY2stc2V0dGluZ3MtdGl0bGUtZHJvcFwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLWNvZ1wiPjwvaT48L3NwYW4+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLXRpdGxlLXRleHRcIj7QndCw0YHRgtGA0L7QudC60Lgg0LHQu9C+0LrQsDwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNldHRpbmdzLWNvbnRhaW5lci10b2dnbGUgb3BlbmVkXCIgaWQ9XCJzZXR0aW5ncy1jb250YWluZXItdG9nZ2xlLScgKyBuZXdpdGVtICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWxuIGJsb2NrLXNldHRpbmdzLXZpc2libGUgY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwib3B0aW9uLWdyb3VwIG9wdGlvbi1jb21ibyBvcHRpb24tc2ltcGxlXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxsYWJlbD48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIlNFVFRJTkdTX3Zpc2libGVfJyArIG5ld2l0ZW0gKyAnXCIgdmFsdWU9XCIxXCIgY2hlY2tlZD1cImNoZWNrZWRcIj48c3BhbiBjbGFzcz1cIm9wdGlvblwiPtCQ0LrRgtC40LLQtdC9PC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImRpc2FsbG93XCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJTRVRUSU5HU192aXNpYmxlXycgKyBuZXdpdGVtICsgJ1wiIHZhbHVlPVwiMFwiPjxzcGFuIGNsYXNzPVwib3B0aW9uXCI+0J3QtSDQsNC60YLQuNCy0LXQvTwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1sbiBibG9jay1zZXR0aW5ncy1vcmRlciBjbGVhcmZpeFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1vcmRlci1pbnB1dFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cIlNFVFRJTkdTX29yZF8nICsgbmV3aXRlbSArICdcIiB2YWx1ZT1cIicgKyBvcmRlciArICdcIiBwbGFjZWhvbGRlcj1cItCf0L7RgNGP0LTQvtC6XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWxuIGJsb2NrLXNldHRpbmdzLXNlbGVjdCBjbGVhcmZpeFwiIGlkPVwiYmxvY2stc2V0dGluZ3Mtc2VsZWN0LWJsb2NrLScgKyBuZXdpdGVtICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1zZWxlY3QtYmxvY2sgbHZsMVwiIGlkPVwiYmxvY2stbHZsMS0nICsgbmV3aXRlbSArICdcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNlbGVjdCBuYW1lPVwiU0VUVElOR1NfdHlwZV8nICsgbmV3aXRlbSArICdcIiBpZD1cImNudF90eXBlLScgKyBuZXdpdGVtICsgJ1wiIG9uY2hhbmdlPVwiY3AubG9hZFNldHRpbmdzKHRoaXMudmFsdWUsICcgKyBuZXdpdGVtICsgJywgXFwndHlwZVxcJyk7XCI+PG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkPtCS0YvQsdGA0LDRgtGMPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInJlZGFjdG9yXCI+0JLQuNC30YPQsNC70YzQvdGL0Lkg0YDQtdC00LDQutGC0L7RgDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJlZGl0b3JcIj7QoNC10LTQsNC60YLQvtGAINC60L7QtNCwPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cIm1vZHVsZVwiPtCc0L7QtNGD0LvRjDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJ6b25lXCI+0JfQvtC90LA8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwiYmxvY2tcIj7QkdC70L7Qujwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJiYW5uZXJcIj7QkdCw0L3QvdC10YA8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic2VhcmNoXCI+0J/QvtC40YHQujwvb3B0aW9uPjwvc2VsZWN0PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1sbiBibG9jay1zZXR0aW5ncy1zeXN0ZW0gY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYmxvY2stc2V0dGluZ3Mtc3lzdGVtLWlucHV0XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBuYW1lPVwiU0VUVElOR1Nfc3lzdGVtXycgKyBuZXdpdGVtICsgJ1wiIHZhbHVlPVwiXCIgcGxhY2Vob2xkZXI9XCLQodC40YHRgtC10LzQvdC+0LUg0LjQvNGPXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWJ1dHRvbnMgY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJyZXR1cm4gY3Auc2F2ZVNldHRpbmdzKCcgKyBuZXdpdGVtICsgJywgZXZlbnQpO1wiIGNsYXNzPVwiYnV0dG9uIGJ1dHRvbi1wdXJwbGUgYmxvY2stc2V0dGluZ3Mtc2F2ZVwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLWNoZWNrLXNxdWFyZVwiPjwvaT7QodC+0YXRgNCw0L3QuNGC0Yw8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPidcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgJCgnI2NvbnRfZGF0YScpLmZpbmQoJ3Rib2R5JykuYXBwZW5kKHJvdy5qb2luKCcnKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VsZWN0aXplKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpYWxvZzogZnVuY3Rpb24gKHRleHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maXJtKHRleHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluZGV4YXRpb246IGZ1bmN0aW9uIChlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY3AuZGlhbG9nKCfQndCw0YfQsNGC0Ywg0LjQvdC00LXQutGB0LDRhtC40Y4/JykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJCgnI2luZGV4YXRpb24tZ29vZCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCcjbG9hZGVyJykuZmFkZUluKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXVybCA9ICcvJyArIEFETUlOX0RJUiArICcvc2VhcmNoL2luZGV4ZXIvJztcblxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogaXVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICE9IFwiZ29vZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZ2V0KCBpdXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2xvYWRlclwiKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNpbmRleGF0aW9uLWdvb2RcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgIHt9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHVzaDogZnVuY3Rpb24gKGl0ZW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIHBvcDogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5wb3AoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfTtcbn0oalF1ZXJ5KSk7XG4iXX0=

'use strict';

;(function ($) {
	"use strict";

	$.fn.timeoutClass = function (classname, timeout) {
		timeout = timeout || 10;
		var that = this;
		setTimeout(function () {
			$(that).toggleClass(classname);
		}, timeout);
	};

	$.fn.extend({
		popover: function popover(options) {
			this.defaults = {};
			var settings = $.extend({}, this.defaults, options),
			    isopen = false,
			    scrollShift = 100,
			    popover = {},
			    $page = $('#page-wrapper'),
			    onOpenScrollTop,
			    $popover,
			    $target;

			popover.position = function (target) {
				var left = 0,
				    ww = $(window).width(),
				    top = 0;

				if ($(target).hasClass('trigger-popover')) {
					$target = $(target);
				} else {
					$target = $(target).closest('.trigger-popover');
				}

				left = $target.offset().left + $target.width();
				top = $target.offset().top + $target.height() + 8;

				return { 'left': left, 'top': top };
			};

			popover.hide = function (callback) {
				if ($('.popover.open').length) {
					$popover = $('.popover.open');
					$popover.removeClass('animate');

					setTimeout(function () {
						$popover.removeClass('open');

						if (typeof callback == 'function') {
							callback.apply();
						}
					}, 250);
				} else {
					if (typeof callback == 'function') {
						callback.apply();
					}
				}
			};

			$page.on('click', function (e) {
				if ((isopen || $('.popover.open').length) && !$(e.target).closest('.trigger-popover').length && !$(e.target).closest('.popover').length) {
					popover.hide();
				}
			});

			$(window).resize(function () {
				popover.hide();
			});

			$page.scroll(function () {
				if (isopen === true && (onOpenScrollTop + scrollShift < $page.scrollTop() || onOpenScrollTop - scrollShift > $page.scrollTop())) {
					popover.hide();
				}
			});

			return this.each(function () {
				$(this).on('click', function (e) {
					e.preventDefault();

					var block = $(this).data('popover'),
					    $popover;

					isopen = true;

					popover.hide(function () {

						if ($('#popover-' + block).length == 0) {
							$popover = $(template('tpl_' + block, {}));
							$page.append($popover);
						} else {
							$popover = $('#popover-' + block);
						}

						if (!$('#popover-' + block).hasClass('open')) {
							onOpenScrollTop = $page.scrollTop();

							$popover.css(popover.position(e.target));
							$popover.toggleClass('open').timeoutClass('animate');
						}
					});
				});
			});
		}
	});
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9wb3BvdmVyLmpzIl0sIm5hbWVzIjpbIiQiLCJmbiIsInRpbWVvdXRDbGFzcyIsImNsYXNzbmFtZSIsInRpbWVvdXQiLCJ0aGF0Iiwic2V0VGltZW91dCIsInRvZ2dsZUNsYXNzIiwiZXh0ZW5kIiwicG9wb3ZlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsInNldHRpbmdzIiwiaXNvcGVuIiwic2Nyb2xsU2hpZnQiLCIkcGFnZSIsIm9uT3BlblNjcm9sbFRvcCIsIiRwb3BvdmVyIiwiJHRhcmdldCIsInBvc2l0aW9uIiwidGFyZ2V0IiwibGVmdCIsInd3Iiwid2luZG93Iiwid2lkdGgiLCJ0b3AiLCJoYXNDbGFzcyIsImNsb3Nlc3QiLCJvZmZzZXQiLCJoZWlnaHQiLCJoaWRlIiwiY2FsbGJhY2siLCJsZW5ndGgiLCJyZW1vdmVDbGFzcyIsImFwcGx5Iiwib24iLCJlIiwicmVzaXplIiwic2Nyb2xsIiwic2Nyb2xsVG9wIiwiZWFjaCIsInByZXZlbnREZWZhdWx0IiwiYmxvY2siLCJkYXRhIiwidGVtcGxhdGUiLCJhcHBlbmQiLCJjc3MiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxDQUFFLFVBQVVBLENBQVYsRUFBYTtBQUNmOztBQUVHQSxHQUFFQyxFQUFGLENBQUtDLFlBQUwsR0FBb0IsVUFBU0MsU0FBVCxFQUFvQkMsT0FBcEIsRUFBNkI7QUFDN0NBLFlBQVVBLFdBQVcsRUFBckI7QUFDQSxNQUFJQyxPQUFPLElBQVg7QUFDQUMsYUFBVyxZQUFVO0FBQ2pCTixLQUFFSyxJQUFGLEVBQVFFLFdBQVIsQ0FBb0JKLFNBQXBCO0FBQ0gsR0FGRCxFQUVHQyxPQUZIO0FBR0gsRUFORDs7QUFRSEosR0FBRUMsRUFBRixDQUFLTyxNQUFMLENBQVk7QUFDWEMsV0FBUyxpQkFBU0MsT0FBVCxFQUNUO0FBQ0MsUUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLE9BQUlDLFdBQVdaLEVBQUVRLE1BQUYsQ0FBVSxFQUFWLEVBQWMsS0FBS0csUUFBbkIs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dEIsVUFBSTlCLEVBQUUsY0FBYzBDLEtBQWhCLEVBQXVCVixNQUF2QixJQUFpQyxDQUFyQyxFQUNBO0FBQ0NmLGtCQUFXakIsRUFBRTRDLFNBQVMsU0FBU0YsS0FBbEIsRUFBeUIsRUFBekIsQ0FBRixDQUFYO0FBQ0EzQixhQUFNOEIsTUFBTixDQUFhNUIsUUFBYjtBQUNBLE9BSkQsTUFNQTtBQUNDQSxrQkFBV2pCLEVBQUUsY0FBYzBDLEtBQWhCLENBQVg7QUFDQTs7QUFFRCxVQUFJLENBQUMxQyxFQUFFLGNBQWMwQyxLQUFoQixFQUF1QmhCLFFBQXZCLENBQWdDLE1BQWhDLENBQUwsRUFDQTtBQUNDVix5QkFBa0JELE1BQU13QixTQUFOLEVBQWxCOztBQUVBdEIsZ0JBQVM2QixHQUFULENBQWFyQyxRQUFRVSxRQUFSLENBQWlCaUIsRUFBRWhCLE1BQW5CLENBQWI7QUFDQUgsZ0JBQVNWLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkJMLFlBQTdCLENBQTBDLFNBQTFDO0FBQ0E7QUFFRCxNQXBCRDtBQXFCQSxLQTVCRDtBQThCQSxJQS9CTSxDQUFQO0FBZ0NBO0FBdEdVLEVBQVo7QUF3R0EsQ0FuSEEsRUFtSEc2QyxNQW5ISCIsImZpbGUiOiJfcG9wb3Zlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoIGZ1bmN0aW9uKCAkICl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG4gICAgJC5mbi50aW1lb3V0Q2xhc3MgPSBmdW5jdGlvbihjbGFzc25hbWUsIHRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHRpbWVvdXQgfHwgMTA7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGF0KS50b2dnbGVDbGFzcyhjbGFzc25hbWUpO1xuICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICB9O1xuXG5cdCQuZm4uZXh0ZW5kKHtcblx0XHRwb3BvdmVyOiBmdW5jdGlvbihvcHRpb25zKVxuXHRcdHtcblx0XHRcdHRoaXMuZGVmYXVsdHMgPSB7fTtcblx0XHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyApLFxuXHRcdFx0XHRpc29wZW4gPSBmYWxzZSwgc2Nyb2xsU2hpZnQgPSAxMDAsIHBvcG92ZXIgPSB7fSxcblx0XHRcdFx0JHBhZ2UgPSAkKCcjcGFnZS13cmFwcGVyJyksXG5cdFx0XHRcdG9uT3BlblNjcm9sbFRvcCwgJHBvcG92ZXIsICR0YXJnZXQ7XG5cblx0XHRcdHBvcG92ZXIucG9zaXRpb24gPSBmdW5jdGlvbih0YXJnZXQpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBsZWZ0ID0gMCwgd3cgPSAkKHdpbmRvdykud2lkdGgoKSwgdG9wID0gMDtcblxuXHRcdFx0XHRpZiAoJCh0YXJnZXQpLmhhc0NsYXNzKCd0cmlnZ2VyLXBvcG92ZXInKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCR0YXJnZXQgPSAkKHRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0JHRhcmdldCA9ICQodGFyZ2V0KS5jbG9zZXN0KCcudHJpZ2dlci1wb3BvdmVyJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZWZ0ID0gJHRhcmdldC5vZmZzZXQoKS5sZWZ0ICsgJHRhcmdldC53aWR0aCgpO1xuXHRcdFx0XHR0b3AgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCArICR0YXJnZXQuaGVpZ2h0KCkgKyA4O1xuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHsgJ2xlZnQnOiBsZWZ0LCAndG9wJzogdG9wIH07XG5cdFx0XHR9XG5cblx0XHRcdHBvcG92ZXIuaGlkZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoJCgnLnBvcG92ZXIub3BlbicpLmxlbmd0aClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCRwb3BvdmVyID0gJCgnLnBvcG92ZXIub3BlbicpO1xuXHRcdFx0XHRcdCRwb3BvdmVyLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCAgXHRcdFx0JHBvcG92ZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdCAgXHRcdFx0XG5cdFx0XHQgIFx0XHRcdGlmICh0eXBlb2YoY2FsbGJhY2spID09ICdmdW5jdGlvbicpXG5cdFx0XHQgIFx0XHRcdHtcblx0XHRcdCAgXHRcdFx0XHRjYWxsYmFjay5hcHBseSgpO1xuXHRcdFx0ICBcdFx0XHR9XG5cdFx0XHQgIFx0XHR9LCAyNTApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoY2FsbGJhY2spID09ICdmdW5jdGlvbicpXG5cdFx0ICBcdFx0XHR7XG5cdFx0ICBcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KCk7XG5cdFx0ICBcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0JHBhZ2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoKGlzb3BlbiB8fCAkKCcucG9wb3Zlci5vcGVuJykubGVuZ3RoKSAmJiAhJChlLnRhcmdldCkuY2xvc2VzdCgnLnRyaWdnZXItcG9wb3ZlcicpLmxlbmd0aCAmJiAhJChlLnRhcmdldCkuY2xvc2VzdCgnLnBvcG92ZXInKS5sZW5ndGgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwb3BvdmVyLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdCAgICB9KTtcblxuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe1xuXHRcdFx0XHRwb3BvdmVyLmhpZGUoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkcGFnZS5zY3JvbGwoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKGlzb3BlbiA9PT0gdHJ1ZSAmJiAoKChvbk9wZW5TY3JvbGxUb3AgKyBzY3JvbGxTaGlmdCkgPCAkcGFnZS5zY3JvbGxUb3AoKSkgfHwgKChvbk9wZW5TY3JvbGxUb3AgLSBzY3JvbGxTaGlmdCkgPiAkcGFnZS5zY3JvbGxUb3AoKSkpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cG9wb3Zlci5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHR2YXIgYmxvY2sgPSAkKHRoaXMpLmRhdGEoJ3BvcG92ZXInKSwgJHBvcG92ZXI7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aXNvcGVuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdHBvcG92ZXIuaGlkZShmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0XHRpZiAoJCgnI3BvcG92ZXItJyArIGJsb2NrKS5sZW5ndGggPT0gMClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0JHBvcG92ZXIgPSAkKHRlbXBsYXRlKCd0cGxfJyArIGJsb2NrLCB7fSkpO1xuXHRcdFx0XHRcdFx0XHQkcGFnZS5hcHBlbmQoJHBvcG92ZXIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQkcG9wb3ZlciA9ICQoJyNwb3BvdmVyLScgKyBibG9jayk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICghJCgnI3BvcG92ZXItJyArIGJsb2NrKS5oYXNDbGFzcygnb3BlbicpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRvbk9wZW5TY3JvbGxUb3AgPSAkcGFnZS5zY3JvbGxUb3AoKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdCRwb3BvdmVyLmNzcyhwb3BvdmVyLnBvc2l0aW9uKGUudGFyZ2V0KSk7XG5cdFx0XHRcdFx0XHRcdCRwb3BvdmVyLnRvZ2dsZUNsYXNzKCdvcGVuJykudGltZW91dENsYXNzKCdhbmltYXRlJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KSggalF1ZXJ5ICk7Il19

"use strict";

var category, controls;

function doOnLoad(path) {
  category = new dhtmlXTreeObject("treeboxbox_tree", "100%", "100%", 0);
  category.setImagePath('/' + ADMIN_DIR + '/images/tree/');
  category.enableDragAndDrop(true);
  category.setEditStartAction(true / false);
  category.enableKeyboardNavigation(true);
  category.enableMultiselection(true);
  category.enableTreeLines(true);
  category.makeAllDraggable();

  /*
  category.enableCheckBoxes(true);
  */

  category.attachEvent("onDrop", function (sId, tId, id, sObject, tObject) {
    $.ajax({
      url: '/' + ADMIN_DIR + '/' + path + '/updateStructure',
      type: "post",
      data: {
        oid: sId,
        pid: tId
      }
    });
  });

  category.attachEvent("onDblClick", function (id) {});
}

function controlLink(path, page, type, id, attribute) {
  switch (type) {
    case 'add':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/add/' + id + '" class="control-icon icon icon-file-plus" title="Добавить подраздел" data-no-instant></a>';
      break;

    case 'edit':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/edit/' + id + '" class="control-icon icon icon-edit" title="Редактировать раздел" data-no-instant></a>';
      break;

    case 'visible':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/visible/' + id + '" class="control-icon icon icon-eye' + (attribute == 0 ? '-off' : '') + '" onclick="ajax_vis_toggle(this, 15, 0); return false;" title="Отображение страницы" data-no-instant></a>';
      break;

    case 'delete':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/del/' + id + '" class="control-icon icon icon-delete" title="Удалить раздел" onclick="return cp.dialog(\'Вы действительно хотите удалить раздел?\');" data-no-instant></a>';
      break;
  }
}

function buildTree(path, page) {
  $.ajax({
    url: '/' + ADMIN_DIR + '/' + path + '/getStructure',
    type: "get",
    dataType: "JSON",
    success: function success(response) {
      category.deleteChildItems(0);

      if (response.length) {
        for (var x in response) {
          controls = '';

          controls += '<span class="control-icons">';
          controls += controlLink(path, page, 'add', response[x].id);
          controls += controlLink(path, page, 'edit', response[x].id);
          controls += controlLink(path, page, 'visible', response[x].id, response[x].visible);
          controls += controlLink(path, page, 'delete', response[x].id);
          controls += '</span>';

          close = 0;
          open = 0;
          leaf = 0;

          if (response[x].pid == 0) {
            leaf = 'icon/home.svg';
            open = 'icon/home.svg';
            close = 'icon/home.svg';
          } else if (response[x].dynamic == 1) {
            leaf = 'icon/application-code.svg';
          } else {
            leaf = 'icon/file.svg';
          }

          category.insertNewChild(response[x].pid, response[x].id, response[x].name + ' ' + controls, 0, leaf, open, close);
        }
      }

      category.openOnItemAdding(true);
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zdHJ1Y3R1cmUuanMiXSwibmFtZXMiOlsiY2F0ZWdvcnkiLCJjb250cm9scyIsImRvT25Mb2FkIiwicGF0aCIsImRodG1sWFRyZWVPYmplY3QiLCJzZXRJbWFnZVBhdGgiLCJBRE1JTl9ESVIiLCJlbmFibGVEcmFnQW5kRHJvcCIsInNldEVkaXRTdGFydEFjdGlvbiIsImVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbiIsImVuYWJsZU11bHRpc2VsZWN0aW9uIiwiZW5hYmxlVHJlZUxpbmVzIiwibWFrZUFsbERyYWdnYWJsZSIsImF0dGFjaEV2ZW50Iiwic0lkIiwidElkIiwiaWQiLCJzT2JqZWN0IiwidE9iamVjdCIsIiQiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJvaWQiLCJwaWQiLCJjb250cm9sTGluayIsInBhZ2UiLCJhdHRyaWJ1dGUiLCJidWlsZFRyZWUiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImRlbGV0ZUNoaWxkSXRlbXMiLCJsZW5ndGgiLCJ4IiwidmlzaWJsZSIsImNsb3NlIiwib3BlbiIsImxlYWYiLCJkeW5hbWljIiwiaW5zZXJ0TmV3Q2hpbGQiLCJuYW1lIiwib3Blbk9uSXRlbUFkZGluZyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFKLEVBQWNDLFFBQWQ7O0FBRUEsU0FBU0MsUUFBVCxDQUFrQkMsSUFBbEIsRUFDQTtBQUNDSCxhQUFXLElBQUlJLGdCQUFKLENBQXFCLGlCQUFyQixFQUF3QyxNQUF4QyxFQUFnRCxNQUFoRCxFQUF3RCxDQUF4RCxDQUFYO0FBQ0FKLFdBQVNLLFlBQVQsQ0FBc0IsTUFBTUMsU0FBTixHQUFrQixlQUF4QztBQUNBTixXQUFTTyxpQkFBVCxDQUEyQixJQUEzQjtBQUNBUCxXQUFTUSxrQkFBVCxDQUE0QixPQUFLLEtBQWpDO0FBQ0FSLFdBQVNTLHdCQUFULENBQWtDLElBQWxDO0FBQ0FULFdBQVNVLG9CQUFULENBQThCLElBQTlCO0FBQ0FWLFdBQVNXLGVBQVQsQ0FBeUIsSUFBekI7QUFDQVgsV0FBU1ksZ0JBQVQ7O0FBRUE7Ozs7QUFJQVosV0FBU2EsV0FBVCxDQUFxQixRQUFyQixFQUErQixVQUFTQyxHQUFULEVBQWNDLEdBQWQsRUFBbUJDLEVBQW5CLEVBQXVCQyxPQUF2QixFQUFnQ0MsT0FBaEMsRUFBd0M7QUFDdEVDLE1BQUVDLElBQUYsQ0FBTztBQUNHQyxXQUFLLE1BQU1mLFNBQU4sR0FBa0IsR0FBbEIsR0FBd0JILElBQXhCLEdBQStCLGtCQUR2QztBQUVHbUIsWUFBTSxNQUZUO0FBR0dDLFlBQU07QUFDTEMsYUFBS1YsR0FEQTtBQUVMVyxhQUFLVjtBQUZBO0FBSFQsS0FBUDtBQVFBLEdBVEQ7O0FBV0FmLFdBQVNhLFdBQVQsQ0FBcUIsWUFBckIsRUFBbUMsVUFBU0csRUFBVCxFQUFZLENBRTlDLENBRkQ7QUFHQTs7QUFFRCxTQUFTVSxXQUFULENBQXFCdkIsSUFBckIsRUFBMkJ3QixJQUEzQixFQUFpQ0wsSUFBakMsRUFBdUNOLEVBQXZDLEVBQTJDWSxTQUEzQyxFQUNBO0FBQ0MsVUFBT04sSUFBUDtBQUVDLFNBQUssS0FBTDtBQUNDLGFBQU8sZUFBZWhCLFNBQWYsR0FBMkIsR0FBM0IsR0FBaUNILElBQWpDLEdBQXdDLEdBQXhDLEdBQThDd0IsSUFBOUMsR0FBcUQsT0FBckQsR0FBK0RYLEVBQS9ELEdBQW9FLDRGQUEzRTtBQUNEOztBQUVBLFNBQUssTUFBTDtBQUNDLGFBQU8sZUFBZVYsU0FBZixHQUEyQixHQUEzQixHQUFpQ0gsSUFBakMsR0FBd0MsR0FBeEMsR0FBOEN3QixJQUE5QyxHQUFxRCxRQUFyRCxHQUFnRVgsRUFBaEUsR0FBcUUseUZBQTVFO0FBQ0Q7O0FBRUEsU0FBSyxTQUFMO0FBQ0MsYUFBTyxlQUFlVixTQUFmLEdBQTJCLEdBQTNCLEdBQWlDSCxJQUFqQyxHQUF3QyxHQUF4QyxHQUE4Q3dCLElBQTlDLEdBQXFELFdBQXJELEdBQW1FWCxFQUFuRSxHQUF3RSxxQ0FBeEUsSUFBaUhZLGFBQWEsQ0FBYixHQUFpQixNQUFqQixHQUEwQixFQUEzSSxJQUFpSiwyR0FBeEo7QUFDRDs7QUFFQSxTQUFLLFFBQUw7QUFDQyxhQUFPLGVBQWV0QixTQUFmLEdBQTJCLEdBQTNCLEdBQWlDSCxJQUFqQyxHQUF3QyxHQUF4QyxHQUE4Q3dCLElBQTlDLEdBQXFELE9BQXJELEdBQStEWCxFQUEvRCxHQUFvRSw4SkFBM0U7QUFDRDtBQWhCRDtBQWtCQTs7QUFFRCxTQUFTYSxTQUFULENBQW1CMUIsSUFBbkIsRUFBeUJ3QixJQUF6QixFQUNBO0FBQ0NSLElBQUVDLElBQUYsQ0FBTztBQUNBQyxTQUFLLE1BQU1mLFNBQU4sR0FBa0IsR0FBbEIsR0FBd0JILElBQXhCLEdBQStCLGVBRHBDO0FBRUFtQixVQUFNLEtBRk47QUFHQVEsY0FBVSxNQUhWO0FBSUFDLGFBQVMsaUJBQVNDLFFBQVQsRUFDVDtBQUNDaEMsZUFBU2lDLGdCQUFULENBQTBCLENBQTFCOztBQUVBLFVBQUlELFNBQVNFLE1BQWIsRUFDQTtBQUNJLGFBQUksSUFBSUMsQ0FBUixJQUFhSCxRQUFiLEVBQ0E7QUFDQy9CLHFCQUFXLEVBQVg7O0FBRUFBLHNCQUFZLDhCQUFaO0FBQ0FBLHNCQUFZeUIsWUFBWXZCLElBQVosRUFBa0J3QixJQUFsQixFQUF3QixLQUF4QixFQUErQkssU0FBU0csQ0FBVCxFQUFZbkIsRUFBM0MsQ0FBWjtBQUNBZixzQkFBWXlCLFlBQVl2QixJQUFaLEVBQWtCd0IsSUFBbEIsRUFBd0IsTUFBeEIsRUFBZ0NLLFNBQVNHLENBQVQsRUFBWW5CLEVBQTVDLENBQVo7QUFDQWYsc0JBQVl5QixZQUFZdkIsSUFBWixFQUFrQndCLElBQWxCLEVBQXdCLFNBQXhCLEVBQW1DSyxTQUFTRyxDQUFULEVBQVluQixFQUEvQyxFQUFtRGdCLFNBQVNHLENBQVQsRUFBWUMsT0FBL0QsQ0FBWjtBQUNBbkMsc0JBQVl5QixZQUFZdkIsSUFBWixFQUFrQndCLElBQWxCLEVBQXdCLFFBQXhCLEVBQWtDSyxTQUFTRyxDQUFULEVBQVluQixFQUE5QyxDQUFaO0FBQ0FmLHNCQUFZLFNBQVo7O0FBRUFvQyxrQkFBUSxDQUFSO0FBQ0FDLGlCQUFPLENBQVA7QUFDQUMsaUJBQU8sQ0FBUDs7QUFFQSxjQUFJUCxTQUFTRyxDQUFULEVBQVlWLEdBQVosSUFBbUIsQ0FBdkIsRUFDQTtBQUNDYyxtQkFBTyxlQUFQO0FBQ0FELG1CQUFPLGVBQVA7QUFDQUQsb0JBQVEsZUFBUjtBQUNBLFdBTEQsTUFNSyxJQUFJTCxTQUFTRyxDQUFULEVBQVlLLE9BQVosSUFBdUIsQ0FBM0IsRUFDTDtBQUNSRCxtQkFBTywyQkFBUDtBQUNTLFdBSEksTUFJQTtBQUNKQSxtQkFBTyxlQUFQO0FBQ0E7O0FBRUR2QyxtQkFBU3lDLGNBQVQsQ0FBd0JULFNBQVNHLENBQVQsRUFBWVYsR0FBcEMsRUFBeUNPLFNBQVNHLENBQVQsRUFBWW5CLEVBQXJELEVBQXlEZ0IsU0FBU0csQ0FBVCxFQUFZTyxJQUFaLEdBQW1CLEdBQW5CLEdBQXlCekMsUUFBbEYsRUFBNEYsQ0FBNUYsRUFBK0ZzQyxJQUEvRixFQUFxR0QsSUFBckcsRUFBMkdELEtBQTNHO0FBQ0E7QUFDSjs7QUFFRHJDLGVBQVMyQyxnQkFBVCxDQUEwQixJQUExQjtBQUNBO0FBNUNELEdBQVA7QUE4Q0EiLCJmaWxlIjoiX3N0cnVjdHVyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXRlZ29yeSwgY29udHJvbHM7XG5cbmZ1bmN0aW9uIGRvT25Mb2FkKHBhdGgpXG57XG5cdGNhdGVnb3J5ID0gbmV3IGRodG1sWFRyZWVPYmplY3QoXCJ0cmVlYm94Ym94X3RyZWVcIiwgXCIxMDAlXCIsIFwiMTAwJVwiLCAwKTtcblx0Y2F0ZWdvcnkuc2V0SW1hZ2VQYXRoKCcvJyArIEFETUlOX0RJUiArICcvaW1hZ2VzL3RyZWUvJyk7XG5cdGNhdGVnb3J5LmVuYWJsZURyYWdBbmREcm9wKHRydWUpO1xuXHRjYXRlZ29yeS5zZXRFZGl0U3RhcnRBY3Rpb24odHJ1ZS9mYWxzZSk7XG5cdGNhdGVnb3J5LmVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbih0cnVlKTtcblx0Y2F0ZWdvcnkuZW5hYmxlTXVsdGlzZWxlY3Rpb24odHJ1ZSk7XG5cdGNhdGVnb3J5LmVuYWJsZVRyZWVMaW5lcyh0cnVlKTtcblx0Y2F0ZWdvcnkubWFrZUFsbERyYWdnYWJsZSgpO1xuXHRcblx0Lypcblx0Y2F0ZWdvcnkuZW5hYmxlQ2hlY2tCb3hlcyh0cnVlKTtcblx0Ki9cblx0XG5cdGNhdGVnb3J5LmF0dGFjaEV2ZW50KFwib25Ecm9wXCIsIGZ1bmN0aW9uKHNJZCwgdElkLCBpZCwgc09iamVjdCwgdE9iamVjdCl7XG5cdFx0JC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy8nICsgcGF0aCArICcvdXBkYXRlU3RydWN0dXJlJyxcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXHRvaWQ6IHNJZCxcbiAgICAgICAgICAgIFx0cGlkOiB0SWRcbiAgICAgICAgICAgIH1cbiAgICAgICBcdH0pO1xuXHR9KTtcblxuXHRjYXRlZ29yeS5hdHRhY2hFdmVudChcIm9uRGJsQ2xpY2tcIiwgZnVuY3Rpb24oaWQpe1xuXHQgICAgXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjb250cm9sTGluayhwYXRoLCBwYWdlLCB0eXBlLCBpZCwgYXR0cmlidXRlKVxue1xuXHRzd2l0Y2godHlwZSlcblx0e1xuXHRcdGNhc2UgJ2FkZCc6XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCIvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnLycgKyBwYWdlICsgJy9hZGQvJyArIGlkICsgJ1wiIGNsYXNzPVwiY29udHJvbC1pY29uIGljb24gaWNvbi1maWxlLXBsdXNcIiB0aXRsZT1cItCU0L7QsdCw0LLQuNGC0Ywg0L/QvtC00YDQsNC30LTQtdC7XCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnZWRpdCc6XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCIvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnLycgKyBwYWdlICsgJy9lZGl0LycgKyBpZCArICdcIiBjbGFzcz1cImNvbnRyb2wtaWNvbiBpY29uIGljb24tZWRpdFwiIHRpdGxlPVwi0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0YDQsNC30LTQtdC7XCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAndmlzaWJsZSc6XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCIvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnLycgKyBwYWdlICsgJy92aXNpYmxlLycgKyBpZCArICdcIiBjbGFzcz1cImNvbnRyb2wtaWNvbiBpY29uIGljb24tZXllJyArIChhdHRyaWJ1dGUgPT0gMCA/ICctb2ZmJyA6ICcnKSArICdcIiBvbmNsaWNrPVwiYWpheF92aXNfdG9nZ2xlKHRoaXMsIDE1LCAwKTsgcmV0dXJuIGZhbHNlO1wiIHRpdGxlPVwi0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDRgdGC0YDQsNC90LjRhtGLXCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdHJldHVybiAnPGEgaHJlZj1cIi8nICsgQURNSU5fRElSICsgJy8nICsgcGF0aCArICcvJyArIHBhZ2UgKyAnL2RlbC8nICsgaWQgKyAnXCIgY2xhc3M9XCJjb250cm9sLWljb24gaWNvbiBpY29uLWRlbGV0ZVwiIHRpdGxlPVwi0KPQtNCw0LvQuNGC0Ywg0YDQsNC30LTQtdC7XCIgb25jbGljaz1cInJldHVybiBjcC5kaWFsb2coXFwn0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0YDQsNC30LTQtdC7P1xcJyk7XCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVHJlZShwYXRoLCBwYWdlKVxue1xuXHQkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnL2dldFN0cnVjdHVyZScsXG4gICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgIHtcbiAgICAgICAgXHRjYXRlZ29yeS5kZWxldGVDaGlsZEl0ZW1zKDApO1xuXHRcdFx0XG4gICAgICAgIFx0aWYgKHJlc3BvbnNlLmxlbmd0aClcbiAgICAgICAgXHR7XG4gICAgICAgICAgICBcdGZvcih2YXIgeCBpbiByZXNwb25zZSlcbiAgICAgICAgICAgIFx0e1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzID0gJyc7XG5cbiAgICAgICAgICAgIFx0XHRjb250cm9scyArPSAnPHNwYW4gY2xhc3M9XCJjb250cm9sLWljb25zXCI+JztcbiAgICAgICAgICAgIFx0XHRjb250cm9scyArPSBjb250cm9sTGluayhwYXRoLCBwYWdlLCAnYWRkJywgcmVzcG9uc2VbeF0uaWQpO1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzICs9IGNvbnRyb2xMaW5rKHBhdGgsIHBhZ2UsICdlZGl0JywgcmVzcG9uc2VbeF0uaWQpO1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzICs9IGNvbnRyb2xMaW5rKHBhdGgsIHBhZ2UsICd2aXNpYmxlJywgcmVzcG9uc2VbeF0uaWQsIHJlc3BvbnNlW3hdLnZpc2libGUpO1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzICs9IGNvbnRyb2xMaW5rKHBhdGgsIHBhZ2UsICdkZWxldGUnLCByZXNwb25zZVt4XS5pZCk7XG4gICAgICAgICAgICBcdFx0Y29udHJvbHMgKz0gJzwvc3Bhbj4nO1xuXG4gICAgICAgICAgICBcdFx0Y2xvc2UgPSAwO1xuICAgICAgICAgICAgXHRcdG9wZW4gPSAwO1xuICAgICAgICAgICAgXHRcdGxlYWYgPSAwO1xuXG4gICAgICAgICAgICBcdFx0aWYgKHJlc3BvbnNlW3hdLnBpZCA9PSAwKVxuICAgICAgICAgICAgXHRcdHtcbiAgICAgICAgICAgIFx0XHRcdGxlYWYgPSAnaWNvbi9ob21lLnN2Zyc7XG4gICAgICAgICAgICBcdFx0XHRvcGVuID0gJ2ljb24vaG9tZS5zdmcnO1xuICAgICAgICAgICAgXHRcdFx0Y2xvc2UgPSAnaWNvbi9ob21lLnN2Zyc7XG4gICAgICAgICAgICBcdFx0fVxuICAgICAgICAgICAgXHRcdGVsc2UgaWYgKHJlc3BvbnNlW3hdLmR5bmFtaWMgPT0gMSlcbiAgICAgICAgICAgIFx0XHR7XG5cdFx0XHRcdFx0XHRsZWFmID0gJ2ljb24vYXBwbGljYXRpb24tY29kZS5zdmcnO1xuICAgICAgICAgICAgXHRcdH1cbiAgICAgICAgICAgIFx0XHRlbHNlIHtcbiAgICAgICAgICAgIFx0XHRcdGxlYWYgPSAnaWNvbi9maWxlLnN2Zyc7XG4gICAgICAgICAgICBcdFx0fVxuXG4gICAgICAgICAgICBcdFx0Y2F0ZWdvcnkuaW5zZXJ0TmV3Q2hpbGQocmVzcG9uc2VbeF0ucGlkLCByZXNwb25zZVt4XS5pZCwgcmVzcG9uc2VbeF0ubmFtZSArICcgJyArIGNvbnRyb2xzLCAwLCBsZWFmLCBvcGVuLCBjbG9zZSk7XG4gICAgICAgICAgICBcdH1cbiAgICAgICAgXHR9XG5cdFx0XHRcbiAgICAgICAgXHRjYXRlZ29yeS5vcGVuT25JdGVtQWRkaW5nKHRydWUpO1xuICAgICAgICB9XG4gICBcdH0pO1xufSJdfQ==

'use strict';

;(function (d) {
    function template(id, data) {
        if (d.getElementById(id) !== null) {
            return Template7.compile(d.getElementById(id).innerHTML)(data || {});
        }
        return '';
    }
    window.template = template;
})(document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsImlkIiwiZGF0YSIsImQiLCJnZXRFbGVtZW50QnlJZCIsIlRlbXBsYXRlNyIsImNvbXBpbGUiLCJpbm5lckhUTUwiLCJ3aW5kb3ciLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLENBQUUsYUFBSztBQUNKLGFBQVNBLFFBQVQsQ0FBa0JDLEVBQWxCLEVBQXNCQyxJQUF0QixFQUE0QjtBQUN4QixZQUFJQyxFQUFFQyxjQUFGLENBQWlCSCxFQUFqQixNQUF5QixJQUE3QixFQUFtQztBQUMvQixtQkFBT0ksVUFBVUMsT0FBVixDQUFrQkgsRUFBRUMsY0FBRixDQUFpQkgsRUFBakIsRUFBcUJNLFNBQXZDLEVBQWtETCxRQUFRLEVBQTFELENBQVA7QUFDSDtBQUNELGVBQU8sRUFBUDtBQUNIO0FBQ0RNLFdBQU9SLFFBQVAsR0FBa0JBLFFBQWxCO0FBQ0gsQ0FSQSxFQVFHUyxRQVJIIiwiZmlsZSI6Il90ZW1wbGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoKGQgPT4ge1xuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKGlkLCBkYXRhKSB7XG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlNy5jb21waWxlKGQuZ2V0RWxlbWVudEJ5SWQoaWQpLmlubmVySFRNTCkoZGF0YSB8fCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB3aW5kb3cudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbn0pKShkb2N1bWVudCk7XG4iXX0=

'use strict';

$(document).ready(function () {

    $.upload = {
        open: function open(selector, isClearErr, isResetForm, isOverlay) {
            clearInterval(uploadOpenTimeout);
            uploadOpenTimeout = setTimeout(function () {
                upload._open(selector, isClearErr, isResetForm, isOverlay);
            }, 200);
        },
        clearErrors: function clearErrors($upload) {
            $upload.find('.error').removeClass('error');
            $upload.find('.upload__errorList').addClass('hide').empty();
            $upload.find('.hide-on-open').hide();
            $upload.find('.tooltip').remove();
        }
    };

    $.upload.init = function () {
        var formAction = '/' + ADMIN_DIR + '/meta/fileUpload';
        var filesLimit = 0;

        $('.js-fileupload').each(function (index, item) {
            return function (element) {
                var $attachments = $(element);
                var id = $attachments.find('.js-fileupload-control').attr('id');

                var groupid = $attachments.find('.js-fileupload-group').val();
                var settings = $attachments.find('.js-fileupload-settings').val();
                var input_name = $attachments.find('.js-fileupload-group').attr('name');

                if ($attachments.data('action')) {
                    formAction = $attachments.data('action');
                }

                var uploader = new qq.FineUploader({
                    debug: false,

                    multiple: true,

                    element: document.getElementById(id),

                    template: 'upload-template',

                    request: {
                        accessKey: "file_key",
                        endpoint: formAction,
                        inputName: 'file',
                        includeExif: false,
                        defaultQuality: 100,
                        params: {
                            groupid: groupid,
                            settings: settings
                        }
                    },

                    deleteFile: {
                        enabled: true,
                        forceConfirm: false,
                        endpoint: '/' + ADMIN_DIR + '/meta/filedelete'
                    },

                    thumbnails: {
                        placeholders: {
                            waitingPath: '/' + ADMIN_DIR + '/images/fine-uploader/waiting-generic.png',
                            notAvailablePath: '/' + ADMIN_DIR + '/images/fine-uploader/not_available-generic.png'
                        }
                    },

                    validation: {
                        // allowedExtensions: ['jpeg', 'jpg', 'png', 'gif', 'txt'],
                        itemLimit: filesLimit,
                        sizeLimit: 2048000
                    },

                    callbacks: {
                        onComplete: function onComplete(id, name, response) {
                            this.setUuid(id, response.id);
                        }
                    }
                });

                console.log(initialFiles[groupid] || []);

                uploader.addInitialFiles(initialFiles[groupid] || []);

                $attachments.on('click', '.qq-upload-file-selector', function (e) {
                    e.preventDefault();
                    var title = $(this).text();
                    var index = $(this).closest('.attachments-list__item').index();
                    var id = uploader.getUuid(index);

                    var update = Module.changeFileName(id, title);

                    if (update) {
                        uploader.setName(index, update);
                    }
                });
            }(item);
        });
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl91cGxvYWQuanMiXSwibmFtZXMiOlsiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ1cGxvYWQiLCJvcGVuIiwic2VsZWN0b3IiLCJpc0NsZWFyRXJyIiwiaXNSZXNldEZvcm0iLCJpc092ZXJsYXkiLCJjbGVhckludGVydmFsIiwidXBsb2FkT3BlblRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiX29wZW4iLCJjbGVhckVycm9ycyIsIiR1cGxvYWQiLCJmaW5kIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImVtcHR5IiwiaGlkZSIsInJlbW92ZSIsImluaXQiLCJmb3JtQWN0aW9uIiwiQURNSU5fRElSIiwiZmlsZXNMaW1pdCIsImVhY2giLCJpbmRleCIsIml0ZW0iLCJlbGVtZW50IiwiJGF0dGFjaG1lbnRzIiwiaWQiLCJhdHRyIiwiZ3JvdXBpZCIsInZhbCIsInNldHRpbmdzIiwiaW5wdXRfbmFtZSIsImRhdGEiLCJ1cGxvYWRlciIsInFxIiwiRmluZVVwbG9hZGVyIiwiZGVidWciLCJtdWx0aXBsZSIsImdldEVsZW1lbnRCeUlkIiwidGVtcGxhdGUiLCJyZXF1ZXN0IiwiYWNjZXNzS2V5IiwiZW5kcG9pbnQiLCJpbnB1dE5hbWUiLCJpbmNsdWRlRXhpZiIsImRlZmF1bHRRdWFsaXR5IiwicGFyYW1zIiwiZGVsZXRlRmlsZSIsImVuYWJsZWQiLCJmb3JjZUNvbmZpcm0iLCJ0aHVtYm5haWxzIiwicGxhY2Vob2xkZXJzIiwid2FpdGluZ1BhdGgiLCJub3RBdmFpbGFibGVQYXRoIiwidmFsaWRhdGlvbiIsIml0ZW1MaW1pdCIsInNpemVMaW1pdCIsImNhbGxiYWNrcyIsIm9uQ29tcGxldGUiLCJuYW1lIiwicmVzcG9uc2UiLCJzZXRVdWlkIiwiY29uc29sZSIsImxvZyIsImluaXRpYWxGaWxlcyIsImFkZEluaXRpYWxGaWxlcyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwidGl0bGUiLCJ0ZXh0IiwiY2xvc2VzdCIsImdldFV1aWQiLCJ1cGRhdGUiLCJNb2R1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aUNBQUtDLE9BQUwsQ0FBYW5DLEVBQWIsRUFBaUJrQyxTQUFTbEMsRUFBMUI7QUFDSDtBQUhNO0FBeENzQixpQkFBcEIsQ0FBakI7O0FBK0NBb0Msd0JBQVFDLEdBQVIsQ0FBWUMsYUFBYXBDLE9BQWIsS0FBeUIsRUFBckM7O0FBRUFLLHlCQUFTZ0MsZUFBVCxDQUF5QkQsYUFBYXBDLE9BQWIsS0FBeUIsRUFBbEQ7O0FBRUFILDZCQUFheUMsRUFBYixDQUFnQixPQUFoQixFQUF5QiwwQkFBekIsRUFBcUQsVUFBU0MsQ0FBVCxFQUFZO0FBQzdEQSxzQkFBRUMsY0FBRjtBQUNBLHdCQUFNQyxRQUFRekUsRUFBRSxJQUFGLEVBQVEwRSxJQUFSLEVBQWQ7QUFDQSx3QkFBTWhELFFBQVExQixFQUFFLElBQUYsRUFBUTJFLE9BQVIsQ0FBZ0IseUJBQWhCLEVBQTJDakQsS0FBM0MsRUFBZDtBQUNBLHdCQUFNSSxLQUFLTyxTQUFTdUMsT0FBVCxDQUFpQmxELEtBQWpCLENBQVg7O0FBRUEsd0JBQU1tRCxTQUFTQyxPQUFPQyxjQUFQLENBQXNCakQsRUFBdEIsRUFBMEIyQyxLQUExQixDQUFmOztBQUVBLHdCQUFJSSxNQUFKLEVBQVk7QUFDUnhDLGlDQUFTMkMsT0FBVCxDQUFpQnRELEtBQWpCLEVBQXdCbUQsTUFBeEI7QUFDSDtBQUNKLGlCQVhEO0FBYUgsYUE3RU0sQ0E2RUpsRCxJQTdFSSxDQUFQO0FBOEVILFNBL0VEO0FBZ0ZILEtBcEZEO0FBcUZILENBdkdEIiwiZmlsZSI6Il91cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAkLnVwbG9hZCA9IHtcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oc2VsZWN0b3IsIGlzQ2xlYXJFcnIsIGlzUmVzZXRGb3JtLCBpc092ZXJsYXkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodXBsb2FkT3BlblRpbWVvdXQpO1xuICAgICAgICAgICAgdXBsb2FkT3BlblRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHVwbG9hZC5fb3BlbihzZWxlY3RvciwgaXNDbGVhckVyciwgaXNSZXNldEZvcm0sIGlzT3ZlcmxheSk7XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9LFxuICAgICAgICBjbGVhckVycm9yczogZnVuY3Rpb24oJHVwbG9hZCkge1xuICAgICAgICAgICAgJHVwbG9hZC5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICR1cGxvYWQuZmluZCgnLnVwbG9hZF9fZXJyb3JMaXN0JykuYWRkQ2xhc3MoJ2hpZGUnKS5lbXB0eSgpO1xuICAgICAgICAgICAgJHVwbG9hZC5maW5kKCcuaGlkZS1vbi1vcGVuJykuaGlkZSgpO1xuICAgICAgICAgICAgJHVwbG9hZC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICQudXBsb2FkLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGZvcm1BY3Rpb24gPSBgLyR7QURNSU5fRElSfS9tZXRhL2ZpbGVVcGxvYWRgO1xuICAgICAgICBsZXQgZmlsZXNMaW1pdCA9IDA7XG5cbiAgICAgICAgJCgnLmpzLWZpbGV1cGxvYWQnKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRhdHRhY2htZW50cyA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSAkYXR0YWNobWVudHMuZmluZCgnLmpzLWZpbGV1cGxvYWQtY29udHJvbCcpLmF0dHIoJ2lkJyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cGlkID0gJGF0dGFjaG1lbnRzLmZpbmQoJy5qcy1maWxldXBsb2FkLWdyb3VwJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSAkYXR0YWNobWVudHMuZmluZCgnLmpzLWZpbGV1cGxvYWQtc2V0dGluZ3MnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dF9uYW1lID0gJGF0dGFjaG1lbnRzLmZpbmQoJy5qcy1maWxldXBsb2FkLWdyb3VwJykuYXR0cignbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRhdHRhY2htZW50cy5kYXRhKCdhY3Rpb24nKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1BY3Rpb24gPSAkYXR0YWNobWVudHMuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdXBsb2FkZXIgPSBuZXcgcXEuRmluZVVwbG9hZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWc6IGZhbHNlLFxuXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGxlOiB0cnVlLFxuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSxcblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3VwbG9hZC10ZW1wbGF0ZScsXG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzS2V5OiBcImZpbGVfa2V5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogZm9ybUFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0TmFtZTogJ2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUV4aWY6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFF1YWxpdHk6IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwaWQ6IGdyb3VwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlRmlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlQ29uZmlybTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogYC8ke0FETUlOX0RJUn0vbWV0YS9maWxlZGVsZXRlYFxuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhaXRpbmdQYXRoOiBgLyR7QURNSU5fRElSfS9pbWFnZXMvZmluZS11cGxvYWRlci93YWl0aW5nLWdlbmVyaWMucG5nYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RBdmFpbGFibGVQYXRoOiBgLyR7QURNSU5fRElSfS9pbWFnZXMvZmluZS11cGxvYWRlci9ub3RfYXZhaWxhYmxlLWdlbmVyaWMucG5nYFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbG93ZWRFeHRlbnNpb25zOiBbJ2pwZWcnLCAnanBnJywgJ3BuZycsICdnaWYnLCAndHh0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtTGltaXQ6IGZpbGVzTGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplTGltaXQ6IDIwNDgwMDBcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGlkLCBuYW1lLCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXVpZChpZCwgcmVzcG9uc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbml0aWFsRmlsZXNbZ3JvdXBpZF0gfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgdXBsb2FkZXIuYWRkSW5pdGlhbEZpbGVzKGluaXRpYWxGaWxlc1tncm91cGlkXSB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAkYXR0YWNobWVudHMub24oJ2NsaWNrJywgJy5xcS11cGxvYWQtZmlsZS1zZWxlY3RvcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9ICQodGhpcykudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICQodGhpcykuY2xvc2VzdCgnLmF0dGFjaG1lbnRzLWxpc3RfX2l0ZW0nKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHVwbG9hZGVyLmdldFV1aWQoaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IE1vZHVsZS5jaGFuZ2VGaWxlTmFtZShpZCwgdGl0bGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnNldE5hbWUoaW5kZXgsIHVwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkoaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59KTsiXX0=

'use strict';

var d = document;

function keyControls() {
    var clipboard = new ClipboardJS('.j-clipboard', {
        text: function text(trigger) {
            $(trigger).addClass('copied');

            setTimeout(function () {
                $(trigger).removeClass("copied");
            }, 700);

            return trigger.getAttribute('data-clipboard');
        }
    });

    $("body").on('click', '.remove-trigger', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var _self_ = this,
            href = $(_self_).attr('href');

        $.post(href, function () {
            cp.notify('Удалено', 'info');

            if (typeof $(_self_).attr('rel') !== 'undefined' && $($(_self_).attr('rel')).length > 0) {
                $($(_self_).attr('rel')).remove();
            } else {
                $(_self_).closest('tr').remove();
            }
        });

        return !1;
    });

    $('body').on('click', '.js-remove-item', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var _self_ = this,
            href = $(_self_).attr('href');

        $.post(href, function () {
            cp.notify('Удалено', 'info');

            if (typeof $(_self_).attr('rel') !== 'undefined' && $($(_self_).attr('rel')).length > 0) {
                $($(_self_).attr('rel')).remove();
            } else {
                $(_self_).closest('tr').remove();
            }
        });

        return !1;
    });

    $('body').on('click', '.js-add-template', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var $wrap = $(this).closest('.js-template-wrapper'),
            iteration = parseInt($(this).data('iteration')),
            tpl = $(this).data('template'),
            data = {};

        if (typeof iteration !== 'undefined') {
            data['id'] = iteration;
            iteration += -1;
            $(this).data('iteration', iteration);
        }

        $wrap.append(template(tpl, data));
    });

    $('body').on('keydown', '.reducing-trigger', function (e) {
        if (e.which == 38 || e.which == 40) {
            e.preventDefault();

            var reducing = $(this).data('reducing') || 10,
                format = $(this).data('format'),
                value = parseInt($(this).val()) || 0,
                result = 0;

            if (e.which == 38) {
                result = value + reducing;
            } else if (e.which == 40) {
                result = value - reducing;
            }

            if (result < 0) {
                result = 0;
            }

            if (typeof format !== 'undefined') {
                result = '?i%'.replace('?i', result);
            }

            $(this).val(result);
        }
    });

    $('body').on('keypress', '.latin', function (e) {
        var regex = /[^A-Za-z]/g;
        if (regex.test(String.fromCharCode(e.keyCode))) {
            return !1;
        }
    });

    $("body").on('keypress', '.integer', function (e) {
        if ([0, 8, 13, 38, 40].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
            return !1;
        }
    });

    $("body").on('keypress', '.float', function (e) {
        if ([0, 8, 13, 38, 40, 44, 46].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
            return !1;
        }
    });
}

function fileManager() {}

function fullCalendar() {
    var removeEvent = function removeEvent(id, callback) {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/sheduler/delete',
            type: 'post',
            data: {
                'id': id
            },
            success: callback,
            dataType: "json"
        });
    };

    var changeEvent = function changeEvent(event, callback) {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/sheduler/edit',
            type: 'post',
            data: {
                'id': event.id,
                'start': event.start.format(),
                'end': event.end.format()
            },
            success: callback,
            dataType: "json"
        });
    };

    var createEvent = function createEvent(input, callback) {
        $.ajax({
            url: input.action,
            type: input.method,
            data: input.data,
            success: callback,
            dataType: "json"
        });
    };

    var prepareEvent = function prepareEvent($calendar, data, isCreate) {
        var keys = Object.keys(data);

        var count = keys.length - 1;

        var event = {};

        var excellent = ['id', 'group', 'title', 'item', 'color', 'types', 'start', 'end', 'extra', 'visible'];

        keys.forEach(function (name, index) {
            if (excellent.indexOf(name) >= 0) {
                event[name] = data[name];
            }

            if (name === 'types' && data[name] !== '') {
                event[name] = data[name].split(',');
            }

            if (index === count) {
                if (isCreate) {
                    $calendar.fullCalendar('renderEvent', event, true);
                    $calendar.fullCalendar('refetchEvents');
                } else {
                    $calendar.fullCalendar('updateEvent', event);
                }
            }
        });
    };

    var closePopup = function closePopup($popup) {
        $popup.removeClass('is-animated');

        setTimeout(function () {
            $popup.removeClass('is-visible').remove();
        }, 350);
    };

    var prepareEditEvent = function prepareEditEvent($calendar, data) {
        var keys = Object.keys(data);

        var count = keys.length - 1;

        var event = {};

        var excellent = ['id', 'group', 'title', 'item', 'color', 'types', 'extra', 'visible'];

        keys.forEach(function (name, index) {
            if (excellent.indexOf(name) >= 0) {
                event[name] = data[name];
            }

            if (name === 'types' && data[name] !== '') {
                event[name] = data[name].split(',');
            }

            if (index === count) {
                event.action = '/' + ADMIN_DIR + '/meta/sheduler/edit';
                openPopup($calendar, event, false);
            }
        });
    };

    var openPopup = function openPopup($calendar, data, isCreate) {
        var $popup = $(template('tpl_schedule', data || {}));

        if (!$('body').find('#schedule-popup').length) {
            $('body').append($popup);

            $popup.addClass('is-visible');

            setTimeout(function () {
                selectize();
                jscolor.install();
                $popup.addClass('is-animated');
            }, 50);

            $popup.find('form').on('submit', function (e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = false;

                var $form = $(this);

                if ($form.data('is-busy')) {
                    return;
                }

                var action = $form.attr('action');
                var method = $form.attr('method') || 'post';
                var formdata = $form.serializeArray();

                $form.data('is-busy', true);

                createEvent({
                    action: action,
                    method: method,
                    data: formdata
                }, function (responce) {
                    $form.data('is-busy', false);

                    closePopup($popup);
                    prepareEvent($calendar, responce, isCreate);
                });

                return false;
            });

            $popup.find('.j-schedule-popup-close').on('click', function (e) {
                e.preventDefault();
                closePopup($popup);
            });
        }
    };

    if ($('.fullcalendar').length) {
        var todayDate = moment().startOf('day');
        var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
        var TODAY = todayDate.format('YYYY-MM-DD');
        var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');
        var START_WEEK = moment('2018-01-01').startOf('week');
        var END_WEEK = moment('2018-01-01').endOf('week');

        var config = {
            lang: 'ru',
            height: 'auto',
            timezone: 'local',
            header: {
                left: 'agendaWeek,agendaDay',
                right: ''
                // left: 'promptEvent today prev,next',
                // center: 'title',
                // right: 'month,agendaWeek,agendaDay,listWeek'
            },
            eventLimit: false,
            lazyFetching: false,
            defaultView: 'agendaWeek',
            defaultDate: '2018-01-01',
            navLinks: true,
            editable: true,
            droppable: true,
            selectable: true,
            selectHelper: true,
            aspectRatio: 2,
            allDaySlot: false,
            minTime: '07:00:00',
            maxTime: '21:00:00',
            snapDuration: '00:05:00',
            slotDuration: '00:05:00',
            slotLabelFormat: 'H(:mm)',
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
        };

        $('.fullcalendar').each(function (e) {
            var id = $(this).attr('id');

            var $calendar = $('#' + id);
            var name = $calendar.data('name');
            var group = $('input[name="' + name + '"]').val();

            // config.customButtons = {
            //     promptEvent: {
            //         text: 'Добавить элемент',
            //         click: function() {
            //             const title = prompt('Заголовок события:');

            //             if (title) {
            //                 createEvent({
            //                     // id: 1000,
            //                     // color: '#f00',
            //                     title: title,
            //                     group: group,
            //                     start: start,
            //                     end: end
            //                 },
            //                 function(responce) {
            //                     prepareEvent($calendar, responce);
            //                 });
            //             }
            //         }
            //     }
            // };

            config.select = function (start, end) {
                openPopup($calendar, {
                    action: '/' + ADMIN_DIR + '/meta/sheduler/add',
                    group: group,
                    start: start,
                    end: end
                }, true);

                $calendar.fullCalendar('unselect');
            };

            config.eventRender = function (event, element) {
                var timeout = null;

                element.on('click', function () {
                    clearTimeout(timeout);

                    timeout = setTimeout(function () {
                        prepareEditEvent($calendar, event);
                    }, 300);
                });

                element.on('dblclick', function () {
                    if (confirm('Удалить?')) {
                        clearTimeout(timeout);

                        removeEvent(event.id, function () {
                            $calendar.fullCalendar("removeEvents", function (ev) {
                                return ev.id == event.id;
                            });
                        });
                    }
                });
            };

            config.eventDrop = function (event) {
                changeEvent(event);
            };

            config.eventResize = function (event) {
                changeEvent(event);
            };

            if (typeof eventsJson[name] !== 'undefined') {
                config.events = eventsJson[name];
            }

            $("body").on('click', '.j-remove-event', function (e) {
                e.preventDefault();

                var link = $(this);

                if (link.data('is-busy')) {
                    return;
                }

                link.data('is-busy', true);

                var event_id = link.data('event');
                var $closestPopup = link.closest('.schedule-popup');

                removeEvent(event_id, function () {
                    $calendar.fullCalendar("removeEvents", function (ev) {
                        return ev.id == event_id;
                    });

                    closePopup($closestPopup);
                });
            });

            $calendar.fullCalendar(config);

            $calendar.fullCalendar('changeView', 'agendaWeek', {
                start: START_WEEK,
                end: END_WEEK
            });

            $calendar.fullCalendar('render');
        });
    }
}

function on_load() {
    fileManager();

    fullCalendar();

    $(".watch-datemask").mask("99/99/9999");
    $(".watch-phonemask").mask("+ 7 (999) 999-99-99");
    $(".watch-cartnumber").mask("999-999-999");

    $('body').on('click', '.js-size-delete', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
        $(this).closest('tr').remove();
    });

    $('body').on('click', '.js-add-size', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;

        var $table = $(this).closest('.js-size-list').find('table').find('tbody'),
            iteration = parseInt($(this).data('iteration')),
            index = 0;

        $table.find('tr').each(function () {
            if (parseInt($(this).data('index')) > index) {
                index = parseInt($(this).data('index'));
            }
        });

        index++;

        $table.append(template('tpl_image_row', {
            index: index,
            button: true,
            iteration: iteration
        }));
    });

    if ($('.js-table-toggle').length) {
        $('.js-table-toggle').on('click', function (e, flag) {
            e.preventDefault ? e.preventDefault() : e.returnValue = !1;

            if (flag) {
                cp.tableToggle($(this).data('toggle'));
            } else {
                cp.tableToggle($(this).data('toggle'), e);
            }
        });

        if ($('.js-table-toggle[data-toggle-init="true"]').length) {
            $('.js-table-toggle[data-toggle-init="true"]').trigger('click', true);
        }
    }

    if ($('.js-slider').length) {
        $('.js-slider').each(function () {
            var id = $(this).attr('id');
            var type = $(this).data('type');
            var value = $(this).data('value');
            var min = $(this).data('min');
            var max = $(this).data('max');

            slider(id, type, value, min, max);
        });
    }

    if ($('.js-map').length) {
        $('.js-map').each(function () {
            var element = $(this).data('element');
            var provider = $(this).data('provider');

            mapConteiner(provider, element);
        });
    }

    if ($('.js-redactor').length) {
        $('.js-redactor').each(function () {
            var id = $(this).attr('id');
            var type = $(this).data('redactor');

            _redactor.init(id, type);
        });
    }

    if ($('.js-editor').length) {
        $('.js-editor').each(function () {
            var id = $(this).attr('id');
            var type = $(this).data('editor');
            var hightlight = $(this).data('hightlight');

            _editor.init(id, type, hightlight);
        });
    }

    $("body").on('click', '.js-toggle-binding', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var $target = $(this);

        if ($target.data('element').length) {
            var $input = $($(this).data('element'));
            $target.toggleClass('on').toggleClass('off');
            $input.prop('readonly', !$target.hasClass('on'));
            $('input[name="' + $input.data('binding-name') + '"]').trigger('blur');
        }
    });

    if ($('.js-binding').length) {
        $('.js-binding').each(function () {
            if (!$(this).hasClass('js-binding-init')) {
                binding($(this).data('binding-name'), $(this).data('binding-element'));
            }
        });
    }

    if ($('.js-fileupload').length) {
        $.upload.init();
    }

    $('body').on('mouseenter', '.js-structure-controll', function (e) {
        $(this).find('.structure__control.animate').removeClass('animate');
    });

    $('body').on('mouseleave', '.js-structure-controll', function (e) {
        $(this).find('.structure__control').addClass('animate');
    });

    $('body').on('click', '.menu-trigger', function (e) {
        e.preventDefault();
        $('#page').toggleClass('page-open');

        var visibility = 'visible';

        if (!$('#page').hasClass('page-open')) {
            visibility = 'hidden';
        }

        $('#overlay').css({
            'visibility': visibility
        });

        return !1;
    });

    $('#meta_data').sortable({
        handle: '.js-trigger-drag',
        pullPlaceholder: false,
        bodyClass: 'dragging',
        draggedClass: 'dragged',
        containerSelector: 'table',
        itemPath: '> tbody',
        itemSelector: 'tr',
        placeholder: '<tr class="placeholder"/>',
        onDrop: function onDrop($item, container, _super, event) {
            $item.removeClass('dragged').removeAttr("style");
            $("body").removeClass('dragging');
        }
    });

    $('body').on('mouseenter', '.trigger-navigation', function (e) {
        var $item = $(this),
            $page = $('#page'),
            title = $item.attr('rel'),
            tooltip,
            id = 'tooltip-' + $item.attr('id');

        if (title && !$('#' + id).length && !$page.hasClass('page-open')) {
            var pos_top = $item.offset().top + 10;

            tooltip = document.createElement('span');
            tooltip.id = id;
            tooltip.innerHTML = title;
            tooltip.className = 'navigation__tooltip navigation__tooltip_animate';
            tooltip.style.top = pos_top + 'px';

            $page.append(tooltip);

            setTimeout(function () {
                $(tooltip).removeClass('navigation__tooltip_animate');
            }, 30);
        }
    });

    $('body').on('mouseleave', '.trigger-navigation', function (e) {
        var id = 'tooltip-' + $(this).attr('id');

        if ($('#' + id).length) {
            var $tooltip = $('#' + id);

            $tooltip.addClass('navigation__tooltip_animate');

            setTimeout(function () {
                $tooltip.remove();
            }, 200);
        }
    });

    $('body').on('click', '.wrapper', function (e) {
        $('#page').removeClass('page-open');
        $('#overlay').css({
            'visibility': 'hidden'
        });
    });

    $('body').on('mouseenter', '.trigger-tooltip', function (e) {
        $(this).data('xtitle', $(this).prop('title'));
        $(this).prop('title', '');
    });

    $('body').on('mouseleave', '.trigger-tooltip', function (e) {
        $(this).prop('title', $(this).data('xtitle'));
        $(this).data('xtitle', '');
    });

    $('.trigger-popover').popover();

    if ($('.nestable-tree').length) {
        var structure_tree = $('.nestable-tree').eq(0);

        if (typeof structure_tree.data('path') !== 'undefined' && typeof structure_tree.data('group') !== 'undefined') {
            var path = structure_tree.data('path'),
                group = parseInt(structure_tree.data('group'));

            structure_tree.nestable({
                group: group,
                maxDepth: 20,
                dragStop: function dragStop(el) {
                    var target, parent, next;

                    next = 0;
                    target = parseInt(el[0].id.split('-')[1]);
                    parent = parseInt(el[0].offsetParent.offsetParent.id.split('-')[1]);

                    if (isNaN(parent)) {
                        parent = group;
                    }

                    if (el[0].nextElementSibling !== null) {
                        next = parseInt(el[0].nextElementSibling.id.split('-')[1]);
                    }

                    if (!isNaN(target) && !isNaN(parent)) {
                        $.ajax({
                            url: '/' + ADMIN_DIR + '/' + path + '/updateStructure',
                            type: "post",
                            data: {
                                oid: target,
                                pid: parent,
                                nid: next
                            }
                        });
                    }
                },
                afterExpand: function afterExpand(el) {
                    var id = el[0].id.split('-')[1];
                    $.removeCookie(path + '_collapse_' + id, { path: '/' });
                },
                afterCollapse: function afterCollapse(el) {
                    var id = el[0].id.split('-')[1];
                    $.cookie(path + '_collapse_' + id, '1', { expires: 30, path: '/' });
                }
            });
        }
    }

    /*
    doOnLoad('structure');
    buildTree('structure', 'index');
      $('#nestable-menu').on('click', function(e)
    {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });
     var list = this;
    list.el.find(list.options.itemNodeName).each(function() {
        list.collapseItem($(this));
    });
      expandItem: function(li)
    {
        li.removeClass(this.options.collapsedClass);
        li.children('[data-action="expand"]').hide();
        li.children('[data-action="collapse"]').show();
        li.children(this.options.listNodeName).show();
    },
     collapseItem: function(li)
    {
        var lists = li.children(this.options.listNodeName);
        if (lists.length) {
            li.addClass(this.options.collapsedClass);
            li.children('[data-action="collapse"]').hide();
            li.children('[data-action="expand"]').show();
            li.children(this.options.listNodeName).hide();
        }
    },
     var updateOutput = function(e)
    {
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };
     // activate Nestable for list 1
    $('#nestable').nestable({
        group: 1
    })
    .on('change', updateOutput);
     // activate Nestable for list 2
    $('#nestable2').nestable({
        group: 1
    })
    .on('change', updateOutput);
     // output initial serialised data
    updateOutput($('#nestable').data('output', $('#nestable-output')));
    updateOutput($('#nestable2').data('output', $('#nestable2-output')));
     $('#nestable-menu').on('click', function(e)
    {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });
     $('#nestable3').nestable();
    */
}

$(document).ready(function () {
    selectize();
    datepicker();
    metaCounter();
    seoCrowl();
    keyControls();
    on_load();
    cp.dropdown();
    cp.tableToggleList();
    cp.cleditor();
    jscolor.install();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsiZCIsImRvY3VtZW50Iiwia2V5Q29udHJvbHMiLCJjbGlwYm9hcmQiLCJDbGlwYm9hcmRKUyIsInRleHQiLCJ0cmlnZ2VyIiwiJCIsImFkZENsYXNzIiwic2V0VGltZW91dCIsInJlbW92ZUNsYXNzIiwiZ2V0QXR0cmlidXRlIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsIl9zZWxmXyIsImhyZWYiLCJhdHRyIiwicG9zdCIsImNwIiwibm90aWZ5IiwibGVuZ3RoIiwicmVtb3ZlIiwiY2xvc2VzdCIsIiR3cmFwIiwiaXRlcmF0aW9uIiwicGFyc2VJbnQiLCJkYXRhIiwidHBsIiwiYXBwZW5kIiwidGVtcGxhdGUiLCJ3aGljaCIsInJlZHVjaW5nIiwiZm9ybWF0IiwidmFsdWUiLCJ2YWwiLCJyZXN1bHQiLCJyZXBsYWNlIiwicmVnZXgiLCJ0ZXN0IiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwia2V5Q29kZSIsImluZGV4T2YiLCJmaWxlTWFuYWdlciIsImZ1bGxDYWxlbmRhciIsInJlbW92ZUV2ZW50IiwiaWQiLCJjYWxsYmFjayIsImFqYXgiLCJ1cmwiLCJBRE1JTl9ESVIiLCJ0eXBlIiwic3VjY2VzcyIsImRhdGFUeXBlIiwiY2hhbmdlRXZlbnQiLCJldmVudCIsInN0YXJ0IiwiZW5kIiwiY3JlYXRlRXZlbnQiLCJpbnB1dCIsImFjdGlvbiIsIm1ldGhvZCIsInByZXBhcmVFdmVudCIsIiRjYWxlbmRhciIsImlzQ3JlYXRlIiwia2V5cyIsIk9iamVjdCIsImNvdW50IiwiZXhjZWxsZW50IiwiZm9yRWFjaCIsIm5hbWUiLCJpbmRleCIsInNwbGl0IiwiY2xvc2VQb3B1cCIsIiRwb3B1cCIsInByZXBhcmVFZGl0RXZlbnQiLCJvcGVuUG9wdXAiLCJmaW5kIiwic2VsZWN0aXplIiwianNjb2xvciIsImluc3RhbGwiLCIkZm9ybSIsImZvcm1kYXRhIiwic2VyaWFsaXplQXJyYXkiLCJyZXNwb25jZSIsInRvZGF5RGF0ZSIsIm1vbWVudCIsInN0YXJ0T2YiLCJZRVNURVJEQVkiLCJjbG9uZSIsInN1YnRyYWN0IiwiVE9EQVkiLCJUT01PUlJPVyIsImFkZCIsIlNUQVJUX1dFRUsiLCJFTkRfV0VFSyIsImVuZE9mIiwiY29uZmlnIiwibGFuZyIsImhlaWdodCIsInRpbWV6b25lIiwiaGVhZGVyIiwibGVmdCIsInJpZ2h0IiwiZXZlbnRMaW1pdCIsImxhenlGZXRjaGluZyIsImRlZmF1bHRWaWV3IiwiZGVmYXVsdERhdGUiLCJuYXZMaW5rcyIsImVkaXRhYmxlIiwiZHJvcHBhYmxlIiwic2VsZWN0YWJsZSIsInNlbGVjdEhlbHBlciIsImFzcGVjdFJhdGlvIiwiYWxsRGF5U2xvdCIsIm1pblRpbWUiLCJtYXhUaW1lIiwic25hcER1cmF0aW9uIiwic2xvdER1cmF0aW9uIiwic2xvdExhYmVsRm9ybWF0Iiwic2NoZWR1bGVyTGljZW5zZUtleSIsImVhY2giLCJncm91cCIsInNlbGVjdCIsImV2ZW50UmVuZGVyIiwiZWxlbWVudCIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJjb25maXJtIiwiZXYiLCJldmVudERyb3AiLCJldmVudFJlc2l6ZSIsImV2ZW50c0pzb24iLCJldmVudHMiLCJsaW5rIiwiZXZlbnRfaWQiLCIkY2xvc2VzdFBvcHVwIiwib25fbG9hZCIsIm1hc2siLCIkdGFibGUiLCJidXR0b24iLCJmbGFnIiwidGFibGVUb2dnbGUiLCJtaW4iLCJtYXgiLCJzbGlkZXIiLCJwcm92aWRlciIsIm1hcENvbnRlaW5lciIsIl9yZWRhY3RvciIsImluaXQiLCJoaWdodGxpZ2h0IiwiX2VkaXRvciIsIiR0YXJnZXQiLCIkaW5wdXQiLCJ0b2dnbGVDbGFzcyIsInByb3AiLCJoYXNDbGFzcyIsImJpbmRpbmciLCJ1cGxvYWQiLCJ2aXNpYmlsaXR5IiwiY3NzIiwic29ydGFibGUiLCJoYW5kbGUiLCJwdWxsUGxhY2Vob2xkZXIiLCJib2R5Q2xhc3MiLCJkcmFnZ2VkQ2xhc3MiLCJjb250YWluZXJTZWxlY3RvciIsIml0ZW1QYXRoIiwiaXRlbVNlbGVjdG9yIiwicGxhY2Vob2xkZXIiLCJvbkRyb3AiLCIkaXRlbSIsImNvbnRhaW5lciIsIl9zdXBlciIsInJlbW92ZUF0dHIiLCIkcGFnZSIsInRpdGxlIiwidG9vbHRpcCIsInBvc190b3AiLCJvZmZzZXQiLCJ0b3AiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiY2xhc3NOYW1lIiwic3R5bGUiLCIkdG9vbHRpcCIsInBvcG92ZXIiLCJzdHJ1Y3R1cmVfdHJlZSIsImVxIiwicGF0aCIsIm5lc3RhYmxlIiwibWF4RGVwdGgiLCJkcmFnU3RvcCIsImVsIiwidGFyZ2V0IiwicGFyZW50IiwibmV4dCIsIm9mZnNldFBhcmVudCIsImlzTmFOIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwib2lkIiwicGlkIiwibmlkIiwiYWZ0ZXJFeHBhbmQiLCJyZW1vdmVDb29raWUiLCJhZnRlckNvbGxhcHNlIiwiY29va2llIiwiZXhwaXJlcyIsInJlYWR5IiwiZGF0ZXBpY2tlciIsIm1ldGFDb3VudGVyIiwic2VvQ3Jvd2wiLCJkcm9wZG93biIsInRhYmxlVG9nZ2xlTGlzdCIsImNsZWRpdG9yIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVI7O0FBRUEsU0FBU0MsV0FBVCxHQUNBO0FBQ0ksUUFBSUMsWUFBWSxJQUFJQyxXQUFKLENBQWdCLGNBQWhCLEVBQWdDO0FBQzVDQyxjQUFNLGNBQVNDLE9BQVQsRUFBa0I7QUFDcEJDLGNBQUVELE9BQUYsRUFBV0UsUUFBWCxDQUFvQixRQUFwQjs7QUFFQUMsdUJBQVcsWUFBVTtBQUNqQkYsa0JBQUVELE9BQUYsRUFBV0ksV0FBWCxDQUF1QixRQUF2QjtBQUNILGFBRkQsRUFFRyxHQUZIOztBQUlBLG1CQUFPSixRQUFRSyxZQUFSLENBQXFCLGdCQUFyQixDQUFQO0FBQ0g7QUFUMkMsS0FBaEMsQ0FBaEI7O0FBWUFKLE1BQUUsTUFBRixFQUFVSyxFQUFWLENBQWEsT0FBYixFQUFzQixpQkFBdEIsRUFBeUMsVUFB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0ZIOztBQUVEeEwsRUFBRU4sUUFBRixFQUFZaU4sS0FBWixDQUFrQixZQUFVO0FBQ3hCbEk7QUFDQW1JO0FBQ0FDO0FBQ0FDO0FBQ0FuTjtBQUNBeUk7QUFDQXZILE9BQUdrTSxRQUFIO0FBQ0FsTSxPQUFHbU0sZUFBSDtBQUNBbk0sT0FBR29NLFFBQUg7QUFDQXZJLFlBQVFDLE9BQVI7QUFDSCxDQVhEIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZCA9IGRvY3VtZW50O1xuXG5mdW5jdGlvbiBrZXlDb250cm9scygpXG57XG4gICAgdmFyIGNsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmRKUygnLmotY2xpcGJvYXJkJywge1xuICAgICAgICB0ZXh0OiBmdW5jdGlvbih0cmlnZ2VyKSB7XG4gICAgICAgICAgICAkKHRyaWdnZXIpLmFkZENsYXNzKCdjb3BpZWQnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICQodHJpZ2dlcikucmVtb3ZlQ2xhc3MoXCJjb3BpZWRcIik7XG4gICAgICAgICAgICB9LCA3MDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2xpcGJvYXJkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJib2R5XCIpLm9uKCdjbGljaycsICcucmVtb3ZlLXRyaWdnZXInLCBmdW5jdGlvbiAoZSl7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIF9zZWxmXyA9IHRoaXMsIGhyZWYgPSAkKF9zZWxmXykuYXR0cignaHJlZicpO1xuXG4gICAgICAgICQucG9zdChocmVmLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY3Aubm90aWZ5KCfQo9C00LDQu9C10L3QvicsICdpbmZvJyk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoJChfc2VsZl8pLmF0dHIoJ3JlbCcpKSAhPT0gJ3VuZGVmaW5lZCcgJiYgJCgkKF9zZWxmXykuYXR0cigncmVsJykpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJCgkKF9zZWxmXykuYXR0cigncmVsJykpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgJChfc2VsZl8pLmNsb3Nlc3QoJ3RyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAhMTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLXJlbW92ZS1pdGVtJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcblxuICAgICAgICB2YXIgX3NlbGZfID0gdGhpcywgaHJlZiA9ICQoX3NlbGZfKS5hdHRyKCdocmVmJyk7XG5cbiAgICAgICAgJC5wb3N0KGhyZWYsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjcC5ub3RpZnkoJ9Cj0LTQsNC70LXQvdC+JywgJ2luZm8nKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZigkKF9zZWxmXykuYXR0cigncmVsJykpICE9PSAndW5kZWZpbmVkJyAmJiAkKCQoX3NlbGZfKS5hdHRyKCdyZWwnKSkubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKCQoX3NlbGZfKS5hdHRyKCdyZWwnKSkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKF9zZWxmXykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICExO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtYWRkLXRlbXBsYXRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgdmFyICR3cmFwID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtdGVtcGxhdGUtd3JhcHBlcicpLFxuICAgICAgICAgICAgaXRlcmF0aW9uID0gcGFyc2VJbnQoJCh0aGlzKS5kYXRhKCdpdGVyYXRpb24nKSksXG4gICAgICAgICAgICB0cGwgPSAkKHRoaXMpLmRhdGEoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICBkYXRhID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpdGVyYXRpb24gIT09ICd1bmRlZmluZWQnKVxuICAgICAgICB7XG4gICAgICAgICAgICBkYXRhWydpZCddID0gaXRlcmF0aW9uO1xuICAgICAgICAgICAgaXRlcmF0aW9uICs9IC0xO1xuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdpdGVyYXRpb24nLCBpdGVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHdyYXAuYXBwZW5kKHRlbXBsYXRlKHRwbCwgZGF0YSkpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdrZXlkb3duJywgJy5yZWR1Y2luZy10cmlnZ2VyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUud2hpY2ggPT0gMzggfHwgZS53aGljaCA9PSA0MCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcmVkdWNpbmcgPSAkKHRoaXMpLmRhdGEoJ3JlZHVjaW5nJykgfHwgMTAsXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gJCh0aGlzKS5kYXRhKCdmb3JtYXQnKSxcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCQodGhpcykudmFsKCkpIHx8IDAsIHJlc3VsdCA9IDA7XG5cbiAgICAgICAgICAgIGlmIChlLndoaWNoID09IDM4KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlICsgcmVkdWNpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlLndoaWNoID09IDQwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlIC0gcmVkdWNpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXN1bHQgPCAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoZm9ybWF0KSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gJz9pJScucmVwbGFjZSgnP2knLCByZXN1bHQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHRoaXMpLnZhbChyZXN1bHQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgJCgnYm9keScpLm9uKCdrZXlwcmVzcycsICcubGF0aW4nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciByZWdleCA9IC9bXkEtWmEtel0vZztcbiAgICAgICAgaWYgKHJlZ2V4LnRlc3QoU3RyaW5nLmZyb21DaGFyQ29kZShlLmtleUNvZGUpKSkge1xuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiYm9keVwiKS5vbigna2V5cHJlc3MnLCAnLmludGVnZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoWzAsIDgsIDEzLCAzOCwgNDBdLmluZGV4T2YoIGUud2hpY2ggKSA8IDAgJiYgKGUud2hpY2ggPCA0OCB8fCBlLndoaWNoID4gNTcpKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJib2R5XCIpLm9uKCdrZXlwcmVzcycsICcuZmxvYXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIFswLCA4LCAxMywgMzgsIDQwLCA0NCwgNDZdLmluZGV4T2YoIGUud2hpY2ggKSA8IDAgJiYgKCBlLndoaWNoIDwgNDggfHwgZS53aGljaCA+IDU3ICkgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZmlsZU1hbmFnZXIoKSB7fVxuXG5mdW5jdGlvbiBmdWxsQ2FsZW5kYXIoKVxue1xuICAgIGNvbnN0IHJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gKGlkLCBjYWxsYmFjaykge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgLyR7QURNSU5fRElSfS9tZXRhL3NoZWR1bGVyL2RlbGV0ZWAsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJ2lkJzogaWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBjYWxsYmFjayxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYC8ke0FETUlOX0RJUn0vbWV0YS9zaGVkdWxlci9lZGl0YCxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAnaWQnOiBldmVudC5pZCxcbiAgICAgICAgICAgICAgICAnc3RhcnQnOiBldmVudC5zdGFydC5mb3JtYXQoKSxcbiAgICAgICAgICAgICAgICAnZW5kJzogZXZlbnQuZW5kLmZvcm1hdCgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogY2FsbGJhY2ssXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlRXZlbnQgPSBmdW5jdGlvbiAoaW5wdXQsIGNhbGxiYWNrKSB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGlucHV0LmFjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IGlucHV0Lm1ldGhvZCxcbiAgICAgICAgICAgIGRhdGE6IGlucHV0LmRhdGEsXG4gICAgICAgICAgICBzdWNjZXNzOiBjYWxsYmFjayxcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVwYXJlRXZlbnQgPSBmdW5jdGlvbiAoJGNhbGVuZGFyLCBkYXRhLCBpc0NyZWF0ZSlcbiAgICB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcblxuICAgICAgICBjb25zdCBjb3VudCA9IGtleXMubGVuZ3RoIC0gMTtcblxuICAgICAgICBjb25zdCBldmVudCA9IHt9O1xuXG4gICAgICAgIGNvbnN0IGV4Y2VsbGVudCA9IFtcbiAgICAgICAgICAgICdpZCcsICdncm91cCcsICd0aXRsZScsICdpdGVtJywgJ2NvbG9yJywgJ3R5cGVzJywgJ3N0YXJ0JywgJ2VuZCcsICdleHRyYScsICd2aXNpYmxlJ1xuICAgICAgICBdO1xuXG4gICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbihuYW1lLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKGV4Y2VsbGVudC5pbmRleE9mKG5hbWUpID49IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZXZlbnRbbmFtZV0gPSBkYXRhW25hbWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ3R5cGVzJyAmJiBkYXRhW25hbWVdICE9PSAnJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBldmVudFtuYW1lXSA9IGRhdGFbbmFtZV0uc3BsaXQoJywnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBjb3VudClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDcmVhdGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKCdyZW5kZXJFdmVudCcsIGV2ZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVmZXRjaEV2ZW50cycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKCd1cGRhdGVFdmVudCcsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGNsb3NlUG9wdXAgPSBmdW5jdGlvbiAoJHBvcHVwKVxuICAgIHtcbiAgICAgICAgJHBvcHVwLnJlbW92ZUNsYXNzKCdpcy1hbmltYXRlZCcpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJHBvcHVwLnJlbW92ZUNsYXNzKCdpcy12aXNpYmxlJykucmVtb3ZlKCk7XG4gICAgICAgIH0sIDM1MCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlcGFyZUVkaXRFdmVudCA9IGZ1bmN0aW9uICgkY2FsZW5kYXIsIGRhdGEpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IGNvdW50ID0ga2V5cy5sZW5ndGggLSAxO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50ID0ge307XG5cbiAgICAgICAgY29uc3QgZXhjZWxsZW50ID0gW1xuICAgICAgICAgICAgJ2lkJywgJ2dyb3VwJywgJ3RpdGxlJywgJ2l0ZW0nLCAnY29sb3InLCAndHlwZXMnLCAnZXh0cmEnLCAndmlzaWJsZSdcbiAgICAgICAgXTtcblxuICAgICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24obmFtZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChleGNlbGxlbnQuaW5kZXhPZihuYW1lKSA+PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGV2ZW50W25hbWVdID0gZGF0YVtuYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICd0eXBlcycgJiYgZGF0YVtuYW1lXSAhPT0gJycpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZXZlbnRbbmFtZV0gPSBkYXRhW25hbWVdLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gY291bnQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZXZlbnQuYWN0aW9uID0gYC8ke0FETUlOX0RJUn0vbWV0YS9zaGVkdWxlci9lZGl0YDtcbiAgICAgICAgICAgICAgICBvcGVuUG9wdXAoJGNhbGVuZGFyLCBldmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBvcGVuUG9wdXAgPSBmdW5jdGlvbiAoJGNhbGVuZGFyLCBkYXRhLCBpc0NyZWF0ZSl7XG4gICAgICAgIGNvbnN0ICRwb3B1cCA9ICQodGVtcGxhdGUoJ3RwbF9zY2hlZHVsZScsIGRhdGEgfHwge30pKTtcblxuICAgICAgICBpZiAoISQoJ2JvZHknKS5maW5kKCcjc2NoZWR1bGUtcG9wdXAnKS5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQoJHBvcHVwKTtcblxuICAgICAgICAgICAgJHBvcHVwLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdGl6ZSgpO1xuICAgICAgICAgICAgICAgIGpzY29sb3IuaW5zdGFsbCgpO1xuICAgICAgICAgICAgICAgICRwb3B1cC5hZGRDbGFzcygnaXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDUwKTtcblxuICAgICAgICAgICAgJHBvcHVwLmZpbmQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiAoZS5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0ICRmb3JtID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICgkZm9ybS5kYXRhKCdpcy1idXN5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGFjdGlvbiA9ICRmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9ICRmb3JtLmF0dHIoJ21ldGhvZCcpIHx8ICdwb3N0JztcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtZGF0YSA9ICRmb3JtLnNlcmlhbGl6ZUFycmF5KCk7XG5cbiAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCdpcy1idXN5JywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBjcmVhdGVFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZm9ybWRhdGEsXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnaXMtYnVzeScsIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICBjbG9zZVBvcHVwKCRwb3B1cCk7XG4gICAgICAgICAgICAgICAgICAgIHByZXBhcmVFdmVudCgkY2FsZW5kYXIsIHJlc3BvbmNlLCBpc0NyZWF0ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHBvcHVwLmZpbmQoJy5qLXNjaGVkdWxlLXBvcHVwLWNsb3NlJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgY2xvc2VQb3B1cCgkcG9wdXApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoJCgnLmZ1bGxjYWxlbmRhcicpLmxlbmd0aClcbiAgICB7XG4gICAgICAgIGNvbnN0IHRvZGF5RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xuICAgICAgICBjb25zdCBZRVNURVJEQVkgPSB0b2RheURhdGUuY2xvbmUoKS5zdWJ0cmFjdCgxLCAnZGF5JykuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgIGNvbnN0IFRPREFZID0gdG9kYXlEYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgICAgICBjb25zdCBUT01PUlJPVyA9IHRvZGF5RGF0ZS5jbG9uZSgpLmFkZCgxLCAnZGF5JykuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgICAgIGNvbnN0IFNUQVJUX1dFRUsgPSBtb21lbnQoJzIwMTgtMDEtMDEnKS5zdGFydE9mKCd3ZWVrJyk7XG4gICAgICAgIGNvbnN0IEVORF9XRUVLID0gbW9tZW50KCcyMDE4LTAxLTAxJykuZW5kT2YoJ3dlZWsnKTtcblxuICAgICAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgICAgICBsYW5nOiAncnUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnYXV0bycsXG4gICAgICAgICAgICB0aW1lem9uZTonbG9jYWwnLFxuICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgbGVmdDogJ2FnZW5kYVdlZWssYWdlbmRhRGF5JyxcbiAgICAgICAgICAgICAgICByaWdodDogJydcbiAgICAgICAgICAgICAgICAvLyBsZWZ0OiAncHJvbXB0RXZlbnQgdG9kYXkgcHJldixuZXh0JyxcbiAgICAgICAgICAgICAgICAvLyBjZW50ZXI6ICd0aXRsZScsXG4gICAgICAgICAgICAgICAgLy8gcmlnaHQ6ICdtb250aCxhZ2VuZGFXZWVrLGFnZW5kYURheSxsaXN0V2VlaydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudExpbWl0OiBmYWxzZSxcbiAgICAgICAgICAgIGxhenlGZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICBkZWZhdWx0VmlldzogJ2FnZW5kYVdlZWsnLFxuICAgICAgICAgICAgZGVmYXVsdERhdGU6ICcyMDE4LTAxLTAxJyxcbiAgICAgICAgICAgIG5hdkxpbmtzOiB0cnVlLFxuICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBkcm9wcGFibGU6IHRydWUsXG4gICAgICAgICAgICBzZWxlY3RhYmxlOiB0cnVlLFxuICAgICAgICAgICAgc2VsZWN0SGVscGVyOiB0cnVlLFxuICAgICAgICAgICAgYXNwZWN0UmF0aW86IDIsXG4gICAgICAgICAgICBhbGxEYXlTbG90OiBmYWxzZSxcbiAgICAgICAgICAgIG1pblRpbWU6ICcwNzowMDowMCcsXG4gICAgICAgICAgICBtYXhUaW1lOiAnMjE6MDA6MDAnLFxuICAgICAgICAgICAgc25hcER1cmF0aW9uOiAnMDA6MDU6MDAnLFxuICAgICAgICAgICAgc2xvdER1cmF0aW9uOiAnMDA6MDU6MDAnLFxuICAgICAgICAgICAgc2xvdExhYmVsRm9ybWF0OiAnSCg6bW0pJyxcbiAgICAgICAgICAgIHNjaGVkdWxlckxpY2Vuc2VLZXk6ICdHUEwtTXktUHJvamVjdC1Jcy1PcGVuLVNvdXJjZSdcbiAgICAgICAgfTtcblxuICAgICAgICAkKCcuZnVsbGNhbGVuZGFyJykuZWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcblxuICAgICAgICAgICAgY29uc3QgJGNhbGVuZGFyID0gJChgIyR7aWR9YCk7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJGNhbGVuZGFyLmRhdGEoJ25hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gJChgaW5wdXRbbmFtZT1cIiR7bmFtZX1cIl1gKS52YWwoKTtcblxuICAgICAgICAgICAgLy8gY29uZmlnLmN1c3RvbUJ1dHRvbnMgPSB7XG4gICAgICAgICAgICAvLyAgICAgcHJvbXB0RXZlbnQ6IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgdGV4dDogJ9CU0L7QsdCw0LLQuNGC0Ywg0Y3Qu9C10LzQtdC90YInLFxuICAgICAgICAgICAgLy8gICAgICAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHByb21wdCgn0JfQsNCz0L7Qu9C+0LLQvtC6INGB0L7QsdGL0YLQuNGPOicpO1xuXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBjcmVhdGVFdmVudCh7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGlkOiAxMDAwLFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb2xvcjogJyNmMDAnLFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cCxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBlbmQ6IGVuZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uY2UpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZUV2ZW50KCRjYWxlbmRhciwgcmVzcG9uY2UpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfTtcblxuICAgICAgICAgICAgY29uZmlnLnNlbGVjdCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgICAgICAgICBvcGVuUG9wdXAoJGNhbGVuZGFyLCB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogYC8ke0FETUlOX0RJUn0vbWV0YS9zaGVkdWxlci9hZGRgLFxuICAgICAgICAgICAgICAgICAgICBncm91cDogZ3JvdXAsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgZW5kOiBlbmRcbiAgICAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICRjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ3Vuc2VsZWN0Jyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25maWcuZXZlbnRSZW5kZXIgPSBmdW5jdGlvbihldmVudCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCB0aW1lb3V0ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXJlRWRpdEV2ZW50KCRjYWxlbmRhciwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oJ9Cj0LTQsNC70LjRgtGMPycpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50KGV2ZW50LmlkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKFwicmVtb3ZlRXZlbnRzXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXYuaWQgPT0gZXZlbnQuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uZmlnLmV2ZW50RHJvcCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uZmlnLmV2ZW50UmVzaXplID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VFdmVudChldmVudCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIChldmVudHNKc29uW25hbWVdKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuZXZlbnRzID0gZXZlbnRzSnNvbltuYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChcImJvZHlcIikub24oJ2NsaWNrJywgJy5qLXJlbW92ZS1ldmVudCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmIChsaW5rLmRhdGEoJ2lzLWJ1c3knKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGluay5kYXRhKCdpcy1idXN5JywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBldmVudF9pZCA9IGxpbmsuZGF0YSgnZXZlbnQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkY2xvc2VzdFBvcHVwID0gbGluay5jbG9zZXN0KCcuc2NoZWR1bGUtcG9wdXAnKTtcblxuICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50KGV2ZW50X2lkLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNhbGVuZGFyLmZ1bGxDYWxlbmRhcihcInJlbW92ZUV2ZW50c1wiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldi5pZCA9PSBldmVudF9pZDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2xvc2VQb3B1cCgkY2xvc2VzdFBvcHVwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKGNvbmZpZyk7XG5cbiAgICAgICAgICAgICRjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ2NoYW5nZVZpZXcnLCAnYWdlbmRhV2VlaycsIHtcbiAgICAgICAgICAgICAgICBzdGFydDogU1RBUlRfV0VFSyxcbiAgICAgICAgICAgICAgICBlbmQ6IEVORF9XRUVLXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVuZGVyJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gb25fbG9hZCgpXG57XG4gICAgZmlsZU1hbmFnZXIoKTtcblxuICAgIGZ1bGxDYWxlbmRhcigpO1xuXG4gICAgJChcIi53YXRjaC1kYXRlbWFza1wiKS5tYXNrKFwiOTkvOTkvOTk5OVwiKTtcbiAgICAkKFwiLndhdGNoLXBob25lbWFza1wiKS5tYXNrKFwiKyA3ICg5OTkpIDk5OS05OS05OVwiKTtcbiAgICAkKFwiLndhdGNoLWNhcnRudW1iZXJcIikubWFzayhcIjk5OS05OTktOTk5XCIpO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtc2l6ZS1kZWxldGUnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCd0cicpLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtYWRkLXNpemUnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcblxuICAgICAgICB2YXIgJHRhYmxlID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc2l6ZS1saXN0JykuZmluZCgndGFibGUnKS5maW5kKCd0Ym9keScpLFxuICAgICAgICAgICAgaXRlcmF0aW9uID0gcGFyc2VJbnQoJCh0aGlzKS5kYXRhKCdpdGVyYXRpb24nKSksXG4gICAgICAgICAgICBpbmRleCA9IDA7XG5cbiAgICAgICAgJHRhYmxlLmZpbmQoJ3RyJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKHBhcnNlSW50KCQodGhpcykuZGF0YSgnaW5kZXgnKSkgPiBpbmRleClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhcnNlSW50KCQodGhpcykuZGF0YSgnaW5kZXgnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGluZGV4ICsrO1xuXG4gICAgICAgICR0YWJsZS5hcHBlbmQoXG4gICAgICAgICAgICB0ZW1wbGF0ZSgndHBsX2ltYWdlX3JvdycsIHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgYnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGl0ZXJhdGlvbjogaXRlcmF0aW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgaWYgKCQoJy5qcy10YWJsZS10b2dnbGUnKS5sZW5ndGgpXG4gICAge1xuICAgICAgICAkKCcuanMtdGFibGUtdG9nZ2xlJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSwgZmxhZyl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuXG4gICAgICAgICAgICBpZiAoZmxhZykge1xuICAgICAgICAgICAgICAgIGNwLnRhYmxlVG9nZ2xlKCQodGhpcykuZGF0YSgndG9nZ2xlJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY3AudGFibGVUb2dnbGUoJCh0aGlzKS5kYXRhKCd0b2dnbGUnKSwgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICgkKCcuanMtdGFibGUtdG9nZ2xlW2RhdGEtdG9nZ2xlLWluaXQ9XCJ0cnVlXCJdJykubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICAkKCcuanMtdGFibGUtdG9nZ2xlW2RhdGEtdG9nZ2xlLWluaXQ9XCJ0cnVlXCJdJykudHJpZ2dlcignY2xpY2snLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICgkKCcuanMtc2xpZGVyJykubGVuZ3RoKVxuICAgIHtcbiAgICAgICAgJCgnLmpzLXNsaWRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICAgIHZhciB0eXBlID0gJCh0aGlzKS5kYXRhKCd0eXBlJyk7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLmRhdGEoJ3ZhbHVlJyk7XG4gICAgICAgICAgICB2YXIgbWluID0gJCh0aGlzKS5kYXRhKCdtaW4nKTtcbiAgICAgICAgICAgIHZhciBtYXggPSAkKHRoaXMpLmRhdGEoJ21heCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzbGlkZXIoaWQsIHR5cGUsIHZhbHVlLCBtaW4sIG1heCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtbWFwJykubGVuZ3RoKVxuICAgIHtcbiAgICAgICAgJCgnLmpzLW1hcCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKS5kYXRhKCdlbGVtZW50Jyk7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSAkKHRoaXMpLmRhdGEoJ3Byb3ZpZGVyJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1hcENvbnRlaW5lcihwcm92aWRlciwgZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtcmVkYWN0b3InKS5sZW5ndGgpXG4gICAge1xuICAgICAgICAkKCcuanMtcmVkYWN0b3InKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICB2YXIgdHlwZSA9ICQodGhpcykuZGF0YSgncmVkYWN0b3InKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgX3JlZGFjdG9yLmluaXQoaWQsIHR5cGUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLmpzLWVkaXRvcicpLmxlbmd0aClcbiAgICB7XG4gICAgICAgICQoJy5qcy1lZGl0b3InKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICB2YXIgdHlwZSA9ICQodGhpcykuZGF0YSgnZWRpdG9yJyk7XG4gICAgICAgICAgICB2YXIgaGlnaHRsaWdodCA9ICQodGhpcykuZGF0YSgnaGlnaHRsaWdodCcpO1xuXG4gICAgICAgICAgICBfZWRpdG9yLmluaXQoaWQsIHR5cGUsIGhpZ2h0bGlnaHQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkKFwiYm9keVwiKS5vbignY2xpY2snLCAnLmpzLXRvZ2dsZS1iaW5kaW5nJywgZnVuY3Rpb24gKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJCh0aGlzKTtcblxuICAgICAgICBpZiAoJHRhcmdldC5kYXRhKCdlbGVtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkKCQodGhpcykuZGF0YSgnZWxlbWVudCcpKTtcbiAgICAgICAgICAgICR0YXJnZXQudG9nZ2xlQ2xhc3MoJ29uJykudG9nZ2xlQ2xhc3MoJ29mZicpO1xuICAgICAgICAgICAgJGlucHV0LnByb3AoJ3JlYWRvbmx5JywgISR0YXJnZXQuaGFzQ2xhc3MoJ29uJykpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicrJGlucHV0LmRhdGEoJ2JpbmRpbmctbmFtZScpKydcIl0nKS50cmlnZ2VyKCdibHVyJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgkKCcuanMtYmluZGluZycpLmxlbmd0aClcbiAgICB7XG4gICAgICAgICQoJy5qcy1iaW5kaW5nJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdqcy1iaW5kaW5nLWluaXQnKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBiaW5kaW5nKCQodGhpcykuZGF0YSgnYmluZGluZy1uYW1lJyksICQodGhpcykuZGF0YSgnYmluZGluZy1lbGVtZW50JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLmpzLWZpbGV1cGxvYWQnKS5sZW5ndGgpXG4gICAge1xuICAgICAgICAkLnVwbG9hZC5pbml0KCk7XG4gICAgfVxuXG4gICAgJCgnYm9keScpLm9uKCdtb3VzZWVudGVyJywgJy5qcy1zdHJ1Y3R1cmUtY29udHJvbGwnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc3RydWN0dXJlX19jb250cm9sLmFuaW1hdGUnKS5yZW1vdmVDbGFzcygnYW5pbWF0ZScpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdtb3VzZWxlYXZlJywgJy5qcy1zdHJ1Y3R1cmUtY29udHJvbGwnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKCcuc3RydWN0dXJlX19jb250cm9sJykuYWRkQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm1lbnUtdHJpZ2dlcicsIGZ1bmN0aW9uKGUpe1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJyNwYWdlJykudG9nZ2xlQ2xhc3MoJ3BhZ2Utb3BlbicpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cbiAgICAgICAgaWYgKCEkKCcjcGFnZScpLmhhc0NsYXNzKCdwYWdlLW9wZW4nKSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmlzaWJpbGl0eSA9ICdoaWRkZW4nXG4gICAgICAgIH1cblxuICAgICAgICAkKCcjb3ZlcmxheScpLmNzcyh7XG4gICAgICAgICAgICAndmlzaWJpbGl0eSc6IHZpc2liaWxpdHlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICExO1xuICAgIH0pO1xuXG4gICAgJCgnI21ldGFfZGF0YScpLnNvcnRhYmxlKHtcbiAgICAgICAgaGFuZGxlOiAnLmpzLXRyaWdnZXItZHJhZycsXG4gICAgICAgIHB1bGxQbGFjZWhvbGRlcjogZmFsc2UsXG4gICAgICAgIGJvZHlDbGFzczogJ2RyYWdnaW5nJyxcbiAgICAgICAgZHJhZ2dlZENsYXNzOiAnZHJhZ2dlZCcsXG4gICAgICAgIGNvbnRhaW5lclNlbGVjdG9yOiAndGFibGUnLFxuICAgICAgICBpdGVtUGF0aDogJz4gdGJvZHknLFxuICAgICAgICBpdGVtU2VsZWN0b3I6ICd0cicsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnPHRyIGNsYXNzPVwicGxhY2Vob2xkZXJcIi8+JyxcbiAgICAgICAgb25Ecm9wOiBmdW5jdGlvbiAoJGl0ZW0sIGNvbnRhaW5lciwgX3N1cGVyLCBldmVudCkge1xuICAgICAgICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2RyYWdnZWQnKS5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnZHJhZ2dpbmcnKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCdib2R5Jykub24oJ21vdXNlZW50ZXInLCAnLnRyaWdnZXItbmF2aWdhdGlvbicsIGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgJGl0ZW0gPSAkKHRoaXMpLCAkcGFnZSA9ICQoJyNwYWdlJyksIHRpdGxlID0gJGl0ZW0uYXR0cigncmVsJyksIHRvb2x0aXAsIGlkID0gJ3Rvb2x0aXAtJyArICRpdGVtLmF0dHIoJ2lkJyk7XG5cbiAgICAgICAgaWYgKHRpdGxlICYmICEkKCcjJytpZCkubGVuZ3RoICYmICEkcGFnZS5oYXNDbGFzcygncGFnZS1vcGVuJykpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwb3NfdG9wID0gJGl0ZW0ub2Zmc2V0KCkudG9wICsgMTA7XG5cbiAgICAgICAgICAgIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICB0b29sdGlwLmlkID0gaWQ7XG4gICAgICAgICAgICB0b29sdGlwLmlubmVySFRNTCA9IHRpdGxlO1xuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc05hbWUgPSAnbmF2aWdhdGlvbl9fdG9vbHRpcCBuYXZpZ2F0aW9uX190b29sdGlwX2FuaW1hdGUnO1xuICAgICAgICAgICAgdG9vbHRpcC5zdHlsZS50b3AgPSBwb3NfdG9wICsgJ3B4JztcblxuICAgICAgICAgICAgJHBhZ2UuYXBwZW5kKHRvb2x0aXApO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCh0b29sdGlwKS5yZW1vdmVDbGFzcygnbmF2aWdhdGlvbl9fdG9vbHRpcF9hbmltYXRlJyk7XG4gICAgICAgICAgICB9LCAzMCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBcbiAgICAkKCdib2R5Jykub24oJ21vdXNlbGVhdmUnLCAnLnRyaWdnZXItbmF2aWdhdGlvbicsIGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgaWQgPSAndG9vbHRpcC0nICsgJCh0aGlzKS5hdHRyKCdpZCcpO1xuXG4gICAgICAgIGlmICgkKCcjJytpZCkubGVuZ3RoKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgJHRvb2x0aXAgPSAkKCcjJytpZCk7XG5cbiAgICAgICAgICAgICR0b29sdGlwLmFkZENsYXNzKCduYXZpZ2F0aW9uX190b29sdGlwX2FuaW1hdGUnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICR0b29sdGlwLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcud3JhcHBlcicsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAkKCcjcGFnZScpLnJlbW92ZUNsYXNzKCdwYWdlLW9wZW4nKTtcbiAgICAgICAgJCgnI292ZXJsYXknKS5jc3Moe1xuICAgICAgICAgICAgJ3Zpc2liaWxpdHknOiAnaGlkZGVuJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignbW91c2VlbnRlcicsICcudHJpZ2dlci10b29sdGlwJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICQodGhpcykuZGF0YSgneHRpdGxlJywgJCh0aGlzKS5wcm9wKCd0aXRsZScpKTtcbiAgICAgICAgJCh0aGlzKS5wcm9wKCd0aXRsZScsICcnKTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignbW91c2VsZWF2ZScsICcudHJpZ2dlci10b29sdGlwJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICQodGhpcykucHJvcCgndGl0bGUnLCAkKHRoaXMpLmRhdGEoJ3h0aXRsZScpKTtcbiAgICAgICAgJCh0aGlzKS5kYXRhKCd4dGl0bGUnLCAnJyk7XG4gICAgfSk7XG5cbiAgICAkKCcudHJpZ2dlci1wb3BvdmVyJykucG9wb3ZlcigpO1xuXG4gICAgaWYgKCQoJy5uZXN0YWJsZS10cmVlJykubGVuZ3RoKVxuICAgIHtcbiAgICAgICAgdmFyIHN0cnVjdHVyZV90cmVlID0gJCgnLm5lc3RhYmxlLXRyZWUnKS5lcSgwKTtcblxuICAgICAgICBpZiAodHlwZW9mKHN0cnVjdHVyZV90cmVlLmRhdGEoJ3BhdGgnKSkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZihzdHJ1Y3R1cmVfdHJlZS5kYXRhKCdncm91cCcpKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwYXRoID0gc3RydWN0dXJlX3RyZWUuZGF0YSgncGF0aCcpLFxuICAgICAgICAgICAgICAgIGdyb3VwID0gcGFyc2VJbnQoc3RydWN0dXJlX3RyZWUuZGF0YSgnZ3JvdXAnKSk7XG5cbiAgICAgICAgICAgIHN0cnVjdHVyZV90cmVlLm5lc3RhYmxlKHtcbiAgICAgICAgICAgICAgICBncm91cDogIGdyb3VwLFxuICAgICAgICAgICAgICAgIG1heERlcHRoOiAyMCxcbiAgICAgICAgICAgICAgICBkcmFnU3RvcDogZnVuY3Rpb24oZWwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0LCBwYXJlbnQsIG5leHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHBhcnNlSW50KGVsWzBdLmlkLnNwbGl0KCctJylbMV0pO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJzZUludChlbFswXS5vZmZzZXRQYXJlbnQub2Zmc2V0UGFyZW50LmlkLnNwbGl0KCctJylbMV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihwYXJlbnQpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBncm91cDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsWzBdLm5leHRFbGVtZW50U2libGluZyAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHBhcnNlSW50KGVsWzBdLm5leHRFbGVtZW50U2libGluZy5pZC5zcGxpdCgnLScpWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNOYU4odGFyZ2V0KSAmJiAhaXNOYU4ocGFyZW50KSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnL3VwZGF0ZVN0cnVjdHVyZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvaWQ6IHRhcmdldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlkOiBwYXJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5pZDogbmV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZnRlckV4cGFuZDogZnVuY3Rpb24oZWwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5pZC5zcGxpdCgnLScpWzFdO1xuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShwYXRoICsgJ19jb2xsYXBzZV8nICsgaWQsIHsgcGF0aDogJy8nIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWZ0ZXJDb2xsYXBzZTogZnVuY3Rpb24oZWwpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5pZC5zcGxpdCgnLScpWzFdO1xuICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZShwYXRoICsgJ19jb2xsYXBzZV8nICsgaWQsICcxJywgeyBleHBpcmVzOiAzMCwgcGF0aDogJy8nIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLypcbiAgICBkb09uTG9hZCgnc3RydWN0dXJlJyk7XG4gICAgYnVpbGRUcmVlKCdzdHJ1Y3R1cmUnLCAnaW5kZXgnKTtcbiBcbiAgICAkKCcjbmVzdGFibGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpXG4gICAge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICBhY3Rpb24gPSB0YXJnZXQuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdleHBhbmQtYWxsJykge1xuICAgICAgICAgICAgJCgnLmRkJykubmVzdGFibGUoJ2V4cGFuZEFsbCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdjb2xsYXBzZS1hbGwnKSB7XG4gICAgICAgICAgICAkKCcuZGQnKS5uZXN0YWJsZSgnY29sbGFwc2VBbGwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgIGxpc3QuZWwuZmluZChsaXN0Lm9wdGlvbnMuaXRlbU5vZGVOYW1lKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsaXN0LmNvbGxhcHNlSXRlbSgkKHRoaXMpKTtcbiAgICB9KTtcblxuXG4gICAgZXhwYW5kSXRlbTogZnVuY3Rpb24obGkpXG4gICAge1xuICAgICAgICBsaS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiZXhwYW5kXCJdJykuaGlkZSgpO1xuICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiY29sbGFwc2VcIl0nKS5zaG93KCk7XG4gICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLnNob3coKTtcbiAgICB9LFxuXG4gICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbihsaSlcbiAgICB7XG4gICAgICAgIHZhciBsaXN0cyA9IGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpO1xuICAgICAgICBpZiAobGlzdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbj1cImNvbGxhcHNlXCJdJykuaGlkZSgpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbj1cImV4cGFuZFwiXScpLnNob3coKTtcbiAgICAgICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB2YXIgdXBkYXRlT3V0cHV0ID0gZnVuY3Rpb24oZSlcbiAgICB7XG4gICAgICAgIHZhciBsaXN0ICAgPSBlLmxlbmd0aCA/IGUgOiAkKGUudGFyZ2V0KSxcbiAgICAgICAgICAgIG91dHB1dCA9IGxpc3QuZGF0YSgnb3V0cHV0Jyk7XG4gICAgICAgIGlmICh3aW5kb3cuSlNPTikge1xuICAgICAgICAgICAgb3V0cHV0LnZhbCh3aW5kb3cuSlNPTi5zdHJpbmdpZnkobGlzdC5uZXN0YWJsZSgnc2VyaWFsaXplJykpKTsvLywgbnVsbCwgMikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0LnZhbCgnSlNPTiBicm93c2VyIHN1cHBvcnQgcmVxdWlyZWQgZm9yIHRoaXMgZGVtby4nKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBhY3RpdmF0ZSBOZXN0YWJsZSBmb3IgbGlzdCAxXG4gICAgJCgnI25lc3RhYmxlJykubmVzdGFibGUoe1xuICAgICAgICBncm91cDogMVxuICAgIH0pXG4gICAgLm9uKCdjaGFuZ2UnLCB1cGRhdGVPdXRwdXQpO1xuXG4gICAgLy8gYWN0aXZhdGUgTmVzdGFibGUgZm9yIGxpc3QgMlxuICAgICQoJyNuZXN0YWJsZTInKS5uZXN0YWJsZSh7XG4gICAgICAgIGdyb3VwOiAxXG4gICAgfSlcbiAgICAub24oJ2NoYW5nZScsIHVwZGF0ZU91dHB1dCk7XG5cbiAgICAvLyBvdXRwdXQgaW5pdGlhbCBzZXJpYWxpc2VkIGRhdGFcbiAgICB1cGRhdGVPdXRwdXQoJCgnI25lc3RhYmxlJykuZGF0YSgnb3V0cHV0JywgJCgnI25lc3RhYmxlLW91dHB1dCcpKSk7XG4gICAgdXBkYXRlT3V0cHV0KCQoJyNuZXN0YWJsZTInKS5kYXRhKCdvdXRwdXQnLCAkKCcjbmVzdGFibGUyLW91dHB1dCcpKSk7XG5cbiAgICAkKCcjbmVzdGFibGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpXG4gICAge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICBhY3Rpb24gPSB0YXJnZXQuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdleHBhbmQtYWxsJykge1xuICAgICAgICAgICAgJCgnLmRkJykubmVzdGFibGUoJ2V4cGFuZEFsbCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdjb2xsYXBzZS1hbGwnKSB7XG4gICAgICAgICAgICAkKCcuZGQnKS5uZXN0YWJsZSgnY29sbGFwc2VBbGwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnI25lc3RhYmxlMycpLm5lc3RhYmxlKCk7XG4gICAgKi9cbn1cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICBzZWxlY3RpemUoKTtcbiAgICBkYXRlcGlja2VyKCk7XG4gICAgbWV0YUNvdW50ZXIoKTtcbiAgICBzZW9Dcm93bCgpO1xuICAgIGtleUNvbnRyb2xzKCk7XG4gICAgb25fbG9hZCgpO1xuICAgIGNwLmRyb3Bkb3duKCk7XG4gICAgY3AudGFibGVUb2dnbGVMaXN0KCk7XG4gICAgY3AuY2xlZGl0b3IoKTtcbiAgICBqc2NvbG9yLmluc3RhbGwoKTtcbn0pOyJdfQ==
