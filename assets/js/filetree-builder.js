// Load template list from server on page load
function loadTemplateList() {
	$.getJSON('assets/templates.php?action=list', function(data) {
		let $select = $('#template-select');

		// Remove any previously loaded dynamic options
		$select.find('option.dynamic').remove();

		if(data.length) {
			data.forEach(function(name) {
				$select.append(
					$('<option>')
						.addClass('dynamic')
						.val(name)
						.text(name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
				);
			});
		}
	});
}

loadTemplateList();

$('#template-select').on('change', function() {
	let template = $(this).val();
	$(this).val('');

	if(!template) return;

	if(template === '__blank__') {
		if(confirm('Start a new blank project?')) {
			localStorage.removeItem('filetree-project');
			location.reload();
		}
		return;
	}

	// Load from server
	$.getJSON('assets/templates.php?action=load&name=' + encodeURIComponent(template), function(data) {
		if(!data || data.error) {
			alert('Could not load template.');
			return;
		}

		if(!confirm('Replace current project with template "' + template + '"?')) {
			return;
		}

		let t = $('#tree').jstree(true);
		t.settings.core.data = data;
		t.refresh();

		localStorage.setItem('filetree-project', JSON.stringify(data));

		$('#tree').one('refresh.jstree', function() {
			t.get_json('#', { flat: true }).forEach(function(item) {
				let node = t.get_node(item.id);
				if(node.type === 'file') {
					t.set_icon(node, getFileIcon(node.text));
				} else {
					fixFolderIcons(node);
				}
			});
			refreshAscii();
			saveProject();
		});
	}).fail(function() {
		alert('Could not load template.');
	});
});

// Save as Template
$('#save-template').on('click', function() {
	let name = prompt('Template name:');
	if(!name) return;

	name = name.trim();
	if(!name) return;

	let tree = $('#tree').jstree(true);

	function cleanNode(node) {
		return {
			text: node.text,
			type: node.type,
			children: node.children.map(function(childId) {
				return cleanNode(tree.get_node(childId));
			})
		};
	}

	let json = tree.get_json('#', { flat: false }).map(function(rootNode) {
		return cleanNode(tree.get_node(rootNode.id));
	});

	$.ajax({
		url: 'assets/templates.php?action=save',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ name: name, data: json }),
		success: function(resp) {
			if(resp.success) {
				loadTemplateList();
			} else {
				alert('Save failed: ' + (resp.error || 'unknown error'));
			}
		},
		error: function() {
			alert('Save failed.');
		}
	});
});

// remember tree
function getInitialData() {
	let saved = localStorage.getItem('filetree-project');

	if(saved) {
		try {
			return JSON.parse(saved);
		}
		catch(e) {
			console.error(e);
		}
	}

	return [
		{
			text: "root",
			type: "folder",
			icon: "fa-regular fa-folder-open",
			state: {
				opened: true
			},
			children: []
		}
	];
}

// Initialize jsTree
$(function () {
	$('#tree').jstree({
		core: {
			check_callback: true,
			data: getInitialData()
		},
		plugins: [
			"dnd",
			"types",
			"wholerow",
			"contextmenu"
		],
		types: {
			folder: {
				icon: "fa fa-folder"
			},
			file: {
				icon: "fa fa-file"
			}
		},
		contextmenu: {
			items: function(node) {

				let tree = $('#tree').jstree(true);

				let menu = {

					createFolder: {
						label: "📁 Add Folder",
						action: function() {

							let newNode = tree.create_node(node, {
								text: "New Folder",
								type: "folder"
							});

							tree.edit(newNode);
						}
					},

					createFile: {
						label: "📄 Add File",
						action: function() {

							let newNode = tree.create_node(node, {
								text: "newfile.txt",
								type: "file",
								icon: getFileIcon('newfile.txt')
							});

							tree.edit(newNode);
						}
					},

					rename: {
						label: "✏ Rename",
						action: function() {
							tree.edit(node);
						}
					},

					delete: {
						label: "🗑 Delete",
						action: function() {

							if(confirm('Delete "' + node.text + '"?')) {
								tree.delete_node(node);
							}

						}
					}
				};

				// Prevent root deletion
				if(node.parent === '#') {
					delete menu.delete;
				}

				return menu;
			}
		}
	});
	
	$(document).on('click', '#dark-mode', function() {
		$('body').toggleClass('dark');
	});
});

