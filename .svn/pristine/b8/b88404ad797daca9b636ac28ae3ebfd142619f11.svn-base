<?php
class Tx_SitemgrTemplate_Domain_Model_TemplateTemplavoilaFrameworkModel extends Tx_SitemgrTemplate_Domain_Model_TemplateAbstractModel {
	/**
	 * @param $name Name of the skin
	 */
	function __construct($name) {
		$skinInfo = tx_templavoilaframework_lib::getSkinInfo($name);
		
		if ($skinInfo['icon']) {
			$previewIconFilename = $GLOBALS['BACK_PATH'] . $skinInfo['icon'];
		} else {
			$previewIconFilename = $GLOBALS['BACK_PATH'].'../'.t3lib_extMgm::siteRelPath('templavoila_framework').'/default_screenshot.gif';
		}
			//fetch screenshots
		$extName = substr($name,4);
		if(($name !== 'LOCAL:error') && (t3lib_extMgm::isLoaded($extName, FALSE))){
			$additionalScreenshots = t3lib_div::getFilesInDir(t3lib_extMgm::extRelPath($extName) . 'screenshots', '', TRUE);
			$additionalScreenshots = array_values($additionalScreenshots);
		}
		if(count($additionalScreenshots) === 0) {
			$additionalScreenshots = array(
				$previewIconFilename,
			);
		}
			//build config array
		$this->config = array(
			'id'         => get_class($this).'|'.$name,
			'icon'       => $previewIconFilename,
			'screens'    => $additionalScreenshots,
			'description'=> $skinInfo['description'],
			'title'      => $skinInfo['title'],
			'copyright'  => null,
			'version'    => t3lib_extMgm::getExtensionVersion($name),
		);
			// get copy info
		$this->config['copyright'] = $this->getCopyrightInformation();
	}
	function isInUseOnPage($pid) {
		$tmpl = t3lib_div::makeInstance('t3lib_tsparser_ext');
		$tplRow = $tmpl->ext_getFirstTemplate($pid);
		list($class, $_EXTKEY) = explode('|', $this->config['id']);
		if($tplRow['skin_selector'] == $_EXTKEY) {
			$this->config['isInUse'] = TRUE;
		} else {
			$this->config['isInUse'] = FALSE;
		}
		// @todo checkhow to init the isInUse property
	}
	function getCopyrightInformation() {
		list($class, $_EXTKEY) = explode('|', $this->config['id']);
		if(substr($_EXTKEY,0,4) == 'EXT:') {
			$_EXTKEY = substr($_EXTKEY,4);
			include(t3lib_extMgm::extPath($_EXTKEY) . 'ext_emconf.php');
			$copyArray = array(
				'name'           => $this->config['title'],
				'nameAdditional'=> $EM_CONF[$_EXTKEY]['title'],
				'version'        => $EM_CONF[$_EXTKEY]['version'],
				'state'          => $EM_CONF[$_EXTKEY]['state'],
				'authorName'    => $EM_CONF[$_EXTKEY]['author'],
				'authorCompany' => $EM_CONF[$_EXTKEY]['author_company'],
				'authorEmail'   => $EM_CONF[$_EXTKEY]['author_email'],
				'license'        => 'GPL'
			);
		} else {
			$copyArray = array();
		}
		return $copyArray;
	}
	/**
	 * @todo discuss things like ts and ts_next
	 *
	 * @param integer $pid
	 * @return array
	 */
	function getEnvironmentOptions($pid) {
		$config = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['templavoila_framework']);
		$templates = t3lib_BEfunc::getRecordsByField(
			'tx_templavoila_tmplobj',
			'pid',
			$config['templateObjectPID'],
			'AND datastructure LIKE "%templavoila_framework/core_templates/datastructures/page/f%"',
			'',
			'title'
		);
		$options = array();
		foreach($templates as $option) {
			$options[] = array(
				$option['uid'],
				$option['title'],
				$option['previewicon']
			);
		}
		$page                = t3lib_BEfunc::getRecord('pages',$pid);
		return array(
			'layout' => 'form',
			'items' => array(
				array(
					'xtype'      => 'sitemgrcombobox',
					'fieldLabel' => $GLOBALS['LANG']->sL('LLL:EXT:sitemgr_template/Resources/Private/Language/Modules/Template/locallang.xml:SitemgrTemplates_rootpageTvStructure'),
					'staticData' => $options,
					'value'      => $page['tx_templavoila_to'],
					'name'       => 'options[tv_ts]',
				),
				array(
					'xtype'      => 'sitemgrcombobox',
					'fieldLabel' => $GLOBALS['LANG']->sL('LLL:EXT:sitemgr_template/Resources/Private/Language/Modules/Template/locallang.xml:SitemgrTemplates_rootpageTvStructure_next'),
					'staticData' => $options,
					'value'      => $page['tx_templavoila_next_to'],
					'name'       => 'options[tv_ts_next]',
				),
			),
		);
	}
	function setEnvironment($pid, $options) {
		$this->initializeTSParser($pid);
		list($templateClass, $templateUID) = explode('|', $this->config['id']);
		$saveId = $this->tsParserTplRow['uid'];
		$recData['sys_template'][$saveId]['skin_selector'] = $templateUID;
		$recData['sys_template'][$saveId]['root']          = 1;
			// set tv setttings
		if($options !== null) {
			if($options['tv_ts'] != 0) {
				$recData['pages'][$pid]['tx_templavoila_to'] = $options['tv_ts'];
				$recData['pages'][$pid]['tx_templavoila_ds'] = $this->getTvDs($options['tv_ts']);
			}
			if($options['tv_ts_next'] != 0) {
				$recData['pages'][$pid]['tx_templavoila_next_to'] = $options['tv_ts_next'];
				$recData['pages'][$pid]['tx_templavoila_next_ds'] =$this->getTvDs($options['tv_ts_next']);
			}
		}
			// set general record storage page
		$tvFrameworkSettings = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['templavoila_framework']);
		$recData['pages'][$pid]['storage_pid'] = $tvFrameworkSettings['templateObjectPID'];
			// store changes
		$tce = t3lib_div::makeInstance('t3lib_TCEmain');
		$tce->stripslashes_values = 0;
		// Initialize
		$tce->start($recData, Array());
		// Saved the stuff
		$tce->process_datamap();
		// Clear the cache (note: currently only admin-users can clear the cache in tce_main.php)
		$tce->clear_cacheCmd('all');
	}
	private function getTvDs($to_uid) {
		if($to_uid) {
			$to = t3lib_BEfunc::getRecord('tx_templavoila_tmplobj',$to_uid);
			if(is_array($to)) {
				return $to['datastructure'];
			} else {
				throw new Exception('Invalid TO '.$to_uid);
			}
		} else {
			return '';
		}
	}
}