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

<div class="footer">
	<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;" width="1.2em" height="1.2em" viewBox="0 0 24 24">
		<path d="M0 0h24v24H0z" fill="none" />
		<path fill="#6220bd" d="M3 3h6v4H3zm12 7h6v4h-6zm0 7h6v4h-6zm-2-4H7v5h6v2H5V9h2v2h6z" />
	</svg>
	FileTree-Builder 
	<a href="https://github.com/risingisland/FileTree-Builder" target="_blank" style="padding-left:20px;">
		<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;" width="1.2em" height="1.2em" viewBox="-2 -2 24 24">
			<path d="M-2 -2h24v24H-2z" fill="none" />
			<path fill="currentColor" d="M18.88 1.099Q17.78-.001 16.233 0H3.746Q2.198 0 1.099 1.099Q-.001 2.199 0 3.746v12.487q0 1.548 1.099 2.647q1.1 1.1 2.647 1.099H6.66q.285 0 .429-.02a.5.5 0 0 0 .286-.169q.143-.15.143-.435l-.007-.885q-.006-.846-.006-1.34l-.3.052q-.285.052-.721.046a5.6 5.6 0 0 1-.904-.091a2 2 0 0 1-.872-.39a1.65 1.65 0 0 1-.572-.8l-.13-.3a3.3 3.3 0 0 0-.41-.663q-.28-.364-.566-.494l-.09-.065a1 1 0 0 1-.17-.156a.7.7 0 0 1-.117-.182q-.039-.092.065-.15q.104-.06.378-.059l.26.04q.26.051.643.311a2.1 2.1 0 0 1 .631.677q.3.532.722.813q.423.28.852.28t.742-.065a2.6 2.6 0 0 0 .585-.196q.117-.871.637-1.34a9 9 0 0 1-1.333-.234a5.3 5.3 0 0 1-1.223-.507a3.5 3.5 0 0 1-1.047-.872q-.416-.52-.683-1.365q-.266-.846-.266-1.952q0-1.573 1.027-2.68q-.48-1.183.091-2.652q.378-.118 1.119.175t1.086.5q.345.21.553.352a9.2 9.2 0 0 1 2.497-.338q1.288 0 2.498.338l.494-.312a7 7 0 0 1 1.197-.572q.689-.26 1.054-.143q.585 1.47.103 2.653q1.028 1.105 1.028 2.68q0 1.106-.267 1.957q-.266.852-.689 1.366a3.7 3.7 0 0 1-1.053.865q-.63.351-1.223.507a9 9 0 0 1-1.333.235q.675.585.676 1.846v3.11q0 .22.065.357a.36.36 0 0 0 .208.189q.143.052.254.064q.111.014.318.013h2.914q1.548 0 2.647-1.099t1.099-2.647V3.746q0-1.548-1.1-2.647z" />
		</svg>
	</a>
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
