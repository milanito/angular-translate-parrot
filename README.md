# angular-translate-parrot

This is a custom loader for angular translate with [parrot](http://anthonynsimon.com/parrot.github.io/) backend

> **Warning :** This has only been tested in specific cases and might not suit everyone, do not hesitate to make a PR :)

## Usage

Install it using yarn or npm :

    $ yarn add angular-translate-loader-parrot
    $ npm install angular-translate-loader-parrot --save

Then in your angular project :

    ...
    import angularTranslateLoaderParrot from 'angular-translate-loader-parrot';

    angular.module('yourApp', [ ..., angularTranslateLoaderParrot ])
    ...
    .config(($translateProvider) => {
      ...
      $translateProvider.use('translateParrotLoader', options);
      ...
    })
    ...

## Options

The options are :

```
{
  // url to the Parrot server
  url: 'https://translate.parrot.com',

  // The client id
  client_id: 'client_id',

  // The client secret
  client_secret: 'client_secret',

  // The project id
  project_id: 'project id in parror',
}
```

## Misc

- To make it run you have to create a new project in Parrot and add a client to it.
- If you are using an interceptor, there is an option, `skipAuthorization` to the request options, use it so you won't erase the `Authorization` header
- The token is saved to the local storage, so it's not fetch each time

## License

MIT
