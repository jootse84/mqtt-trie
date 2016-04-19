export default class Trie {

    constructor (trie) {
        this.trie = trie
    }
    
    addTopic (topic) {
        let ls = topic.split('\/').reverse()
        this.trie = this.rec(ls, ls.pop(), this.trie)
    }
    
    print () {
        console.log(this.trie)
    }
    
    rec (levels, actual, trie) {

        if (levels.length === 0 && actual === '#') {
            for (let key in trie) {
                if (key !== '$') {
                     trie[key] = this.rec(levels, '#', trie[key])
                }
            }
            trie['$'] = true
            return trie
        }
    
        if (levels.length === 0) {
            if (!(actual in trie)) {
                trie[actual] = { '$': true }
            } else {
                trie['$'] = true
            }
            return trie
        }

        let node = trie
        let level = levels.pop()
        switch (actual) {
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
