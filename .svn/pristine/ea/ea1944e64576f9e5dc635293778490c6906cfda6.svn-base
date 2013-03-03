Ext.ns('Ext.ux.sitemgrCombobox');

Ext.ux.sitemgrCombobox= Ext.extend(Ext.form.ComboBox,
	{
		constructor: function(config) {
			config = Ext.apply({
				store: new Ext.data.ArrayStore({
					autoDestroy: true,
					idIndex:0,
					fields: ['id', 'title','image'],
					data: config.staticData
				}),
				id: config.name,
				name: '--' + config.name,
				hiddenName: config.name,
				valueField: 'id',
				displayField: 'title',
				mode:'local',
				width:300,
				triggerAction: 'all',
				selectOnFocus: true,
				forceSelection: true,
				autoSelect: true,
				//allowBlank: false,
				editable: false,
				typeAhead: false,
				tpl: '<tpl for=".">'
						+'<div class="x-combo-list-item">'
							+'<tpl if="image"><img src="../uploads/tx_templavoila/{image}" align="left"></tpl>'
							+'<p>{title}</p>'
						+'</div>'
					+'</tpl>'
			}, config);
			Ext.ux.sitemgrCombobox.superclass.constructor.call(this, config);
		}
	}
);

Ext.reg('sitemgrcombobox', Ext.ux.sitemgrCombobox);