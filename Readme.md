# Progressive Web Applications

<p>

Progressive Web Applications are web apps that are made with offline first approach with the help of manifest.json files(Metadata about the app), Service Workers(Run parellel to the main thread and have no access to DOM but can intercept requests made by the page), and IndexDB API(In browser data store).

</p>

## Offline first techniques
- Deliver the page content/headers from cache and then update cache over network.
- Deliver the page headers from cache and then fetch content from network request


## Service Workers

<p> 

Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests and take appropriate action based on whether the network is available, and update assets residing on the server. They will also allow access to push notifications and background sync APIs.

</p>

### Download, install and activate

<p>

At this point, your service worker will observe the following lifecycle:

1. Download
2. Install
3. Activate

The service worker is immediately downloaded when a user first accesses a service worker–controlled site/page.

After that, it is updated when:

A navigation to an in-scope page occurs.
An event is fired on the service worker and it hasn't been downloaded in the last 24 hours.
Installation is attempted when the downloaded file is found to be new — either different to an existing service worker (byte-wise compared), or the first service worker encountered for this page/site.

If this is the first time a service worker has been made available, installation is attempted, then after a successful installation, it is activated.

If there is an existing service worker available, the new version is installed in the background, but not yet activated — at this point it is called the worker in waiting. It is only activated when there are no longer any pages loaded that are still using the old service worker. As soon as there are no more pages to be loaded, the new service worker activates (becoming the active worker). Activation can happen sooner using `ServiceWorkerGlobalScope.skipWaiting()` and existing pages can be claimed by the active worker using `Clients.claim()`.

You can listen for the install event; a standard action is to prepare your service worker for usage when this fires, for example by creating a cache using the built in storage API, and placing assets inside it that you'll want for running your app offline.

There is also an activate event. The point where this event fires is generally a good time to clean up old caches and other things associated with the previous version of your service worker.

Your service worker can respond to requests using the FetchEvent event. You can modify the response to these requests in any way you want, using the `FetchEvent.respondWith()` method.

Note: Because install/activate events could take a while to complete, the service worker spec provides a waitUntil() method. Once it is called on install or activate events with a promise, functional events such as fetch and push will wait until the promise is successfully resolved.

</p>