{strip}

{if isset($permissions ) && !empty( $permissions )}
    <h4>Ошибки прав на папки:</h4>
    {foreach from=$permissions item=item key=id}
        <div class="apply notice">
            <p><b>{$item.folder}</b> нет прав на редактирования, текущие права на папку <b>{$item.perms}</b></p>
            <div class="button-container mb5 clearfix">
                <a href="{$base_path}/perm/edit/{$id}/" class="button button-green"><i class="zmdi zmdi-wrench"></i>Исправить</a>
            </div>
        </div>
    {/foreach}
{/if}

{*
<div class="fr">
	<button class="button" class="button blue"><i class="zmdi zmdi-plus-circle"></i> Добавить виджет</button> &nbsp;
	<button class="button" class="button blue"><i class="zmdi zmdi-settings"></i> Настройки</button>
</div>
*}

<div class="fl">
	{include file="$TPL_PATH/technology.tpl"}
	{include file="$TPL_PATH/widgets.tpl"}
</div>

{*
<div class="clear"></div>

<div class="card-body">
    <div class="">
      <div class="streamline b-l m-b">
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">2 minutes ago</div>
            <p>Check your Internet connection</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">9:30</div>
            <p>Meeting with tech leader</p>
          </div>
        </div>
        <div class="sl-item b-success">
          <div class="sl-content">
            <div class="text-muted-dk">8:30</div>
            <p>Call to customer <a href="" class="text-info">Jacob</a> and discuss the detail.</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">Wed, 25 Mar</div>
            <p>Finished task <a href="" class="text-info">Testing</a>.</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">Thu, 10 Mar</div>
            <p>Trip to the moon</p>
          </div>
        </div>
        <div class="sl-item b-info">
          <div class="sl-content">
            <div class="text-muted-dk">Sat, 5 Mar</div>
            <p>Prepare for presentation</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">Sun, 11 Feb</div>
            <p><a href="" class="text-info">Jessi</a> assign you a task <a href="" class="text-info">Mockup Design</a>.</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">Thu, 17 Jan</div>
            <p>Follow up to close deal</p>
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="streamline b-l b-accent m-b">
        <div class="sl-item sl-item-md">
          <div class="sl-icon">
            <i class="zmdi zmdi-check text-muted-dk"></i>
          </div>
          <div class="sl-content">
            <div class="text-muted-dk">Just now</div>
            <p>Finished task <a href="" class="text-info">#features 4</a>.</p>
          </div>
        </div>
        <div class="sl-item sl-item-md b-success">
          <div class="sl-icon">
            <i class="zmdi zmdi-twitter text-success"></i>
          </div>
          <div class="sl-content">
            <div class="text-muted-dk">11:30</div>
            <p><a href="">@Jessi</a> retwit your post</p>
          </div>
        </div>
        <div class="sl-item b-primary b-l">
          <div class="sl-content">
            <div class="text-muted-dk">10:30</div>
            <p>Call to customer <a href="" class="text-info">Jacob</a> and discuss the detail.</p>
          </div>
        </div>
        <div class="sl-item sl-item-md b-info">
          <div class="sl-icon">
            <i class="zmdi zmdi-bolt text-info"></i>
          </div>
          <div class="sl-content">
            <div class="text-muted-dk">3 days ago</div>
            <p><a href="" class="text-info">Jessi</a> commented your post.</p>
          </div>
        </div>
        <div class="sl-item b-warning">
          <div class="sl-content">
            <div class="text-muted-dk">Thu, 10 Mar</div>
            <p>Trip to the moon</p>
          </div>
        </div>
        <div class="sl-item b-info">
          <div class="sl-content">
            <div class="text-muted-dk">Sat, 5 Mar</div>
            <p>Prepare for presentation</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">Sun, 11 Feb</div>
            <p><a href="" class="text-info">Jessi</a> assign you a task <a href="" class="text-info">Mockup Design</a>.</p>
          </div>
        </div>
        <div class="sl-item">
          <div class="sl-content">
            <div class="text-muted-dk">Thu, 17 Jan</div>
            <p>Follow up to close deal</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
<div class="dashboard-item__widgets">
	<div class="widget">
		<div class="dashboard-item__drag"><div class="dashboard-item__drag__item"><i class="zmdi zmdi-apps"></i></div></div>
		<div class="dashboard-item__edit"><i class="zmdi zmdi-settings"></i></div>
	
		<div class="widget__settings"></div>

		<div class="widget__title">Информация о сервере</div>
		
		<div class="bx-gadgets-content">
			Попыток вторжения не обнаружено
		</div>
	</div>
</div>

<div class="dashboard-item__widgets">
	<div class="widget">
		<div class="dashboard-item__drag"><div class="dashboard-item__drag__item"><i class="zmdi zmdi-apps"></i></div></div>
		<div class="dashboard-item__edit"><i class="zmdi zmdi-settings"></i></div>
	
		<div class="widget__settings"></div>

		<div class="widget__title">Информация о сайте</div>
		
		<div class="bx-gadgets-content">
			<table class="bx-gadgets-info-site-table" cellspacing="0">
				<tbody>
				<tr>
					<td class="bx-gadget-gray">
						Создатель сайта:
					</td>
					<td>
						Группа компаний «1С-Битрикс».
					</td>
					<td class="bx-gadgets-info-site-logo" rowspan="5">
						<img src="/images/mail_logo.png" alt="">
					</td>
				</tr>
				<tr>
					<td class="bx-gadget-gray">
						Адрес сайта:
					</td>
					<td>
						<a href="http://www.1c-bitrix.ru">www.1c-bitrix.ru</a>
					</td>
				</tr>
				<tr>
					<td class="bx-gadget-gray">
						Сайт сдан:
					</td>
					<td>
						12 декабря 2010 г.
					</td>
				</tr>
				<tr>
					<td class="bx-gadget-gray">
						Ответственное лицо:
					</td>
					<td>
						Иван Иванов
					</td>
				</tr>
				<tr>
					<td class="bx-gadget-gray">
						E-mail:
					</td>
					<td>
						<a href="mailto:info@1c-bitrix.ru">info@1c-bitrix.ru</a>
					</td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>

<div class="dashboard-item__widgets">
	<div class="widget">
		<div class="dashboard-item__drag"><div class="dashboard-item__drag__item"><i class="zmdi zmdi-apps"></i></div></div>
		<div class="dashboard-item__edit"><i class="zmdi zmdi-settings"></i></div>
	
		<div class="widget__settings"></div>

		<div class="widget__title">О системе</div>
		
		<div class="bx-gadgets-content">
			
			<div class="bx-gadgets-info">
				<div class="bx-gadgets-content-padding-rl bx-gadgets-content-padding-t" style="font-weight: bold; line-height: 28px;">
					Проект работает на основе "1С-Битрикс: Управление сайтом 15.0.6"
				</div>
				<div style="margin: 0 1px 0 1px; border-bottom: 1px solid #D7E0E8;">
				</div>
				<div class="bx-gadgets-content-padding-rl">
					<table class="bx-gadgets-info-site-table">
					<tbody>
					<tr>
						<td align="left" valign="top" style="padding-bottom: 20px; line-height: 28px;">
							<span>
							<div>
								Последнее обновление: -
							</div>
							<div>
								Текущая оценка производительности: не проводилась
							</div>
							<div>
								Количество пользователей: 1
							</div>
							</span>
						</td>
						<td align="right" valign="bottom">
							<span style="display: inline-block; vertical-align: bottom; align: right;"><img src="http://bitrixlabs.ru/bitrix/gadgets/bitrix/admin_info/images/ru/logo.gif"></span>
						</td>
					</tr>
					</tbody>
					</table>
				</div>
			</div>
			
		</div>
	</div>
</div>

<div class="dashboard-item__widgets">
	<div class="widget">
		<div class="dashboard-item__drag"><div class="dashboard-item__drag__item"><i class="zmdi zmdi-apps"></i></div></div>
		<div class="dashboard-item__edit"><i class="zmdi zmdi-settings"></i></div>
	
		<div class="widget__settings"></div>

		<div class="widget__title">Монитор производительности</div>
		
		<div class="bx-gadgets-content">
			<div class="bx-gadget-button-text">
				Проверить
			</div>
			</a>
			<div class="bx-gadget-desc">
				Оценка не проводилась. <a href="/bitrix/admin/perfmon_panel.php?lang=ru">Протести­руйте производитель­ность</a>.
			</div>
		</div>
	</div>
</div>

<div class="dashboard-item__widgets">
	<div class="widget">
		<div class="dashboard-item__drag"><div class="dashboard-item__drag__item"><i class="zmdi zmdi-apps"></i></div></div>
		<div class="dashboard-item__edit"><i class="zmdi zmdi-settings"></i></div>
	
		<div class="widget__settings"></div>

		<div class="widget__title">Сканер<br>безопасности</div>
		
		<div class="bx-gadgets-content">
			Попыток вторжения не обнаружено
		</div>
	</div>
</div>
*}
{/strip}