/****************************************************************
 * Wizard
 ****************************************************************/
Ext.ux.SitemgrTemplavoilaRereferenceButton = Ext.extend(Ext.Panel, {
		constructor: function(config) {
			config = Ext.apply({
				cls: 'typo3-message message-warning',
				items: [
					{
						cls: 'header-container',
						html : TYPO3.lang.sitemgr_SitemgrTemplavoilaRereferenceButton_header,
						style: 'margin-bottom:10px;'
					},{
						cls: 'message-body',
						html : TYPO3.lang.sitemgr_SitemgrTemplavoilaRereferenceButton_text,
						style: 'margin-bottom:10px;'
					}, {
						xtype: 'button',
						text:  TYPO3.lang.sitemgr_SitemgrTemplavoilaRereferenceButton_button,
						handler: function() {
							Ext.Msg.wait(
								TYPO3.lang.SitemgrTemplates_loadingForm
							);
							record = {
								uid : TYPO3.settings.sitemgr.uid
							};
							TYPO3.sitemgr.tabs.dispatch(
								'sitemgr_template',
								'templavoilaRemapContent',
								record,
								function(provider,response) {
									Ext.Msg.hide();
									Ext.Msg.alert('', TYPO3.lang.sitemgr_SitemgrTemplavoilaRereferenceButton_doneText);
								}
							);
						}
					}
				]
			}, config);
			Ext.ux.SitemgrTemplavoilaRereferenceButton.superclass.constructor.call(this, config);
		}
	}
);
Ext.reg('sitemgrTemplavoilaRereferenceButton',Ext.ux.SitemgrTemplavoilaRereferenceButton);