<?php

class Tx_SitemgrTemplate_Domain_Model_TemplateOldsitemgrModel
	extends Tx_SitemgrTemplate_Domain_Model_TemplateAbstractModel {
	
}

return;

class dummy {
	//get structures:
			function get_Structues() {
				foreach($templates as $template) {
					$output[] = array(
						'previewIcon'   => $template->getMainScreenshot(),
						//'name'          =>
						'identifier'    => $template->getIdentifier(),
						'title'         => $template->getTitle(),
						'description'   => $template->getDescription(),
						'copyright'     => $template->getCopyright(),
					);
				}
				return $output;
			}

	//colorthemes:
		function getColorThemes($id) {
			$searchPath = PATH_site.$this->getTemplatePath($id);
			#throw new Exception($searchPath);
			if(!is_dir($searchPath)) {
				return array(
					'success'      => false,
					'errorMessage' => 'No Skins for this Layout ',
				);
			}
			$colorThemes = t3lib_div::get_dirs($searchPath);
			natsort($colorThemes);
			$return      = array();
			foreach($colorThemes as $colorTheme) {
				if(file_exists($searchPath.$colorTheme.'/install.ini') &&
				   file_exists($searchPath.$colorTheme.'/main.css')) {
					$return[] = array(
						'uid'         => $id.':'.$colorTheme,
						'title'       => str_replace('_',' ',$colorTheme),
						'previewicon' => t3lib_BEfunc::getThumbNail('thumbs.php',$searchPath.$colorTheme.'/preview.png','',100)
					);
				}
			}
			return $return;
		}

		protected function getTemplatePath($uid) {
			$extConfig = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['ks_sitemgr']);
			if($extConfig['searchInTemplateFolder']) {
				$TVtemplateObject = t3lib_BEfunc::getRecord(
					'tx_templavoila_tmplobj',
					$uid
				);
				$searchPath = dirname($TVtemplateObject['fileref']).'/skins/';
			} else {
				$searchPath = $extConfig['templatePath'];
			}
			return $searchPath;
		}

		function getTemplateOptions($arg) {
			$return = array(
				'success'       => true,
				'form'    => array(),
			);
			$p           = strpos($arg,':');
			$TVtemplate  = substr($arg,0,$p+1);
			$skin        = substr($arg,$p+1);
			$file = PATH_site.$this->getTemplatePath($TVtemplate).$skin.'/install.ini';
			$iniArray = parse_ini_file($file,TRUE);
			foreach($iniArray as $sectionName=>$sectionContent) {
				if(substr($sectionName,0,4)=='FILE'){
					$field = array(
						'name'       => $sectionName,
						'fieldLabel' => $sectionContent['description'],
						#'xtype'      => 'textfield'
						'inputType'  => 'file',
					);
					$return['form'][] = $field;
				} elseif(substr($sectionName,0,8)=='CONSTANT') {
					$field = array(
						'name'       => $sectionName,
						'fieldLabel' => $sectionContent['description'],
						#'xtype'      => 'textfield'
						#'value'      => tx_ks_sitemgr_div::getTSConstantValue($customer->getPage(),$sectionContent['constant']);
					);
					if($sectionContent['length']) {
						$field['maxLength'] = $sectionContent['length'];
					}
					$return['form'][] = $field;
				}

			}
			$return['form'] = array_values($return['form']);
			return $return;
			return array(
				'success'    => true,
				'properties' => array(
					'name'  => 'test2',
					'value' => 'test2',
				),
				'propertyNames' => array(
					'name'  => 'Realname'
				)
			);
		}

	/**
	 * @todo
	 *  - security check if allowed
	 *  - relative path for @import @BACKPATH ...
	 */
	function saveTemplateSettings($arg) {
		// config
			list($TVtemplate,$skin,$cid) = explode(':',$arg['args']);
			$customer = new tx_ks_sitemgr_customer($cid);
			$customer->init();
			$saveFolder = $customer->getFolder().'layout/';
			t3lib_div::mkdir_deep($customer->getFolder(),'layout');
		//create dynamic css
			$file = PATH_site.$this->getTemplatePath($TVtemplate).$skin.'/install.ini';
			$iniArray = parse_ini_file($file,TRUE);
			$css = '@import "/'.$this->getTemplatePath($TVtemplate).$skin.'/main.css" all;'."\n";

			foreach($iniArray as $sectionName=>$sectionContent) {
				if(substr($sectionName,0,4)=='FILE'){
					//move / modify file
					$source = $arg[$sectionName]['tmp_name'];
					$dest   = $saveFolder.$sectionContent['filename'];
					if(move_uploaded_file($source,$dest)) {
						$css.= $sectionContent['css']."\n";
					} else {
						$css.='/* no file uploaded - '.$sectionContent['css']."*/\n";
					}
				} elseif(substr($sectionName,0,8)=='CONSTANT') {
					tx_ks_sitemgr_div::setTSConstantValue($customer->getPage(),$sectionContent['constant'],trim($arg[$sectionName]));
					$css.= '/* '.$sectionContent['description'].' : '.trim($arg[$sectionName])." */\n";
				}
			}
		//update page template
			$TVdatastructure = t3lib_BEfunc::getRecord(
				'tx_templavoila_tmplobj',
				$TVtemplate
			);
			$GLOBALS['TYPO3_DB']->exec_UPDATEquery(
				'pages',
				'uid = '.$customer->getPage(),
				array(
					'tx_templavoila_ds' => $TVdatastructure['datastructure'],
					'tx_templavoila_to' => $TVtemplate,
				)
			);
		//read template
			$buffer     = t3lib_div::getURL(dirname(__FILE__).'/screen.css');
			$replace    = array(
				'###CID###' => $cid,
				'###UID###' => $customer->getMainUserUid(),
				'###CSS###' => $css,
			);
			foreach($replace as $key => $value) {
				$buffer = str_replace($key,$value,$buffer);
			}
			t3lib_div::writeFile($saveFolder.'screen.css',$buffer);

		return array(
			'success'     =>true,
		);
	}

}