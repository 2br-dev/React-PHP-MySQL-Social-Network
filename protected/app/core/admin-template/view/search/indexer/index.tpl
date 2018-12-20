{strip}
<!DOCTYPE HTML>
<html>
<head>
	<meta charset="utf-8">
	<title>Индексация</title>
	<script src="/{$ADMIN_DIR}/templates/js/jquery.js"></script>
    <link href="/{$ADMIN_DIR}/templates/style.css" rel="stylesheet" type="text/css">
	
	{literal}
	<script type="text/javascript">
		$(document).ready(function(){

			$("#loading").ajaxStart(function(){
				$(this).show();
			});
			
			$("#loading").ajaxStop(function(){
			   $(this).hide();
			});
			
			$("#requests").ajaxSend(function(evt, request, settings){
				$(this).append("Starting request at "
				+ settings.url
				+ "\n");
			});
			
			$("#answers").ajaxError(function(event, request, settings){
			   $(this).append("Error requesting page "
			   + settings.url
			   + "\n");
			});
			
			$("#answers").ajaxComplete(function(request, settings){
			   $(this).append("Request Complete.\n");
			});
			
			if (cp.dialog('Начать индексацию?'))
			{
				$.ajax({
	                url: "/{/literal}{$ADMIN_DIR}{literal}/search/indexer/",
	                type: 'get',
	                data: { start: 0 },
	                success: function(data)
	                {
						if (data != "good")
						{
							$.get( "/{/literal}{$ADMIN_DIR}{literal}/search/indexer/", {
								start: data
							});
						}
						else {
							$("#loader").hide();
							$("#info").hide();
							$("#good").show();
						}
					},
	                error: function(response)
	                {
	                    $.app.callback_stack.form_ajax_default($form, response);
	                    alert("error");
	                }
	            });
			}
		});
	</script>
	{/literal}
</head>
<body class="indexer">

<div class="content" style="margin: 0;">
	<table>
		<tr>
			<td>
				<form id="info">
					<p class="mb10"><b>Не закрывайте окно, до окончания индексации!</b></p>
	                <div class="cols clearfix">
	                    <div class="col-l">
	                        <div class="label">
	                            <div class="name">Запросы:</div>
	                            <textarea id="requests" style="height: 200px"></textarea>
	                        </div>
	                    </div>
	                    
	                    <div class="col-r">
	                        <div class="label">
	                            <div class="name">Ответ скрипта:</div>
	                            <textarea id="answers" style="height: 200px"></textarea>
	                        </div>
	                    </div>
					</div>
				</form>
				
				<div id="good" class="apply" style="display:none">
					<p class="mb10"><b>Индексация сайта завершена</b></p>
					<p>Теперь можно закрыть окно</p>
				</div>
			</td>
		</tr>
	</table>
</div>

</body>
</html>
{/strip}