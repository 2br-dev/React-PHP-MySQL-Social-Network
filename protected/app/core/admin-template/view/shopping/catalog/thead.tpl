{strip}
<colgroup>
    {if !$is_search}
    <col width="30">    {* Чекбокс *}
    {/if}

    <col width="50">    {* Номер *}
    <col>               {* Название *}
    <col width="200">   {* Категория *}
    <col width="200">   {* Производитель *}

    {if !$is_search}
    <col width="90">    {* Цена, руб. *}
    <col width="70">    {* Скидка *}
    <col width="70">    {* Остаток, шт. *}
    <col width="60">    {* На сайте *}
    <col width="60">    {* Клонирование *}
    {/if}

    <col width="70">    {* Акция *}
    <col width="50">    {* Отображать *}

    {if !$is_search}
    <col width="30">    {* Действия *}
    {/if}
</colgroup>
<thead>
    <tr>
        {if !$is_search}
        <th class="module-table__header module-table__center">
            {include file="system/controll.tpl"
                type        =   "checkbox"
                addclass    =   "controll_single"
                name        =   "order"
                onchange    =   "shopping.checkAll(this)"
            }
        </th>
        {/if}

        <th class="module-table__header">
            <span class="module-table__sort{if $sort.name == 'id'} {$sort.by}{/if}{if $is_search} module-table__sort--disable{/if}" onclick="shopping.sort('id')">№</span>
        </th>
        <th class="module-table__header">
            <span class="module-table__sort{if $sort.name == 'name'} {$sort.by}{/if}{if $is_search} module-table__sort--disable{/if}" onclick="shopping.sort('name')">Название</span>
        </th>
        <th class="module-table__header">
            <span class="module-table__sort{if $sort.name == 'category'} {$sort.by}{/if}{if $is_search} module-table__sort--disable{/if}" onclick="shopping.sort('category')">Категория</span>
        </th>
        </th>
        <th class="module-table__header">
            <span class="module-table__sort{if $sort.name == 'manufacturer'} {$sort.by}{/if}{if $is_search} module-table__sort--disable{/if}" onclick="shopping.sort('manufacturer')">Производитель</span>
        </th>

        {if !$is_search}
        <th class="module-table__header">
            <span class="module-table__sort{if $sort.name == 'price'} {$sort.by}{/if}{if $is_search} module-table__sort--disable{/if}" onclick="shopping.sort('price')">Цена, р.</span>
        </th>
        <th class="module-table__header module-table__center">Скидка</th>
        <th class="module-table__header module-table__center">Остаток</th>
        <th class="module-table__header module-table__center">Ссылка</th>
        <th class="module-table__header module-table__center">Клон</th>
        {/if}

        <th class="module-table__header module-table__center">
            <span class="module-table__sort{if $sort.name == 'special'} {$sort.by}{/if}{if $is_search} module-table__sort--disable{/if}" onclick="shopping.sort('special')">Акция</span>
        </th>
        <th class="module-table__header module-table__center"><i class="catalog-eye icon icon-eye"></i></th>

        {if !$is_search}
        <th class="module-table__header"></th>
        {/if}
    </tr>
    <tr>
        {if !$is_search}
        <td class="module-table__sub-header"></td>
        {/if}

        <td class="module-table__sub-header">
            <input name="search_id" class="catalog-input integer"{if $search.id} value="{$search.id}"{/if} placeholder="ID" onkeypress="shopping.search('id', this.value, true, event)">
        </td>
        <td class="module-table__sub-header">
            <input name="search_name" class="catalog-input"{if $search.name} value="{$search.name}"{/if} placeholder="Поиск по названию..." onkeypress="shopping.search('name', this.value, true, event)">
        </td>
        <td class="module-table__sub-header">
            {if $category}
            <div class="catalog-select">
                <select name="search_category" onchange="shopping.search('category', this.value)"><option value="">Выберите категорию</option>>
                {foreach $category as $item}
                    <option value="{$item.id}"{if $item.id == $search.selected} selected{/if}>{$item.name}</option>

                    {if !empty($item.tree)}
                        {foreach $item.tree as $child}
                        <option value="{$child.id}"{if $child.id == $search.selected} selected{/if}>---- {$child.name}</option>
                        {/foreach}
                    {/if}

                {/foreach}
                </select>
            </div>
            {/if}
        </td>
        <td class="module-table__sub-header">
            {if $manufacturer}
            <div class="catalog-select">
                <select name="search_manufacturer" onchange="shopping.search('manufacturer', this.value)"><option value="">Выберите производителя</option>>
                {foreach $manufacturer as $item}
                    <option value="{$item.id}"{if $item.id == $search.manufacturer} selected{/if}>{$item.name}</option>
                {/foreach}
                </select>
            </div>
            {/if}
        </td>

        {if !$is_search}
        <td class="module-table__sub-header"></td>
        <td class="module-table__sub-header"></td>
        <td class="module-table__sub-header"></td>
        <td class="module-table__sub-header"></td>
        <td class="module-table__sub-header"></td>
        {/if}

        <td class="module-table__sub-header module-table__center">
            <label class="switch">
                <input name="search_special" value="1" onchange="shopping.search('special', Number(this.checked))" type="checkbox"{if $search.special == 1} checked{/if}>
                <div class="slider"></div>
            </label>
        </td>
        <td class="module-table__sub-header module-table__center">
            <label class="switch">
                <input name="search_visible" value="1" onchange="shopping.search('visible', Number(this.checked))" type="checkbox"{if $search.visible == 1} checked{/if}>
                <div class="slider"></div>
            </label>
        </td>

        {if !$is_search}
        <td class="module-table__sub-header"></td>
        {/if}
    </tr>
</thead>
{/strip}