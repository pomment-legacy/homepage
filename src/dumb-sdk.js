class DumbSDK {
    constructor() {
        this._count = 4;
        const dateA = new Date();
        dateA.setTime(dateA.getTime() - 10 * 60 * 60 * 1000);
        const dateB = new Date();
        dateB.setTime(dateB.getTime() - 5 * 60 * 60 * 1000);
        const dateC = new Date();
        dateC.setTime(dateC.getTime() - 3 * 60 * 60 * 1000);
        const dateD = new Date();
        dateD.setTime(dateD.getTime() - 0.5 * 60 * 60 * 1000);
        this._commentList = [
            {
                id: 1,
                name: 'tcdw',
                emailHashed: '70ae2023afad30dae905344325cece8f',
                website: 'https://www.tcdw.net',
                content: '好耶，Pomment 启动了。',
                parent: -1,
                createdAt: dateA,
                byAdmin: false,
            },
            {
                id: 2,
                name: 'Akarin',
                content: '还行（',
                parent: 1,
                createdAt: dateB,
                byAdmin: false,
            },
            {
                id: 3,
                name: 'tcdw',
                emailHashed: '70ae2023afad30dae905344325cece8f',
                website: 'https://www.tcdw.net',
                content: 'Pomment 是一款能用的评论系统',
                parent: 2,
                createdAt: dateA,
                byAdmin: false,
            },
            {
                id: 4,
                name: 'Alice',
                content: '纯文本限定',
                parent: -1,
                createdAt: dateD,
                byAdmin: false,
            },
        ];
    }

    async listComments() {
        return {
            url: '',
            locked: false,
            content: this._commentList,
        };
    }

    submitComment({
        parent = -1,
        name,
        email,
        website,
        content,
    }) {
        return new Promise((res) => {
            setTimeout(() => {
                this._count += 1;
                const result = {
                    id: this._count,
                    name: name.trim() === '' ? null : name,
                    email,
                    website,
                    content,
                    parent,
                    createdAt: new Date(),
                    byAdmin: false,
                };
                res(result);
            }, 500);
        });
    }
}

export default DumbSDK;
