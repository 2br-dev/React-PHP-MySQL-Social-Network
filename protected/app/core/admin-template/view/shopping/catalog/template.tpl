<script type="text/html" id="tmpl-modification">
	<tr>
		<td><input name="modification[variation_name][{literal}{{id}}{/literal}]" class="ness"></td>
		<td><input name="modification[article][{literal}{{id}}{/literal}]"></td>
		<td><input name="modification[price][{literal}{{id}}{/literal}]" class="float"></td>
		<td><input name="modification[old_price][{literal}{{id}}{/literal}]" class="float"></td>
		<td>
			<table class="no-border no-padding">
				<tr>
					<td class="vam"><input name="modification[infinity][{literal}{{id}}{/literal}]"  class="integer"></td>
					<td>&nbsp;</td>
					<td class="vam">
						{include file="system/controll.tpl"
				            type        =   "checkbox"
				            name        =   modification|cat:"[infinity]"|cat:"[id]"
				            value       =   1
				            text		=	"∞"
				        }
					</td>
				</tr>
			</table>
		</td>
		<td>

		</td>
		<td><a href="" class="icon icon-delete js-remove-item" title="Удалить" onclick="return cp.dialog('Вы действительно хотите удалить модификацию?')" data-no-instant></a></td>
	</tr>
</script>

<script type="text/html" id="tmpl-properties">
	<tr>
		<td><input name="properties[name][{literal}{{id}}{/literal}]"></td>
		<td><input name="properties[value][{literal}{{id}}{/literal}]"></td>
		<td><a href="#" class="icon icon-delete js-remove-item" title="Удалить" data-no-instant></a></td>
	</tr>
</script>