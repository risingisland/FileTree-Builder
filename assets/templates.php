<?php
// -------------------------------------------------------
// FileTree Builder — Templates API
// -------------------------------------------------------

$config = [
	'allow_save_template' => true,
];

define('TEMPLATES_DIR', __DIR__ . '/../templates/');

header('Content-Type: application/json');

// Ensure templates directory exists
if(!is_dir(TEMPLATES_DIR)) {
	mkdir(TEMPLATES_DIR, 0755, true);
}

$action = $_GET['action'] ?? '';

switch($action) {

	// List all templates
	case 'list':
		$files = glob(TEMPLATES_DIR . '*.json');
		$names = [];

		if($files) {
			foreach($files as $file) {
				$names[] = basename($file, '.json');
			}
			sort($names);
		}

		echo json_encode($names);
		break;

	// Load a template
	case 'load':
		$name = $_GET['name'] ?? '';

		if(!validName($name)) {
			echo json_encode(['error' => 'Invalid template name.']);
			break;
		}

		$path = TEMPLATES_DIR . $name . '.json';

		if(!file_exists($path)) {
			echo json_encode(['error' => 'Template not found.']);
			break;
		}

		$contents = file_get_contents($path);
		$data = json_decode($contents, true);

		if($data === null) {
			echo json_encode(['error' => 'Invalid template file.']);
			break;
		}

		echo json_encode($data);
		break;

	// Save a template
	case 'save':
		if(!$config['allow_save_template']) {
			echo json_encode(['error' => 'Saving templates is disabled.']);
			break;
		}

		$body = file_get_contents('php://input');
		$payload = json_decode($body, true);

		if(!$payload || empty($payload['name']) || !isset($payload['data'])) {
			echo json_encode(['error' => 'Invalid request.']);
			break;
		}

		$name = trim($payload['name']);

		if(!validName($name)) {
			echo json_encode(['error' => 'Invalid template name. Use letters, numbers, hyphens and underscores only.']);
			break;
		}

		$path = TEMPLATES_DIR . $name . '.json';

		$result = file_put_contents(
			$path,
			json_encode($payload['data'], JSON_PRETTY_PRINT)
		);

		if($result === false) {
			echo json_encode(['error' => 'Could not write template file.']);
			break;
		}

		echo json_encode(['success' => true, 'name' => $name]);
		break;

	default:
		echo json_encode(['error' => 'Unknown action.']);
		break;
}

// Validate template name — letters, numbers, hyphens, underscores only
function validName($name) {
	return $name !== '' && preg_match('/^[a-zA-Z0-9_-]+$/', $name);
}