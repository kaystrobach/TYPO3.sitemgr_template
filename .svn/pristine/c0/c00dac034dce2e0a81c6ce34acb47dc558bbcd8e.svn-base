Ext.ns('Ext.ux.sitemgrWizardfield');

document.sitemgrWizardfield_OpenWizardRef = null;

Ext.ux.sitemgrWizardfield= Ext.extend(Ext.form.ComboBox,
	{
		constructor: function(config) {
			//config = Ext.apply({
			//}, config);
			Ext.ux.sitemgrWizardfield.superclass.constructor.call(this, config);
		},
		onTriggerClick: function(event, image, c) {
			if(this.wizardUri) {
				uri = this.wizardUri;
				/*
				win = new Ext.Window(
					{
						html: '<iframe src="' + uri + '" width="100%" height="100%"></iframe>',
						width: 600,
						height:600,
						closeAction: 'close',
						maximized:true
					}
				);
				win.show();//*/
				window.open(uri, 'Tetete', "width=600, height=600, scrollbars=yes, dependent=yes, resizable=yes");
				document.sitemgrWizardfield_OpenWizardRef = {'ref':this.el.dom};
			} else {
				alert('unknown handler: ' + this.internalHandler);
			}
		}
	}
);

Ext.reg('sitemgrwizardfield', Ext.ux.sitemgrWizardfield);