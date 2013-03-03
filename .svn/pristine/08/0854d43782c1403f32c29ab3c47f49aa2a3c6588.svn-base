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
		);
	}
	protected function initRepository() {
		$this->TemplateRepository = new Tx_SitemgrTemplate_Domain_Repository_TemplateRepository();
	}
	/**
	 * @param object $args
	 * @return array
	 */
	function setTemplate($args) {
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
		$return = array();
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
		try {
			$cid           = Tx_Sitemgr_Utilities_CustomerUtilities::getCustomerForPage($uid);
			$customer      = new Tx_Sitemgr_Utilities_CustomerUtilities($cid);
			$customer->enableExceptions();
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
