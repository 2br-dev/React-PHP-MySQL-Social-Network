{strip}
<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <div class="catalog">

    {if $parse}
        <input type="hidden" name="form_action" value="handle">
        <input type="hidden" name="checked" value="">

        <table class="module-table">
            <colgroup>
                <col width="30">
                <col width="250">
                <col width="150">
                <col>
                <col width="120">
                <col width="120">
            </colgroup>
            {foreach $parse as $hash => $seq}
            <thead>
                <tr>
                    <th class="module-table__header" colspan="6">{$seq.item.name} <strong>({$seq.item.count})</strong></th>
                </tr>
            </thead>
            {if !empty($seq.tree)}
            <tbody>
                <tr>
                    <td class="module-table__sub-header module-table__center">
                        {include file="system/controll.tpl"
                            checked     =   true
                            type        =   "checkbox"
                            addclass    =   "controll_single"
                            onchange    =   "shopping.checkByName(this)"
                            value       =   "checked["|cat:$hash|cat:"][]"
                        }
                    </td>
                    <td class="module-table__sub-header">Наименование</td>
                    <td class="module-table__sub-header">Выход</td>
                    <td class="module-table__sub-header">Описание</td>
                    <td class="module-table__sub-header">Остаток</td>
                    <td class="module-table__sub-header">Цена</td>
                </tr>
                {foreach $seq.tree as $id => $item}
                <tr class="module-table__row">
                    <td class="module-table__column module-table__vhcenter">
                        {include file="system/controll.tpl"
                            checked     =   true
                            type        =   "checkbox"
                            addclass    =   "controll_single"
                            ctrlclass   =   "check-all-spy"
                            name        =   "checked["|cat:$hash|cat:"][]"
                            value       =   $id
                        }
                    </td>
                    <td class="module-table__column">{$item.name}</td>
                    <td class="module-table__column">{$item.weight}</td>
                    <td class="module-table__column">{$item.description}</td>
                    <td class="module-table__column">{$item.balance}</td>
                    <td class="module-table__column">{$item.price|to_money} р.</td>
                </tr>
                {/foreach}
                <tr class="module-table__row">
                    <td class="module-table__separator" colspan="5"></td>
                </tr>
            </tbody>
            {/if}
            {/foreach}
        </table>
    {else}
        <input type="hidden" name="form_action" value="import">

        <table class="table bg-white b-a">
             <colgroup>
                <col>
                <col width="100">
                <col width="170">
            </colgroup>
            <thead>
                <tr>
                    <th>Файл</th>
                    <th>Размер</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
            {if isset($files) && !empty($files)}
                {foreach $files as $e}
                <tr>
                    <td>{$e.name|escape}</td>
                    <td>{$e.size}</td>
                    <td class="tac">
                        <a href="{$base_path}/catalog/import/delete/{$e.hash}" class="btn btn-default btn-xs" data-no-instant>Удалить</a>
                        <span>&nbsp;&nbsp;</span>
                        <a href="{$base_path}/catalog/import/handle/{$e.hash}" class="btn btn-success btn-xs" data-no-instant>Обработать</a>
                    </td>
                </tr>
                {/foreach}
            {else}
                <tr>
                    <td colspan="3" class="center-middle">
                        Файлы не загружены
                    </td>
                </tr>
            {/if}
            </tbody>
        </table>

        {include file="fields/upload.tpl"
            name    =   'file'
            count   =   0
        }
    {/if}
    </div>

    {include file="system/buttons.tpl"}
</form>
{/strip}
