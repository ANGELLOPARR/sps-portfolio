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

function getComments() {
  // Perform the fetch and store as promise
  var commentsPromise = fetch('/data');
  commentsPromise.then(response => response.json())
    .then((resJson) => {
      commentData = resJson;
      updateDOMComments();
    })
}

function translateComments() {
  var languageCode = document.getElementById('language').value;
  const params = new URLSearchParams();

  // Fill params with comments from variable
  for (const comment of commentData) {
    params.append('comments', comment['comment']);
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

/** Given a list of strings representing the bodies of comments,
 * replaces the old comment texts with the new given ones. */
function setNewComments(comments) {
  if (comments.length != commentData.length) {
    console.log('New comments and old comments are not of same length');
    return;
  }

  for (var i = 0; i < comments.length; i++) {
    commentData[i]['comment'] = comments[i];
  }
}

/** Using the commentData variable, creates and populates the DOM with
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
  let name = createParagraphElement(commentData['username']);
  let body = createParagraphElement(commentData['comment']);
  let timestamp = createParagraphElement(new Date(commentData['timestamp']));

  // Assemble comment contents
  commentWrapper.appendChild(commentMeta);
  commentWrapper.appendChild(commentBody);
  commentMeta.appendChild(name);
  commentMeta.appendChild(timestamp);
  commentBody.appendChild(body);
  
  return commentWrapper;
}