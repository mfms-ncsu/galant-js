import * as api from './API.js';

onmessage = function(message) {
    api.getNodes();
}