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

package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private ArrayList<String> comments;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Arrange needed variables
    Gson gson = new Gson();
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    comments = new ArrayList<String>();

    // Query Datastore for comments
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery results = datastore.prepare(query);

    // Add all comments to array
    for (Entity entity : results.asIterable()) {
      String comment = (String) entity.getProperty("body");
      comments.add(comment);
    }
    
    String json = gson.toJson(comments);
    response.setContentType("application/json");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get data of comment
    String newComment = getParameter(request, "comment-body", "");
    long timestamp = System.currentTimeMillis();

    // Get datastore instance
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
    // Build commentEntity
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("body", newComment);
    commentEntity.setProperty("timestamp", timestamp);

    // Store in datastore
    datastore.put(commentEntity);

    response.sendRedirect("/index.html");
  }

  // Attempts to grab the value from a key-value pair in the request.
  public String getParameter(HttpServletRequest req, String key, String defaultVal) {
      String value = req.getParameter(key);

      // Protect against adding null to our comments array.
      if (value == null) {
          return defaultVal;
      }
      return value;
  }
}
