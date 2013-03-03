Ext.ns('Ext.ux.sitemgrMultiField');
//Ext.ux.Typo3MultiField = Ext.extend(Ext.form.CompositeField,  {
Ext.ux.sitemgrMultiField = Ext.extend(Ext.Panel,  {
		constructor: function(config) {
				// settings for the value field
			config.fieldConfig.width     = 200;
			config.fieldConfig.name      = 'data[' + config.subname + ']';
			config.fieldConfig.hidden    = !config.checkState;
			config.fieldConfig.disabled  = !config.checkState;
			config.fieldConfig.msgTarget = 'side';
				//unset unused settings
			fieldConfig = config.fieldConfig;
			config.fieldConfig = undefined;
					//global settings
			config = Ext.apply({
				height:25,
				layout: 'hbox',
				bodyCssClass: 'sitemgr_template-tsconst',
				items: [
					{
						xtype: 'button',
						iconCls: 't3-icon t3-icon-actions t3-icon-actions-edit t3-icon-edit-undo',
						autoShow: true,
						hidden: !config.checkState,
						handler: function(button, event) {
							panel = button.findParentByType('panel');
							panel.get(4).setValue(false);
						}
					},{
						xtype: 'button',
						autoShow: true,
						iconCls: 't3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-open',
						hidden: config.checkState,
						handler: function(button, event) {
							panel = button.findParentByType('panel');
							panel.get(4).setValue(true);
						}
					},
					fieldConfig,
					{
						hidden: config.checkState,
						xtype: 'textfield',
						readOnly: true,
						cls:   'sitemgr_template-constdisplayfield',
						value: fieldConfig.defaultValue,
						width: 200,
						fieldClass: 'x-form-field x-form-field-readonly',
						name: 'data[' + config.subname + ']',
						disabled: config.checkState
					},{
						xtype: 'checkbox',
						name : 'check[' + config.subname + ']',
						checked: config.checkState,
						hidden: true,
						width: 20,
						listeners: {
							check: function(checkbox, value) {
								field = checkbox.findParentByType('panel');
								if(checkbox.getValue()) {
									field.get(0).show();
									field.get(1).hide();
									field.get(2).show();
									field.get(3).hide();
										// Ensure, validation
									field.get(2).enable();
									field.get(3).disable();
								} else {
									field.get(0).hide();
									field.get(1).show();
									field.get(2).hide();
									field.get(3).show();
									field.get(2).disable();
									field.get(3).enable();
										// Suppress validation
									field.get(2).setRawValue(field.get(2).defaultValue);
								}
								field.doLayout()
							}
						}
					}
				]
	        }, config);
			Ext.ux.sitemgrMultiField.superclass.constructor.call(this, config);
		}
	}
);

Ext.reg('sitemgrmultifield', Ext.ux.sitemgrMultiField);