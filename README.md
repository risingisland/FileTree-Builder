# FileTree Builder

A lightweight, browser-based tool for visually designing and exporting file/folder structures. Built with PHP, jQuery, and jsTree.

<img width="900" alt="FileTree-Builder" src="https://github.com/user-attachments/assets/9adaf9e8-623f-47e1-8d22-ebdf031cf05a" />
---

## Features

- **Visual tree editor** — drag and drop to build and rearrange folder structures
- **ASCII preview** — live side-by-side ASCII tree output
- **Templates** — load from and save to a `templates/` folder of JSON files
- **Export** — JSON, PNG (tree or ASCII), and ZIP scaffold with file content stubs
- **Import** — JSON via button or drag and drop onto the page
- **Sort** — alphabetically sorts folders and files (folders first) at all levels
- **Dark mode** — toggle via the toolbar
- **Persistent** — project state is saved to `localStorage` between sessions

---

## Requirements

- PHP 7.4+
- A local web server (e.g. Laragon, XAMPP, or `php -S localhost:8080`)

> **Note:** Opening `index.php` directly via `file://` will cause PNG export to fail due to browser CORS restrictions on font file access. Always serve through a local server.

---

## File Structure

```
www
├── index.php
├── README.md
├── LICENSE
├── assets
│   ├── css
│   │   ├── 32px.png
│   │   ├── 40px.png
│   │   ├── filetree-builder.css
│   │   ├── fontawesome.min.css
│   │   ├── jstree.min.css
│   │   └── throbber.gif
│   ├── js
│   │   ├── dom-to-image-more.min.js
│   │   ├── filetree-builder.js
│   │   ├── jquery.min.js
│   │   ├── jstree.min.js
│   │   └── jszip.min.js
│   ├── webfonts
│   │   ├── fa-brands-400.woff2
│   │   ├── fa-regular-400.woff2
│   │   └── fa-solid-900.woff2
│   └── templates.php
└── templates
	├── FileTree-Builder.json
	├── getsimple-plugin.json
	└── website.json
```

---

## Configuration

At the top of `index.php`:

```php
$config = [
    'allow_save_template' => true,   // Show "Save Template" button and allow writing to templates/
];
```

Setting `allow_save_template` to `false` hides the Save Template button in the UI and also blocks the save action server-side in `templates.php`.

---

## Toolbar Reference

| Control | Description |
|---|---|
| **Templates** | Load a saved template. Selecting "Blank Project" clears the current tree after confirmation. |
| **Save Template** | Save the current tree as a named `.json` file in `templates/`. *(Hidden when `allow_save_template` is `false`)* |
| **Folder** | Add a new folder under the selected node (or at root if nothing selected). |
| **File** | Add a new file under the selected node (or at root if nothing selected). |
| **Expand** | Expand all folders in the tree. |
| **Collapse** | Collapse all folders in the tree. |
| **Sort** | Sort all folders and their contents alphabetically, folders before files. |
| **Import** | Import a `.json` project file via file picker. |
| **Export** | Open the export dropdown menu. |
| **🌙** | Toggle dark mode. |

---

## Export Options

| Option | Output | Description |
|---|---|---|
| **Export JSON** | `project.json` | Exports the tree structure as JSON (`text`, `type`, `children` only — no icon data). |
| **Export Tree as PNG** | `filetree.png` | Captures the Project Structure panel as a 2× PNG. Dark mode aware. |
| **Export ASCII as PNG** | `ascii.png` | Captures the ASCII Preview panel as a 2× PNG. Dark mode aware. |
| **Export as ZIP** | `project.zip` | Creates a real folder/file scaffold ZIP. Root node is stripped; contents are zipped directly. |

### ZIP File Content Stubs

When exporting as ZIP, files are created with minimal boilerplate based on extension:

| Extension | Content |
|---|---|
| `.html` | HTML5 scaffold |
| `.php` | `<?php` |
| `.css` | `/* Styles */` |
| `.js` | `'use strict';` |
| `.json` | `{}` |
| `.md` | `# Project Name` |
| `.xml` | XML declaration |
| `.txt` `.env` `.db` | Empty |
| `.svg` | `.` |
| `.png` `.jpg` `.jpeg` `.gif` `.webp` `.ico` | 1×1 transparent PNG placeholder |
| *Any other extension* | `// filename` comment |

---

## Templates

Templates are stored as `.json` files in the `templates/` folder. They are loaded dynamically — adding or removing a file from the folder is reflected immediately in the Templates dropdown on next page load.

Template names may only contain letters, numbers, hyphens, and underscores (`a-z A-Z 0-9 - _`).

### Template JSON Format

```json
[
    {
        "text": "folder-name",
        "type": "folder",
        "children": [
            { "text": "index.php", "type": "file" },
            {
                "text": "assets",
                "type": "folder",
                "children": [
                    { "text": "app.css", "type": "file" }
                ]
            }
        ]
    }
]
```

Only `text`, `type`, and `children` are needed. Icons are assigned automatically on load based on file extension.

---

## Tree Interactions

| Action | Result |
|---|---|
| Click a node | Select it |
| Double-click a file | Rename inline |
| Double-click a folder | Open/close |
| Right-click any node | Context menu: Add Folder, Add File, Rename, Delete |
| Drag a node | Move it within the tree |
| Drag a `.json` file onto the page | Import it as the current project |
| Double-click a panel header | Rename the panel (reflected in PNG exports) |

---

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [jQuery](https://jquery.com) | 3.7.1 | DOM & AJAX |
| [jsTree](https://www.jstree.com) | 3.3.17 | Interactive tree widget |
| [Font Awesome](https://fontawesome.com) | 6.7.2 | Icons |
| [dom-to-image-more](https://github.com/1904labs/dom-to-image-more) | latest | PNG export |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | ZIP export |

All dependencies are hosted locally under `assets/`.

---

## License

MIT
