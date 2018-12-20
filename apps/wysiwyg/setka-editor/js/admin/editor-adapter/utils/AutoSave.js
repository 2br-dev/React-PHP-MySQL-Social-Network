var
    $ = jQuery,
    translations = window.setkaEditorAdapterL10n;

module.exports = Backbone.View.extend({

    DOM: {},

    initialize: function() {
        _.bindAll(this, 'save', 'onHeartBeatSend', 'onHeartBeatTick');
        this.setupDOM();
        this.addEvents();
    },

    setupDOM: function() {
        this.DOM.document = $(document);
    },

    addEvents: function() {
        this.DOM.document
            .on('heartbeat-send.' + translations.names.css, this.onHeartBeatSend);

        this.DOM.document
            .on('heartbeat-tick.' + translations.names.css, this.onHeartBeatTick);
    },

    save: function() {
        // Nonce may outdated here. We need update it just before sending request
        // and we update it on heartbeat-send event.
        window.wp.heartbeat.enqueue(
            translations.names.css,
            this.model.getDataForAutosave(),
            false
        );
    },

    /**
     * Before Heartbeat API sends data to server.
     *
     * @param event
     * @param data
     */
    onHeartBeatSend: function(event, data) {
        // Add our plugin data if WP doing auto save or some settings in editor changed
        // (our own data already added to query and we need update it)
        if(
            // We replace all data for 100% actual data in request (nonce may outdated)
            !_.isUndefined(data[translations.names.css])
            ||
            // if WP doing auto save also include our data
            !_.isUndefined(data['wp_autosave'])
        ) {
            if(this.model.get('editorInitialized')) {
                data.wp_autosave.content = this.model.get('editorContent');
            }
            data[translations.names.css] = this.model.getDataForAutosave();
        }
    },

    /**
     * Heartbeat get a response from server.
     *
     * @param event
     * @param data
     */
    onHeartBeatTick: function(event, data) {
        // Do nothing at now
    }

});
