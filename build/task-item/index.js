/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/task-item/edit.js":
/*!*******************************!*\
  !*** ./src/task-item/edit.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/task-item/editor.scss");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _task_edit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./task-edit */ "./src/task-item/task-edit.js");









function Edit(_ref) {
  let {
    attributes,
    setAttributes,
    context
  } = _ref;
  const schoolId = context['d2i-task-list/schoolId'];
  const {
    directoryName
  } = attributes;
  const [newTaskTitle, setNewTaskTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [newTaskType, setNewTaskType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [externalLink, setExternalLink] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [addingTask, setAddingTask] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [tasksState, setTasks] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    tasks: []
  });
  const [isUnsavedTasksConfirmed, setUnsavedTasksConfirmed] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const taskTitleRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const actions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useDispatch)('d2i/tasks');
  const addTask = actions && actions.addTask;
  const deleteTask = actions && actions.deleteTask;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (schoolId !== 0 && directoryName) {
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6___default()({
        path: `/d2i-task-list/v1/task-items/${schoolId}?directoryName=${directoryName}`
      }).then(res => {
        if (res.length > 0) {
          setTasks({
            tasks: res
          });
          setUnsavedTasksConfirmed(true);
        } else {
          _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6___default()({
            path: `/d2i-task-list/v1/task-items/by-folder?directoryName=${directoryName}`
          }).then(emptyTasks => {
            setTasks({
              tasks: emptyTasks
            });
            if (emptyTasks.length < 1) {
              setUnsavedTasksConfirmed(true);
            }
          });
        }
      });
    } else if (directoryName && schoolId === 0) {
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6___default()({
        path: `/d2i-task-list/v1/task-items/by-folder?directoryName=${directoryName}`
      }).then(emptyTasks => {
        setTasks({
          tasks: emptyTasks
        });
        if (emptyTasks.length < 1) {
          setUnsavedTasksConfirmed(true);
        }
      });
    }
  }, [directoryName]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setAttributes({
      directoryName
    });
  }, [null, directoryName]);
  const onToggleTask = (task, index) => {
    if (task.isCompleted === '1') {
      task.isCompleted = '0';
    } else if (task.isCompleted === '0') {
      task.isCompleted = '1';
    } else if (task.isCompleted === true) {
      task.isCompleted = false;
    } else {
      task.isCompleted = true;
    }
    const tasksCopy = [...tasksState.tasks];
    tasksCopy[index] = {
      ...task,
      isCompleted: task.isCompleted
    };
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6___default()({
      path: `/d2i-task-list/v1/task-items/${task.id}`,
      method: 'POST',
      data: tasksCopy[index]
    }).then(() => {
      setTasks({
        tasks: tasksCopy
      });
    });
  };
  const onLinkTitleChange = v => {
    const externalLinkCopy = {
      ...externalLink
    };
    externalLinkCopy.title = v;
    setExternalLink(externalLinkCopy);
  };
  const onLinkUrlChange = v => {
    const externalLinkCopy = {
      ...externalLink
    };
    externalLinkCopy.url = v;
    setExternalLink(externalLinkCopy);
  };
  const onSetNewTaskType = v => {
    setExternalLink();
    if (v === 'external_link') {
      setExternalLink({
        title: '',
        url: ''
      });
    }
    setNewTaskType(v);
  };
  const onConfirmUnsavedTasks = () => {
    const tasks = tasksState.tasks.map(task => {
      const newTask = {
        ...task,
        schoolId,
        directoryName
      };
      if (task.documentLink) {
        newTask.documentLink = task.documentLink;
      }
      return newTask;
    });
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_6___default()({
      path: '/d2i-task-list/v1/task-items/confirm-new',
      method: 'POST',
      data: tasks
    }).then(res => {
      setTasks({
        tasks: res
      });
      if (tasksState.tasks) {
        setUnsavedTasksConfirmed(true);
      }
    });
  };
  const onEditTaskItem = (task, index) => {
    task.isEdit = !task.isEdit;
    const tasksCopy = [...tasksState.tasks];
    tasksCopy[index] = {
      ...task
    };
    setTasks({
      tasks: tasksCopy
    });
  };
  const onChangeName = newName => {
    setAttributes({
      directoryName: newName
    });
  };
  const onTaskSubmit = async e => {
    e.preventDefault();
    if (addTask && newTaskTitle) {
      const newTask = {
        title: newTaskTitle,
        schoolId,
        directoryName,
        newTaskType,
        isCompleted: '0'
      };
      if (externalLink) {
        newTask.documentLink = externalLink;
      }
      setAddingTask(true);
      const newSavedTask = await addTask(newTask);
      setNewTaskTitle('');
      setNewTaskType('');
      setExternalLink();
      setTasks({
        tasks: [...tasksState.tasks, newSavedTask.task]
      });
      setAddingTask(false);
      taskTitleRef.current.focus();
    }
  };
  const onDeleteTask = async (task, index) => {
    await deleteTask(task, index);
    const tasksCopy = [...tasksState.tasks];
    tasksCopy.splice(index, 1);
    setTasks({
      tasks: tasksCopy
    });
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)(), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Folder Name', 'team-member'),
    tagName: "h2",
    onChange: onChangeName,
    value: directoryName,
    allowedFormats: []
  }), !tasksState.tasks || tasksState.tasks.length < 1 && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Card, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CardBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please add some tasks using the form below', 'd2i-task-list-blocks')))), tasksState.tasks && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Card, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
    size: "xSmall"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, "Tasks", !isUnsavedTasksConfirmed && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    disabled: addingTask || schoolId === 0 || !schoolId,
    onClick: onConfirmUnsavedTasks,
    isPrimary: true
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Confirm New Tasks', 'd2i-task-list-blocks')))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CardBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", null, tasksState.tasks.map((task, index) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
    key: index,
    className: (task.isCompleted === '1' || task.isCompleted === true) && 'is-completed'
  }, !task.isEdit && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CheckboxControl, {
    disabled: task.loading,
    label: task.title,
    checked: task.isCompleted === '1' || task.isCompleted === true,
    onChange: () => {
      onToggleTask(task, index);
    },
    className: 'task-check-control'
  }), task.documentLink && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ExternalLink, {
    href: task.documentLink.url,
    target: task.documentLink.target
  }, task.documentLink.title), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    disabled: addingTask || task.isCompleted === '1' || task.isCompleted === true || !isUnsavedTasksConfirmed,
    onClick: () => onEditTaskItem(task, index),
    variant: "secondary",
    isSmall: true
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Edit', 'd2i-task-list-blocks')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    disabled: task.isCompleted === '1' || task.isCompleted === true || !isUnsavedTasksConfirmed,
    onClick: () => onDeleteTask(task, index),
    isDestructive: true,
    variant: "tertiary",
    isSmall: true
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete', 'd2i-task-list-blocks'))), task.isEdit && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_task_edit__WEBPACK_IMPORTED_MODULE_7__["default"], {
    task: task,
    index: index,
    toggleTaskEdit: onEditTaskItem
  })))))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Card, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
    size: 'xSmall'
  }, "New Tasks"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.CardBody, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    onSubmit: onTaskSubmit,
    className: "addtodo-form"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    ref: taskTitleRef,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Task name', 'd2i-task-list-blocks'),
    value: newTaskTitle,
    onChange: v => setNewTaskTitle(v)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RadioControl, {
    selected: newTaskType,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Document Type', 'd2i-task-list-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether this doc is an upload or link to download', 'd2i-task-list-blocks'),
    options: [{
      label: 'Upload',
      value: 'upload'
    }, {
      label: 'External Link',
      value: 'external_link'
    }],
    onChange: onSetNewTaskType
  }), newTaskType === 'external_link' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link Title', 'd2i-task-list-blocks'),
    value: externalLink.title,
    onChange: onLinkTitleChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link URL', 'd2i-task-list-blocks'),
    value: externalLink.url,
    onChange: onLinkUrlChange
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
    disabled: addingTask,
    type: "submit",
    isPrimary: true
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add Task', 'todo-list')))))));
}

