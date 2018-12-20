/* global jQuery, setkaEditorSettingPages */
(function( $ ) {
    $(document).ready(function() {
        var forms = $('form');
        var FragmentView = setkaEditorSettingPages.view.Fragment;
        var FragmentModel = setkaEditorSettingPages.model.Fragment;
        window.setkaEditorSettingPageFormInstances = [];

        _.each(forms, function(form){
            if($(form).data('form-type') == 'conditional-form') {
                window.setkaEditorSettingPageFormInstances.push(
                    new FragmentView({
                        el: form,
                        model: new FragmentModel({
                            name: $(form).attr('name')
                        })
                    })
                );
            }
        });

        // Open external links in our menu in new tab.
        var menuLinks = $('#toplevel_page_setka-editor a');
        _.each(menuLinks, function(link) {
            if(location.hostname !== link.hostname && link.hostname.length) {
                $(link).attr('target', '_blank');
            }
        });
    });
}(jQuery));
