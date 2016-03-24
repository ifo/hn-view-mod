function getCommentTree() {
  return makeTree(getAllComments());
}

function getAllComments() {
  var comments = [];
  var commentRefs = document.getElementsByClassName('athing');
  // the first comment is not a response, so it is ignored
  for (var i = 1; i < commentRefs.length; i++) {
    comments.push(commentRefs[i]);
  }
  return comments;
}

function makeTree(arr) {
  var commentArray = arr.slice();
  if (commentArray.length === 0) {
    return [];
  } else if (commentArray.length === 1) {
    return [{elem: commentArray[0], children: []}];
  }

  var comment = commentArray.shift();
  var nestLevel = getNestLevel(comment);
  var tree = [];
  var subArray = [];

  while (commentArray.length !== 0) {
    var current = commentArray.shift();
    if (getNestLevel(current) === nestLevel) {
      tree.push({elem: comment, children: subArray});
      comment = current;
      subArray = [];
    } else {
      subArray.push(current);
    }
  }
  tree.push({elem: comment, children: subArray});

  tree.map(function(comment) {
    comment.children = makeTree(comment.children);
  });

  return tree;
}

function getNestLevel(elem) {
  return elem.getElementsByTagName('img')[0].width;
}

/*
 * Display functions
 */
function hideAllReplies(level) {
  level.map(function(e) {
    hideLevel(e.children);
  });
}

function hideLevel(level) {
  level.map(function(e) {
    //e.elem.setAttribute('style', 'display: none;');
    e.elem.style.display = 'none';
    hideLevel(e.children);
  });
}

function showLevel(level) {
  level.map(function(e) {
    e.elem.style.display = '';
  });
}

function showAll(level) {
  level.map(function(e) {
    e.elem.style.display = '';
    showAll(e.children);
  });
}

/*
 * Event handlers
 */
function addClickHandler(level) {
  level.map(function(e) {
    AddOnClickShowHide(e);
    addClickHandler(e.children);
  });
}

function addOnClickShowHide(e) {
  e.elem.onclick = function() {
    if (e.children.length > 0) {
      if (e.children[0].elem.style.display === 'none') {
        showLevel(e.children);
      } else {
        hideLevel(e.children);
      }
    }
  }
}
