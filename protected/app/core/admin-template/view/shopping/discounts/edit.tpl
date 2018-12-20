{strip}
<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <input type="hidden" name="form_action" value="edit_discount">

    <table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Редактирование промокода</th>
            </tr>
        </thead>
        <tbody>

            <tr>
                <td class="h">Наименование:</td>
                <td>
                    <input name="name" placeholder="Акция" value="{$item.name}">
                </td>
            </tr>

            <tr>
                <td class="h">Промокод:</td>
                <td>
                    <input name="code" id="promocode" class="w25 mb10" value="{$item.code}">

                    <a href="#" onclick="return secret('#promocode')" class="button button-purple button-icon">
                        <i class="icon icon-refresh"></i>
                    </a>

                    <div class="apply notice mb0">Если оставить поле пустым, промокод сгенерируется автоматически</div>
                </td>
            </tr>

            <tr>
                <td class="h">Количество использований:</td>
                <td>
                    <div class="mb10">
                        <input name="limit" class="integer w25" value="{$item.limit}">
                    </div>

                    <div class="apply notice mb0">Если указать 0 или не указывать ничего, то можно будет использовать неограниченно</div>
                </td>
            </tr>

            <tr>
                <td class="h">Размер скидки:</td>
                <td>
                    <input name="discount" class="float w25" value="{$item.discount}">&nbsp;&nbsp;

                    {include file="system/group.tpl"
                        name    = "discount_type"
                        check   = $item.discount_type
                        list    = [
                            [ value => 1, text => "В процентах" ],
                            [ value => 0, text => "Статическая скидка" ]
                        ]
                    }
                </td>
            </tr>

            <tr>
                <td class="h">Дата действия:</td>
                <td>
                    <div class="mb10 clearfix">
                        <div class="calendar w25" style="float: left; margin-right: 10px;">
                            <input name="date_start" data-format="DD.MM.YYYY" placeholder="Начало" value="{$item.date_start}">
                            <a href="#" onclick="return false" class="icon icon-calendar selector"></a>
                        </div>

                        <div class="calendar w25" style="float: left;">
                            <input name="date_end" data-format="DD.MM.YYYY" placeholder="Окончание" value="{$item.date_end}">
                            <a href="#" onclick="return false" class="icon icon-calendar selector"></a>
                        </div>
                    </div>

                    <div class="apply notice mb0">Если не указывать то промокод будет считаться активным всегда (если имеет статус "Активен")</div>
                </td>
            </tr>

            <tr>
                <td class="h">Статус:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "active"
                        check   = $item.active
                        list    = [
                            [ value => 1, text => "Активен" ],
                            [ value => 0, text => "Заблокирован" ]
                        ]
                    }
                </td>
            </tr>

        </tbody>
   </table>

    {include file="system/buttons.tpl"}
</form>
{/strip}