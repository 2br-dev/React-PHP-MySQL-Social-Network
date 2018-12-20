{strip}
{if isset($smarty.get.msg ) && $smarty.get.msg == "apply"}
<div class="apply">Данные были успешно сохранены!</div>
{/if}

<form action="{$request_path}" method="post" enctype="multipart/form-data" name="meta_form" class="dropzone">
    <input type="hidden" name="form_action" value="edit">
    <input type="hidden" name="back_to_page" value="{if isset($smarty.get.back_to_page ) && $smarty.get.back_to_page !== ''}{$smarty.get.back_to_page}{else}0{/if}">

    {if is_array( $meta_enable ) || $meta_enable === true}
        {include file="fields/meta.tpl"
            title           =   $meta_enable.meta_title
            keywords        =   $meta_enable.meta_keywords
            description     =   $meta_enable.meta_description
            robots          =   $meta_enable.meta_robots
        }
    {/if}
    
    <table class="module">
        <col width="200">
        <col>
        <thead>
            <tr class="module__tr">
                <th class="module__th" colspan="2">{t('contents.title')}</th>
            </tr>
        </thead>
        <tbody>
        {assign var="zindex" value=1000}
        {foreach item=item from=$meta_item name=i}
            {assign var="zindex" value=$zindex-1}
        
            {if $item.f_type !== 'meta' && $item.f_sys_name !== 'meta_title' && $item.f_sys_name !== 'meta_keywords' && $item.f_sys_name !== 'meta_robots' && $item.f_sys_name !== 'meta_description'}
                {if $item.f_sys_name == "visible"}
                <tr class="module__tr">
                    <td class="module__td module__td_strong">{$item.f_name}:</td>
                    <td class="module__td">
                        {include file="system/group.tpl"
                            name    = $item.f_sys_name
                            check   = $item.value
                            list    = [
                                [ value => '1', text => "Да" ],
                                [ value => '0', text => "Нет", default => true ]
                            ]
                        }
                    </td>
                </tr>
                {elseif $item.f_sys_name == "ord"}
                <tr class="module__tr">
                    <td class="module__td module__td_strong">{$item.f_name}:</td>
                    <td class="module__td">
                        <input name="{$item.f_sys_name}" value="{$item.value}" class="ord integer reducing-trigger">
                    </td>
                </tr>
                {elseif $item.f_sys_name != "id" and 
                        $item.f_sys_name != "updated" and
                        $item.f_sys_name != "uid" and
                        $item.f_sys_name != "gid"
                }
                <tr class="module__tr">
                    <td class="module__td module__td_strong">{$item.f_name}:</td>
                    <td class="module__td module__td_{$item.f_type}">
                        <div style="z-index: {$zindex}; position: relative;">
                            {if isset($item.list)}
                                {assign var="list" value=$item.list}
                            {else}
                                {assign var="list" value=""}
                            {/if}
                            
                            {assign var="field" value=$item.f_type}
                            {assign var="f_width" value=$item.f_width}
                            {assign var="class_name" value=""}
                                
                            {if isset($f_width ) && $f_width > 0}
                                {assign var="class_name" value="width-$f_width"}
                            {/if}
                        
                            {include file="fields/$field.tpl"
                                index       =   $smarty.foreach.i.iteration
                                fid         =   $item.id 
                                type        =   $item.f_type 
                                name        =   $item.f_sys_name
                                value       =   $item.value
                                list        =   $list
                                json        =   $item.json
                                width       =   $item.f_width
                                settings    =   $item.f_settings
                                class_name  =   $class_name
                            }
                        </div>
                    </td>
                </tr>
                {/if}
            {/if}
        {/foreach}
        </tbody>
    </table>
    
    {include file="system/buttons.tpl"}
</form>
{/strip}