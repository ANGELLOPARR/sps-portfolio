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
  public void init() {
    comments = new ArrayList<String>();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Gson gson = new Gson();
    
    String json = gson.toJson(comments);

    response.setContentType("application/json");
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get data for comment
    String newComment = getParameter(request, "comment-body", "");
    long timestamp = System.currentTimeMillis();

    // Get datastore instance
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
    // Store comment in datastore
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("body", newComment);
    commentEntity.setProperty("timestamp", timestamp);

    // Store in datastore
    // (and add to comments array because I am not at the load data part yet)
    datastore.put(commentEntity);
    comments.add(newComment);

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
