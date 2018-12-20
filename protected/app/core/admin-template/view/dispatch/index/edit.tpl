{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply">Данные были успешно сохранены!</div>
{/if}

<form id="dispatch" method="post">
    <input type="hidden" name="action" value="edit">
    
	<table class="table">
	    <thead>
            <tr>
                <th colspan="2">Редактирование рассылки</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="h"><span class="ness_color">*</span> {t('titles.name')}</td>
                <td><input name="name" value="{$item_dispatch.name}" class="w50 ness"></td>
            </tr>
            <tr>
                <td class="h">Модуль</td>
                <td>
                    <select name="module" id="moduleSending" class="w50">
                    {foreach from=$item_modules item=i}
                        <option {if isset($item_dispatch.module)}{foreach from=$item_dispatch.module item=j}{if $j==$i.id}selected="selected"{/if}{/foreach}{/if} value="{$i.id}" style="padding:3px 5px 0px 5px">{$i.name}</option>
                    {/foreach}
                    </select>
                    
                    <div id="module_fields">
                    {if $item_fields}
                        <table class="table">
                            <col>
                            <col width="120">
                            <col width="120">
                            <thead>
                                <tr>
                                    <td class="h">Наименование</td>
                                    <td class="h">В рассылке</td>
                                    <td class="h">Порядок</td>
                                </tr>
                            </thead>
                            <tbody>
                                {foreach from=$item_fields item=i}
                                <tr valign="middle">
                                    <td>{$i.f_name}</td>
                                    <td>
                                        {assign var="checked" value=false}
                                        {if isset($item_dispatch.settings)}
                                            {foreach from=$item_dispatch.settings item=dd key=kk}
                                                {if $kk==$i.f_sys_name}
                                                    {assign var="checked" value=true}
                                                {/if}
                                            {/foreach}
                                        {/if}

                                        {include file="system/controll.tpl"
                                            type        =   "checkbox"
                                            name        =   "settings_"|cat:$i.f_sys_name
                                            value       =   $i.id
                                            checked       =   $checked
                                            text        =   Да
                                        }
                                    </td>
                                    <td><input name="settings_{$i.f_sys_name}_ord" value="{if isset($item_dispatch.settings)}{foreach from=$item_dispatch.settings item=dd key=kk}{if $kk==$i.f_sys_name}{$dd.order}{/if}{/foreach}{/if}" class="ord integer reducing-trigger"></td>
                                </tr>
                                {/foreach}
                            </tbody>
                        </table>
                    {/if}
                    </div>
                </td>
            </tr>
            <tr>
                <td class="h">Разослать на email'ы из таблицы</td>
                <td>{if $item_modules}
                    <select name='send_to' id="send_to" class="w50 ness" style="width:200px">
                        <option value="0"></option>
                        {foreach from=$item_modules item=i}
                            {if $i.name}<option value="{$i.id}" {if $item_dispatch.send_to==$i.id}selected{/if}>{$i.name}</option>{/if}
                        {/foreach}		
                    </select>
                    {/if}
                    Поле:
                    <select name='send_to_field' id='send_to_field' class="w50 ness">
                        <option value="0"></option>
                        {if isset($item_dispatch.send_to_field_id)}
                            {foreach from=$item_dispatch.send_to_field item=i}
                                {if $i.f_name}<option value="{$i.id}" {if $item_dispatch.send_to_field_id==$i.id}selected{/if}>{$i.f_name}</option>{/if}
                            {/foreach}
                        {/if}
                    </select>			
                </td>
            </tr>
            <tr>	
                <td class="h">Разослать группам</td>
                <td>
                    {foreach from=$item_groups item=i}
                        {assign var="checked" value=false}

                        {if isset($item_dispatch.send_group) && is_array($item_dispatch.send_group) && in_array($i.id, $item_dispatch.send_group)}
                            {assign var="checked" value=true}
                        {/if}

                        {include file="system/controll.tpl"
                            type        =   "checkbox"
                            name        =   "send_group[]"
                            value       =   $i.id
                            checked     =   $checked
                            text        =   $i.name
                        }
                    {/foreach}
                </td>
            </tr>
            <tr>	
                <td class="h">Разослать на&nbsp;e-mail'ы</td>
                <td><textarea name="send_list" class="w50" cols="50" rows="5">{if $item_dispatch.send_list}{$item_dispatch.send_list}{/if}</textarea><br class="clear">
                <span class="hint2">Чтобы добывать несколько e-mail адресов, разделите их точкой с запятой ;</span>
                </td>
            </tr>	
        </tbody>
	</table>
    
    {include file="system/buttons.tpl"}
</form>
<script type="text/javascript">
	{literal}
	$().ready(function(){ 
		$("#send_to").change(function(){
			$.post(
				$.post('/{/literal}{$ADMIN_DIR}{literal}/_ajax/dispatch/',
                { 
					action: "get_fields" ,
					id: $(this).val()
				},
				function(data){
					var json = eval ("("+data+")");
					var str = "" ;
					str += "<option value='0'></option>";
					$.each( json, function( i, n ){					
						var id = n['id'] ;
						var name = n['f_name'] ;
						str += "<option value='" + id + "'>" + name + "</option>";
					});
					$("#send_to_field").empty().append(str);
				}
			);			
		});
		$("#moduleSending").change(function(){
			$.post(
				$.post('/{/literal}{$ADMIN_DIR}{literal}/_ajax/dispatch/',
				{ 
					action: "moduleSending" ,
					id: $(this).val()
				},
				function(data){
					var json = eval ("("+data+")");
					var str  = "" ;
					str += "<table width='100%' style='border-collapse:collapse' border='1'><tr valign='middle'><td width='70%'>Наименование</td><td width='15%'>В рассылке</td><td width='15%'>Порядок</td></tr>" ;
					$.each( json, function( i, n ) {
						var id = n['id'] ;
						var name = n['f_name'] ;
						var sys_name = n['f_sys_name'] ;
						str += "<tr valign='middle'>" ;
							str += "<td>" + name + "</td>" ;
							str += "<td><input name='settings_" + sys_name + "' value='" + id + "' type='checkbox'></td>" ;
							str += "<td><input name='settings_" + sys_name + "_ord' value='' style='width:80px;padding:2px 4px;border:1px solid #ccc'></td>" ;
						str += "</tr>" ;
					});
					str += "</table>" ;
					$("#module_fields").empty().append(str);
				}
			);
		});
	});
	{/literal}
</script>
{/strip}