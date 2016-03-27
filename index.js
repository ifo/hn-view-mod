;(function() {
'use strict';

function getCommentTree() {
  return makeTree(getAllComments());
}

function getAllComments() {
  var comments = [];
  var commentRefs = document.getElementsByClassName('athing');
  // the first comment is not a reply, so it is ignored
  for (var i = 1; i < commentRefs.length; i++) {
    comments.push(commentRefs[i]);
  }
  return comments;
}

function makeTree(arr) {
  var commentArray = arr.slice(); // copy arr to prevent modifying it

  if (commentArray.length === 0) {
    return [];
  } else if (commentArray.length === 1) {
    return [{elem: commentArray[0], replies: []}];
  }

  var comment = commentArray.shift();
  var nestLevel = getNestLevel(comment);
  var tree = [];
  var subArray = [];

  while (commentArray.length !== 0) {
    var current = commentArray.shift();
    if (getNestLevel(current) === nestLevel) {
      tree.push({elem: comment, replies: subArray});
      comment = current;
      subArray = [];
    } else {
      subArray.push(current);
    }
  }
  tree.push({elem: comment, replies: subArray});

  tree.map(function(comment) {
    comment.replies = makeTree(comment.replies);
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
    hideLevel(e.replies);
  });
}

function hideLevel(level) {
  level.map(function(e) {
    e.elem.style.display = 'none';
    hideLevel(e.replies);
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
    showAll(e.replies);
  });
}

// TODO precompute border selectors
function addBorder(e) {
  e.elem
    .getElementsByClassName('default')[0]
    .getElementsByTagName('div')[0]
    .getElementsByTagName('span')[0]
    .style['border-top'] = '1px solid #ccc';
}

function removeBorder(e) {
  e.elem
    .getElementsByClassName('default')[0]
    .getElementsByTagName('div')[0]
    .getElementsByTagName('span')[0]
    .style['border-top'] = '';
}

function setStyle(e) {
  if (e.replies.length > 0 && e.replies[0].elem.style.display === 'none') {
    addBorder(e);
  } else {
    removeBorder(e);
  }
}

/*
 * Event handlers
 */
function addOnClickShowHideStyle(e) {
  // TODO disable click handler when "reply", "name" or "comment link" are clicked
  e.elem.getElementsByClassName('default')[0].onclick = function() {
    if (e.replies.length > 0) {
      if (e.replies[0].elem.style.display === 'none') {
        showLevel(e.replies);
      } else {
        hideLevel(e.replies);
      }
      setStyle(e);
      // quick fix, ensure all replies have the correct style
      // TODO handle remembering styles and visibility
      e.replies.map(setStyle);
    }
  };
}

/*
 * Putting it all together
 */
function addHandlerAndStyle(level) {
  level.map(function(e) {
    addOnClickShowHideStyle(e);
    setStyle(e);
    addHandlerAndStyle(e.replies);
  });
}

function setupPage() {
  var tree = getCommentTree();
  hideAllReplies(tree);
  addHandlerAndStyle(tree);
}

// Run it
setupPage();

})();
