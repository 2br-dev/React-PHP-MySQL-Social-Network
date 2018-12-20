{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply">Данные были успешно сохранены!</div>
{/if}

<form action="" method="post">
	<input type="hidden" name="form_action" value="edit_list">

	{* List *}
	<table class="table">
        <thead>
            <tr>
                <th colspan="2">Редактировать список</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h w50">Название списка на русском</td>
                <td class="h w50">Системное имя ( латин. символы )</td>
            </tr>
            <tr>
                <td><input name="name" value="{$mdd_list.0.name}" placeholder="Например: Субъекты федерации"></td>
                <td><input name="list_name" value="{$mdd_list.0.list_name}" placeholder="Например: regions"></td>
            </tr>
        </tbody>
	</table>

	{* Values *}
	<table class="table">
        <col>
        <col>
        <col width="120">
        <col width="120">
        <col width="55">
        <thead>
            <tr>
                <th colspan="5">Список значений</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">{t('titles.name')}</td>
                <td class="h">Значение<br><span style="font-weight:normal;color:#777"></span></td>
                <td class="h">По-умолчанию</td>
                <td class="h">Порядок</td>
                <td class="h"></td>
            </tr>
            {foreach item=item from=$mdd_list name=i}
            <tr id="tr{$smarty.foreach.i.iteration}">
                <td>
                    <input type="hidden" name="field_id[{$smarty.foreach.i.iteration}]" value="{$item.id}">
                    <input name="var[{$smarty.foreach.i.iteration}]" placeholder="Например: Краснодарский край" value="{$item.var}">
                </td>
                <td><input name="value[{$smarty.foreach.i.iteration}]" placeholder="Например: 23" value="{$item.value}"></td>
                <td>
                    {include file="system/controll.tpl"
                        type        =   "checkbox"
                        needle      =   $item.default
                        value       =   "1"
                        name        =   "default["|cat:$smarty.foreach.i.iteration|cat:"]"
                    }
                </td>
                <td><input name="ord[{$smarty.foreach.i.iteration}]" value="{$item.ord}" class="ord integer reducing-trigger"></td>
                <td class="tac">
                    <a href="#" class="zmdi zmdi-delete" title="Удалить" onclick="del_list_fields({$smarty.foreach.i.iteration});return false;"></a>
                </td>
            </tr>
            {/foreach}
            <tr id="add_btn">
                <td colspan="5">
                    <a href="#" title="Добавить" class="fr" onclick="add_list_fields_list();return false;"><span class="zmdi zmdi-plus-circle"></span> Добавить</a>
                </td>
            </tr>
        </tbody>
	</table>

    {include file="system/buttons.tpl"}
</form>

<script type="text/javascript">
	var field_counter = {$smarty.foreach.i.total};
</script>
{/strip}
