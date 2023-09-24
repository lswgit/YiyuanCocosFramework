// ProtocolManager.ts

class ProtocolManager {
    private static instance: ProtocolManager;

    private constructor() {
        // 私有构造函数，确保只有一个实例
    }

    public static getInstance(): ProtocolManager {
        if (!ProtocolManager.instance) {
            ProtocolManager.instance = new ProtocolManager();
        }
        return ProtocolManager.instance;
    }

    // 添加发送协议的方法
    public sendProtocolToServer(protocol: string, data: any) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://192.168.0.160:82/", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // 协议发送成功，接收服务器响应
                const response = JSON.parse(xhr.responseText);
                this.handleServerResponse(protocol, response);
            }
        }.bind(this);
        const requestData = { protocol, data };
        xhr.send(JSON.stringify(requestData));
    }

    // 添加处理服务器响应的方法
    private handleServerResponse(protocol: string, response: any) {
        if (protocol === "playerMove") {
            // 处理玩家移动协议
            console.log(`Received playerMove protocol response: ${JSON.stringify(response)}`);
            // 处理协议逻辑
        } else if (protocol === "enemyAttack") {
            // 处理敌人攻击协议
            console.log(`Received enemyAttack protocol response: ${JSON.stringify(response)}`);
            // 处理协议逻辑
        }
    }
}

export default ProtocolManager;
