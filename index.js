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

// Example
// Hide all 2nd level + comments
function hide(commentTree) {
  commentTree.map(function(e) {
    hideChildren(e.children);
  });
}

function hideChildren(commentTree) {
  commentTree.map(function(e) {
    e.elem.setAttribute('style', 'display: none;');
    hideChildren(e.children);
  });
}
