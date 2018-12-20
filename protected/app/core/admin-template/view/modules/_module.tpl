{strip}
<table class="table" id="meta_data">
    <col>
    <col>
    <col width="150">
    <col width="100">
    <col width="148">
    <col width="190">
    <col width="125">
    <col width="195">
    <thead>
        <tr>
            <th colspan="8">
                Добавление модуля
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="h">{t('titles.name')} <span class="ness_color">*</span></td>
            <td class="h">Системное имя  <span class="ness_color">*</span></td>
            <td class="h">Тип таблицы</td>
            <td class="h">Pager</td>
            <td class="h">Тип</td>
            <td class="h">Поле сортировки</td>
            <td class="h">Порядок</td>
            <td class="h">Статус</td>
        </tr>
        <tr>
            <td class="va_t"><input name="name" value="{if isset($mdd_module.name )}{$mdd_module.name}{/if}" class="ness"></td>
            <td class="va_t"><input name="sys_name" value="{if isset($mdd_module.sys_name )}{$mdd_module.sys_name}{/if}" class="ness"></td>
            <td class="va_t">
                {if $storage}
                <select name="storage"{if isset($mdd_module.storage)} disabled{/if}>
                {foreach from=$storage item=item key=key name=engine}
                    <option value="{$key}"{if (isset($mdd_module.storage) && $mdd_module.storage == $key) || $smarty.foreach.engine.first} selected="selected"{/if}>{$item}</option>
                {/foreach}
                </select>
                {/if}
            </td>
            <td class="va_t"><input name="pager" value="{if isset($mdd_module.pager )}{$mdd_module.pager}{else}10{/if}" data-reducing="1" class="integer reducing-trigger"></td>
            <td class="va_t">
                {include file="system/group.tpl"
                    name    = "type"
                    check   = $mdd_module.type
                    list    = [
                        [ value => '1', text => "MULTI", default => true ],
                        [ value => '2', text => "SINGLE" ]
                    ]
                }
            </td>
            <td class="va_t">
                <input name="ord" value="{if isset($mdd_module.ord )}{$mdd_module.ord}{else}created{/if}" class="x-ord fl">
                
                {include file="system/group.tpl"
                    name    = "ord_type"
                    check   = $mdd_module.ord_type
                    list    = [
                        [ value => 'ASC', text => "ASC", default => true ],
                        [ value => 'DESC', text => "DESC" ]
                    ]
                }
            </td>
            <td class="va_t">
                <input name="order" value="{if isset($mdd_module.order )}{$mdd_module.order}{else}10{/if}" class="integer reducing-trigger">
            </td>
            <td class="va_t">
                {include file="system/group.tpl"
                    name    = "active"
                    check   = $mdd_module.active
                    list    = [
                        [ value => '1', text => "Активен", default => true ],
                        [ value => '0', text => "Не активен" ]
                    ]
                }
            </td>
        </tr>
    </tbody>
</table>
{/strip}