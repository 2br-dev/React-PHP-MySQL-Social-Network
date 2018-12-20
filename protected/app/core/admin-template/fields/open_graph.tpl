{strip}
<table class="t1 table table-toggle-trigger" id="open_graph">
    <col width="200">
    <col>
    <thead>
        <tr class="th">
            <th colspan="2">
                <a href="#" class="table_hdr table_u js-table-toggle" data-toggle-init="true" data-toggle="open_graph"><i class="icon"></i> Open Graph</a>
            </th>
        </tr>
    </thead>
    <tbody>

        <tr>
            <td class="h hl va_m">Тип</td>
            <td>
                {if $ogp_types}
                <select name="og_type">
                    {foreach $ogp_types as $og_type}
                        
                        {if $og_type.tree}
                        <optgroup label="{$og_type.name|escape}">
                            {foreach $og_type.tree as $og_tree}
                                <option value="{$og_tree.value|escape}">{$og_tree.name|escape}</option>
                            {/foreach}
                        </optgroup>
                        {else}
                            <option value="{$og_type.value|escape}">{$og_type.name|escape}</option>
                        {/if}

                    {/foreach}
                </select>
                {else}
                <input type="hidden" name="og_type" value="website">
                {/if}
            </td>
        </tr>
        
        <tr>
            <td class="h hl va_m">Заголовок</td>
            <td>
                <div class="count-number-block clearfix">
                    <span class="count-number-block-count{if isset($og_title) && $og_title|mb_strlen > 65} unlim{/if}" data-recomend="65">{if isset($og_title)}{$og_title|mb_strlen}{else}0{/if}/65</span>
                    <input name="og_title" placeholder="og:title" value="{if isset($og_title)}{$og_title|escape}{/if}" class="count-number">
                </div>
            </td>
        </tr>
        
        <tr>
            <td class="h hl va_m">Описание</td>
            <td>
                <div class="count-number-block clearfix">
                    <span class="count-number-block-count{if isset($og_description) && $og_description|mb_strlen > 300} unlim{/if}" data-recomend="300">{if isset($og_description)}{$og_description|mb_strlen}{else}0{/if}/300</span>
                    <textarea name="og_description" placeholder="og:description" class="count-number">{if isset($og_description)}{$og_description|escape}{/if}</textarea>
                </div>
            </td>
        </tr>
    
        <tr>
            <td class="h hl va_m">Иллюстрации</td>
            <td>
                <!--
                Minimum size in pixels is 600x315
                Recommended size is 1200x630 - Images this size will get a larger display treatment.
                Aspect ratio should be 1.91:1
                <input name="" placeholder="og:image" value="{if isset($og_image)}{$og_image|escape}{/if}" class="count-number">
                -->

                {include file="fields/image.tpl"
                    action      =   '/'
                    name        =   'og_image'
                    list        =   ''
                    value       =   ''
                    settings    =   ''
                }
            </td>
        </tr>

        {*
        og:image — в этом теге прописывается адрес картинки, которую мы хотим видеть в анонсе. Заметьте, что теперь вовсе не обязательно использовать только те иллюстрации, которые мы вставляли в текст записи. Указать можно совершенно любую картинку, которую вы сочтете нужным.
        og:title — здесь указывается заголовок вашего анонса. И если на блоге мы пытаемся сделать его максимально информативным, «цепляющим», да еще и с ключевыми словами, то здесь можно дать волю фантазии и «продать» свою запись по полной!
        og:description — ну а в этом теге и прописывается, собственно, текст анонса. Обратите внимание на то, что facebook подхватывает около 300 символов, так что больше писать не имеет смысла. Но это явно больше, чем те 160 символов, которые предлагаются нам для обычного дескрипшена (напишете больше — ПС то ли обрежут, то ли вовсе проигнорируют).

        <!-- Open Graph -->
        <meta content="sexispure.com" property="og:site_name">
        <meta content="Sex is Pure | Egon Schiele — a true feminist" property="og:title">
        <meta content="How the artist who loved vaginas also loved everything else." property="og:description">
        <meta content="website" property="og:type">
        <meta content="http://sexispure.com/issue-1/egon-schiele/" property="og:url">
        <meta content="http://sexispure.com/images/open-graph/egon-schiele2.jpg" property="og:image">
        <meta content="image/jpeg" property="og:image:type">
        <meta content="902" property="og:image:width">
        <meta content="473" property="og:image:height">

        <meta property="og:title" content="Performance Optimizing for Smart Layers" />
        <meta property="og:type" content="blog" />
        <meta property="og:image" content="http://farm4.staticflickr.com/3742/9776421873_0d5795a966_z.jpg" />
        <meta property="og:url" content="http://www.addthis.com/blog/2013/09/17/performance-optimizing-for-smart-layers/" />
        <meta property="og:site_name" content="AddThis Blog" />
        *}

        </tr>
    </tbody>
</table>
{/strip}