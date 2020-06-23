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
      comments = resJson;
      updateDOMComments();
    })
}

function translateComments() {
  var languageCode = document.getElementById('language').value;
  const params = new URLSearchParams();

  // Fill params with comments from variable
  for (const comment of comments) {
    params.append('comments', comment);
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
      comments = translated;
      updateDOMComments();
    });
}

function updateDOMComments() {
  container = document.getElementById('comments-container');
  container.innerText = '';
  comments.forEach(comment => {
    container.appendChild(createParagraphElement(comment));
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