function fixFolderIcons(node) {
	let tree = $('#tree').jstree(true);

	if(node.type === 'folder') {
		tree.set_icon(
			node,
			node.state.opened
				? 'fa-regular fa-folder-open'
				: 'fa-solid fa-folder'
		);
	}

	node.children.forEach(function(id){
		fixFolderIcons(
			tree.get_node(id)
		);
	});
}

$('#tree').on('ready.jstree', function() {
	refreshAscii();

	let tree = $('#tree').jstree(true);

	tree.get_json('#', {flat:true}).forEach(function(item){
		fixFolderIcons(
			tree.get_node(item.id)
		);
	});

});

// auto update icons
$('#tree').on('rename_node.jstree', function(e,data){
	let tree = $('#tree').jstree(true);

	if(data.node.type === 'file') {
		tree.set_icon(
			data.node,
			getFileIcon(data.text)
		);
	}

});

// Add Icons
function getFileIcon(filename) {
	let ext = filename.split('.').pop().toLowerCase();

	const icons = {
		js: 'fa-regular fa-file-code js',
		css: 'fa-regular fa-file-code css',
		php: 'fa-solid fa-file-code php',
		html: 'fa-solid fa-file-code html',
		json: 'fa-solid fa-file-invoice json',
		db: 'fa-solid fa-file-invoice db',

		png: 'fa-solid fa-file-image png',
		jpg: 'fa-solid fa-file-image jpg',
		jpeg: 'fa-solid fa-file-image jpeg',
		gif: 'fa-solid fa-file-image gif',
		svg: 'fa-solid fa-file-image svg',
		webp: 'fa-solid fa-file-image webp',
		ico: 'fa-solid fa-file-image ico',

		md: 'fa-solid fa-file-lines md',
		txt: 'fa-solid fa-file-lines txt',

		zip: 'fa-solid fa-file-zipper zip',
		pdf: 'fa-solid fa-file-pdf pdf'
	};

	return icons[ext] || 'fa-solid fa-file txt';
}

// open/close folder icon
$('#tree')
.on('open_node.jstree', function(e,data){
	$('#tree').jstree(true).set_icon(
		data.node,
		'fa-regular fa-folder-open'
	);
})

.on('close_node.jstree', function(e,data){
	$('#tree').jstree(true).set_icon(
		data.node,
		'fa-solid fa-folder'
	);
});

// Add Folder Button
$('#add-folder').on('click', function () {
	let tree = $('#tree').jstree(true);

	let selected = tree.get_selected();

	if (!selected.length) {
		selected = ['#'];
	}

	let node = tree.create_node(
		selected[0],
		{
			text: 'New Folder',
			type: 'folder'
		}
	);

	tree.edit(node);
});

// Add File Button
$('#add-file').on('click', function () {
	let tree = $('#tree').jstree(true);

	let selected = tree.get_selected();

	if (!selected.length) {
		selected = ['#'];
	}

	let node = tree.create_node(
		selected[0],
		{
			text: 'newfile.txt',
			type: 'file',
			icon: getFileIcon('newfile.txt')
		}
	);

	tree.edit(node);
});

// Generate ASCII
function buildAscii(node, prefix = '') {
	let output = '';

	let children = node.children || [];

	children.forEach((childId, index) => {
		let tree = $('#tree').jstree(true);
		let child = tree.get_node(childId);

		let last = index === children.length - 1;

		output += prefix +
				  (last ? '└── ' : '├── ') +
				  child.text +
				  '\n';

		output += buildAscii(
			child,
			prefix + (last ? '	' : '│   ')
		);
	});

	return output;
}

// auto-save
function saveProject() {
	let tree = $('#tree').jstree(true);

	localStorage.setItem(
		'filetree-project',
		JSON.stringify(tree.get_json('#'))
	);
}

