package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/translate")
public class TranslationServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Gson gson = new Gson();
    String[] comments;
    String languageCode = request.getParameter("languageCode");
    Translate translate = TranslateOptions.getDefaultInstance().getService();

    comments = request.getParameterValues("comments");

    // Translate and store each comment.
    for (int i = 0; i < comments.length; i++) {
      Translation translation =
        translate.translate(comments[i], Translate.TranslateOption.targetLanguage(languageCode));
      String translatedText = translation.getTranslatedText();
      comments[i] = translatedText;
    }

    // Output the translation.
    String json = gson.toJson(comments);
    response.setContentType("application/json");
    response.getWriter().println(json);
  }

  private String[] translateComments(String[] comments, String code) {
    
  }

}