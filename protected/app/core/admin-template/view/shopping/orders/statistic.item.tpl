{strip}
<tr class="statistic__row">
	<td class="statistic__item statistic__item--border"><span class="statistic__item__name">{$name}:</span></td>
	<td class="statistic__item statistic__item--push">{$list.count}</td>
	<td class="statistic__item statistic__item--push">
		{if $list.cost}
			<strong>{$list.cost|to_money}</strong> <span class="ruble">p</span>
		{else}
			-
		{/if}
	</td>
	<td class="statistic__item statistic__item--push">
		{if $list.average}
			<strong>{$list.average|to_money}</strong> <span class="ruble">p</span>
		{else}
			-
		{/if}
	</td>
	<td class="statistic__item statistic__item--push">{$list.products} / {$list.unique}</td>
	<td class="statistic__item statistic__item--pure">
		{if $list.hits}
		<button type="button" class="statistic__button" onclick="orders.toggle(this, 'hits-{$id}', 'is-visible', true)">Показать</button>
		<div class="statistic__block" id="hits-{$id}">
			<table class="statistic__hits">
				<colgroup>
					<col width="75%">
					<col width="20%">
				</colgroup>
				<thead>
					<tr>
						<th class="statistic__hits__head">Наименование</th>
						<th class="statistic__hits__head statistic__hits__head--push">Продаж</th>
					</tr>
				</thead>
				<tbody>
				{foreach $list.hits as $id => $hit}
					<tr>
						<td class="statistic__hits__item">
							<a href="/{$ADMIN_DIR}/shopping/catalog/edit/{$hit.id}" class="statistic__hits__product" target="_blank">{$hit.name}</a>
						</td>
						<td class="statistic__hits__item statistic__hits__item--push">{$hit.count}</td>
					</tr>
				{/foreach}
				</tbody>
			</table>
		</div>
		{/if}
	</td>
</tr>
{/strip}
