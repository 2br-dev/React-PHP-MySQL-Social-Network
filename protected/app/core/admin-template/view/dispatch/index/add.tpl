{strip}
<form id="dispatch" method="post">
    <input type="hidden" name="action" value="add">
    
	<table class="table">
        <col width="200">
        <col>
        <thead>
            <tr>
                <th colspan="2">Добавление рассылки</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h">Название <span class="ness_color">*</span></td>
                <td><input name="name" class="w50 ness"></td>
            </tr>
            <tr>
                <td class="h">Модуль</td>
                <td>
                    <select name="module" id="moduleSending" class="mb10">
                    {foreach from=$item_modules item=i}
                        <option value="{$i.id}">{$i.name}</option>
                    {/foreach}
                    </select>
                    <div id="module_fields"></div>
                </td>
            </tr>
            <tr>
                <td class="h">Разослать на email'ы из таблицы</td>
                <td>
                    {if $item_modules}
                    <label class="label label-box">
                        <span class="name">Модуль</span>
                        <select name="send_to" id="send_to" class="ness">
                            <option value="0"></option>
                            {foreach from=$item_modules item=i}
                                {if $i.name}<option value="{$i.id}" {if isset($item_dispatch.send_to ) && $item_dispatch.send_to==$i.id}selected{/if}>{$i.name}</option>{/if}
                            {/foreach}		
                        </select>
                    </label>
                    {/if}
                    
                    <label class="label label-box">
                        <span class="name">Поле:</span>
                        <select name='send_to_field' id='send_to_field' class="ness">
                            <option value="0"></option>
                            {if isset($item_dispatch.send_to_field_id )}
                                {foreach from=$item_dispatch.send_to_field item=i}
                                    {if $i.f_name}<option value="{$i.id}" {if isset($item_dispatch.send_to_field_id ) && $item_dispatch.send_to_field_id==$i.id}selected{/if}>{$i.f_name}</option>{/if}
                                {/foreach}
                            {/if}
                        </select>
                    </label>
                </td>
            </tr>
            <tr>	
                <td class="h">Разослать группам</td>
                <td>
                    {foreach from=$item_groups item=i}
                        {include file="system/controll.tpl"
                            type        =   "checkbox"
                            name        =   "send_group[]"
                            value       =   $i.id
                            text        =   $i.name
                        }
                    {/foreach}
                </td>
            </tr>
            <tr>	
                <td class="h">Разослать на&nbsp;e-mail'ы</td>
                <td>
                    <textarea name="send_list" cols="50" class="mb10" rows="5">{if isset($item_dispatch.send_list ) && $item_dispatch.send_list}{$item_dispatch.send_list}{/if}</textarea><br class="clear">
                    <p class="apply notice mb0">Чтобы добывать несколько e-mail адресов, разделите их точкой с запятой;</p>
                </td>
            </tr>
        </tbody>
	</table>
    
    {include file="system/buttons.tpl"}
</form>

{literal}
<script type="text/javascript">
	$(document).ready(function(){ 
		$("#send_to").change(function(){
			$.post('/{/literal}{$ADMIN_DIR}{literal}/_ajax/dispatch/', { action: "get_fields", id: $(this).val() }, function( json ) {
                var str = "" ;
                str += "<option value='0'></option>";
                $.each( json, function( i, n ){					
                    var id = n['id'] ;
                    var name = n['f_name'] ;
                    str += "<option value='" + id + "'>" + name + "</option>";
                });
				$("#send_to_field").empty().append(str);
            }, 'JSON' );
		});
		
		$("#moduleSending").change(function(){
            $.post('/{/literal}{$ADMIN_DIR}{literal}/_ajax/dispatch/', { action: "moduleSending", id: $(this).val() }, function( json ) {
                var str  = [
                    '<table class="table">',
                    '<col>',
                    '<col width="120">',
                    '<col width="120">',
                    '<thead>',
                    '<tr>',
                    '<td class="h">Наименование</td>',
                    '<td class="h">В рассылке</td>',
                    '<td class="h">Порядок</td>',
                    '</tr>',
                    '</thead>'
                ].join( '' );
                
                $.each( json, function( i, n ) {
                    str += '<tr>' ;
                        str += '<td>' + n['f_name'] + '</td>' ;
                        str += '<td><label class="checkbox-label"><input type="checkbox" value="' + n['id'] + '" name="settings_' + n['f_sys_name'] + '"><span class="checkbox"></span> &mdash; Да</label></td>' ;
                        str += '<td><input name="settings_' + n['f_sys_name'] + '_ord" class="ord integer reducing-trigger"></td>' ;
                    str += '</tr>' ;
                });
                str += "</table>" ;
                $("#module_fields").empty().append(str);
            }, 'JSON' );
		});
	});
</script>
{/literal}
{/strip}