// Refresh Preview
function refreshAscii() {
	let tree = $('#tree').jstree(true);

	let root = tree.get_json('#', {
		flat: false
	});

	let output = '';

	root.forEach(function(node) {
		output += node.text + '\n';
		output += buildAscii(
			tree.get_node(node.id)
		);
	});

	$('#ascii').text(output);
}

// Auto Update
$('#tree').on(
	'rename_node.jstree create_node.jstree delete_node.jstree move_node.jstree',
	function() {
		refreshAscii();
		saveProject();
	}
);

$('#tree').on('ready.jstree', refreshAscii);

// Export dropdown toggle
$('#export-btn').on('click', function(e) {
	e.stopPropagation();
	$('.export-dropdown').toggleClass('open');
});

$(document).on('click', function() {
	$('.export-dropdown').removeClass('open');
});

// Export JSON
$('#export-json').on('click', function() {
	$('.export-dropdown').removeClass('open');

	let tree = $('#tree').jstree(true);

	function cleanNode(node) {
		return {
			text: node.text,
			type: node.type,
			children: node.children.map(function(childId) {
				return cleanNode(tree.get_node(childId));
			})
		};
	}

	let json = tree.get_json('#', { flat: false }).map(function(rootNode) {
		return cleanNode(tree.get_node(rootNode.id));
	});

	let blob = new Blob(
		[JSON.stringify(json, null, 4)],
		{type:'application/json'}
	);

	let a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = 'project.json';
	a.click();
});

// PNG export helper
function exportPng(element, filename) {
	let isDark = $('body').hasClass('dark');
	let bg = isDark ? '#252526' : '#ffffff';

	domtoimage.toPng(element, {
		bgcolor: bg,
		scale: 2
	})
	.then(function(dataUrl) {
		let a = document.createElement('a');
		a.href = dataUrl;
		a.download = filename;
		a.click();
	})
	.catch(function(err) {
		alert('PNG export failed. Check console for details.');
		console.error(err);
	});
}

// Export Tree as PNG
$('#export-tree-png').on('click', function() {
	$('.export-dropdown').removeClass('open');
	exportPng(document.getElementById('tree-panel'), 'filetree.png');
});

// Export ASCII as PNG
$('#export-ascii-png').on('click', function() {
	$('.export-dropdown').removeClass('open');
	exportPng(document.getElementById('ascii-panel'), 'ascii.png');
});

// Export as ZIP
$('#export-zip').on('click', function() {
	$('.export-dropdown').removeClass('open');

	let tree = $('#tree').jstree(true);
	let zip = new JSZip();

	// 1x1 transparent PNG as base64
	const PLACEHOLDER_IMG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

	const fileContent = {
		// Web
		html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n\n</body>\n</html>',

		php:  '<?php\n',

		css:  '/* Styles */\n',

		js:   "'use strict';\n",

		json: '{}',

		// Markdown / text
		md:   '# Project Name\n',

		txt:  '',

		// Data
		db:   '',
		xml:  '<?xml version="1.0" encoding="UTF-8"?>\n',
		env:  '',

		// SVG placeholder
		svg:  '.',
	};

	// Image extensions — use base64 placeholder PNG
	const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico'];

	function getFileContent(filename) {
		let ext = filename.split('.').pop().toLowerCase();

		if(imageExts.includes(ext)) {
			return { content: PLACEHOLDER_IMG, base64: true };
		}

		if(fileContent.hasOwnProperty(ext)) {
			return { content: fileContent[ext], base64: false };
		}

		return { content: '// ' + filename + '\n', base64: false };
	}

	function addToZip(node, folder) {
		node.children.forEach(function(childId) {
			let child = tree.get_node(childId);

			if(child.type === 'folder') {
				let subFolder = folder.folder(child.text);
				addToZip(child, subFolder);
			} else {
				let fc = getFileContent(child.text);
				folder.file(child.text, fc.content, { base64: fc.base64 });
			}
		});
	}

	// Strip root — zip contents of each root node directly
	tree.get_node('#').children.forEach(function(rootId) {
		let root = tree.get_node(rootId);
		addToZip(root, zip);
	});

	zip.generateAsync({ type: 'blob' })
	.then(function(blob) {
		let a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'project-skeleton.zip';
		a.click();
	})
	.catch(function(err) {
		alert('ZIP export failed. Check console for details.');
		console.error(err);
	});
});

