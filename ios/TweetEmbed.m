#import "TweetEmbed.h"

@implementation TweetEmbed

NSString * widgetJs = nil;

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(fetchWidgetJs,
                 fetchWidgetJsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter: (RCTPromiseRejectBlock)reject)
{
  if(widgetJs == nil){
    NSURL * widgetURL = [NSURL URLWithString:@"https://platform.twitter.com/widgets.js"];
    NSMutableURLRequest * twitterwidgetJsRequest = [NSMutableURLRequest requestWithURL: widgetURL];
    NSURLSession * session = [NSURLSession sharedSession];
    NSURLSessionDataTask * task = [session dataTaskWithRequest:twitterwidgetJsRequest
                                             completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
      if(error != nil){
        reject(@"something_broke", @"error", error);
      }else if(data != nil){
        NSString * js = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        widgetJs = js;
        resolve(widgetJs);
      }
    }
                                   ];
    [task resume];
  }else{
    resolve(widgetJs);
  }
}

@end
