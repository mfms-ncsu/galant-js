/**
 * This code initializes and manages a service worker for a web application. 
 * t defines a static cache name and pre-caches essential assets during installation. 
 * The service worker activates by cleaning up old caches upon activation and responds to messages, 
 * particularly for immediate activation requests. It employs cache management functions to prioritize 
 * cached responses over network requests and to cache fetched resources selectively.
 * This setup ensures efficient offline support and optimized resource handling, 
 * enhancing the application's performance and reliability.
 * @author Christina Albores
 */

function log(...data) {
    console.log("SWv1.0", ...data);
  }
  
  log("SW Script executing");
  
  
  const STATIC_CACHE_NAME = 'galant-js-v2';
  
  self.addEventListener('install', event => {
    log('install', event);
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
            //Public
            './offline',
            './index',
            './humans.txt',
            //Collections
            './collection/algorithms/bfs.js',
            './collection/algorithms/dfs.js',
            './collection/algorithms/dijkstra.js',
            './collection/algorithms/kruskal.js',
            './collection/algorithms/shortest_path.js',
            './collection/graphs/dual_16.gph',
            './collection/graphs/map.txt',
            './collection/graphs/rand_7.txt',
            './collection/graphs/small.txt',
            './collection/graphs/unweighted_10.txt',
            './collection/graphs/valid_graph_ncsu.txt',
            './collection/graphs/weighted_6.txt',
            './collection/graphs/weighted_7,txt',
            //CSS
            './offline-style.css',
            //Images
            './apple-touch-icon.png',
            './favicon-16x16.png',
            './favicon-32x32.png',
            './favicon.ico',
            './img/galant_full_logo_without_words.svg',
            './img/galant_full_logo.svg',
            './img/github-mark.png',
            './img/left_arrow.svg',
            './img/old_left_arrow.svg',
          './img/old_right_arrow.svg',
          './img/right_arrow.svg',
          //src
          //    -> Algorithm
          '../src/components/Editor/EditorGroup.jsx',
          '../src/components/Editor/EditorOverlay.jsx',
          '../src/components/Editor/TabList.jsx',
          '../src/components/Editor/TabUtils.jsx',
          '../src/pages/AlgorithmEditor/Algorithm.scss',
          //      -> AlgorithmConsole
          '../src/frontend/Algorithm/AlgorithmConsole/AlgorithmConsole.jsx',
          '../src/frontend/Algorithm/AlgorithmConsole/AlgorithmConsole.scss',
          //      -> AlgorithmControls
          '../src/pages/GraphView/GraphOverlay/AlgorithmControls/AlgorithmControls.jsx',
         
          //      -> AlgorithmInput
          '../src/pages/AlgorithmEditor/AlgorithmInput.jsx',
          '../src/pages/AlgorithmEditor/AlgorithmInput.scss',
          '../src/pages/AlgorithmEditor/index.jsx',
          //    -> Collection
          '../src/frontend/Collection/Collection.jsx',
          '../src/frontend/Collection/Collection.scss',
          //    -> Graph
          '../src/pages/GraphEditor/index.jsx',
          //      -> GraphInput
          '../src/frontend/Graph/GraphInput/GraphInput.jsx',
          '../src/frontend/Graph/GraphInput/GraphInput.scss',
          //      -> GraphViewer
          '../src/pages/GraphView/GraphOverlay/GraphControls/Components/ControlSettingsPopover.jsx',
          '../src/pages/GraphView/GraphOverlay/GraphControls/Components/EdgeSettingsPopover.jsx',
          '../src/pages/GraphView/GraphOverlay/GraphControls/Components/NodeSettingsPopover.jsx',
          '../src/pages/GraphView/GraphOverlay/GraphControls/Components/PrefencesPopover.jsx',
          '../src/pages/GraphView/GraphOverlay/GraphControls/GraphControlsComponent.jsx',
          '../src/pages/GraphView/GraphOverlay/Prompts/AlgorithmErrorPrompt.jsx',
          '../src/pages/GraphView/GraphOverlay/Prompts/InputPrompt.jsx',
          '../src/pages/GraphView/GraphOverlay/Prompts/PromptComponent.jsx',
          '../src/pages/GraphView/GraphOverlay/GraphOverlay.jsx',
          '../src/pages/GraphView/CytoscapeComponent.jsx',
          '../src/pages/GraphView/HeaderComponent.jsx',
          '../src/pages/GraphView/index.jsx',
          '../src/frontend/Graph/GraphViewer/GraphViewer.scss',
          // graph view utils
          '../src/pages/GraphView/utils/AlgorithmContext.js',
          '../src/pages/GraphView/utils/CytoscapeLayout.js',
          '../src/pages/GraphView/utils/CytoscapeStylesheet.js',
          '../src/pages/GraphView/utils/GraphContext.js',
          '../src/pages/GraphView/utils/PredicateConverter.js',
          '../src/pages/GraphView/utils/PromptService.js',
          //collection
          '../src/pages/Other/Collection.jsx',
          '../src/pages/Other/Collection.scss',
          //predicate/file etc
          '../src/utils/FileToPredicate.js',
          '../src/utils/Graph.js',
          '../src/utils/Predicates.js',
          '../src/utils/PredicateToFile.js',
          // Algorithm + Thread
          '../src/utils/Algorithm/AlgorithmHandler.js',
          '../src/utils/Algorithm/StepHandler.js',
          '../src/utils/Algorithm/Thread/Thread.js',
          '../src/utils/Algorithm/Thread/ThreadHandler.js',
          '../src/utils/Algorithm/Thread/ThreadHandlerDemo.js',

          '../src/index.js',
          '../src/index.css',
          //External Resources
          'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js'
        ]);
      })
    );
  });
    
  self.addEventListener('activate', event => {
    // Log the 'activate' event and associated data for debugging purposes
    log('activate', event);
    // Extend the activation process until all caches are cleaned up
    event.waitUntil(
      // Retrieve all cache storage keys
      caches.keys().then(cacheNames => {
        // Delete caches that match specific criteria
        return Promise.all(
          cacheNames.filter(cacheName => {
            // Filter cache names to find those starting with 'galant-js-v2-' but not equal to STATIC_CACHE_NAME
            return cacheName.startsWith('galant-js-v2-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            // Delete each cache that matches the criteria
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
    
  // Function to respond with cached data first, and then fetch from network if not available
  function cacheFirst(request) {
    return caches.match(request)
      .then(response => {
        // Return a response if we have one cached. Otherwise, get from the network
        return response || fetchAndCache(request);
      })
      .catch(error => {
        // If an error occurs while fetching from cache, respond with offline page
        return caches.match('/offline');
      })
  }

  // Function to fetch data from network and cache it
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
      // Cache everything except login pages
      if(response.ok && !requestUrl.pathname.startsWith('/login')) {
        caches.open(STATIC_CACHE_NAME).then(cache => {
          cache.put(request, response);
        });
      }
      // Return a clone of the response to keep the original response available for the browser
      return response.clone();
    });
  }

    
  // Event listener for messages sent to the service worker
  self.addEventListener('message', event => {
    // Log the received message for debugging purposes
    log('message', event.data);
    // If the message indicates to skip waiting, proceed to activate the service worker immediately
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
