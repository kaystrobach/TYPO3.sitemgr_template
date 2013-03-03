<?php
if (!defined ('TYPO3_MODE')) {
	die ('Access denied.');
}

class Tx_SitemgrTemplate_Modules_Template_TemplateController extends Tx_Sitemgr_Modules_Abstract_AbstractController{
	protected $file = __FILE__;
	protected $access = array(
		'general' => 'customerAdmin'
	);
	/**
	 * @var \Tx_SitemgrTemplate_Domain_Repository_TemplateRepository
	 */
	protected $TemplateRepository = array();
	function __construct() {
		$this->initRepository();
			// general files
		$this->jsFiles = array(
			t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/JavaScripts/Modules/Template/functions.js',
			t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-sitemgrTemplate/Ext.ux.patches.js',
			t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-sitemgrTemplate/Ext.ux.sitemgrMultiField.js',
			t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-sitemgrTemplate/Ext.ux.sitemgrCombobox.js',
			t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-sitemgrTemplate/Ext.ux.sitemgrWizardfield.js',
			t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-sitemgrTemplate/Ext.ux.wizard.js',
		);
			// ryanpetrello colorfield
		#$this->jsFiles[]  = t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-ColorField-ryanpetrelo/Ext.ux.ColorField.js';
		#$this->cssFiles[] = t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-ColorField-ryanpetrelo/Ext.ux.ColorField.css';
			// vtswingkid colorpicker
		$this->jsFiles[]  = t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-ColorPicker-vtswingkid/sources/ColorPicker.js';
		$this->jsFiles[]  = t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-ColorPicker-vtswingkid/sources/ColorMenu.js';
		$this->jsFiles[]  = t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-ColorPicker-vtswingkid/sources/ColorPickerField.js';
		$this->cssFiles[] = t3lib_extMgm::extRelPath('sitemgr_template').'Resources/Public/Contrib/ux-ColorPicker-vtswingkid/resources/css/colorpicker.css';
	}
	protected function initRepository() {
		$this->TemplateRepository = new Tx_SitemgrTemplate_Domain_Repository_TemplateRepository();
	}
	/**
	 * @param object $args
	 * @return array
	 */
	function setTemplateAndGetOptions($args) {
		$cid           = Tx_Sitemgr_Utilities_CustomerUtilities::getCustomerForPage($args->uid);
		$customer      = new Tx_Sitemgr_Utilities_CustomerUtilities($cid);
		$customer->enableExceptions();
		$customer->isAdministratorForCustomer();
		$pid           = $customer->getRootPage();
		$templateName = $args->id;
			//apply template to make sure, correct constants are loaded
		$this->TemplateRepository->get($templateName)->setEnvironment($pid, null);
		$this->initRepository();
			//build output for fields
		$return = array(
			$this->renderFields(
				$this->TemplateRepository->get($templateName)->getTsParser($pid),
				$this->TemplateRepository->get($templateName)->getConstants($pid)
			)
		);
			//add special options
		$fields = $this->TemplateRepository->get($templateName)->getEnvironmentOptions($pid);
		if($fields != null) {
			$return[] = array(
				array(
					'title'  => $GLOBALS['LANG']->sL('LLL:EXT:sitemgr_template/Resources/Private/Language/Modules/Template/locallang.xml:SitemgrTemplates_templateSpecialProperties'),
					'layout' => 'form',
					'labelAlign' => 'top',
					'items'  => $fields,
				),
			);
		}
			//build return
		return array(
			'form' =>$return
		);
	}
	private function renderFields($tsParser, $constants) {
		$definition = array();
		$categories = $tsParser->categories;
		foreach($categories as $categorieName => $categorie) {
			asort($categorie);
			//@todo add dynamic filter
			if(is_array($categorie) && ($categorieName == 'site constants')) {
				$title = $GLOBALS['LANG']->sL('LLL:EXT:sitemgr_template/Resources/Private/Language/Constants/locallang.xml:cat_' . $categorieName);
				if(strlen($title) === 0) {
					$title = $categorieName;
				}
				$definition[$categorieName] = array(
					//'title'  => $GLOBALS['LANG']->sL($categorieName),
					'title'  => $title,
					'layout' => 'form',
					'labelAlign' => 'top',
					'items'  => array(),
				);
				foreach($categorie as $constantName => $type) {
					$definition[$categorieName]['items'][] = $this->renderField($constantName,$constants);
				}
			}
		}
		return array_values($definition);
	}

