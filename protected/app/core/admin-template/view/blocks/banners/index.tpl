{strip}
<table class="table">
    <col>
    <col width="180">
    <col width="300">
    <col width="80">
    <col width="65">
    <thead>
        <tr>
            <th colspan="5">Список банеров</th>
        </tr>
    </thead>
    <tbody>
        {if isset($blocks_list ) && !empty( $blocks_list )}
        <tr>
            <td class="h">{t('titles.name')}</td>
            <td class="h">Системное имя <span class="ness_color">*</span></td>
            <td class="h">Ссылка</td>
            <td class="h">Активен</td>
            <td class="h"></td>
        </tr>
        {foreach item=item from=$blocks_list name=i}
        <tr>
            <td><a href="{$base_path}/banners/edit/{$item.id}/" title="Редактировать" class="module-item-link"><i class="zmdi zmdi-edit"></i> {$item.name}</a></td>
            <td>{$item.sys_name}</td>
            <td>{$item.link}</td>
            <td class="tac">
                {if $item.visible}
                    <span class="color-green">Да</span>
                {else}
                    <span class="color-red">Нет</span>
                {/if}
            </td>
            <td class="tac">
                <a href="{$base_path}/banners/edit/{$item.id}/" class="zmdi zmdi-edit" title="Редактировать"></a>
                <a href="{$base_path}/banners/del/{$item.id}/" class="zmdi zmdi-delete remove-trigger" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить баннер?');"></a>
            </td>
        </tr>
        {/foreach}
        {else}
        <tr>
            <td colspan="5" class="center-middle">Банеров нет</td>
        </tr>
        {/if}
    </tbody>
</table>
            
<p class="apply notice">Если указать одинаковые системные имена для 2 или более баннеров, то они будут показываться по-очереди.</p>

<a href="{$base_path}/banners/add/" class="button"><i class="zmdi zmdi-plus-circle"></i>Добавить баннер</a>
{/strip}