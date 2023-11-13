/**
 * Represents an actionable data entity within a message received by the Chatbot.
 * An Entity encapsulates specific information such as its type and associated value,
 * enabling the Chatbot to extract and process meaningful data for appropriate actions.
 *
 * @class Entity
 * @param {string} type - The type of the entity, indicating the category or nature of the information.
 * @param {any} value - The value associated with the entity, providing the specific data for actionable tasks.
 * @example
 * const userEntity = new Entity('username', 'JohnDoe');
 * chatbot.processEntity(userEntity); // Performs actions based on the user's username.
 */
function Entity(type, value) {
    this.type = type;
    this.value = value;
}

module.exports = Entity;
