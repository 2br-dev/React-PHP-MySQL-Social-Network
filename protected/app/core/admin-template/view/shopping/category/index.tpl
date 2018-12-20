{strip}
<div class="button-container clearfix">
	<a href="{$base_path}/category/add" class="button button-blue"><i class="icon icon-plus-square"></i>Добавить категорию</a>
</div>

<div class="dd nestable-tree" data-path="shopping" data-group="0">
    {if isset($category)}
    <ol class="dd-list">
        {include file="$TPL_PATH/category_tree.tpl" a_tree=$category}
    </ol>
    {/if}
</div>
{/strip}