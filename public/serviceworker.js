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
            './collection/algorithms/bff.js',
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

          //->backend
          '../src/backend/FileToPredicate.js',
          '../src/backend/PredicateConverter.js',
          //    -> Algorithm
          '../src/backend/Algorithm/AlgorithmHandler.js',
          '../src/backend/Algorithm/StepHandler.js',
          //        -> Thread
          '../src/backend/Algorithm/Thread/Thread.js',
          '../src/backend/Algorithm/Thread/ThreadHandler.js',
          '../src/backend/Algorithm/Thread/ThreadHandlerDemo.js',
          //    -> Graph
          '../src/backend/Graph/Graph.js',
          '../src/backend/Graph/PredicateConverter.js',

          //->frontend
          '../src/frontend/App.jsx',
          '../src/frontend/App.scss',
          '../src/frontend/GraphContext.jsx',
          //    -> Algorithm
          '../src/frontend/Algorithm/Algorithm.jsx',
          '../src/frontend/AlgorithmInput/Algorithm.scss',
          //      -> AlgorithmConsole
          '../src/frontend/Algorithm/AlgorithmConsole/AlgorithmConsole.jsx',
          '../src/frontend/Algorithm/AlgorithmConsole/AlgorithmConsole.scss',
          //      -> AlgorithmControls
          '../src/frontend/Algorithm/AlgorithmControls/AlgorithmControls.jsx',
          '../src/frontend/Algorithm/AlgorithmControls/AlgorithmControls.scss',
          //      -> AlgorithmInput
          '../src/frontend/Algorithm/AlgorithmInput/AlgorithmInput.jsx',
          '../src/frontend/Algorithm/AlgorithmInput/AlgorithmInput.scss',
          //    -> Collection
          '../src/frontend/Collection/Collection.jsx',
          '../src/frontend/Collection/Collection.scss',
          //    -> Graph
          '../src/frontend/Graph/Graph.jsx',
          '../src/frontend/Graph/Graph.scss',
          //      -> GraphInput
          '../src/frontend/Graph/GraphInput/GraphInput.jsx',
          '../src/frontend/Graph/GraphInput/GraphInput.scss',
          //      -> GraphViewer
          '../src/frontend/Graph/GraphViewer/GraphViewer.jsx',
          '../src/frontend/Graph/GraphViewer/GraphViewer.scss',
          //    -> Navbar
          '../src/frontend/Navbar/Navbar.jsx',
          '../src/frontend/Navbar/Navbar.scss',
          //Scripts
          '../src/index.js',
          //External Resources
          'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
          'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js'
        ]);
      })
    );
  });
    
  self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('galant-js-v2-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
    
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
    //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
    
    
    
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      var requestUrl = new URL(request.url);
    //Cache everything except login
      if(response.ok && !requestUrl.pathname.startsWith('/login')) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
    
    
    
  self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
    
    
