{strip}
<form method="post" id="auth">
	<p><b>Логин:</b><br />
	<input type="text" name="login" class="padd bord ness" /></p>
	
	<p><b>Пароль:</b><br />
	<input type="password" name="password" class="padd bord ness" /></p>
	
	<p>
		<input type="hidden" name="auth" value="1" />
		<a href="#" onclick='return CheckAndSubmit("auth")' class="btn">Войти<span></span></a>
	</p>
</form>
{/strip}