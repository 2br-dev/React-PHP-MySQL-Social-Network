"use strict";

var Module = function ($) {

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

            Object.keys(get).map(function (id) {
                if (id !== 'page' && get[id] !== 'undefined' && get[id] !== '') {
                    if (url !== '') {
                        url += '&';
                    }

                    url += [id, get[id]].join('=');
                }
            });

            location.search = url;
        }
    }

    return {

        changeFileName: function changeFileName(id, title) {
            console.log('ed', id, title);

            if (typeof id !== 'undefined' && typeof title !== 'undefined') {
                var name = prompt('Введите новое имя', title);

                if (name !== '' && name !== title && name !== null) {
                    $.ajax({
                        url: "/" + ADMIN_DIR + "/meta/filename",
                        type: 'POST',
                        data: {
                            id: id,
                            name: name
                        }
                    });

                    return name;
                }
            }

            return false;
        },

        ajaxFileDelete: function ajaxFileDelete(id, obj) {
            if (cp.dialog("Вы дейсвительно хотите удалить файл?")) {
                $.ajax({
                    url: '/' + ADMIN_DIR + '/meta/filedelete',
                    type: "post",
                    data: {
                        id: id
                    },
                    dataType: 'JSON',
                    success: function success(response) {
                        console.log(response);

                        if (response.status === true) {
                            $('#' + obj).remove();
                        }
                    }
                });
            }

            return false;
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
        setSort: function setSort(element, id, field) {
            var name = ['module', 'sorted', id].join('_');
            var value = element.value;
            var cache = $.cookie(name);

            if (cache) {
                var sort = [];
                var temp = unserialize(cache);

                if (temp[id] == 'undefined') {
                    sort[id] = {};
                    sort[id][field] = value;
                } else {
                    if (temp[id][field] == 'undefined') {
                        temp[id][field] = value;
                    } else {
                        temp[id][field] = value;
                    }

                    sort = temp;
                }

                $.removeCookie(name);
                $.cookie(name, serialize(sort), { expires: 30, path: '/' });
            } else {
                var _sort = [];

                _sort[id] = {};
                _sort[id][field] = value;

                $.cookie(name, serialize(_sort), { expires: 30, path: '/' });
            }

            setTimeout(function () {
                location.reload();
            }, 50);
        },
        setLimit: function setLimit(element, id) {
            var name = ['module', 'limit', id].join('_');
            var limit = parseInt(element.value);

            $.removeCookie(name);
            $.cookie(name, limit, { expires: 30, path: '/' });

            setTimeout(function () {
                location.reload();
            }, 50);
        },
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
        deleteQuestion: function deleteQuestion(e, element) {
            e.preventDefault();

            var isDelete = cp.dialog('Вы действительно хотите удалить позицию?');

            if (isDelete) {
                var _href = $(element).attr('href');

                $.post(_href, function () {
                    cp.notify('Позиция удалена', 'info');
                    $(element).closest('tr').remove();
                });
            }

            return false;
        },
        deleteItem: function deleteItem(id, mid, notify) {
            $.ajax({
                url: "/" + ADMIN_DIR + "/meta/module/del/" + mid + "/" + id,
                type: "post",
                data: {
                    id: id,
                    module: mid
                },
                dataType: 'JSON',
                success: function success() {
                    $('#module-table').find('.module-table__row[data-id="' + id + '"]').remove();

                    if (notify) {
                        cp.notify('Позиция удалена', 'info');
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

                if (cp.dialog(['Вы действительно хотите удалить ', declOfNum(count, ['позиция', 'позиций', 'позиции']), '?'].join(''))) {
                    $('.check-all-spy:checked').each(function (k, element) {
                        var mix = $(element).val();
                        var tmp = mix.split('_');

                        _this.deleteItem(parseInt(tmp[0]), parseInt(tmp[1]), false);

                        if (k + 1 == count) {
                            cp.notify(['Удалено ', declOfNum(count, ['позиция', 'позиций', 'позиции'])].join(''), 'info');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyJdLCJuYW1lcyI6WyJNb2R1bGUiLCIkIiwiX2dldFVybCIsInF1ZXJ5IiwibG9jYXRpb24iLCJzZWFyY2giLCJzdWJzdHIiLCJyZXN1bHQiLCJzcGxpdCIsImZvckVhY2giLCJwYXJ0IiwiaXRlbSIsImVuY29kZVVSSSIsInVuZXNjYXBlIiwiX3NldFVybCIsIm5hbWUiLCJwYXJhbWV0ZXIiLCJfdXJsIiwiX2pvaW5VcmwiLCJnZXQiLCJ1cmwiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiaWQiLCJwdXNoIiwiam9pbiIsIl9yZWRpcmVjdFVybCIsImxlbmd0aCIsImNoYW5nZUZpbGVOYW1lIiwidGl0bGUiLCJjb25zb2xlIiwibG9nIiwicHJvbXB0IiwiYWpheCIsIkFETUlOX0RJUiIsInR5cGUiLCJkYXRhIiwiYWpheEZpbGVEZWxldGUiLCJvYmoiLCJjcCIsImRpYWxvZyIsImRhdGFUeXBlIiwic3VjY2VzcyIsInJlc3BvbnNlIiwic3RhdHVzIiwicmVtb3ZlIiwic29ydCIsIl9nZXQiLCJ2YWx1ZSIsImJpbmQiLCJlIiwia2V5Q29kZSIsInJlbG9hZCIsInBhZ2UiLCJwcmV2Iiwic2V0U29ydCIsImVsZW1lbnQiLCJmaWVsZCIsImNhY2hlIiwiY29va2llIiwidGVtcCIsInVuc2VyaWFsaXplIiwicmVtb3ZlQ29va2llIiwic2VyaWFsaXplIiwiZXhwaXJlcyIsInBhdGgiLCJzZXRUaW1lb3V0Iiwic2V0TGltaXQiLCJsaW1pdCIsInBhcnNlSW50IiwidXBkYXRlIiwiTnVtYmVyIiwidGFyZ2V0IiwiY2hlY2tlZCIsImNoZWNrQWxsIiwicHJvcCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJjaGVja0l0ZW0iLCJkZWxldGVRdWVzdGlvbiIsInByZXZlbnREZWZhdWx0IiwiaXNEZWxldGUiLCJfaHJlZiIsImF0dHIiLCJwb3N0Iiwibm90aWZ5IiwiY2xvc2VzdCIsImRlbGV0ZUl0ZW0iLCJtaWQiLCJtb2R1bGUiLCJmaW5kIiwiZGVsZXRlQWxsIiwiY291bnQiLCJfdGhpcyIsImRlY2xPZk51bSIsImVhY2giLCJrIiwibWl4IiwidmFsIiwidG1wIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFNBQVUsVUFBU0MsQ0FBVCxFQUFZOztBQUV4QixhQUFTQyxPQUFULEdBQW1CO0FBQ2YsWUFBTUMsUUFBUUMsU0FBU0MsTUFBVCxDQUFnQkMsTUFBaEIsQ0FBdUIsQ0FBdkIsQ0FBZDtBQUNBLFlBQU1DLFNBQVMsRUFBZjs7QUFFQUosY0FBTUssS0FBTixDQUFZLEdBQVosRUFBaUJDLE9BQWpCLENBQXlCLFVBQVNDLElBQVQsRUFBZTtBQUNwQyxnQkFBTUMsT0FBT0QsS0FBS0YsS0FBTCxDQUFXLEdBQVgsQ0FBYjtBQUNBRCxtQkFBT0ksS0FBSyxDQUFMLENBQVAsSUFBa0JDLFVBQVVDLFNBQVNBLFNBQVNGLEtBQUssQ0FBTCxDQUFULENBQVQsQ0FBVixDQUFsQjtBQUNILFNBSEQ7O0FBS0EsZUFBT0osTUFBUDtBQUNIOztBQUVELGFBQVNPLE9BQVQsQ0FBaUJDLElBQWpCLEVBQXVCQyxTQUF2QixFQUFrQztBQUM5QixZQUFNQyxPQUFPZixTQUFiOztBQUVBZSxhQUFLRixJQUFMLElBQWFDLFNBQWI7O0FBRUEsZUFBT0MsSUFBUDtBQUNIOztBQUVELGFBQVNDLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQ25CLFlBQU1DLE1BQU0sRUFBWjs7QUFFQUMsZUFBT0MsSUFBUCxDQUFZSCxHQUFaLEVBQWlCSSxHQUFqQixDQUFxQixjQUFNO0FBQ3ZCLGdCQUFJSixJQUFJSyxFQUFKLE1BQVksV0FBWixJQUEyQkwsSUFBSUssRUFBSixNQUFZLEVBQTNDLEVBQStDO0FBQzNDSixvQkFBSUssSUFBSixDQUFTLENBQUNELEVBQUQsRUFBS0wsSUFBSUssRUFBSixDQUFMLEVBQWNFLElBQWQsQ0FBbUIsR0FBbkIsQ0FBVDtBQUNIO0FBQ0osU0FKRDs7QUFNQSxlQUFPTixJQUFJTSxJQUFKLENBQVMsR0FBVCxDQUFQO0FBQ0g7O0FBRUQs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QixTQUFTeEIsS0FBYixFQUFvQjtBQUNoQnlCLDBDQUFNekMsTUFBTjtBQUNILGlDQUZELE1BRU87QUFDSGpELDZDQUFTaUQsTUFBVDtBQUNIO0FBQ0osNkJBTkQsRUFNRyxHQU5IO0FBT0g7QUFDSixxQkFqQkQ7QUFrQkg7QUFDSjtBQUNKO0FBaFFFLEtBQVA7QUFrUUgsQ0F0VGUsQ0FzVGRnRCxNQXRUYyxDQUFoQiIsImZpbGUiOiJtb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNb2R1bGUgPSAoZnVuY3Rpb24oJCkge1xuXG4gICAgZnVuY3Rpb24gX2dldFVybCgpIHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBsb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgICAgICBxdWVyeS5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbihwYXJ0KSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gcGFydC5zcGxpdChcIj1cIik7XG4gICAgICAgICAgICByZXN1bHRbaXRlbVswXV0gPSBlbmNvZGVVUkkodW5lc2NhcGUodW5lc2NhcGUoaXRlbVsxXSkpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfc2V0VXJsKG5hbWUsIHBhcmFtZXRlcikge1xuICAgICAgICBjb25zdCBfdXJsID0gX2dldFVybCgpO1xuXG4gICAgICAgIF91cmxbbmFtZV0gPSBwYXJhbWV0ZXI7XG5cbiAgICAgICAgcmV0dXJuIF91cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2pvaW5VcmwoZ2V0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IFtdO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKGdldCkubWFwKGlkID0+IHtcbiAgICAgICAgICAgIGlmIChnZXRbaWRdICE9PSAndW5kZWZpbmVkJyAmJiBnZXRbaWRdICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHVybC5wdXNoKFtpZCwgZ2V0W2lkXV0uam9pbignPScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHVybC5qb2luKCcmJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlZGlyZWN0VXJsKGdldCkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZ2V0KS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCB1cmwgPSAnJztcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZ2V0KS5tYXAoaWQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpZCAhPT0gJ3BhZ2UnICYmIGdldFtpZF0gIT09ICd1bmRlZmluZWQnICYmIGdldFtpZF0gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgKz0gJyYnXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gW2lkLCBnZXRbaWRdXS5qb2luKCc9JylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBsb2NhdGlvbi5zZWFyY2ggPSB1cmxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgY2hhbmdlRmlsZU5hbWU6IGZ1bmN0aW9uKGlkLCB0aXRsZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2VkJywgaWQsIHRpdGxlKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZihpZCkgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZih0aXRsZSkgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwcm9tcHQoJ9CS0LLQtdC00LjRgtC1INC90L7QstC+0LUg0LjQvNGPJywgdGl0bGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgIT09ICcnICYmIG5hbWUgIT09IHRpdGxlICYmIG5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYC8ke0FETUlOX0RJUn0vbWV0YS9maWxlbmFtZWAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWpheEZpbGVEZWxldGU6IGZ1bmN0aW9uKGlkLCBvYmopIHtcbiAgICAgICAgICAgIGlmIChjcC5kaWFsb2coXCLQktGLINC00LXQudGB0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0YTQsNC50Ls/XCIpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy9tZXRhL2ZpbGVkZWxldGUnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnIycrb2JqKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc29ydCAobmFtZSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgX2dldCA9IF9nZXRVcmwoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBfZ2V0LnNvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBfZ2V0LnNvcnQuc3BsaXQoJy0nKVsxXTtcbiAgICAgICAgICAgICAgICB0eXBlID0gKHR5cGUgPT09ICdhc2MnKSA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnNlYXJjaCA9IF9qb2luVXJsKF9zZXRVcmwoJ3NvcnQnLCBuYW1lICsgJy0nICsgdHlwZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5zZWFyY2ggPSBfam9pblVybChfc2V0VXJsKCdzb3J0JywgbmFtZSArICctYXNjJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNlYXJjaCAobmFtZSwgdmFsdWUsIGJpbmQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChiaW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBfcmVkaXJlY3RVcmwoX3NldFVybChuYW1lLCB2YWx1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3JlZGlyZWN0VXJsKF9zZXRVcmwobmFtZSwgdmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZWxvYWQgKClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgX2dldCA9IF9nZXRVcmwoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBfZ2V0LnBhZ2UgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSAoX2dldC5wYWdlIC0gMSkgPj0gMCA/IChfZ2V0LnBhZ2UgLSAxKSA6ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uc2VhcmNoID0gJ3BhZ2U9JytwcmV2O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0U29ydCAoZWxlbWVudCwgaWQsIGZpZWxkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gWydtb2R1bGUnLCAnc29ydGVkJywgaWRdLmpvaW4oJ18nKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gJC5jb29raWUobmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgICAgIGxldCBzb3J0ID0gW107XG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcCA9IHVuc2VyaWFsaXplKGNhY2hlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0ZW1wW2lkXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBzb3J0W2lkXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBzb3J0W2lkXVtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVtcFtpZF1bZmllbGRdID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wW2lkXVtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBbaWRdW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc29ydCA9IHRlbXA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUobmFtZSk7XG4gICAgICAgICAgICAgICAgJC5jb29raWUobmFtZSwgc2VyaWFsaXplKHNvcnQpLCB7IGV4cGlyZXM6IDMwLCBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc29ydCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgc29ydFtpZF0gPSB7fTtcbiAgICAgICAgICAgICAgICBzb3J0W2lkXVtmaWVsZF0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICQuY29va2llKG5hbWUsIHNlcmlhbGl6ZShzb3J0KSwgeyBleHBpcmVzOiAzMCwgcGF0aDogJy8nIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRMaW1pdCAoZWxlbWVudCwgaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBbJ21vZHVsZScsICdsaW1pdCcsIGlkXS5qb2luKCdfJyk7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9IHBhcnNlSW50KGVsZW1lbnQudmFsdWUpO1xuXG4gICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShuYW1lKTtcbiAgICAgICAgICAgICQuY29va2llKG5hbWUsIGxpbWl0LCB7IGV4cGlyZXM6IDMwLCBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZSAoZSwgbmFtZSwgaWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gTnVtYmVyKGUudGFyZ2V0LmNoZWNrZWQpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogWycvJywgQURNSU5fRElSLCAnL3Nob3BwaW5nL3VwZGF0ZSddLmpvaW4oJycpLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hlY2tBbGwgKGVsZW1lbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSAkKGVsZW1lbnQpLnByb3AoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICQoJy5jaGVjay1hbGwtc3B5JykucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xuXG4gICAgICAgICAgICBpZiAoY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICQoJyNyZW1vdmUtYnV0dG9uJykuYWRkQ2xhc3MoJ2VuYWJsZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcjcmVtb3ZlLWJ1dHRvbicpLnJlbW92ZUNsYXNzKCdlbmFibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjaGVja0l0ZW0gKGVsZW1lbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICgkKCcuY2hlY2stYWxsLXNweTpjaGVja2VkJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJCgnI3JlbW92ZS1idXR0b24nKS5hZGRDbGFzcygnZW5hYmxlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJyNyZW1vdmUtYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2VuYWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZVF1ZXN0aW9uIChlLCBlbGVtZW50KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGlzRGVsZXRlID0gY3AuZGlhbG9nKCfQktGLINC00LXQudGB0YLQstC40YLQtdC70YzQvdC+INGF0L7RgtC40YLQtSDRg9C00LDQu9C40YLRjCDQv9C+0LfQuNGG0LjRjj8nKTtcblxuICAgICAgICAgICAgaWYgKGlzRGVsZXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX2hyZWYgPSAkKGVsZW1lbnQpLmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgICQucG9zdChfaHJlZiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjcC5ub3RpZnkoJ9Cf0L7Qt9C40YbQuNGPINGD0LTQsNC70LXQvdCwJywgJ2luZm8nKTtcbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCd0cicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVsZXRlSXRlbSAoaWQsIG1pZCwgbm90aWZ5KSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogYC8ke0FETUlOX0RJUn0vbWV0YS9tb2R1bGUvZGVsLyR7bWlkfS8ke2lkfWAsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZTogbWlkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ0pTT04nLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNtb2R1bGUtdGFibGUnKS5maW5kKCcubW9kdWxlLXRhYmxlX19yb3dbZGF0YS1pZD1cIicgKyBpZCArICdcIl0nKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobm90aWZ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjcC5ub3RpZnkoJ9Cf0L7Qt9C40YbQuNGPINGD0LTQsNC70LXQvdCwJywgJ2luZm8nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlbGV0ZUFsbCAoZSlcbiAgICAgICAge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9ICQoJy5jaGVjay1hbGwtc3B5OmNoZWNrZWQnKS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBsaW1pdCA9ICQoJy5jaGVjay1hbGwtc3B5JykubGVuZ3RoO1xuXG4gICAgICAgICAgICBpZiAoY291bnQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNwLmRpYWxvZyhbJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMICcsIGRlY2xPZk51bShjb3VudCwgWyfQv9C+0LfQuNGG0LjRjycsICfQv9C+0LfQuNGG0LjQuScsICfQv9C+0LfQuNGG0LjQuCddKSwgJz8nXS5qb2luKCcnKSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY2hlY2stYWxsLXNweTpjaGVja2VkJykuZWFjaCgoaywgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWl4ID0gJChlbGVtZW50KS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRtcCA9IG1peC5zcGxpdCgnXycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kZWxldGVJdGVtKHBhcnNlSW50KHRtcFswXSksIHBhcnNlSW50KHRtcFsxXSksIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChrICsgMSkgPT0gY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcC5ub3RpZnkoWyfQo9C00LDQu9C10L3QviAnLCBkZWNsT2ZOdW0oY291bnQsIFsn0L/QvtC30LjRhtC40Y8nLCAn0L/QvtC30LjRhtC40LknLCAn0L/QvtC30LjRhtC40LgnXSldLmpvaW4oJycpLCAnaW5mbycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PSBsaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDE1MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0oalF1ZXJ5KSk7Il19

"use strict";

var structure = function ($) {
    return {};
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cnVjdHVyZS5qcyJdLCJuYW1lcyI6WyJzdHJ1Y3R1cmUiLCIkIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLFlBQWEsVUFBU0MsQ0FBVCxFQUFZO0FBQzNCLFdBQU8sRUFBUDtBQUNILENBRmtCLENBRWpCQyxNQUZpQixDQUFuQiIsImZpbGUiOiJzdHJ1Y3R1cmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzdHJ1Y3R1cmUgPSAoZnVuY3Rpb24oJCkge1xuICAgIHJldHVybiB7fVxufShqUXVlcnkpKTsiXX0=
