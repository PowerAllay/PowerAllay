export class Internet {
    static async getIP(): Promise<string | null> {
        return new Promise((resolve) => {
            fetch('https://api.ipify.org/?format=json')
                .then((response) => response.json())
                .then((data) => {
                    if (data !== null) {
                        resolve(data.ip);
                    }
                })
                .catch(() => {
                    resolve(null);
                });
        });
    }
}
