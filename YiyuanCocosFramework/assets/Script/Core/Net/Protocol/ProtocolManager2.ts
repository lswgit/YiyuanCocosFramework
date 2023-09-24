// ProtocolManager2.ts

type ProtocolHandler = (data: any) => void;

class ProtocolManager2 {
    private static instance: ProtocolManager2;

    private protocolHandlers: Map<string, ProtocolHandler> = new Map();

    private constructor() {
        // 私有构造函数，确保只有一个实例
    }

    public static getInstance(): ProtocolManager2 {
        if (!ProtocolManager2.instance) {
            ProtocolManager2.instance = new ProtocolManager2();
        }
        return ProtocolManager2.instance;
    }

    // 注册协议处理函数
    public registerProtocolHandler(protocol: string, handler: ProtocolHandler) {
        this.protocolHandlers.set(protocol, handler);
    }

    // 发送协议到服务器
    public sendProtocolToServer(protocol: string, data: any) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://192.168.0.160:82/", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 协议发送成功，接收服务器响应
                const response = JSON.parse(xhr.responseText);
                this.handleServerResponse(protocol, response);
            }
        };
        const requestData = { protocol, data };
        xhr.send(JSON.stringify(requestData));
    }

    // 处理服务器响应
    private handleServerResponse(protocol: string, response: any) {
        const handler = this.protocolHandlers.get(protocol);
        if (handler) {
            // 调用注册的协议处理函数
            handler(response);
        }
    }
}

export default ProtocolManager2;
