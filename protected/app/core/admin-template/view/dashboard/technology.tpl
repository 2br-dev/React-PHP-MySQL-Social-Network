{strip}
<div class="technology_block">
    <a href="#" class="button mb5 " onclick="return toggle_item(event, this, 'server-info', ['zmdi-chevron-up', 'zmdi-chevron-down'])">
        <i class="zmdi zmdi-chevron-down"></i> <i class="zmdi zmdi-info-outline"></i> {t('server.informationen')}
    </a>

    <div class="technology_list clearfix hidden" id="server-info">
        {if isset($technology.php)}
        <div class="technology_item">
            <div class="technology_version">{$technology.php}</div>
            <div class="technology_logo">
                <a href="/{$ADMIN_DIR}/phpinfo.php" target="_blank"><img src="/{$ADMIN_DIR}/images/technology/php.png" height="60" alt=""></a>
            </div>
        </div>
        {/if}

        {if isset($technology.mysql)}
        <div class="technology_item">
            <div class="technology_version">{$technology.mysql}</div>
            <div class="technology_logo"><img src="/{$ADMIN_DIR}/images/technology/mysql.png" height="60" alt=""></div>
        </div>
        {/if}

        {if isset($technology.memcached)}
        <div class="technology_item">
            <div class="technology_version">{$technology.memcached}</div>
            <div class="technology_logo"><img src="/{$ADMIN_DIR}/images/technology/memcached.png" height="60" alt=""></div>
        </div>
        {/if}

        {if isset($technology.apache)}
        <div class="technology_item">
            <div class="technology_version">{$technology.apache}</div>
            <div class="technology_logo"><img src="/{$ADMIN_DIR}/images/technology/apache.png" height="60" alt=""></div>
        </div>
        {/if}

        {if isset($technology.nginx)}
        <div class="technology_item">
            <div class="technology_version">{$technology.nginx}</div>
            <div class="technology_logo"><img src="/{$ADMIN_DIR}/images/technology/nginx.png" height="60" alt=""></div>
        </div>
        {/if}

        {if isset($technology.mongodb)}
        <div class="technology_item">
            <div class="technology_version">{$technology.mongodb}</div>
            <div class="technology_logo"><img src="/{$ADMIN_DIR}/images/technology/mongodb.png" height="60" alt=""></div>
        </div>
        {/if}

        {if isset($technology.redis)}
        <div class="technology_item">
            <div class="technology_version">{$technology.redis}</div>
            <div class="technology_logo"><img src="/{$ADMIN_DIR}/images/technology/redis.png" height="60" alt=""></div>
        </div>
        {/if}
    </div>
</div>
{/strip}