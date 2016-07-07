/**
 * @file Trie class
 * @author Jose E. Martinez <jootse.84@gmail.com>
 * @description A class that saves MQTT topics in a trie structure. The trie structure is represented by an Object which keys contains the topics levels. In addition, the topic levels with the key '$' as 'true' are the completed topics.
 * @see [Project info]{@link https://jootse84.github.io/notes/create-your-own-MQTT-broker.-part-1}
 * @see [Trie structure]{@link https://en.wikipedia.org/wiki/Trie}
 * @see [MQTT topic]{@link http://www.hivemq.com/blog/mqtt-essentials-part-5-mqtt-topics-best-practices}
 * @version 0.1
 */

export default class Trie {

    /**
     * @constructor
     */
    constructor () {
        this.trie = {}
    }

    /**
     * Save a new topic in the trie
     *
     * @params {String} topic The topic to be saved
     * @returns {Object} The value of the trie, after new topic saved
     */
    saveTopic (topic) {
        let ls = topic.split('\/').reverse()
        this.trie = this.rec(ls, ls.pop(), this.trie)
        return this.trie
    }

    /**
     * Get the current value of the trie
     *
     * @returns {Object} The current value of the trie
     */
    getTrie () {
        return this.trie
    }

    /**
     * Get the current value of the trie
     *
     * @params {Array} levels List of topic levels to be included
     * @params {String} actual Actual topic to be included in the trie
     * @returns {Object} The current value of the trie
     */
    rec (levels, actual, trie) {

        // '#'. Every sublevel topic from the actual trie is a completed topic 
        if (levels.length === 0 && actual === '#') {
            for (let key in trie) {
                if (key !== '$') {
                    trie[key] = this.rec(levels, '#', trie[key])
                }
            }
            trie['$'] = true
            return trie
        }

        // It is a completed topic, add it on the trie
        if (levels.length === 0) {
            if (!(actual in trie)) {
                trie[actual] = { '$': true }
            } else {
                trie['$'] = true
            }
            return trie
        }

        // Not finished yet, treat next topic level
        let node = trie
        let level = levels.pop()

        switch (actual) {
        // '+'. All topics in the actual level are included
        case '+':
            for (let key in node) {
                if (key !== '$') {
                    node[key] = this.rec(levels, level, trie[key])
                }
            }
            break;
        default:
            trie = (actual in trie) ? trie[actual] : {}
            node[actual] = this.rec(levels, level, trie)
        }
        return node
    }
}
