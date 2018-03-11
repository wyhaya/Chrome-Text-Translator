

(() => {

    'use strict'

    const appid = '20170922000084556'
    const key = '1SdPnR8gm19e1L_4asM0'

    let timer = null

    let translator = document.createElement('div')
    translator.id = 'translator_alert'
    document.body.appendChild(translator)


    translator.addEventListener('mouseover', () => {
        window.clearTimeout(timer)
    })

    translator.addEventListener('mouseout', setRemove)


    function setRemove() {
        timer = setTimeout(() => {
            translator.style.display = ''
        }, 3000)
    }


    // 监听键盘事件
    document.onkeyup = e => {

        (e.key === 'q' || e.key === 'Q') && (() => {

            let text = window.getSelection().toString()

            if (!text) {
                return
            }

            translator.style.display = 'block'
            translator.innerHTML = 'loading...'

            window.clearTimeout(timer)
            setRemove()

            // 查询
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

    // 翻译
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

