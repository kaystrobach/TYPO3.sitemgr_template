<?php

class Tx_SitemgrTemplate_Domain_Repository_TemplateTemplavoilaFrameworkRepository 
	extends Tx_SitemgrTemplate_Domain_Repository_TemplateAbstractRepository{
	function __construct() {
		$customSkins = tx_templavoilaframework_lib::getCustomSkinKeys();
		$standardSkins = tx_templavoilaframework_lib::getStandardSkinKeys();
		if(count($customSkins) && count($standardSkins)) {
			$skins = array_merge($customSkins,$standardSkins);
		} elseif(count($standardSkins)) {
			$skins = $standardSkins;
		} elseif(count($customSkins)) {
			$skins = $customSkins;
		} else {
			return;
		}
		foreach($skins as $skin) {
			if($skin !== 'LOCAL:error') {
				$this->templates[] = new Tx_SitemgrTemplate_Domain_Model_TemplateTemplavoilaFrameworkModel($skin);
			}
		}
	}
}