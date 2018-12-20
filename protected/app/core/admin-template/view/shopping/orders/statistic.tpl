{strip}
{if $smarty.session.userinf.gid == 10 || $smarty.session.userinf.id == 4}
	<div class="widget-table">
	    <div class="widget-table__title"><span class="icon icon-chart"></span>&nbsp;&nbsp;Статистика заказов</div>
	    <div class="widget-table__button">
	    	<button type="button" onclick="orders.toggle(this, 'statistic', 'is-visible', { 1: 'Показать', 0: 'Скрыть' })">Показать</button>
	    </div>
	</div>

	{if $statistic}
	<div class="statistic" id="statistic">
		<table class="statistic__table">
			<colgroup>
				<col width="160">
				<col width="160">
				<col width="160">
				<col width="160">
				<col width="160">
				<col>
			</colgroup>
			<thead>
				<tr class="statistic__trow">
					<th class="statistic__head"></th>
					<th class="statistic__head">Кол-во продаж</th>
					<th class="statistic__head">Общая сумма</th>
					<th class="statistic__head">Средний чек</th>
					<th class="statistic__head">Всего / уникальных</th>
					<th class="statistic__head">Хиты продаж</th>
				</tr>
			</thead>
			<tbody>
			{foreach $statistic as $id => $item}
				{include file='./statistic.item.tpl'
			        id		=	$id
			        name	=	$item.name
			        list	=	$item.list
			    }
			{/foreach}
			</tbody>
		</table>
	</div>
	{/if}
{/if}
{/strip}
