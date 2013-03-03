/***************************************************************
*  Copyright notice
*
*  (c) 2010 Kay Strobach (typo3@kay-strobach.de)
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt and important notices to the license
*  from the author is found in LICENSE.txt distributed with these scripts.
*
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

/*******************************************************************************
 * Register Namespace
 * Initialize some vars 
 ******************************************************************************/ 	
	Ext.ns('TYPO3.Sitemgr.TemplateApp');

/*******************************************************************************
 * Application object
 ******************************************************************************/
	Ext.ComponentMgr.create = Ext.ComponentMgr.create.createInterceptor(function(config, defaultType) {
		var type = config.xtype || defaultType;
		if ( !Ext.ComponentMgr.isRegistered(type))  {
			throw 'xtype ""'+type+'"" is not a registered component';
		}
		return true;
	});
	
	/**
	  * recreate the alias 
	  */
	Ext.create  =  Ext.ComponentMgr.create;
	
	Ext.onReady(function (){
		TYPO3.Sitemgr.TemplateApp.init();
	});
	
	TYPO3.Sitemgr.TemplateApp = {
		tpl: new Ext.XTemplate(
			'<tpl for=".">',
				'<tpl if="isInUse==0"><div class="template-item-wrap" id="structure{uid}"></tpl>',
				'<tpl if="isInUse==1"><div class="template-item-wrap template-item-selected" id="structure{uid}"></tpl>',
					'<div class="thumb" style="background-image: url({icon});">',
						'<div class="template-selector"></div>',
						'<div class="template-title">{title}</div>',
					'</div>',
				'</div>',
				'</tpl>',
			'<div class="x-clear"></div>'
		),
		/**
		 * show the preview window of the given template record
		 * @param record extjs record of template
		 */
		showTemplatePreview: function(record) {
			record.uid = TYPO3.settings.sitemgr.uid
			if(record.isInUse) {
				this.showTemplateOptions(record);
			} else {
				var screenShots = [];
				if(record.screens.length == 0) {
					screenShots[0]  = {
							html: '<img src="' + record.icon + '">'
						};
				} else {
					for(i=0; i<record.screens.length; i++) {
						screenShots[i] = {
							html: '<img src="' + record.screens[i] + '">'
						};
					}
				}
				var win = new Ext.Window({
					title: TYPO3.lang.SitemgrTemplates_templatePreview + ': ' + record.title,
					id   : 'templatePreviewWindow',
					modal:true,
					closeAction: 'close',
					resizeable: true,
					layout: 'fit',
					//maximized: true,
					width: 480,
					height: 400,
					closable: false,
					listeners: {
						close: function(p) {
							this.tab.findById('templateSelector').getStore().reload();
						},
						scope: this
					},
					bbar: [
						{
							xtype: 'button',
							text: '<span class="t3-icon t3-icon-actions t3-icon-actions-edit t3-icon-edit-undo"></span>' + TYPO3.lang.SitemgrTemplates_theme_cansel_apply,
							handler: function() {
								Ext.getCmp('templatePreviewWindow').close();
							},
							scope: this
						}, '->',{
							xtype: 'button',
							text: '<span class="t3-icon t3-icon-status t3-icon-status-dialog t3-icon-dialog-ok"></span>' + TYPO3.lang.SitemgrTemplates_theme_apply,
							handler: function() {
								Ext.Msg.confirm(
									TYPO3.lang.SitemgrTemplates_applyTemplateHeader,
									TYPO3.lang.SitemgrTemplates_applyTemplateMessage,
									function(button) {
										if(button == 'yes') {
											this.showTemplateOptions(record);
										}
									},
									this
								);
								Ext.getCmp('templatePreviewWindow').close();
							},
							scope: this
						}
					],
					tbar: [
						{
							iconCls:'t3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-close',
							handler:function() {
								Ext.getCmp('templatePreviewWindow').close();
							}
						}, '-', {
							tooltip:TYPO3.lang.SitemgrBeUser_action_saveRight,
							iconCls:'t3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-save',
							handler:function() {
								Ext.getCmp('templatePreviewWindow').close();
								this.showTemplateOptions(record);
							},
							scope:this
						}, '-', {
							iconCls: 't3-icon t3-icon-actions t3-icon-actions-system t3-icon-system-extension-documentation',
							handler: function() {
								window.open('../typo3conf/ext/' + record.extensionKey + '/doc/manual.sxw', '_blank');
							},
							disabled: !record.copyright.hasDocumentation,
							scope: this
						}, '->', {
							tooltip:TYPO3.lang.SitemgrBeUser_action_saveRight,
							iconCls:'t3-icon t3-icon-actions t3-icon-actions-system t3-icon-system-typoscript-documentation-open',
							handler:function() {
								Ext.Msg.alert(
									'Id of template',
									new Ext.XTemplate(
											'mod.web_txsitemgr.template.allowedList = {id}<br />',
											'mod.web_txsitemgr.template.deniedList = {id}'
									).apply(record)
								);
							},
							scope:this
						}
					],
					items:[
						{
							xtype: 'panel',
							autoScroll: true,
							layoutConfig: {
								columns: 1
							},
							defaults: {
								padding: 10
							},
							items: [
								{
									xtype: 'wizard',
									width: 400,
									height: 320,
									items: screenShots
								}, {
									html: new Ext.XTemplate(
											'<tpl for="copyright">',
												'<div class="typo3-message message-information">',
													'<div class="header-container">',
														'<div class="message-header">' + 'Informationen zur Vorlage' + '</div>',
													'</div>',
													'<div class="message-body">',
														'<p>{nameAdditional} - {version} - {state}<p>',
														'<br></p><p>{parent.description}</p>',
														'<br><p><i>{description}</i></p>',
														'<br><p>&copy;{license} by <a href="mailto:{authorEmail}">{authorName}</a> - {authorCompany}</small></p>',
													'</div>',
												'</div>',
											'</tpl>'
									).apply(record)
								}
							]
						}
					]
				});
				win.show();
			}
		},
		showTemplateOptions: function(record) {
			if(record.isInUse) {
				if(Ext.getCmp('sitemgr_fesettings-tab')) {
					Ext.getCmp('Sitemgr_App_Tabs').setActiveTab('sitemgr_fesettings-tab');
				}
			} else {
				Ext.getBody().mask();
				TYPO3.sitemgr.tabs.dispatch(
					'sitemgr_template',
					'setTemplate',
					record,
					function(provider,response) {
						record.isInUse = true;
						// reload the template store
						TYPO3.Sitemgr.TemplateApp.showTemplateOptions(record);
						TYPO3.Sitemgr.FesettingsApp.loadOptions();
						TYPO3.Sitemgr.TemplateApp.tab.findById('templateSelector').getStore().reload();
						Ext.getBody().unmask();
					}
				);
			}

		},
		init: function() {
			this.templateStructureStore = new Ext.data.DirectStore({
				storeId:'templateStructureStore',
				autoLoad:true,
				autoSave: false,
				pruneModifiedRecords: false,
				directFn:TYPO3.sitemgr.tabs.dispatch,
				paramsAsHash: false,
				paramOrder:'module,fn,args',
				baseParams:{
					module:'sitemgr_template',
					fn    :'getTemplates',
					args  :TYPO3.settings.sitemgr.uid
				},
				idProperty: 'uid',
				fields: [
					'id',
					'icon',
					'screens',
					'description',
					'title',
					'copyright',
					'version',
					'isInUse',
					'extensionKey'
				],
				listeners: {
					load: function(store, records, options) {
						var usedTemplate = store.find('isInUse',true);
						if(usedTemplate !== -1) {
							this.tab.findById('templateSelector').select(usedTemplate);
						}
					},
					scope: this
				}
			});
			this.tab = Ext.getCmp('Sitemgr_App_Tabs').add({
				title:TYPO3.lang.SitemgrTemplates_title,
				disabled:!TYPO3.settings.sitemgr.customerSelected,
				layoutConfig: {
					border:false
				},
				iconCls: 'template-tab-icon',
				autoScroll:true,
				items: [
					{
						xtype: 'panel',
						layout: 'fit',
						items: [
							{
								xtype:'dataview',
								loadingText: '<div class="typo3-message message-information">' + TYPO3.lang.SitemgrTemplates_loading + '<div class="message-body"></div></div>',
								emptyText:  '<div class="typo3-message message-information">' + TYPO3.lang.SitemgrTemplates_norecords + '<div class="message-body"></div></div>',
								deferEmptyText: false,
								id:'templateSelector',
								selectedClass:'template-item-selected',
								overClass: 'template-item-hover',
								itemSelector:'div.template-item-wrap',
								store: this.templateStructureStore,
								tpl: this.tpl,
								//multiSelect:false,
								singleSelect:true,
								listeners: {
									click : function(dv, idx, node, e) {
										record = dv.getStore().getAt(idx);
										this.showTemplatePreview(record.data);
									},
									scope:this
								}
							}
						]
					}
				]
			});
		}
	};