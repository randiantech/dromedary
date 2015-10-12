<img src="https://raw.githubusercontent.com/randiantech/dromedary/master/docs/dromedary_logo.png" width="200">

# Dromedary

!Note: Dromedary is in experimental state, and by no means its ready for production use. We'll let you know once Dromedary is ready to go!

Let's put it simple: Dromedary is a command line tool that allows you to create integration services without writing a single line of code.
How's that? Once you install Dromedary running

```bash
$ sudo npm install -g dromedary
```

you will be able to fire up and Express App conveniently decorated with the information provided in a JSON configuration file:


<img src="https://raw.githubusercontent.com/randiantech/dromedary/master/docs/dromedary_diag1.png">


<img src="https://33.media.tumblr.com/303a1e93a2fc8535e78adc88759794f9/tumblr_nuwn12D2FN1u60o27o1_250.gif">


Ok, thing is quite simple: Dromedary File is a JSON file that describes each route of the application, and the ordered list of plugins that needs to be executed. Check this Dromedary configuration file:


```json
{
  "env": {
    "port": 3444
  },
  "routes": {
    "/person": {
      "method": "GET",
      "flow": {
        "Set foo_header": {
          "pluginName":"set_request_header",
          "header": {
            "foo_header": "value"
          }
        },
        "Set bar_header": {
          "pluginName":"set_request_header",
          "header": {
            "bar_header": "other value"
          }
        },
        "Set foobar header in response": {
          "pluginName":"set_response_header",
          "header": {
            "foobar_header": "valueResponse"
          }
        },
        "call posts service and save data in jhr variable": {
          "pluginName":"http",
          "uri": "http://jsonplaceholder.typicode.com/posts",
          "method": "GET",
          "timeout": 15000,
          "data":"jhr"
        },
        "get jhr variable and set values in response body":{
          "pluginName":"set_response_body",
          "data":"jhr"
        }
      }
    }
  }
}
```

As you can see, theres one route defined, '/person', and the execution flow: 

First, executes step "Set foo_header", that uses plugin "set_request_header". This plugin expects a header key containing the value of the header to be set. Basically: 


```json
"header": {
  "foo_header": "value"
}
```

So it will be added foo_header header with value "value" to request.
After that it will execute next step, "Set bar_header".
Every plugin will consume configuration from this file, and required configuration for each plugin is different. In example, in last step, it being used "set_response_body" that requires a "data" configuration field that specifies the variable that holds the data that will be placed in response body (variable 'jhr' in fact is set in previous step).
Every plugin describes in its documentation the required configuration.

All this steps simply decorate the Express middleware.


# Available plugins

A complete list of plugins:



!Note: Dromedary is in experimental state, and by no means its ready for production use. We'll let you know once Dromedary is ready to go!

