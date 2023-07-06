const {
    CODE_ERROR,
    CODE_SUCCESS,
    CODE_TOKEN_EXPIRED
} = require('../utils/code-status')

class Result {
    constructor(data, msg = '操作成功', enMsg = 'Success', options) {
        // this.data = null
        // if (arguments.length === 0) {
        //     this.msg = '操作成功'
        //     this.enMsg = 'Success'
        // } else if (arguments.length === 1) {
        //     this.msg = data
        // } else {
        //     this.data = data
        //     this.msg = msg
        //     this.enMsg = enMsg
        //     if (options) {
        //         this.options = options
        //     }
        // }
        if (data) {
            this.data = data
        }
        this.msg = msg
        this.enMsg = enMsg
        if (options) {
            this.options = options
        }
    }

    createResult() {
        if (!this.code) {
            this.code = CODE_SUCCESS
        }
        let base = {
            code: this.code,
            msg: this.msg,
            enMsg: this.enMsg,            
        }
        if (this.data) {
            base.data = this.data
        }
        if (this.options) {
            base = { ...base, ...this.options }
        }
        return base
    }

    json(res) {
        // res.json(this.createResult())
        res.body = this.createResult()
    }

    success(res) {
        this.code = CODE_SUCCESS
        this.json(res)
    }

    fail(res) {
        this.code = CODE_ERROR
        this.json(res)
    }

    jwtError(res) {
        this.code = CODE_TOKEN_EXPIRED
        this.json(res)
    }
}

module.exports = Result
