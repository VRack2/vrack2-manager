class Utility {
    ruleObject(object){
        const result = {}
        for (const name in object){
            result[name] = this.getRuleValue(object[name])
        }
        return result
    }
    /**
     * 
     * 
     * @param {Object} rule 
     * @param {string} rule.type 
     * @param {boolean} rule.require
     * @param {string} rule.description
    */
    getRuleValue (rule){
        let res = undefined
        switch (rule.type){
            case 'string': 
            case 'boolean':
            case 'number':
            case 'any':
                return this.getDefaultValue(rule)
            case 'array':
                res = []
                for (const sRule of rule.rules) if (sRule.name === 'contain') res.push(this.getRuleValue(sRule.args))
                return res
            case 'object': 
                res = {}
                for (const sRule of rule.rules) if (sRule.name === 'fields') for (const nn in sRule.args) res[nn] = this.getRuleValue(sRule.args[nn])
                return res
        }
    }

    /**
     * 
     * 
     * @param {Object} rule 
     * @param {string} rule.type 
     * @param {boolean} rule.require
     * @param {string} rule.description
    */
    getDefaultValue(rule){
        if (rule.default !== undefined) return rule.default
        if (rule.example !== undefined) return rule.example
        switch (rule.type){
            case 'string': 
                return ''
            case 'boolean':
                return false
            case 'number':
                return 0
            case 'any':
                return 'any'
        }
        return ''
    }
}

exports.Utility = new Utility()