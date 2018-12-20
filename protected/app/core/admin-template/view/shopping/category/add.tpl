{strip}
<form action="" method="post" enctype="multipart/form-data" name="meta_form">
    <input type="hidden" name="form_action" value="add_category">
    
    {include file="fields/meta.tpl"
        title           =   ''
        keywords        =   ''
        description     =   ''
        robots          =   ''
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
                <td class="h">Родитель:</td>
                <td>
                    <select name="pid">
                        <option value="0">Родительская категория</option>
                        {include file="fields/select_tree.tpl"
                            name            =   'pid'
                            tree            =   $category_list
                            children        =   'tree'
                            value_key       =   'id'
                            value_name      =   'name'
                            selected        =   0
                        }
                    </select>
                </td>
            </tr>
            
            <tr>
                <td class="h">Описание:</td>
                <td>
                    
                    {include file="fields/redactor.tpl"
                        type        =   'imperavi'
                        name        =   'description'
                        value       =   ''
                    }
                </td>
            </tr>

            <tr>
                <td class="h">ID в системе 1C:</td>
                <td>
                    <input name="syncid">
                </td>
            </tr>

            <tr>
                <td class="h">Отображать:</td>
                <td>
                    {include file="system/group.tpl"
                        name    = "visible"
                        check   = $item.visible
                        list    = [
                            [ value => 1, text => "Да", checked => true ],
                            [ value => 0, text => "Нет" ]
                        ]
                    }
                </td>
            </tr>
			
            <tr>
                <td class="h">Порядок:</td>
                <td>
                    <input name="ord" value="{$category.ord}" class="ord integer reducing-trigger">
                </td>
            </tr>
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}