// Import Json
$('#import-btn').on('click', function() {
	$('#import-json').click();
});

$('#import-json').change(function(e){
	let file = e.target.files[0];

	let reader = new FileReader();

	reader.onload = function() {
		try {
			let data = JSON.parse(reader.result);

			localStorage.setItem(
				'filetree-project',
				JSON.stringify(data)
			);

			let t = $('#tree').jstree(true);
			t.settings.core.data = data;
			t.refresh();

			$('#tree').one('refresh.jstree', function() {
				t.get_json('#', { flat: true }).forEach(function(item) {
					let node = t.get_node(item.id);
					if (node.type === 'file') {
						t.set_icon(node, getFileIcon(node.text));
					} else {
						fixFolderIcons(node);
					}
				});
				refreshAscii();
				saveProject();
			});
		}
		catch(e) {
			alert('Invalid JSON file.');
			console.error(e);
		}
	};

	reader.readAsText(file);
});

$(document).on('dragover', function(e) {
	e.preventDefault();
});

$(document).on('drop', function(e) {
	e.preventDefault();

	let file = e.originalEvent.dataTransfer.files[0];
	if (!file) return;

	let reader = new FileReader();

	reader.onload = function() {
		try {
			let data = JSON.parse(reader.result);

			localStorage.setItem(
				'filetree-project',
				JSON.stringify(data)
			);

			let t = $('#tree').jstree(true);
			t.settings.core.data = data;
			t.refresh();

			$('#tree').one('refresh.jstree', function() {
				t.get_json('#', { flat: true }).forEach(function(item) {
					let node = t.get_node(item.id);
					if (node.type === 'file') {
						t.set_icon(node, getFileIcon(node.text));
					} else {
						fixFolderIcons(node);
					}
				});
				refreshAscii();
				saveProject();
			});
		}
		catch(e) {
			alert('Invalid JSON file.');
			console.error(e);
		}
	};

	reader.readAsText(file);
});

// Expand / Collapse All
$('#expand-all').on('click', function() {
	$('#tree').jstree('open_all');
});

$('#collapse-all').on('click', function() {
	$('#tree').jstree('close_all');
});

// Sort Tree Alphabetically (folders first, then files)
$('#sort-tree').on('click', function() {
	let tree = $('#tree').jstree(true);

	function sortNode(parentId) {
		let parent = tree.get_node(parentId);
		let children = parent.children.map(function(id) {
			return tree.get_node(id);
		});

		children.sort(function(a, b) {
			// folders before files
			if(a.type !== b.type) {
				return a.type === 'folder' ? -1 : 1;
			}
			return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
		});

		children.forEach(function(node, index) {
			tree.move_node(node, parent, index);
			if(node.type === 'folder') {
				sortNode(node.id);
			}
		});
	}

	// sort each root node's children
	tree.get_node('#').children.forEach(function(rootId) {
		sortNode(rootId);
	});

	refreshAscii();
	saveProject();
});

// Rename panel headers on double-click
$(document).on('dblclick', '.panel-header', function() {
	let $header = $(this);
	let current = $header.text().trim();

	let $input = $('<input>')
		.val(current)
		.on('click', function(e) {
			e.stopPropagation();
		})
		.on('blur', function() {
			let val = $(this).val().trim();
			$header.text(val || current);
		})
		.on('keydown', function(e) {
			if(e.key === 'Enter') {
				$(this).blur();
			}
			if(e.key === 'Escape') {
				$(this).val(current).blur();
			}
		});

	$header.empty().append($input);
	$input.focus().select();
});

// rename on doubleckick
$('#tree').on('dblclick.jstree', '.jstree-anchor', function(e) {
	let tree = $('#tree').jstree(true);

	let node = tree.get_node(this);

	if(node.type === 'file') {
		tree.edit(node);
	}
});