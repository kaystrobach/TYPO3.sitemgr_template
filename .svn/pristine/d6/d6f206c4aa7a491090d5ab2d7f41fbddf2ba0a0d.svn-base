<?php
	if (TYPO3_MODE == 'BE') {
			//load template module if templavoila is active
		Tx_Sitemgr_Utilities_CustomerModuleUtilities::registerModule(
			'sitemgr_template',
			'Tx_SitemgrTemplate_Modules_Template_TemplateController',
			'before:sitemgr_help'
		);
	}

?>