enum ESocketState {
    None = 0,
    Connecting = 1,
    Connected = 2
}

export default class Socket {
    //webSocket
    private socket: WebSocket = null;
    //状态
    private state: number = ESocketState.None;
    //连接已建立回调
    public onOpen: () => void = null;
    //链接已关闭回调
    public onClose: (ev: CloseEvent) => void = null;
    //接收到数据回调
    public onMessage: (data: string | Uint8Array) => void = null;
    //WebSocket错误回调
    public onError: (ev: Event) => void = null;

    /**
     * 连接
     * @param url socket地址
     */
    public connect(url: string): void {
        if (this.state == ESocketState.None) {
            this.state = ESocketState.Connecting;

            cc.log(`socket connect:(${url})`);
            this.socket = new WebSocket(url);
            this.bindEvent();
        }
    }

    /**
     * 绑定WebSocket事件
     */
    private bindEvent(): void {
        this.socket.onopen = () => {
            this.state = ESocketState.Connected;
            cc.log(`socket onopen`);
            this.onOpen && this.onOpen();
        };
        this.socket.onclose = (ev: CloseEvent) => {
            cc.log(`socket onclose code:(${ev.code})`);
            this.state = ESocketState.None;
            this.onClose && this.onClose(ev);
        };
        this.socket.onerror = (e: Event) => {
            cc.log(`socket onerror`);
            this.state = ESocketState.None;
            this.onError && this.onError(e);
        };
        this.socket.onmessage = (e: MessageEvent) => {
            if (this.onMessage) {
                console.log("收到消息：" + e.data);
                this.onMessage(e.data);
            }
        };
    }

    /**
     * 往WebSocket发送数据
     * @param data 
     * @returns 
     */
    public send(data: string | ArrayBuffer): void {
        if (this.state != ESocketState.Connected) {
            cc.log(`socket not connect`);
            return;
        }
        console.log("发送消息：" + data);
        this.socket.send(data);
    }

    /**
     * 关闭WebSocket
     */
    public close(): void {
        if (this.state != ESocketState.Connected) {
            return;
        }
        cc.log(`socket close`);
        this.socket.close();
    }
}