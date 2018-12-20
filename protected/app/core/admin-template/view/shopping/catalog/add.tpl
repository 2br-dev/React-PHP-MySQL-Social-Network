{strip}

{include file="./template.tpl"}

<div class="catalog">
    <table class="module-table">
        {include file="./thead.tpl" is_search=true}
    </table>
</div>

<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <input type="hidden" name="form_action" value="add">

    {include file="fields/meta.tpl"
        title           =   ""
        keywords        =   ""
        description     =   ""
        robots          =   ""
        generate        =   true
    }

    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">{t('contents.title')}</th>
            </tr>
        </thead>
        <tbody>

           	<tr>
                <td class="h">Наименование:</td>
                <td>
                    <input name="name">
                </td>
            </tr>

            <tr>
                <td class="h">Системное имя:</td>
                <td>
                    <input name="system" class="js-binding" data-binding-name="name" data-binding-element="system">
                </td>
            </tr>

			<tr>
                <td class="h">Категория:</td>
                <td>
                  	<select name="category">
					    <option value="0">Родительская категория</option>
					    {include file="fields/select_tree.tpl"
					        name            =   'category'
					        tree            =   $category_list
					        children        =   'tree'
					        value_key       =   'id'
					        value_name      =   'name'
					    }
					</select>
                </td>
            </tr>

			<tr>
                <td class="h">Производитель:</td>
                <td>
                  	<select name="manufacturer">
					    <option value="0">Выбрать производителя</option>
                        {foreach $manufacturer_list as $brand}
                        <option value="{$brand.id}">{$brand.name}</option>
                        {/foreach}
					</select>
                </td>
            </tr>

            <tr>
                <td class="h">Артикул:</td>
                <td>
                    <input name="article" class="width-50">
                </td>
            </tr>

            <tr>
                <td class="h table__full-group">Полный вес / объем:</td>
                <td class="table__full-group">
                    <input name="weight" class="width-50">
                </td>
            </tr>

            <tr>
                <td class="h table__full-group">Стоимость:</td>
                <td class="table__full-group">
                    <input name="price" class="width-25 float">
                </td>
            </tr>

            <tr class="table__particle-group">
                <td class="h table__particle-group">Неполный вес / объем:</td>
                <td class="table__particle-group">
                    <input name="particle_weight" class="width-50">
                </td>
            </tr>

            <tr>
                <td class="h table__particle-group">Стоимость:</td>
                <td class="table__particle-group">
                    <input name="particle_price" class="width-25 float">
                </td>
            </tr>

            <tr>
                <td class="h">Скидка:</td>
                <td>
                    <input name="discount" value="0" class="width-25 float reducing-trigger" style="margin-right: 2px;">

                    {include file="system/group.tpl"
                        name    = "discount_type"
                        list    = [
                            [ value => 0, text => "%", checked => true ],
                            [ value => 1, text => "₽" ]
                        ]
                    }
                </td>
            </tr>

            <tr>
                <td class="h">Информация:</td>
                <td>
                    <div class="params">
                        <div class="params__item">
                            <div class="params__item__label">Всегда в наличии</div>
                            <div class="params__item__value">
                                <label class="switch">
                                    <input name="infinity" value="1" type="checkbox">
                                    <div class="slider"></div>
                                </label>
                            </div>
                        </div>

                        <div class="params__item">
                            <div class="params__item__label">Акция</div>
                            <div class="params__item__value">
                                <label class="switch">
                                    <input name="special" value="1" type="checkbox">
                                    <div class="slider"></div>
                                </label>
                            </div>
                        </div>

                        <div class="params__item">
                            <div class="params__item__label">Новинка</div>
                            <div class="params__item__value">
                                <label class="switch">
                                    <input name="novelty" value="1" type="checkbox">
                                    <div class="slider"></div>
                                </label>
                            </div>
                        </div>

                        <div class="params__item">
                            <div class="params__item__label">Значок</div>
                            <div class="params__item__value">
                                <input name="badge">
                            </div>
                        </div>
                    </div>
                </td>
            </tr>

            <tr>
                <td class="h">Фотографии:</td>
                <td>
                    {include file="fields/image.tpl"
                        action      =   $fields.action
                        name        =   $fields.name
                        list        =   $fields.list
                        value       =   $fields.value
                        settings    =   $fields.settings
                    }
                </td>
            </tr>

            <tr>
                <td class="h table__particle-group">Остаток:</td>
                <td class="table__particle-group">
                    <input name="balance" class="width-25 float">
                </td>
            </tr>

            <tr>
                <td class="h">ID в системе 1C:</td>
                <td>
                    <input name="syncid">
                </td>
            </tr>

            <tr>
                <td class="h">Статус:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
                        list    = [
                            [ value => 1, text => "Доступен в каталоге", checked => true ],
                            [ value => 0, text => "Недоступен в каталоге" ]
                        ]
                    }
                </td>
            </tr>

       	</tbody>
   </table>

    <nav class="tabs catalog-tabs">
        <ul class="tabs__list">
        {foreach $catalog_tabs as $system => $tab name=tabs}
            <li class="tabs__list__item">
                <a href="#tab={$system}" class="tabs__list__link{if $smarty.foreach.tabs.first} tabs__list__link_current{/if}" onclick="shopping.tab(this, '{$system}')" data-instant>{$tab}</a>
            </li>
        {/foreach}
        </ul>
    </nav>

    {foreach $catalog_tabs as $system => $tab name=content}
    <section class="catalog-tabs__item{if $smarty.foreach.content.first} current{/if}" id="tab-{$system}">
         {include file="fields/redactor.tpl"
            type    =   'imperavi'
            name    =   $system
            value   =   ""
        }
    </section>
    {/foreach}

    {include file="system/buttons.tpl"}
</form>
{/strip}
