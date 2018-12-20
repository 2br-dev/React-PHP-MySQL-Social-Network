{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply"><b>Данные были успешно сохранены!</b></div>
{/if}

<form method="post" id="form_mdd">
	<input type="hidden" name="action" value="menu_edit">

	<input type="hidden" name="post_id" value="{$menu_edit.id}">
	
	<table id="meta_data" class="table">
        <colgroup>
            <col width="200">
            <col>
        </colgroup>
        <tbody>
            <tr class="th">
                <td class="h hl va_m">Наименование меню</td>
                <td>
                   <input name="name" class="w50 ness" value="{$menu_edit.name}">
                </td>
            </tr>
            <tr class="th">
                <td class="h hl va_m">Системное имя</td>
                <td>
                   <input name="system" class="w50 ness js-binding{if $menu_edit.system} js-binding-init{/if}" data-binding-name="name" data-binding-element="system" value="{$menu_edit.system}">
                </td>
            </tr>
            <tr class="th">
                <td class="h hl va_m">Отображать подменю</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "tree"
                        check   = $menu_edit.tree
                        list    = [
                            [ value => 1, text => "Да" ],
                            [ value => 0, text => "Нет", default => true ]
                        ]
                    }
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}