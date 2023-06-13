if(navigator.serviceWorker){
    navigator.serviceWorker.register('sw.js')
    .then((registrationObj) => {

        // already a registered service worker service worker
        if(!navigator.serviceWorker.controller){
            return;
        }

        // updated SW is waiting, display message
        if(registrationObj.waiting){
            updateServiceWorker(registrationObj.waiting)
        }

        // updated SW is installing, wait for it to install and display message
        if(registrationObj.installing){
            trackInstalling(registrationObj.installing);
            return;
        }

        // listen for new SW incoming
        registrationObj.addEventListener("updatefound", function(){
            trackInstalling(registrationObj.installing)
        })

        navigator.serviceWorker.addEventListener("controllerchange", () => {
            window.location.reload();
        })

        console.log('[Service Worker] Registration Successfull!');
    })
    .catch((error) => {
        console.error('[Service Worker] Registration Failed!', error);
    })
}

function trackInstalling(serviceWorker){
    serviceWorker.addEventListener("statechange", function(){
        if(registrationObj.installing.state === "installed"){
            updateServiceWorker(registrationObj.installing);
        }
    })
}

function updateServiceWorker(serviceWorker){
    console.log('[Service Worker] New SW Found, please update...')
    const div = document.getElementById("sw__message");
    div.style.display = 'flex';
    
    document.getElementById("sw__button").addEventListener("click", (event) => {
        console.log('[Service Worker] Updating...')
        serviceWorker.postMessage({
            action: 'skipWaiting'
        });

        div.style.display = "none"
    })
}