	private function renderField($constantName, $constants) {
		$constant = $constants[$constantName];
		$label    = explode(':', $GLOBALS['LANG']->sL($constant['label']), 2);
		$field = array(
			'xtype'       => 'sitemgrmultifield',
			'fieldLabel'  => '<b>' . $label[0] . '</b>' . $label[1],
			'checkState'  => ($constant['value']!=$constant['default_value']),
			'subname'     => $constant['name'],
			//'name'       => 'data[' . $constant['name'] . ']',
			'width'       => 300,
			'fieldConfig' => array(
				'defaultValue' => $constant['default_value'],
				'value'   => $constant['value'],
					// default xtype
				'xtype'   => 'textfield',
			),
		);
		list($type, $function) = explode('[', $constant['type']);
		if(strlen($function) > 0) {
			$function = substr($function,0,-1);
		}
		switch($type) {
			case 'int':
				$field['fieldConfig']['xtype'] = 'numberfield';
			break;
			case 'int+':
				$field['fieldConfig']['xtype'] = 'numberfield';
				$field['fieldConfig']['allowNegative'] = false;
			break;
			case 'options':
				$field['fieldConfig']['xtype'] = 'sitemgrcombobox';
				$options = explode(',', substr($constant['type'],8,-1));
				foreach($options as $option) {
					$t = array_reverse(explode('=',$option));
					if(count($t) === 1) {
						$t[] = $t[0]; //add value to displayfield!!!
					}
					$field['fieldConfig']['staticData'][] = $t;
				}
			break;
			case 'color':
				#$field['fieldConfig']['xtype'] = 'colorfield';
				$field['fieldConfig']['xtype'] = 'colorpickerfield';
				$field['fieldConfig']['editMode'] = 'all';
				$field['fieldConfig']['hideHtmlCode'] = true;
				$field['fieldConfig']['opacity'] = false;
			break;
			case 'boolean':
				$field['fieldConfig']['xtype'] = 'sitemgrcombobox';
				$field['fieldConfig']['staticData'] = array(
					array(0,0),
					array(1,1),
				);
			break;
				//file selector
				//browser.php?mode=file&bparams=feld
			case 'user':
				$field['fieldConfig']['internalHandler'] = $function;
				$field['fieldConfig']['xtype'] = 'sitemgrwizardfield';
				$fieldName = 'ref';
				$formName  = 'sitemgrWizardfield_OpenWizardRef';
				switch($function) {
						// useable for files, folders and pages
					case 'EXT:templavoila_framework/class.tx_templavoilaframework_pagelink.php:&tx_templavoilaframework_pagelink->main':
							// select page wizard
						$field['fieldConfig']['wizardUri']    = 'browse_links.php?mode=wizard&P[fieldConfig][type]=input&P[field]='. $fieldName .'&P[formName]='.$formName.'&P[itemName]='. $fieldName . '&P[params][blindLinkOptions]=url,mail,spec';
						$field['fieldConfig']['triggerClass'] = 'x-form-search-trigger';
					break;
					case '':
							// select file/folder only wizard
						$field['fieldConfig']['wizardUri']    = 'browse_links.php?mode=wizard&P[fieldConfig][type]=input&P[field]='. $fieldName .'&P[formName]='.$formName.'&P[itemName]='. $fieldName . '&P[params][blindLinkOptions]=url,page,mail,spec';
						$field['fieldConfig']['triggerClass'] = 't3-icon t3-icon-apps t3-icon-apps-filetree t3-icon-filetree-folder-default';
					break;
					default:
						// do nothing and use default xtype
					break;
				}
			break;
			default:
				// do nothing and use default xtype
			break;
		}
		return $field;
	}
	/**
	 * Returns the allowed templates for a given pid
	 *
	 * seen as not security relevant - no check performed!:
	 * - nothing secret is read
	 * - nothing is changed in the setup
	 *
	 * @param integer $uid
	 * @return array of array
	 */
	public function getTemplates($uid) {
			// init customer
		$cid           = Tx_Sitemgr_Utilities_CustomerUtilities::getCustomerForPage($uid);
		$customer      = new Tx_Sitemgr_Utilities_CustomerUtilities($cid);
		$customer->enableExceptions();
		try {
			$customer->isAdministratorForCustomer();
			$pid           = $customer->getRootPage();
				// init repository
			$TemplateRepository = new Tx_SitemgrTemplate_Domain_Repository_TemplateRepository();
				// apply filters for customer
			$allowed = $GLOBALS["BE_USER"]->getTSConfig(
				'mod.web_txsitemgr.template.allowedList',
				t3lib_BEfunc::getPagesTSconfig($pid)
			);
			$denied = $GLOBALS["BE_USER"]->getTSConfig(
				'mod.web_txsitemgr.template.deniedList',
				t3lib_BEfunc::getPagesTSconfig($pid)
			);
			$TemplateRepository->setFilter($allowed['value'], $denied['value']);
				// return
			return $TemplateRepository->getAllTemplatesAsArrayMarkInUse($pid);
		} catch (Exception $e) {
			return array();
		}
			
	}
	/**
	 * Sets template and related options through the model which was selected
	 * 
	 * @return mixed
	 */
	function setTemplateAndOptions($args) {
		list($templateName,$uid) = explode(';',$args['args']);
		$constants     = $_POST['data'];
		$isSetConstants= $_POST['check'];
		$options       = $_POST['options'];
		$cid           = Tx_Sitemgr_Utilities_CustomerUtilities::getCustomerForPage($uid);
		$customer      = new Tx_Sitemgr_Utilities_CustomerUtilities($cid);
		$customer->enableExceptions();
		$customer->isAdministratorForCustomer();
		$pid           = $customer->getRootPage();
		$this->TemplateRepository->get($templateName)->applyToPid($pid, $constants, $isSetConstants,$options);
		return $this->getReturnForForm();
	}
}
