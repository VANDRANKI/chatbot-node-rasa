const axios = require('axios');
const Entity = require('../entity.js');
const Intent = require('../intent.js');

const rasaModelName = 'my-model';

exports.parse = async function parse(message) {
    try {
        console.log("Rasa Parse, message: " + message);
        const response = await axios.post('http://localhost:3100/parse', {
            model: rasaModelName,
            q: message
        });
        console.log('rasa: response - ', response && response.status);
        return {
            intent: extractIntent(response.data),
            entities: extractEntities(response.data)
        };
    } catch (error) {
        console.error('Error parsing message:', error);
        throw new Error('Failed to parse message');
    }
};

function extractIntent(body) {
    return body.intent ? new Intent(body.intent.name) : null;
}

function extractEntities(body) {
    return (body.entities || []).map(entity => new Entity(entity.entity, entity.value));
}
