<?php

class Tx_SitemgrTemplate_Domain_Repository_TemplateAbstractRepository {
	/**
	 * Holds a reference to all templates in this repository
	 * @var array[Tx_SitemgrTemplate_Domain_Model_TemplateAbstractModel]
	 */
	protected $templates = array();
	/**
	 * @var null|array used to store information for the filter
	 */
	protected $filter = null;
	/**
	 * @return array[Tx_SitemgrTemplate_Domain_Model_TemplateAbstractModel]
	 */
	function getAllTemplates() {
		return $this->templates;
	}
	function getAllTemplatesAsArray() {
		$output = array();
		foreach($this->templates as $key=>$template) {
			if($this->allowedByFilter($template->getIdentifier())) {
				$output[] = $template->getConfig();
			}
		}
		return $output;
	}
	/**
	 * @param $pid pageid
	 * @return array
	 */
	function getAllTemplatesAsArrayMarkInUse($pid) {
		foreach($this->templates as $key=>$template) {
			if($this->allowedByFilter($template->getIdentifier())) {
				$this->templates[$key]->isInUseOnPage($pid);
			}
		}
		return $this->getAllTemplatesAsArray();
	}
	/**
	 * @param string $identifier
	 * @return Tx_SitemgrTemplate_Domain_Model_TemplateAbstractModel
	 */
	function get($identifier) {
		foreach($this->templates as $template) {
				if($template->getIdentifier() == $identifier) {
					return $template;
				}
		}
	}
	function allowedByFilter($name) {
			// no filter -> ignore
		if($this->filter === null) {
			return TRUE;
		}
			// check wether something is explicitly allowed
		if(strlen(trim($this->filter['allowed'])) !== 0) {
			if(t3lib_div::inList($this->filter['allowed'], $name)) {
				return TRUE;
			} else {
				return FALSE;
			}
		}
			// check wether something is denied
		if(t3lib_div::inList($this->filter['denied'], $name)) {
			return FALSE;
		}
		return TRUE;
	}
	function setFilter($allowed, $denied) {
		$this->filter = array(
			'allowed' => $allowed,
			'denied'  => $denied,
		);
	}
	function clearFilter() {
		$this->filter = null;
	}
}