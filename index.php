<?php
// -------------------------------------------------------
// Script: FileTree Builder
// Description: Automatically adds Lightbox to all images
// Version: 1.0
// Author: risingisland
// Repo: https://github.com/risingisland/FileTree-Builder
// -------------------------------------------------------
// FileTree Builder — Configuration
// -------------------------------------------------------
$config = [
	'allow_save_template' => true,   // Allow saving new templates to disk (true/false)
];
?>
<!DOCTYPE html>
<html>
<head>

	<meta charset="UTF-8">
	<title>FileTree Builder</title>
	<meta name="description" content="A lightweight, browser-based tool for visually designing and exporting file/folder structures. Built with PHP, jQuery, and jsTree.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0z' fill='none' /%3E%3Cpath fill='%236220bd' d='M3 3h6v4H3zm12 7h6v4h-6zm0 7h6v4h-6zm-2-4H7v5h6v2H5V9h2v2h6z' /%3E%3C/svg%3E%0A" />

	<link rel="stylesheet" href="assets/css/jstree.min.css">
	<link rel="stylesheet" href="assets/css/fontawesome.min.css">
	<link rel="stylesheet" href="assets/css/filetree-builder.css">
	
</head>
<body>

<div id="toolbar">
	<select id="template-select">
		<option value="">Templates...</option>
		<option value="__blank__">Blank Project</option>
	</select>

	<?php if($config['allow_save_template']): ?>
	<button id="save-template">
		<i class="fa-solid fa-floppy-disk"></i>
		Save Template
	</button>
	<?php endif; ?>
	
	<button id="add-folder">
		<i class="fa-solid fa-folder-plus"></i>
		Folder
	</button>

	<button id="add-file">
		<i class="fa-solid fa-file-circle-plus"></i>
		File
	</button>
	
	<div class="toolbar-group">

		<button id="expand-all">
			<i class="fa-solid fa-angles-down"></i>
			Expand
		</button>

		<button id="collapse-all">
			<i class="fa-solid fa-angles-up"></i>
			Collapse
		</button>

	</div>

	<button id="sort-tree">
		<i class="fa-solid fa-arrow-down-a-z"></i>
		Sort
	</button>

	<div class="toolbar-group">

		<input type="file" id="import-json" accept=".json,application/json" style="display:none;">
		<button id="import-btn">
			<i class="fa-solid fa-upload"></i>
			Import
		</button>

		<div class="export-wrap">
			<button id="export-btn">
				<i class="fa-solid fa-download"></i>
				Export
				<i class="fa-solid fa-caret-down" style="margin-left:4px;font-size:11px;"></i>
			</button>
			<ul class="export-dropdown">
				<li id="export-json">
					<i class="fa-solid fa-file-code"></i>
					Export JSON
				</li>
				<li class="export-divider"></li>
				<li id="export-zip">
					<i class="fa-solid fa-file-zipper"></i>
					Export as ZIP
				</li>
				<li class="export-divider"></li>
				<li id="export-tree-png">
					<i class="fa-solid fa-tree"></i>
					Export Tree as PNG
				</li>
				<li id="export-ascii-png">
					<i class="fa-solid fa-terminal"></i>
					Export ASCII as PNG
				</li>
			</ul>
		</div>

	</div>

	<button id="dark-mode">
		<i class="fa-solid fa-moon"></i>
	</button>
</div>

<div id="main">
	<div id="tree-panel">

		<div class="panel-header">
			Project Structure
		</div>

		<div id="tree"></div>

	</div>
	
	<div id="divider"></div>
	
	<div id="ascii-panel">

		<div class="panel-header">
			ASCII Preview
		</div>

		<pre id="ascii"></pre>

	</div>
</div>

<script src="assets/js/jquery.min.js"></script>
<script src="assets/js/jstree.min.js"></script>
<script src="assets/js/dom-to-image-more.min.js"></script>
<script src="assets/js/jszip.min.js"></script>

<script src="assets/js/filetree-builder.js"></script>

<script>
// Config from PHP
const ftConfig = {
	allowSaveTemplate: <?= $config['allow_save_template'] ? 'true' : 'false' ?>
};
</script>

</body>
</html>