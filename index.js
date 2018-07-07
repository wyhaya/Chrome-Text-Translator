

(() => {

    'use strict'

    const appid = '20170922000084556'
    const key = '1SdPnR8gm19e1L_4asM0'

    let timer = null

    document.onkeyup = e => {

        (e.key === 'q' || e.key === 'Q') && (() => {

            let text = window.getSelection().toString()

            if (!text) {
                return
            }

            const old = document.getElementsByTagName('translator')
            !!old.length && old[0].parentNode.removeChild(old[0])

            const translator = document.createElement('translator')
            document.body.appendChild(translator)

            translator.innerHTML = 'loading...'

            window.clearTimeout(timer)

            const timeoutRemove = (function init(){
                timer = setTimeout(() => 
                    translator.parentNode.removeChild(translator)
                , 3000)
                return init
            })()

            translator.addEventListener('mouseover', () => window.clearTimeout(timer))
        
            translator.addEventListener('mouseout', timeoutRemove)

            queryText(text).then(data => {

                if (data.trans_result) {
                    translator.innerHTML = data.trans_result.map(item => {
                        return item.dst.replace(/(^\s*)/g, '')
                    }).join('\n')
                } else {
                    translator.innerHTML = '翻译失败'
                }

            })

        })()

    }

    function queryText(query) {

        let salt = Date.now().toString()
        let isEnglish = /^[A-Za-z]+$/.test(
            query.replace(/\s*/, '')
                .charAt(0)
        )

        let data = {
            q: query.split('\n').join('%0A'),
            from: isEnglish ? 'en' : 'zh',
            to: isEnglish ? 'zh' : 'en',
            appid: appid,
            salt: salt,
            sign: md5(appid + query + salt + key)
        }

        let url = 'https://fanyi-api.baidu.com/api/trans/vip/translate?'
            +
            Object.keys(data).map(key => {
                return key + '=' + data[key] + '&'
            }).join('')

        return fetch(url).then(res => {
            return res.json()
        })

    }


})()

