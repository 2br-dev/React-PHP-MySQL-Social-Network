{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply">Данные были успешно сохранены!</div>
{/if}

<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <input type="hidden" name="form_action" value="edit_manufacturer">

    {include file="fields/meta.tpl"
        title           =   $item.meta_title
        keywords        =   $item.meta_keywords
        description     =   $item.meta_description
        robots          =   $item.meta_robots
    }

    <table class="module">
        <col width="200">
        <col>
        <thead>
            <tr class="module__tr">
                <th class="module__th" colspan="2">{t('contents.title')}</th>
            </tr>
        </thead>

        <tbody>

            <tr class="module__tr">
                <td class="module__td module__td_strong">Наименование:</td>
                <td class="module__td">
                    <input name="name" value="{$item.name}">
                </td>
            </tr>

            <tr class="module__tr">
                <td class="module__td module__td_strong">Системное имя:</td>
                <td class="module__td">
                    <input name="system" value="{$item.system}" class="js-binding" data-binding-name="name" data-binding-element="system">
                </td>
            </tr>

            <tr class="module__tr">
                <td class="module__td module__td_strong">Фотографии:</td>
                <td class="module__td">
                    {include file="fields/image.tpl"
                        action      =   $fields.action
                        name        =   $fields.name
                        list        =   $fields.list
                        json        =   $fields.json
                        value       =   $fields.value
                        settings    =   $fields.settings
                    }
                </td>
            </tr>

            <tr class="module__tr">
                <td class="module__td module__td_strong">Краткое описание:</td>
                <td class="module__td module__td_redactor">
                    {include file="fields/redactor.tpl"
                        type    =   'imperavi'
                        name    =   'anons'
                        value   =   $item.anons|escape
                    }
                </td>
            </tr>

            <tr class="module__tr">
                <td class="module__td module__td_strong">Подробное описание:</td>
                <td class="module__td module__td_redactor">
                    {include file="fields/redactor.tpl"
                        type    =   'imperavi'
                        name    =   'description'
                        value   =   $item.description|escape
                    }
                </td>
            </tr>

            <tr class="module__tr">
                <td class="module__td module__td_strong">Статус:</td>
                <td class="module__td">
                    {include file="system/group.tpl"
                        name    =   'visible'
                        check   =   $item.visible
                        list    =   [
                            [ value => 1, text => "Опубликован", checked => true ],
                            [ value => 0, text => "Не опубликован" ]
                        ]
                    }
                </td>
            </tr>

        </tbody>
   </table>

    {include file="system/buttons.tpl"}
</form>
{/strip}