/***/ }),

/***/ "./src/task-item/index.js":
/*!********************************!*\
  !*** ./src/task-item/index.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/task-item/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/task-item/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/task-item/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/task-item/block.json");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./src/task-item/save.js":
/*!*******************************!*\
  !*** ./src/task-item/save.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ save; }
/* harmony export */ });
function save() {
  return null;
}

/***/ }),

/***/ "./src/task-item/task-edit.js":
/*!************************************!*\
  !*** ./src/task-item/task-edit.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TaskEdit; }
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/task-item/editor.scss");






function TaskEdit(_ref) {
  let {
    task,
    index,
    toggleTaskEdit
  } = _ref;
  const actions = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)('d2i/tasks');
  const editTask = actions && actions.editTask;
  const taskTitleRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [newTaskTitle, setNewTaskTitle] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(task.title);
  const [newTaskType, setNewTaskType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(task.taskType);
  const [externalLink, setExternalLink] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(task.documentLink);
  const [addingTask, setAddingTask] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const onLinkTitleChange = v => {
    const externalLinkCopy = {
      ...externalLink
    };
    externalLinkCopy.title = v;
    setExternalLink(externalLinkCopy);
  };
  const onLinkUrlChange = v => {
    const externalLinkCopy = {
      ...externalLink
    };
    externalLinkCopy.url = v;
    setExternalLink(externalLinkCopy);
  };
  const onSetNewTaskType = v => {
    setExternalLink();
    if (v === 'external_link') {
      setExternalLink({
        title: '',
        url: ''
      });
    }
    setNewTaskType(v);
  };
  const onTaskSubmit = async e => {
    e.preventDefault();
    if (editTask && newTaskTitle) {
      const newTask = {
        title: newTaskTitle,
        schoolId: task.schoolId,
        folder: task.folder,
        taskType: task.taskType,
        isCompleted: '0',
        id: task.id
      };
      if (externalLink) {
        newTask.documentLink = externalLink;
      }
      setAddingTask(true);
      const newSavedTask = await editTask(newTask);
      newSavedTask.task.isEdit = task.isEdit;
      setNewTaskTitle('');
      setNewTaskType('');
      setExternalLink();
      setAddingTask(false);
      toggleTaskEdit(newSavedTask.task, index);
    }
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("form", {
    className: "addtodo-form",
    onSubmit: onTaskSubmit
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    ref: taskTitleRef,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Task name', 'd2i-task-list-blocks'),
    value: newTaskTitle,
    onChange: v => setNewTaskTitle(v)
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RadioControl, {
    selected: newTaskType,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Document Type', 'd2i-task-list-blocks'),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Whether this doc is an upload or link to download', 'd2i-task-list-blocks'),
    options: [{
      label: 'Upload',
      value: 'upload'
    }, {
      label: 'External Link',
      value: 'external_link'
    }],
    onChange: onSetNewTaskType
  }), newTaskType === 'external_link' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link Title', 'd2i-task-list-blocks'),
    value: externalLink ? externalLink.title : null,
    onChange: onLinkTitleChange
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Link URL', 'd2i-task-list-blocks'),
    value: externalLink ? externalLink.url : null,
    onChange: onLinkUrlChange
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    disabled: addingTask,
    type: "submit",
    isPrimary: true
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save Changes', 'todo-list')), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    disabled: addingTask,
    onClick: () => toggleTaskEdit(task, index),
    variant: "tertiary"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Cancel', 'todo-list')));
}

/***/ }),

/***/ "./src/task-item/editor.scss":
/*!***********************************!*\
  !*** ./src/task-item/editor.scss ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/task-item/style.scss":
/*!**********************************!*\
  !*** ./src/task-item/style.scss ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ (function(module) {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ (function(module) {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ (function(module) {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ (function(module) {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ (function(module) {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/task-item/block.json":
/*!**********************************!*\
  !*** ./src/task-item/block.json ***!
  \**********************************/
/***/ (function(module) {

module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"d2i-blocks/task-item","version":"0.1.0","title":"Task Item","category":"widgets","icon":"yes","description":"A school task list item","parent":["d2i-blocks/task-list"],"supports":{"html":false,"reusable":false},"textdomain":"d2i-task-list-blocks","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","attributes":{"directoryName":{"type":"string","default":""}},"usesContext":["d2i-task-list/schoolId"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"task-item/index": 0,
/******/ 			"task-item/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkd2i_task_list_blocks"] = self["webpackChunkd2i_task_list_blocks"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["task-item/style-index"], function() { return __webpack_require__("./src/task-item/index.js"); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map