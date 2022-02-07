package com.reactnativetweetembed;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.BufferedReader;

@ReactModule(name = TweetEmbedModule.NAME)
public class TweetEmbedModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TweetEmbed";
    private final String widgetURL = "https://platform.twitter.com/widgets.js";
    private String widgetJS = "";

    public TweetEmbedModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    private String readStream(BufferedReader br) {
        StringBuilder sb = new StringBuilder();
        try {
  
            String i = br.readLine();
    
            while(i != null && !i.equals("")){
                sb.append(i).append("\n");
                i = br.readLine();
            }
            br.close();
            return sb.toString();
        }catch(IOException e){
            return e.toString();
        }
      }
  
    @ReactMethod
    public void fetchWidgetJs(Promise p) {
        if(this.widgetJS.length() > 0){
            p.resolve(this.widgetJS);
        }
  
        try{
          URL url = new URL(widgetURL);
          HttpURLConnection connection = (HttpURLConnection) url.openConnection();
          BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf8"));
          String js = readStream(reader);
          this.widgetJS = js;
          p.resolve(this.widgetJS);
        }catch(Throwable e){
          p.reject(e);
        }
    }
}
