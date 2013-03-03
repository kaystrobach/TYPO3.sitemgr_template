<?php

class Tx_SitemgrTemplate_Domain_Repository_TemplateTemplavoilaRepository 
	extends Tx_SitemgrTemplate_Domain_Repository_TemplateAbstractRepository{
	
	function __construct() {
		$TVdataStructures = t3lib_BEfunc::getRecordsByField(
			'tx_templavoila_datastructure',
			'scope',
			1
		);
		$TVdataStructuresList='';
		$TVdataStructuresTitles = array();
		foreach($TVdataStructures as $TVdataStructure) {
			$TVdataStructuresList.=  $TVdataStructure['uid'].',';
			$TVdataStructuresTitles[$TVdataStructure['uid']] = $TVdataStructure['title']; 
		}
		
		$TVtemplateObjects = $GLOBALS['TYPO3_DB']->exec_SELECTgetRows (
					'uid,title,description,previewicon,datastructure',
					'tx_templavoila_tmplobj',
					'datastructure IN ('.$TVdataStructuresList.'-1) AND tx_kssitemgr_manager_allowed_for_customer=1',
					'',
					'');
		$output = array();
		foreach($TVtemplateObjects as $TVtemplateObject) {
			$TVtemplateObject['previewicon'] = t3lib_BEfunc::getThumbNail('thumbs.php',PATH_site.'uploads/tx_templavoila/'.$TVtemplateObject['previewicon'],'',100);
			$TVtemplateObject['datastructure']   = $TVdataStructuresTitles[$TVtemplateObject['datastructure']];
			$output[] = $TVtemplateObject;
		}
	}

}