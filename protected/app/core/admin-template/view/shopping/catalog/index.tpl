{strip}
<div class="widget-table">
    <div class="widget-table__title"><span class="icon icon-shopping-cart"></span>&nbsp;&nbsp;Каталог товаров магазина</div>
    <div class="widget-table__count">Товаров в каталоге <strong>{$count.total}</strong> (<span class="widget-table__visible" title="Активные товары">{$count.visible|to_money}</span>/<span class="widget-table__hidden" title="Скрытые товары">{$count.hidden}</span>) шт.</div>
</div>

<div class="managing">
    <div class="managing__start">
        <div class="managing__item">
            <a href="{$base_path}/catalog/add" class="button button-green">
                <i class="icon icon-plus-square"></i>Добавить товар
            </a>
        </div>

		{* <a href="{$base_path}/catalog/export" class="button button-gray"><i class="icon icon-download"></i>Выгрузить в CSV</a> *}
		{* <a href="{$base_path}/catalog/exchange" class="button button-orange"><i class="icon icon-shopping-cart"></i>Выгрузить на Яндекс.Маркет</a> *}

		<div class="managing__item">
			<a href="{$base_path}/catalog/import" class="button button-gray">
				<i class="icon icon-upload"></i>Загрузить товары
			</a>
		</div>

		{if !empty($smarty.get)}
		<div class="managing__item">
			<a href="{$base_path}/catalog" class="button"><i class="icon icon-format-clear-all"></i>Сбросить фильтры</a>
		</div>
		{/if}

		<div class="managing__item catalog-disable" id="remove-button">
		    <button type="button" class="button button-red" onclick="shopping.deleteAll(event)">
		        <i class="icon icon-delete"></i>Удалить выбранные товары
		    </button>
		</div>
    </div>

    <div class="managing__end">
        <div class="managing__limit">
            <span class="managing__limit__label">{t('on.the.page')}:</span>

            <div class="managing__limit__select">
                <select name="limit" onchange="shopping.setLimit('catalog', this)">
                    {foreach $page_count as $page}
                        <option value="{$page}"{if $page == $limit} selected{/if}>{$page}</option>
                    {/foreach}
                </select>
            </div>
        </div>
    </div>
</div>

<div class="catalog">
	<table class="module-table" id="module-table">

		{include file="./thead.tpl" is_search=false}

		<tbody>
		{if $products}
			{foreach from=$products item=product}
			<tr data-id="{$product.id}" id="catalog-row-{$product.id}" class="module-table__row product-row{if $marked == $product.id} module-table__row--marked{/if}">
				<td class="module-table__column module-table__vhcenter">
				    {include file="system/controll.tpl"
				        type        =   "checkbox"
				        addclass    =   "controll_single"
				        ctrlclass   =   "check-all-spy"
				        name        =   "order["|cat:$product.id|cat:"]"
				        value       =   $product.id
				        onchange    =   "shopping.checkItem(this)"
				    }
				</td>

				<td class="module-table__column module-table__vhcenter">{$product.id}</td>

				<td class="module-table__column">
					<a href="{$base_path}/catalog/edit/{$product.id}?backuri={$_backuri}" class="module-table__link" title="Редактировать">
						<span class="catalog-edit icon icon-edit"></span> {$product.name}
					</a>
				</td>

				<td class="module-table__column">
					{if isset($product.category.name)}
						{$product.category.name}
					{else}
						<span class="label bg-light">Не указана</span>
					{/if}
				</td>

				<td class="module-table__column">
					{if isset($product.manufacturer.name)}
						{$product.manufacturer.name}
					{else}
						<span class="label bg-light">Не указан</span>
					{/if}
				</td>

				<td class="module-table__column">
					<span>{$product.price|to_money}</span>
				</td>

				<td class="module-table__column module-table__vhcenter">
					<span>{$product.discount}</span>&nbsp;
					{if $product.discount_type == 0}
					<span>%</span>
					{elseif $product.discount_type == 1}
					<span>₽</span>
					{/if}
				</td>

				<td class="module-table__column module-table__vhcenter">
					<div class="catalog__count">
						<div class="catalog__count__overlay">
							<input name="balance[$product.id]" onblur="shopping.inputBalance({$product.id})" value="{$product.balance}" class="catalog__balance integer" id="balance-{$product.id}"{if $product.infinity == 1} disabled{/if}>

							{include file="system/controll.tpl"
						        type        =   "checkbox"
						        content  	=  	"∞"
						        addclass    =   "controll_single"
						        name        =   "infinity["|cat:$product.id|cat:"]"
						        value       =   $product.id
						        checked		=   $product.infinity == 1
						        onchange    =   "shopping.changeBalance(this)"
						    }
					   </div>
			       </div>
				</td>

				<td class="module-table__column module-table__vhcenter">
				{if $product.link}
					<a href="{$product.link}" class="catalog-view" target="_blank">
						<i class="icon icon-open-in-new"></i>
					</a>
				{else}
					<span class="catalog-view-broken">
						<i class="icon icon-open-in-new"></i>
					</span>
				{/if}
				</td>

			    <td class="module-table__column module-table__vhcenter">
			    	<a href="{$base_path}/catalog/clone/{$product.id}?backuri={$_backuri}" class="catalog-clone">
						<i class="icon icon-collection-item"></i>
					</a>
			    </td>

				<td class="module-table__column module-table__vhcenter">
					<label class="switch">
						<input name="special" onchange="shopping.update(event, 'special', {$product.id})" type="checkbox"{if $product.special == 1} checked {/if}>
						<div class="slider"></div>
					</label>
				</td>

				<td class="module-table__column module-table__vhcenter">
					<label class="switch">
						<input name="visible" onchange="shopping.update(event, 'visible', {$product.id})" type="checkbox"{if $product.visible == 1} checked {/if}>
						<div class="slider"></div>
					</label>
				</td>

			    <td class="module-table__column module-table__vhcenter">
					<a href="{$base_path}/catalog/del/{$product.id}?backuri={$_backuri}" onclick="return shopping.deleteProduct(event, {$product.id})" class="catalog-remove" title="Удалить" data-no-instant>
			    		<i class="icon icon-delete"></i>
			    	</a>
			    </td>
			</tr>
			{/foreach}
		{else}
			<tr>
				<td colspan="12" class="module-table__empty">
					В каталоге нет товаров
				</td>
			</tr>
		{/if}
		</tbody>
	</table>
</div>

{include file="system/pager.inc.tpl"}
{/strip}
