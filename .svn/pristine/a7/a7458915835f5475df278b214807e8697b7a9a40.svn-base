<?php

abstract class Tx_SitemgrTemplate_Domain_Model_TemplateAbstractModel {
	/**
	 * @var t3lib_tsparser_ext
	 */
	protected $tsParser;
	protected $tsParserTplRow;
	protected $tsParserConstants;
	protected $tsParserInitialized;
	/**
	 * $config = array(
	 *    'id'         => $name,
	 *    'icon'       => 'path',
	 *    'screens'    => array()
	 *    'description'=> $skinInfo['description'],
	 *    'title'      => $skinInfo['title'],
	 *    'copyright'  => 'someone',
	 *    'version'    => t3lib_extMgm::getExtensionVersion($name),
	 * );
	*/
	protected $config = array();
	function __construct() {

	}
	function getCopyrightInformation() {
		return array();
	}
	protected function initializeTSParser($pageId, $template_uid = 0) {
		if(!$this->tsParserInitialized) {
			$this->tsParserInitialized = TRUE;
			$this->tsParser = t3lib_div::makeInstance('t3lib_tsparser_ext');
			$this->tsParser->tt_track = 0; // Do not log time-performance information
			$this->tsParser->init();

			$this->tsParser->ext_localGfxPrefix = t3lib_extMgm::extPath('tstemplate_ceditor');
			$this->tsParser->ext_localWebGfxPrefix = $GLOBALS['BACK_PATH'].t3lib_extMgm::extRelPath('tstemplate_ceditor');

			$this->tsParserTplRow = $this->tsParser->ext_getFirstTemplate($pageId, $template_uid);

			if (is_array($this->tsParserTplRow)) {
				/**
				 * @var t3lib_pageSelect $sys_page
				 */
				$sys_page = t3lib_div::makeInstance('t3lib_pageSelect');
				$rootLine = $sys_page->getRootLine($pageId);
				$this->tsParser->runThroughTemplates($rootLine, $template_uid); // This generates the constants/config + hierarchy info for the template.
				$this->tsParserConstants = $this->tsParser->generateConfig_constants(); // The editable constants are returned in an array.
				$this->tsParser->ext_categorizeEditableConstants($this->tsParserConstants); // The returned constants are sorted in categories, that goes into the $tmpl->categories array
				$this->tsParser->ext_regObjectPositions($this->tsParserTplRow['constants']);
				// This array will contain key=[expanded constantname], value=linenumber in template. (after edit_divider, if any)
				return TRUE;
			} else {
				return FALSE;
			}
		} else {
			return TRUE;
		}
	}
	function getConfig() {
		return $this->config;
	}
	function getScreenshots() {
		return $this->config['screens'];
	}
	function getMainScreenshot() {
		return $this->config['screens'][0];
	}
	function getDescription() {
		return $this->config['description'];
	}
	function getTSConstants() {
		return $this->config['tsConstants'];
	}
	function getCopyright() {
		return $this->config['copyright'];
	}
	function getTitle() {
		return $this->config['title'];
	}
	function getIdentifier() {
		return $this->config['id'];
	}
	function getCategory() {
		return get_class($this);
	}
	/**
	 * checks wether the template is in use or not!
	 *
	 * @return boolean
	 */
	function isInUseOnPage($pid) {
		return false;
	}
	/**
	 * @param integer $pid
	 * @param array $constants
	 * @param array $isSetConstants
	 * @return void
	 */
	function applyToPid($pid,array $constants, $isSetConstants = array(), $options = array()) {
		$this->setConstants($pid, $constants, $isSetConstants);
		$this->setPageTS($pid, $constants);
		$this->setTemplateTS($pid, $constants);
		$this->setEnvironment($pid, $options);
	}
	/**
	 * @todo access check!
	 * 
	 * @param $pid
	 * @param $constants
	 * @return void
	 */
	function setConstants($pid, $constants, $isSetConstants = array()) {
		$this->getConstants($pid);

		$filteredConstants = array();
		/*foreach($constants as $constant) {
			foreach($this->tsParserConstants as $allowedConstants) {
				if($constant['name'] == $allowedConstants['name']) {
					$filteredConstants[] = $constant;
					break;
				}
			}
		}*/
		$filteredConstants = $constants;

		$postData = array(
			'data' => $constants,
			'check'=> $isSetConstants,
		);

		$this->tsParser->changed = 0;
			//$this->tsParser->ext_dontCheckIssetValues = 1;
		$this->tsParser->ext_procesInput($postData, $_FILES, $this->tsParserConstants, $this->tsParserTplRow);

		if ($this->tsParser->changed) {
				// Set the data to be saved
			$saveId = $this->tsParserTplRow['uid'];
			$recData = array();
			$recData['sys_template'][$saveId]['constants'] = implode($this->tsParser->raw, chr(10));
				// Create new  tce-object
			$tce = t3lib_div::makeInstance('t3lib_TCEmain');
			$tce->stripslashes_values = 0;

				// Initialize
			$user = clone $GLOBALS['BE_USER'];
			$user->user['admin'] = 1;
			$tce->start($recData, Array(), $user);
			$tce->admin = 1;
				// Saved the stuff
			$tce->process_datamap();
				// Clear the cache (note: currently only admin-users can clear the cache in tce_main.php)
			$tce->clear_cacheCmd('all');
		}
	}
	function setPageTS($pid, $constants) {
	
	}
	function setTemplateTS($pid, $constants) {
	
	}
	function setEnvironment($pid, $options) {
	}
	
	function getEnvironmentOptions($pid) {
		return null;
	}
	/**
	 * @todo use dynamic pageID!
	 * @return void
	 */
	function getConstants($pid) {
		$this->initializeTSParser($pid);
		return $this->tsParserConstants;
	}
	function getTsParser($pid) {
		$this->initializeTSParser($pid);
		return $this->tsParser;
	}
}