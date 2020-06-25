// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var commentData = [];

class Comment {
  constructor(username, commentBody, timestamp) {
    this._username = username;
    this._commentBody = commentBody;
    this._timestamp = timestamp;
  }

  get username() {
    return this._username;
  }

  set username(newName) {
    this._username = newName;
  }

  get commentBody() {
    return this._commentBody;
  }

  set commentBody(newBody) {
    this._commentBody = newBody;
  }

  get timestamp() {
    return this._timestamp;
  }

  set timestamp(newTime) {
    this._timestamp = newTime;
  }

}

/**
 * Navigates the user to a random site that is relevant
 * to my professional life. This may include
 * LinkedIn, a project repo, etc.
 */
function gotoRandomSite() {
  const sites =
    [
      'https://github.com/kevinMoreland/QuarCards',
      'https://github.com/ANGELLOPARR',
      'https://www.linkedin.com/in/angelloparr/',
      'about.html',
      'projects.html'];

  // Pick a random site to navigate to.
  const site = sites[Math.floor(Math.random() * sites.length)];

  // Change current location to new site.
  window.location.href = site;
}

/**
 * Gets comments from datastore and stores them in Comment objects.
 * Also updates the DOM with new comments.
 */
function getComments() {
  // Perform the fetch and store as promise
  var commentsPromise = fetch('/data');
  commentsPromise.then(response => response.json())
    .then((resJson) => {
      for (const comment of resJson) {
        commentData.push(new Comment(comment['username'],
                                     comment['comment'],
                                     comment['timestamp']));
      }
      updateDOMComments();
    })
}

/** 
 * Extracts only the text of the comments and translates them into the
 * desired language. This will update the commentData variable and the DOM.
 */
function translateComments() {
  var languageCode = document.getElementById('language').value;
  const params = new URLSearchParams();

  // Fill params with comments from variable
  for (const comment of commentData) {
    params.append('comments', comment.commentBody);
  }
  params.append('languageCode', languageCode);

  // Clear comments in current language
  container.innerText = 'loading...';

  translatedComments = fetch('/translate', {
    method: 'POST',
    body: params
  });

  translatedComments.then(response => response.json())
    .then(translated => {
      setNewComments(translated);
      updateDOMComments();
    });
}

/**
 * Given a list of strings representing the bodies of comments,
 * replaces comment bodies in the Comment classes in commentData
 * with these new ones.
 */
function setNewComments(comments) {
  if (comments.length != commentData.length) {
    console.log('New comments and old comments are not of same length');
    return;
  }

  for (var i = 0; i < comments.length; i++) {
    commentData[i].commentBody = comments[i];
  }
}

/**
 * Using the commentData variable, creates and populates the DOM with
 * structured HTML for comments */
function updateDOMComments() {
  container = document.getElementById('comments-container');
  container.innerText = '';
  commentData.forEach(comment => {
    container.appendChild(createComment(comment));
  })
}

/** Creates an <li> element containing text. */
function createListElement(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

/** Creates a <p> element containing text. */
function createParagraphElement(text) {
  const pElement = document.createElement('p');
  pElement.innerText = text;
  return pElement;
}

/** Creates a combination of HTML elements representing a comment */
function createComment(commentData) {

  // Create div for whole comment
  let commentWrapper = document.createElement('div');
  commentWrapper.classList.add('comment');

  // Create div for just the metadata (name and time/date)
  let commentMeta = document.createElement('div');
  commentMeta.classList.add('comment-metadata');

  // Create div for body of comment (can include anything else)
  // Allows us to add more stuff in the future
  let commentBody = document.createElement('div');
  commentBody.classList.add('comment-body');

  // Create paragraph elements for content
  let name = createParagraphElement(commentData.username);
  let body = createParagraphElement(commentData.commentBody);
  let timestamp = createParagraphElement(new Date(commentData.timestamp));

  // Assemble comment contents
  commentWrapper.appendChild(commentMeta);
  commentWrapper.appendChild(commentBody);
  commentMeta.appendChild(name);
  commentMeta.appendChild(timestamp);
  commentBody.appendChild(body);
  
  return commentWrapper;
}