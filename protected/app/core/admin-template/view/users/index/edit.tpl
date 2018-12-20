{strip}
<form method="post" id="form_usr">
	<input type="hidden" name="action" value="user_edit">

	<table class="table">
		<col width="200">
		<col>
		<thead>
            <tr>
                <th colspan="2">Редактирование пользователя</th>
            </td>
        </thead>
		<tr>
			<td class="h hl">Пользователь <span class="ness_color">*</span></td>
			<td><input name="name" class="w50 ness" value="{$userinf.name}"></td>
		</tr>
		<tr>
			<td class="h hl">Группа <span class="ness_color">*</span></td>
			<td>
				<div class="width-50">
                    <select name="gid" class="ness">
                        <option value="0"{if isset($smarty.cookies.users_gid ) && $smarty.cookies.users_gid == 0} selected="selected"{/if}>..выбрать</option>
                        {foreach item=item from=$usersGroups}
                        <option value="{$item.id}"{if $userinf.gid == $item.id} selected="selected"{/if}>{$item.name}</option>
                        {/foreach}
                    </select>
				</div>
			</td>
		</tr>
		<tr>
			<td class="h hl">Логин</td>
			<td><input name="login" class="w50" value="{$userinf.login}"></td>
		</tr>
		<tr>
			<td class="h hl">E-mail <span class="ness_color">*</span></td>
			<td><input name="email" class="w50 ness" value="{$userinf.email}"></td>
		</tr>
		<tr>
			<td class="h hl">Сменить пароль</td>
			<td>
			    <input name="password" id="password" class="w25"><a href="#" onclick="return secret('#password')" class="button button-purple button-icon"><i class="zmdi zmdi-refresh"></i></a>
			</td>
		</tr>
		<tr>
			<td class="h hl">Активен</td>
			<td>
                {include file="system/group.tpl"
                    name    = "active"
                    check   = $userinf.active
                    list    = [
                        [ value => '1', text => "Да" ],
                        [ value => '0', text => "Нет", default => true ]
                    ]
                }
			</td>
		</tr>

		{if $additions}
        {foreach from=$additions item=addition name=i}
        <tr>
            <td class="h hl">{$addition.name}</td>
            <td>
            	{if isset($addition.list)}
	                {assign var="list" value=$addition.list}
	            {else}
	                {assign var="list" value=""}
	            {/if}

            	{if isset($userinf[$addition.sys_name])}
	            	{assign var="value" value=$userinf[$addition.sys_name]}
	            {else}
	                {assign var="value" value=""}
	            {/if}

	            {assign var="field" value=$addition.f_type}
	            {assign var="class_name" value="w50"}
	            
	            {include file="$TPL_PATH/fields/$field.tpl"
                    index       =   $smarty.foreach.i.iteration
                    fid         =   $item.id
                    type        =   $addition.f_type 
                    name        =   $addition.sys_name
                    list        =   $list
                    value       =   $value
                    class_name  =   $class_name
                }
            </td>
        </tr>
        {/foreach}
        {/if}
	</table>
	
	{include file="system/buttons.tpl"}
</form>
{/strip}