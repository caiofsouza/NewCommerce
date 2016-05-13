<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function index()
	{
		// where: field: value -> get('collection')
		print_r(  $this->mongo_db->find_one('ecommerce'));
		$this->load->view('welcome_message');
	}
}
