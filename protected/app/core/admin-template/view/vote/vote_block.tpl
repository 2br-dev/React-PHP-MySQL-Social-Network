{strip}
{foreach item=item from=$ArrayVote}
	{assign var=is_result value=0}
	{assign var=check value=0}	
	<table id="vote-block">
		<form id="vid_{$item.0.vote_id}" method="post" class='vote' action="">
		{assign var=vid value=$item.0.vote_id}
			{assign var=ch value=0}
			{assign var=chk value=0}
			{foreach item=it from=$item}
				{if $result_vote_arr.theme_id == $it.vote_id}
					<tr>
						<td>
							{if $chk == 0}
								<div class="question">{if $result_vote_arr.status != "0"}<b>{$result_vote_arr.status}</b>{/if}</div>
								<h1>{$result_vote_arr.theme}</h1>
								{if $ch == 0}
									{foreach item=i from=$result_vote_arr.question}
											<div class="question">{$i.title}</div>
											<div class="vote-voice">
												<div class="left">
													<div class="bg" style="width:{$i.percent}%"></div>
												</div>
												<div class="right">
													<span>{$i.percent} %</span>
												</div>	
											</div>	
									{/foreach}
									<div class="question">Всего голосов: {$result_vote_arr.summ}</div>
								{/if}
								{assign var=ch value=1}
							{/if}	
							{assign var=chk value=1}
						</td>
					</tr>
				{assign var=is_result value=1}
				{else}
					{if $check != 1}
					<tr>
						<td colspan="2">
							<h1>{$it.vote_title}</h1>
							<input type="hidden" name="vote_id" value="{$it.vote_id}" />
						</td>
					</tr>
					{/if}
					<tr>
						<td width="10%" style="width:10% !important">
							<input type="radio" name="vote_question" value="{$it.vote_question_id}" class="radio" />
						</td>
						<td>
							{$it.vote_question_title}
						</td>	
					</tr>	
					{assign var=is_result value=0}
				{/if}
				{assign var=check value=1}
			{/foreach}
			{if $is_result == 0}
			<tr>
				<td colspan="2">
					<p><input class="input-button" type="submit" value="" onmouseover="this.style.background='url(/images/poll-button-bg.gif) no-repeat left bottom'" onmouseout="this.style.background='url(/images/poll-button-bg.gif) no-repeat left top'" /></p>
				</td>
			</tr>
			{/if}
		</form>
	</table>
{foreachelse}
	Голосований нет!
{/foreach}
{/strip}