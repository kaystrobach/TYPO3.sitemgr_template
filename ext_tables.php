<?php
	if (TYPO3_MODE == 'BE') {
			//load template module if templavoila is active
		Tx_Sitemgr_Utilities_CustomerModuleUtilities::registerModule(
			'sitemgr_template',
			'Tx_SitemgrTemplate_Modules_Template_TemplateController',
			'before:sitemgr_help'
		);

		if(t3lib_extMgm::isLoaded('templavoila')) {
			t3lib_SpriteManager::addSingleIcons(
				array(
					'moduleicon-templavoila' => t3lib_extMgm::extRelPath('templavoila') . 'mod1/moduleicon.gif',
				),
				$_EXTKEY
			);
		}
	}


?>