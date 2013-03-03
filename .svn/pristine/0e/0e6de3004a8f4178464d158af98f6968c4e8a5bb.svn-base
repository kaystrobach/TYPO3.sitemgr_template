/****************************************************************
 * Wizard
 ****************************************************************/
Ext.ux.Wizard = Ext.extend(Ext.Panel, {
	layout    : 'card',
	activeItem: 0,
	activeCard: 0,
	cls: 'sitemgr-template-previewimage',
	bbar: [
		{
			id       : 'move-prev',
			disabled : true,
			iconAlign :'left',
			iconCls   :'t3-icon t3-icon-actions t3-icon-actions-view t3-icon-view-paging-previous'
		},'->',{
			id       : 'move-next',
			//disabled : true,
			iconAlign :'right',
			iconCls   :'t3-icon t3-icon-actions t3-icon-actions-view t3-icon-view-paging-next'
		}
	],
	prev : function() {
		this.unRegisterValidator();
		this.activeCard--;
		this.layout.setActiveItem(this.activeCard);
		if(this.activeCard===0) {
			this.disablePrev();
		}
		this.enableNext();
		this.registerValidator();
	},
	next : function() {
		this.unRegisterValidator();
		this.activeCard++;
		this.layout.setActiveItem(this.activeCard);
		if(this.activeCard+1==this.items.length) {
			this.disableNext();
		}
		this.enablePrev();
		this.registerValidator();
	},
	validator         : function() {
		//this.enableNext();
		this.mayEnableNext = 1;
		Ext.each(this.get(this.activeCard).findByType('field'),
			function(item,idx,allItems) {
				if(!item.isValid()) {
					//this.disableNext();
					this.mayEnableNext = 0;
				}
			},
			this
		);
		if(this.mayEnableNext == 1) {
			this.enableNext();
		} else {
			this.disableNext();
		}
	},
	registerValidator : function() {
		if(this.get(this.activeCard).validate) {
			Ext.each(this.get(this.activeCard).findByType('field'),
				function(item,idx,allItems) {
					item.on('change', this.validator, this);
					if(!item.isValid()) {
						this.disableNext();
					}
				},
				this
			);
		}
	},
	unRegisterValidator : function() {
		Ext.each(this.get(this.activeCard).findByType('field'),
			function(item,idx,allItems) {
				item.un('change', this.validator, this);
			},
			this
		);
	},
	bbarDisable :function () {
		this.disablePrev();
		this.disableNext();
	},
	bbarEnable  :function () {
		this.enablePrev();
		this.enableNext();
	},
	enablePrev  :function () {
		this.getBottomToolbar().get(0).enable();
	},
	disablePrev  :function () {
		this.getBottomToolbar().get(0).disable();
	},
	enableNext  :function () {
		this.getBottomToolbar().get(2).enable();
	},
	disableNext  :function () {
		this.getBottomToolbar().get(2).disable();
	},
	listeners: {
		afterrender      : function(cmp) {
			cmp.getBottomToolbar().get(0).on('click',this.prev,cmp);
			cmp.getBottomToolbar().get(2).on('click',this.next,cmp);
			new Ext.util.DelayedTask(function() {
				this.registerValidator();
			},this).delay(100);
			document.title = this.title;
		}
	}
});
Ext.reg('wizard',Ext.ux.Wizard);