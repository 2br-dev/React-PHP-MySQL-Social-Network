"use strict";

var shopping = function ($) {

    function _getUrl() {
        var query = location.search.substr(1);
        var result = {};

        query.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = encodeURI(unescape(unescape(item[1])));
        });

        return result;
    }

    function _setUrl(name, parameter) {
        var _url = _getUrl();

        _url[name] = parameter;

        return _url;
    }

    function _joinUrl(get) {
        var url = [];

        Object.keys(get).map(function (id) {
            if (get[id] !== 'undefined' && get[id] !== '') {
                url.push([id, get[id]].join('='));
            }
        });

        return url.join('&');
    }

    function _redirectUrl(get) {
        if (Object.keys(get).length) {
            var url = '';

            var ignore = ['page', 'backuri'];

            Object.keys(get).map(function (id) {
                if (ignore.indexOf(id) < 0 && get[id] !== 'undefined' && get[id] !== '') {
                    if (url !== '') {
                        url += '&';
                    }

                    url += [id, get[id]].join('=');
                }
            });

            location.href = '/' + ADMIN_DIR + '/shopping/catalog?' + url;

            // location.search = url
        }
    }

    return {
        tab: function tab(element, id) {
            $('.tabs__list__link').removeClass('tabs__list__link_current');
            $('.catalog-tabs__item').removeClass('current');

            $(element).addClass('tabs__list__link_current');
            $("#tab-" + id).addClass('current');
        },
        sort: function sort(name) {
            var _get = _getUrl();

            if (typeof _get.sort !== 'undefined') {
                var type = _get.sort.split('-')[1];
                type = type === 'asc' ? 'desc' : 'asc';
                location.search = _joinUrl(_setUrl('sort', name + '-' + type));
            } else {
                location.search = _joinUrl(_setUrl('sort', name + '-asc'));
            }
        },
        search: function search(name, value, bind, e) {
            if (bind) {
                if (e.keyCode == 13) {
                    _redirectUrl(_setUrl(name, value));
                }
            } else {
                _redirectUrl(_setUrl(name, value));
            }
        },
        reload: function reload() {
            var _get = _getUrl();

            if (typeof _get.page !== 'undefined') {
                var prev = _get.page - 1 >= 0 ? _get.page - 1 : '';

                if (prev) {
                    location.search = 'page=' + prev;
                } else {
                    location.reload();
                }
            } else {
                location.reload();
            }
        },
        setLimit: function setLimit(section, element) {
            var limit = parseInt(element.value);

            if (limit > 0) {
                var name = ['module', 'pages', section].join('_');

                $.removeCookie(name);
                $.cookie(name, limit, { expires: 30, path: '/' });

                setTimeout(function () {
                    location.reload();
                }, 50);
            }
        },
        generateMeta: function generateMeta() {
            console.log('generate');
        },
        requestBalance: function requestBalance($input, data) {
            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/set/balance'].join(''),
                type: "post",
                data: data,
                dataType: 'JSON',
                success: function success(response) {
                    $input.prop('disabled', data.disabled);

                    if (typeof data.disabled !== 'undefined' && !data.disabled) {
                        $input.focus();
                    }
                }
            });
        },
        inputBalance: function inputBalance(id) {
            var $input = $("#balance-" + id);
            var value = $input.val();

            this.requestBalance($input, {
                id: id,
                value: value
            });
        },
        changeBalance: function changeBalance(element) {
            var id = element.value;
            var $input = $("#balance-" + id);

            var value = $input.val();
            var disabled = element.checked;

            this.requestBalance($input, {
                id: id,
                value: value,
                disabled: disabled ? 1 : 0
            });
        },


        // function setModuleSort(obj, module_id, field)
        // {
        //     cn = "moduleSort";
        //     value = $(obj).val();
        //     var cv = getCookie(cn);
        //     if (cv)
        //     {
        //         var arr = new Array();
        //         tmp = unserialize(cv);

        //         if (tmp[module_id] == undefined){
        //             var arr = new Array();
        //             arr[field] = value;
        //             tmp[module_id] = arr;
        //         }
        //         else{
        //             if (tmp[module_id][field] == undefined){
        //                 tmp[module_id][field] = value;
        //             }
        //             else{
        //                 tmp[module_id][field] = value;
        //             }
        //         }

        //         setCookie(cn,serialize(tmp));
        //     }
        //     else
        //     {
        //         var arr = new Array();
        //         var tmp = new Array();
        //         tmp[field] = value;
        //         arr[module_id] = tmp;
        //         setCookie(cn,serialize(arr));
        //     }
        //     location.href = location.href;
        // }

        update: function update(e, name, id) {
            var value = Number(e.target.checked);

            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/update'].join(''),
                type: "post",
                data: {
                    id: id,
                    name: name,
                    value: value
                },
                dataType: 'JSON',
                success: function success(response) {
                    console.log('update');
                }
            });
        },
        checkByName: function checkByName(element) {
            var name = $(element).val();
            var checked = $(element).prop('checked');

            $(".check-all-spy[name=\"" + name + "\"]").prop('checked', checked);
        },
        checkAll: function checkAll(element) {
            var checked = $(element).prop('checked');
            $('.check-all-spy').prop('checked', checked);

            if (checked) {
                $('#remove-button').addClass('enable');
            } else {
                $('#remove-button').removeClass('enable');
            }
        },
        checkItem: function checkItem(element) {
            if ($('.check-all-spy:checked').length) {
                $('#remove-button').addClass('enable');
            } else {
                $('#remove-button').removeClass('enable');
            }
        },
        deleteManufacturer: function deleteManufacturer(e, id) {
            e.preventDefault();

            if (cp.dialog('Вы действительно хотите удалить производителя?')) {
                $.ajax({
                    url: ['/', ADMIN_DIR, '/shopping/manufacturer/del/', id].join(''),
                    type: "get",
                    dataType: 'JSON',
                    success: function success() {
                        $('#module-table').find('.module-table__row[data-id="' + id + '"]').remove();
                        cp.notify('Производитель удален', 'info');
                    }
                });
            }
        },
        deleteProduct: function deleteProduct(e, id) {
            e.preventDefault();

            if (cp.dialog('Вы действительно хотите удалить товар?')) {
                this.deleteItem(id, true);
            }
        },
        deleteItem: function deleteItem(id, notify) {
            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/catalog/del/', id].join(''),
                type: "get",
                dataType: 'JSON',
                success: function success() {
                    $('#module-table').find('.module-table__row[data-id="' + id + '"]').remove();

                    if (notify) {
                        cp.notify('Товар удален', 'info');
                    }
                }
            });
        },
        deleteAll: function deleteAll(e) {
            e.preventDefault();

            var count = $('.check-all-spy:checked').length;
            var limit = $('.check-all-spy').length;

            if (count) {
                var _this = this;

                if (cp.dialog(['Вы действительно хотите удалить ', declOfNum(count, ['товар', 'товара', 'товаров']), '?'].join(''))) {
                    $('.check-all-spy:checked').each(function (k, element) {
                        _this.deleteItem(parseInt($(element).val()), false);

                        if (k + 1 == count) {
                            cp.notify(['Удалено ', declOfNum(count, ['товар', 'товара', 'товаров'])].join(''), 'info');

                            setTimeout(function () {
                                if (count == limit) {
                                    _this.reload();
                                } else {
                                    location.reload();
                                }
                            }, 150);
                        }
                    });
                }
            }
        }
    };
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGFsb2cuanMiXSwibmFtZXMiOlsic2hvcHBpbmciLCIkIiwiX2dldFVybCIsInF1ZXJ5IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJyZXN1bHQiLCJzcGxpdCIsImZvckVhY2giLCJwYXJ0IiwiaXRlbSIsImVuY29kZVVSSSIsInVuZXNjYXBlIiwiX3NldFVybCIsIm5hbWUiLCJwYXJhbWV0ZXIiLCJfdXJsIiwiX2pvaW5VcmwiLCJnZXQiLCJ1cmwiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiaWQiLCJwdXNoIiwiam9pbiIsIl9yZWRpcmVjdFVybCIsImxlbmd0aCIsImlnbm9yZSIsImluZGV4T2YiLCJocmVmIiwiQURNSU5fRElSIiwidGFiIiwiZWxlbWVudCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzb3J0IiwiX2dldCIsInR5cGUiLCJ2YWx1ZSIsImJpbmQiLCJlIiwia2V5Q29kZSIsInJlbG9hZCIsInBhZ2UiLCJwcmV2Iiwic2V0TGltaXQiLCJzZWN0aW9uIiwibGltaXQiLCJwYXJzZUludCIsInJlbW92ZUNvb2tpZSIsImNvb2tpZSIsImV4cGlyZXMiLCJwYXRoIiwic2V0VGltZW91dCIsImdlbmVyYXRlTWV0YSIsImNvbnNvbGUiLCJsb2ciLCJyZXF1ZXN0QmFsYW5jZSIsIiRpbnB1dCIsImRhdGEiLCJhamF4IiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJwcm9wIiwiZGlzYWJsZWQiLCJmb2N1cyIsImlucHV0QmFsYW5jZSIsInZhbCIsImNoYW5nZUJhbGFuY2UiLCJjaGVja2VkIiwidXBkYXRlIiwiTnVtYmVyIiwidGFyZ2V0IiwiY2hlY2tCeU5hbWUiLCJjaGVja0FsbCIsImNoZWNrSXRlbSIsImRlbGV0ZU1hbnVmYWN0dXJlciIsInByZXZlbnREZWZhdWx0IiwiY3AiLCJkaWFsb2ciLCJmaW5kIiwicmVtb3ZlIiwibm90aWZ5IiwiZGVsZXRlUHJvZHVjdCIsImRlbGV0ZUl0ZW0iLCJkZWxldGVBbGwi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QTdVaUIsQ0E2VWhCa0QsTUE3VWdCLENBQWxCIiwiZmlsZSI6ImNhdGFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzaG9wcGluZyA9IChmdW5jdGlvbigkKSB7XG5cbiAgICBmdW5jdGlvbiBfZ2V0VXJsKCkge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIHF1ZXJ5LnNwbGl0KFwiJlwiKS5mb3JFYWNoKGZ1bmN0aW9uKHBhcnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBwYXJ0LnNwbGl0KFwiPVwiKTtcbiAgICAgICAgICAgIHJlc3VsdFtpdGVtWzBdXSA9IGVuY29kZVVSSSh1bmVzY2FwZSh1bmVzY2FwZShpdGVtWzFdKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9zZXRVcmwobmFtZSwgcGFyYW1ldGVyKSB7XG4gICAgICAgIGNvbnN0IF91cmwgPSBfZ2V0VXJsKCk7XG5cbiAgICAgICAgX3VybFtuYW1lXSA9IHBhcmFtZXRlcjtcblxuICAgICAgICByZXR1cm4gX3VybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfam9pblVybChnZXQpIHtcbiAgICAgICAgY29uc3QgdXJsID0gW107XG5cbiAgICAgICAgT2JqZWN0LmtleXMoZ2V0KS5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgaWYgKGdldFtpZF0gIT09ICd1bmRlZmluZWQnICYmIGdldFtpZF0gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdXJsLnB1c2goW2lkLCBnZXRbaWRdXS5qb2luKCc9JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdXJsLmpvaW4oJyYnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfcmVkaXJlY3RVcmwoZ2V0KSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhnZXQpLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IHVybCA9ICcnO1xuXG4gICAgICAgICAgICBjb25zdCBpZ25vcmUgPSBbXG4gICAgICAgICAgICAgICAgJ3BhZ2UnLFxuICAgICAgICAgICAgICAgICdiYWNrdXJpJ1xuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZ2V0KS5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpZ25vcmUuaW5kZXhPZihpZCkgPCAwICYmIGdldFtpZF0gIT09ICd1bmRlZmluZWQnICYmIGdldFtpZF0gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJyYnXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gW2lkLCBnZXRbaWRdXS5qb2luKCc9JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJy8nICsgQURNSU5fRElSICsgJy9zaG9wcGluZy9jYXRhbG9nPycgKyB1cmw7XG5cbiAgICAgICAgICAgIC8vIGxvY2F0aW9uLnNlYXJjaCA9IHVybFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICB0YWIgKGVsZW1lbnQsIGlkKVxuICAgICAgICB7XG4gICAgICAgICAgICAkKCcudGFic19fbGlzdF9fbGluaycpLnJlbW92ZUNsYXNzKCd0YWJzX19saXN0X19saW5rX2N1cnJlbnQnKTtcbiAgICAgICAgICAgICQoJy5jYXRhbG9nLXRhYnNfX2l0ZW0nKS5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuXG4gICAgICAgICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKCd0YWJzX19saXN0X19saW5rX2N1cnJlbnQnKTtcbiAgICAgICAgICAgICQoXCIjdGFiLVwiK2lkKS5hZGRDbGFzcygnY3VycmVudCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNvcnQgKG5hbWUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IF9nZXQgPSBfZ2V0VXJsKCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgX2dldC5zb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gX2dldC5zb3J0LnNwbGl0KCctJylbMV07XG4gICAgICAgICAgICAgICAgdHlwZSA9ICh0eXBlID09PSAnYXNjJykgPyAnZGVzYycgOiAnYXNjJztcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5zZWFyY2ggPSBfam9pblVybChfc2V0VXJsKCdzb3J0JywgbmFtZSArICctJyArIHR5cGUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uc2VhcmNoID0gX2pvaW5VcmwoX3NldFVybCgnc29ydCcsIG5hbWUgKyAnLWFzYycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzZWFyY2ggKG5hbWUsIHZhbHVlLCBiaW5kLCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoYmluZCkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgX3JlZGlyZWN0VXJsKF9zZXRVcmwobmFtZSwgdmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9yZWRpcmVjdFVybChfc2V0VXJsKG5hbWUsIHZhbHVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVsb2FkICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IF9nZXQgPSBfZ2V0VXJsKCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgX2dldC5wYWdlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2ID0gKF9nZXQucGFnZSAtIDEpID49IDAgPyAoX2dldC5wYWdlIC0gMSkgOiAnJztcblxuICAgICAgICAgICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnNlYXJjaCA9ICdwYWdlPScrcHJldjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldExpbWl0IChzZWN0aW9uLCBlbGVtZW50KVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IHBhcnNlSW50KGVsZW1lbnQudmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAobGltaXQgPiAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBbJ21vZHVsZScsICdwYWdlcycsIHNlY3Rpb25dLmpvaW4oJ18nKTtcblxuICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKG5hbWUpO1xuICAgICAgICAgICAgICAgICQuY29va2llKG5hbWUsIGxpbWl0LCB7IGV4cGlyZXM6IDMwLCBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdlbmVyYXRlTWV0YSAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZ2VuZXJhdGUnKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXF1ZXN0QmFsYW5jZSAoJGlucHV0LCBkYXRhKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogWycvJywgQURNSU5fRElSLCAnL3Nob3BwaW5nL3NldC9iYWxhbmNlJ10uam9pbignJyksXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ0pTT04nLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC5wcm9wKCdkaXNhYmxlZCcsIGRhdGEuZGlzYWJsZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoZGF0YS5kaXNhYmxlZCkgIT09ICd1bmRlZmluZWQnICYmICFkYXRhLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXQuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlucHV0QmFsYW5jZSAoaWQpIHtcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoYCNiYWxhbmNlLSR7aWR9YCk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9ICRpbnB1dC52YWwoKTtcblxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QmFsYW5jZSgkaW5wdXQsIHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjaGFuZ2VCYWxhbmNlIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkKGAjYmFsYW5jZS0ke2lkfWApO1xuXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc2FibGVkID0gZWxlbWVudC5jaGVja2VkO1xuXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RCYWxhbmNlKCRpbnB1dCwge1xuICAgICAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ6IChkaXNhYmxlZCA/IDEgOiAwKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZnVuY3Rpb24gc2V0TW9kdWxlU29ydChvYmosIG1vZHVsZV9pZCwgZmllbGQpXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNuID0gXCJtb2R1bGVTb3J0XCI7XG4gICAgICAgIC8vICAgICB2YWx1ZSA9ICQob2JqKS52YWwoKTtcbiAgICAgICAgLy8gICAgIHZhciBjdiA9IGdldENvb2tpZShjbik7XG4gICAgICAgIC8vICAgICBpZiAoY3YpXG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGFyciA9IG5ldyBBcnJheSgpO1xuICAgICAgICAvLyAgICAgICAgIHRtcCA9IHVuc2VyaWFsaXplKGN2KTtcblxuICAgICAgICAvLyAgICAgICAgIGlmICh0bXBbbW9kdWxlX2lkXSA9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgYXJyID0gbmV3IEFycmF5KCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIGFycltmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgLy8gICAgICAgICAgICAgdG1wW21vZHVsZV9pZF0gPSBhcnI7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIGVsc2V7XG4gICAgICAgIC8vICAgICAgICAgICAgIGlmICh0bXBbbW9kdWxlX2lkXVtmaWVsZF0gPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRtcFttb2R1bGVfaWRdW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB0bXBbbW9kdWxlX2lkXVtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIH1cblxuICAgICAgICAvLyAgICAgICAgIHNldENvb2tpZShjbixzZXJpYWxpemUodG1wKSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICBlbHNlXG4gICAgICAgIC8vICAgICB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGFyciA9IG5ldyBBcnJheSgpO1xuICAgICAgICAvLyAgICAgICAgIHZhciB0bXAgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgLy8gICAgICAgICB0bXBbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIC8vICAgICAgICAgYXJyW21vZHVsZV9pZF0gPSB0bXA7XG4gICAgICAgIC8vICAgICAgICAgc2V0Q29va2llKGNuLHNlcmlhbGl6ZShhcnIpKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgIGxvY2F0aW9uLmhyZWYgPSBsb2NhdGlvbi5ocmVmO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgdXBkYXRlIChlLCBuYW1lLCBpZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBOdW1iZXIoZS50YXJnZXQuY2hlY2tlZCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBbJy8nLCBBRE1JTl9ESVIsICcvc2hvcHBpbmcvdXBkYXRlJ10uam9pbignJyksXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdKU09OJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjaGVja0J5TmFtZSAoZWxlbWVudClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICQoZWxlbWVudCkudmFsKCk7XG4gICAgICAgICAgICBjb25zdCBjaGVja2VkID0gJChlbGVtZW50KS5wcm9wKCdjaGVja2VkJyk7XG5cbiAgICAgICAgICAgICQoYC5jaGVjay1hbGwtc3B5W25hbWU9XCIke25hbWV9XCJdYCkucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoZWNrQWxsIChlbGVtZW50KVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBjaGVja2VkID0gJChlbGVtZW50KS5wcm9wKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAkKCcuY2hlY2stYWxsLXNweScpLnByb3AoJ2NoZWNrZWQnLCBjaGVja2VkKTtcblxuICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAkKCcjcmVtb3ZlLWJ1dHRvbicpLmFkZENsYXNzKCdlbmFibGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnI3JlbW92ZS1idXR0b24nKS5yZW1vdmVDbGFzcygnZW5hYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tJdGVtIChlbGVtZW50KVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoJCgnLmNoZWNrLWFsbC1zcHk6Y2hlY2tlZCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJyNyZW1vdmUtYnV0dG9uJykuYWRkQ2xhc3MoJ2VuYWJsZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcjcmVtb3ZlLWJ1dHRvbicpLnJlbW92ZUNsYXNzKCdlbmFibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVNYW51ZmFjdHVyZXIgKGUsIGlkKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmIChjcC5kaWFsb2coJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINC/0YDQvtC40LfQstC+0LTQuNGC0LXQu9GPPycpKSB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBbJy8nLCBBRE1JTl9ESVIsICcvc2hvcHBpbmcvbWFudWZhY3R1cmVyL2RlbC8nLCBpZF0uam9pbignJyksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI21vZHVsZS10YWJsZScpLmZpbmQoJy5tb2R1bGUtdGFibGVfX3Jvd1tkYXRhLWlkPVwiJytpZCsnXCJdJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcC5ub3RpZnkoJ9Cf0YDQvtC40LfQstC+0LTQuNGC0LXQu9GMINGD0LTQsNC70LXQvScsICdpbmZvJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVQcm9kdWN0IChlLCBpZCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoY3AuZGlhbG9nKCfQktGLINC00LXQudGB0YLQstC40YLQtdC70YzQvdC+INGF0L7RgtC40YLQtSDRg9C00LDQu9C40YLRjCDRgtC+0LLQsNGAPycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJdGVtKGlkLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVJdGVtIChpZCwgbm90aWZ5KVxuICAgICAgICB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogWycvJywgQURNSU5fRElSLCAnL3Nob3BwaW5nL2NhdGFsb2cvZGVsLycsIGlkXS5qb2luKCcnKSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdldFwiLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI21vZHVsZS10YWJsZScpLmZpbmQoJy5tb2R1bGUtdGFibGVfX3Jvd1tkYXRhLWlkPVwiJytpZCsnXCJdJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vdGlmeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3Aubm90aWZ5KCfQotC+0LLQsNGAINGD0LTQsNC70LXQvScsICdpbmZvJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVBbGwgKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgY291bnQgPSAkKCcuY2hlY2stYWxsLXNweTpjaGVja2VkJykubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgbGltaXQgPSAkKCcuY2hlY2stYWxsLXNweScpLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKGNvdW50KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGlmIChjcC5kaWFsb2coWyfQktGLINC00LXQudGB0YLQstC40YLQtdC70YzQvdC+INGF0L7RgtC40YLQtSDRg9C00LDQu9C40YLRjCAnLCBkZWNsT2ZOdW0oY291bnQsIFsn0YLQvtCy0LDRgCcsICfRgtC+0LLQsNGA0LAnLCAn0YLQvtCy0LDRgNC+0LInXSksICc/J10uam9pbignJykpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmNoZWNrLWFsbC1zcHk6Y2hlY2tlZCcpLmVhY2goKGssIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmRlbGV0ZUl0ZW0ocGFyc2VJbnQoJChlbGVtZW50KS52YWwoKSksIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChrICsgMSkgPT0gY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcC5ub3RpZnkoWyfQo9C00LDQu9C10L3QviAnLCBkZWNsT2ZOdW0oY291bnQsIFsn0YLQvtCy0LDRgCcsICfRgtC+0LLQsNGA0LAnLCAn0YLQvtCy0LDRgNC+0LInXSldLmpvaW4oJycpLCAnaW5mbycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PSBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0oalF1ZXJ5KSk7Il19

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var orders = function ($) {
    return {
        toggle: function toggle(element, id, classname, button) {
            if ($('#' + id).length) {
                $('#' + id).toggleClass(classname);
            }

            if (typeof button === 'boolean' && button === true) {
                $(element).remove();
            }

            if ((typeof button === 'undefined' ? 'undefined' : _typeof(button)) === 'object') {
                var status = $('#' + id).hasClass(classname) ? 0 : 1;

                $(element).text(button[status]);
            }
        },
        deleteItem: function deleteItem(id, notify) {
            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/orders/del/', id].join(''),
                type: "get",
                dataType: 'JSON',
                success: function success() {
                    $('#module-table').find('.module-table__row[data-id="' + id + '"]').remove();

                    if (notify) {
                        cp.notify('Товар удален', 'info');
                    }
                }
            });
        },
        deleteAll: function deleteAll(e) {
            e.preventDefault();

            var count = $('.check-all-spy:checked').length;
            var limit = $('.check-all-spy').length;

            if (count) {
                var _this = this;

                if (cp.dialog(['Вы действительно хотите удалить ', declOfNum(count, ['заказ', 'заказа', 'заказов']), '?'].join(''))) {
                    $('.check-all-spy:checked').each(function (k, element) {
                        _this.deleteItem(parseInt($(element).val()), false);

                        if (k + 1 == count) {
                            cp.notify(['Удалено ', declOfNum(count, ['заказ', 'заказа', 'заказов'])].join(''), 'info');

                            setTimeout(function () {
                                if (count == limit) {
                                    shopping.reload();
                                } else {
                                    location.reload();
                                }
                            }, 150);
                        }
                    });
                }
            }
        }
    };
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy5qcyJdLCJuYW1lcyI6WyJvcmRlcnMiLCIkIiwidG9nZ2xlIiwiZWxlbWVudCIsImlkIiwiY2xhc3NuYW1lIiwiYnV0dG9uIiwibGVuZ3RoIiwidG9nZ2xlQ2xhc3MiLCJyZW1vdmUiLCJzdGF0dXMiLCJoYXNDbGFzcyIsInRleHQiLCJkZWxldGVJdGVtIiwibm90aWZ5IiwiYWpheCIsInVybCIsIkFETUlOX0RJUiIsImpvaW4iLCJ0eXBlIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwiZmluZCIsImNwIiwiZGVsZXRlQWxsIiwiZSIsInByZXZlbnREZWZhdWx0IiwiY291bnQiLCJsaW1pdCIsIl90aGlzIiwiZGlhbG9nIiwiZGVjbE9mTnVtIiwiZWFjaCIsImsiLCJwYXJzZUludCIsInZhbCIsInNldFRpbWVvdXQiLCJzaG9wcGluZyIsInJlbG9hZCIsImxvY2F0aW9uIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsU0FBVSxVQUFTQyxDQUFULEVBQVk7QUFDeEIsV0FBTztBQUNIQyxjQURHLGtCQUNLQyxPQURMLEVBQ2NDLEVBRGQsRUFDa0JDLFNBRGxCLEVBQzZCQyxNQUQ3QixFQUVIO0FBQ0ksZ0JBQUlMLFFBQU1HLEVBQU4sRUFBWUcsTUFBaEIsRUFDQTtBQUNJTix3QkFBTUcsRUFBTixFQUFZSSxXQUFaLENBQXdCSCxTQUF4QjtBQUNIOztBQUVELGdCQUFJLE9BQU9DLE1BQVAsS0FBbUIsU0FBbkIsSUFBZ0NBLFdBQVcsSUFBL0MsRUFDQTtBQUNJTCxrQkFBRUUsT0FBRixFQUFXTSxNQUFYO0FBQ0g7O0FBRUQsZ0JBQUksUUFBT0gsTUFBUCx5Q0FBT0EsTUFBUCxPQUFtQixRQUF2QixFQUNBO0FBQ0ksb0JBQU1JLFNBQVNULFFBQU1HLEVBQU4sRUFBWU8sUUFBWixDQUFxQk4sU0FBckIsSUFBa0MsQ0FBbEMsR0FBc0MsQ0FBckQ7O0FBRUFKLGtCQUFFRSxPQUFGLEVBQVdTLElBQVgsQ0FBZ0JOLE9BQU9JLE1BQVAsQ0FBaEI7QUFDSDtBQUNKLFNBbkJFO0FBcUJIRyxrQkFyQkcsc0JBcUJTVCxFQXJCVCxFQXFCYVUsTUFyQmIsRUFzQkg7QUFDSWIsY0FBRWMsSUFBRixDQUFPO0FBQ0hDLHFCQUFLLENBQUMsR0FBRCxFQUFNQyxTQUFOLEVBQWlCLHVCQUFqQixFQUEwQ2IsRUFBMUMsRUFBOENjLElBQTlDLENBQW1ELEVBQW5ELENBREY7QUFFSEMsc0JBQU0sS0FGSDtBQUdIQywwQkFBVSxNQUhQO0FBSUhDLHlCQUFTLG1CQUNUO0FBQ0lwQixzQkFBRSxlQUFGLEVBQW1CcUIsSUFBbkIsQ0FBd0IsaUNBQStCbEIsRUFBL0IsR0FBa0MsSUFBMUQsRUFBZ0VLLE1BQWhFOztBQUVBLHdCQUFJSyxNQUFKLEVBQVk7QUFDUlMsMkJBQUdULE1BQUgsQ0FBVSxjQUFWLEVBQTBCLE1BQTFCO0FBQ0g7QUFDSjtBQVhFLGFBQVA7QUFhSCxTQXBDRTtBQXNDSFUsaUJBdENHLHFCQXNDUUMsQ0F0Q1IsRUF1Q0g7QUFDSUEsY0FBRUMsY0FBRjs7QUFFQSxnQkFBTUMsUUFBUTFCLEVBQUUsd0JBQUYsRUFBNEJNLE1BQTFDO0FBQ0EsZ0JBQU1xQixRQUFRM0IsRUFBRSxnQkFBRixFQUFvQk0sTUFBbEM7O0FBRUEsZ0JBQUlvQixLQUFKLEVBQ0E7QUFDSSxvQkFBTUUsUUFBUSxJQUFkOztBQUVBLG9CQUFJTixHQUFHTyxNQUFILENBQVUsQ0FBQyxrQ0FBRCxFQUFxQ0MsVUFBVUosS0FBVixFQUFpQixDQUFDLE9BQUQsRUFBVSxRQUFWLEVBQW9CLFNBQXBCLENBQWpCLENBQXJDLEVBQXVGLEdBQXZGLEVBQTRGVCxJQUE1RixDQUFpRyxFQUFqRyxDQUFWLENBQUosRUFDQTtBQUNJakIsc0JBQUUsd0JBQUYsRUFBNEIrQixJQUE1QixDQUFpQyxVQUFDQyxDQUFELEVBQUk5QixPQUFKLEVBQWdCO0FBQzdDMEIsOEJBQU1oQixVQUFOLENBQWlCcUIsU0FBU2pDLEVBQUVFLE9BQUYsRUFBV2dDLEdBQVgsRUFBVCxDQUFqQixFQUE2QyxLQUE3Qzs7QUFFQSw0QkFBS0YsSUFBSSxDQUFMLElBQVdOLEtBQWYsRUFBc0I7QUFDbEJKLCtCQUFHVCxNQUFILENBQVUsQ0FBQyxVQUFELEVBQWFpQixVQUFVSixLQUFWLEVBQWlCLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBb0IsU0FBcEIsQ0FBakIsQ0FBYixFQUErRFQsSUFBL0QsQ0FBb0UsRUFBcEUsQ0FBVixFQUFtRixNQUFuRjs7QUFFQWtCLHVDQUFXLFlBQU07QUFDYixvQ0FBSVQsU0FBU0MsS0FBYixFQUFvQjtBQUNoQlMsNkNBQVNDLE1BQVQ7QUFDSCxpQ0FGRCxNQUVPO0FBQ0hDLDZDQUFTRCxNQUFUO0FBQ0g7QUFDSiw2QkFORCxFQU1HLEdBTkg7QUFPSDtBQUNKLHFCQWREO0FBZUg7QUFDSjtBQUNKO0FBcEVFLEtBQVA7QUFzRUgsQ0F2RWUsQ0F1RWRFLE1BdkVjLENBQWhCIiwiZmlsZSI6Im9yZGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG9yZGVycyA9IChmdW5jdGlvbigkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdG9nZ2xlIChlbGVtZW50LCBpZCwgY2xhc3NuYW1lLCBidXR0b24pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICgkKGAjJHtpZH1gKS5sZW5ndGgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJChgIyR7aWR9YCkudG9nZ2xlQ2xhc3MoY2xhc3NuYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZihidXR0b24pID09PSAnYm9vbGVhbicgJiYgYnV0dG9uID09PSB0cnVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoYnV0dG9uKSA9PT0gJ29iamVjdCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gJChgIyR7aWR9YCkuaGFzQ2xhc3MoY2xhc3NuYW1lKSA/IDAgOiAxO1xuXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50ZXh0KGJ1dHRvbltzdGF0dXNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZWxldGVJdGVtIChpZCwgbm90aWZ5KVxuICAgICAgICB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogWycvJywgQURNSU5fRElSLCAnL3Nob3BwaW5nL29yZGVycy9kZWwvJywgaWRdLmpvaW4oJycpLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdKU09OJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCcjbW9kdWxlLXRhYmxlJykuZmluZCgnLm1vZHVsZS10YWJsZV9fcm93W2RhdGEtaWQ9XCInK2lkKydcIl0nKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobm90aWZ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcC5ub3RpZnkoJ9Ci0L7QstCw0YAg0YPQtNCw0LvQtdC9JywgJ2luZm8nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUFsbCAoZSlcbiAgICAgICAge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9ICQoJy5jaGVjay1hbGwtc3B5OmNoZWNrZWQnKS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9ICQoJy5jaGVjay1hbGwtc3B5JykubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoY291bnQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNwLmRpYWxvZyhbJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMICcsIGRlY2xPZk51bShjb3VudCwgWyfQt9Cw0LrQsNC3JywgJ9C30LDQutCw0LfQsCcsICfQt9Cw0LrQsNC30L7QsiddKSwgJz8nXS5qb2luKCcnKSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY2hlY2stYWxsLXNweTpjaGVja2VkJykuZWFjaCgoaywgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVsZXRlSXRlbShwYXJzZUludCgkKGVsZW1lbnQpLnZhbCgpKSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGsgKyAxKSA9PSBjb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNwLm5vdGlmeShbJ9Cj0LTQsNC70LXQvdC+ICcsIGRlY2xPZk51bShjb3VudCwgWyfQt9Cw0LrQsNC3JywgJ9C30LDQutCw0LfQsCcsICfQt9Cw0LrQsNC30L7QsiddKV0uam9pbignJyksICdpbmZvJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50ID09IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG9wcGluZy5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTUwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufShqUXVlcnkpKTsiXX0=
