const { ccclass, property } = cc._decorator;

@ccclass
export default class NoProtocolManager extends cc.Component {

    start() {
        // 发送玩家移动协议到服务器
        const playerMoveData = { x: 100, y: 200 };
        sendProtocolToServer("playerMove", playerMoveData);

        // 发送敌人攻击协议到服务器
        const enemyAttackData = { damage: 20 };
        sendProtocolToServer("enemyAttack", enemyAttackData);
    }
}

// 发送协议到服务器
function sendProtocolToServer(protocol: string, data: any) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://192.168.0.160:82/", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 协议发送成功，接收服务器响应
            const response = JSON.parse(xhr.responseText);
            handleServerResponse(protocol, response);
        }
    };
    const requestData = { protocol, data };
    xhr.send(JSON.stringify(requestData));
}

// 处理服务器响应
function handleServerResponse(protocol: string, response: any) {
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