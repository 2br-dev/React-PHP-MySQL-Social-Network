{strip}
{literal}
<style>
    .module-search-form {
        clear: both;
        margin-bottom: 15px; 
    }
    
    .module-search-input {
        max-width: 400px;
        float: left;
        margin-right: 8px;
    }

    .module-search-button {
        float: left;
        width: 120px;
        height: 29px;
        line-height: 29px;
    }
</style>

<script>
    function checkDisabled( str )
    {
        var button = document.getElementById('search-button');
        if ( !(new RegExp('([^\\s*]+)','g').test( str )) )
        {
            button.className = 'btn btn-disabled';

            button.setAttribute("disabled", true);
            button.disabled = true;
        }
        else
        {
            button.className = 'btn';

            button.removeAttribute("disabled");
            button.disabled = false;
        }
    }
</script>
{/literal}

<form action="/{if $_page.lang != 'ru'}{$_page.lang}/{/if}search" id="search_form" class="module-search-form form clearfix" enctype="text/plain">
    <input name="q"{if isset($smarty.get.q) nocache} value="{$smarty.get.q|stripslashes|urldecode}"{/if} class="form__input module-search-input" onkeyup="checkDisabled(this.value)" autofocus>
    <button type="submit" id="search-button" class="module-search-button button"{if !isset($smarty.get.q ) || $smarty.get.q == '' nocache} disabled{/if}>{if $_page.lang != 'en'}Найти{else}Search{/if}</button>
</form>

<div class="result-search">
{if $search_error == 1 nocache}
    <div class="result-search__text">Строка поиска должа содержать более 3-х символов</div>
{elseif $search_error == 2 nocache}
    <div class="result-search__text">Вы ввели недопустимые символы для поиска по сайту</div>
{elseif isset($smarty.get.q ) nocache}
    <div class="result-search__text">Вы искали: <b>{$search_word}</b><br>Найдено: <b>{$search_result_count|textnum:"страница":"страницы":"страниц"}</b></div>

    {if $search_result}
        <div class="result-search__title">Результаты:</div>

        {if isset($smarty.get.page)}
            {assign var="p" value=$smarty.get.page}
        {else}
            {assign var="p" value="0"}
        {/if}

        <ul class="result-search__list">
        {foreach item=item name=i from=$search_result}
            {math equation="x+p*10" x=$smarty.foreach.i.iteration p=$p assign=it}
            <li class="result-search__item clearfix">
                <div class="result-search__item__index">{$it}.</div>
                <div class="result-search__item__content">
                    <a href="{$item.link}?highlight={$smarty.get.q}" class="result-search__item__title">{if $item.page_title}{$item.page_title}{else}Нет заголовка{/if}</a>
                    <div class="result-search__item__text">{$item.content_index}</div>
                    <div class="result-search__item__link">{$item.link}</div>
                </div>
            </li>
        {/foreach}
        </ul>

        {if isset($pager)}
            {include file="./components/pager.tpl" pager=$pager}
        {/if}
    {/if}
{/if}
</div>
{/strip}