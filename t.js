let obj;
try {
    obj = JSON.parse($response.body);
} catch (e) {
    // 解析失败直接放行，避免阻塞
    $done({});
    return;
}

const user = "\/users";
const wallet = "\/wallet\?";
const subscription = "\/subscription\?";
const premium_state = "\/premium_state\?";
const url = $request.url;

// ==================== 用户信息接口：/users ====================
if (url.indexOf(user) != -1) {
    if (obj) {

        // ✅ 修复：forwarding_expiry 不是标准字段 → 应该延长 phone_expiry
        //if ("phone_expiry" in obj) obj.phone_expiry = '2099-12-30';
        if ("expiry" in obj) obj.expiry = '2099-12-30';

        // ✅ 开启呼叫转移
        if ("forwarding_status" in obj) obj.forwarding_status = '1';

        // ✅ 关闭广告
        if ("show_ads" in obj) obj.show_ads = false;

        // ✅ 开启高级通话
        if ("premium_calling" in obj) obj.premium_calling = true;

        // ✅ 设置高额积分
        if ("credits" in obj) obj.credits = 65532;

        // ✅ 清空广告分类
        if ("ad_categories" in obj) obj.ad_categories = null;

        // ✅ 修复时间格式错误（原 2025-09-56 非法）→ 使用当前时间
        if ("purchases_timestamp" in obj) obj.purchases_timestamp = new Date().toISOString();

        // ✅ 【新增】伪装员工权限（解锁隐藏功能）
        if (obj.features && typeof obj.features === 'object') {
            obj.features.is_employee = true;
        }

        // ✅ 【新增】激活临时号码并延长有效期
        if ("mytempnumber_status" in obj) obj.mytempnumber_status = 1;
        if ("mytempnumber_expiry" in obj) obj.mytempnumber_expiry = '2099-12-30';

        // ✅ 【新增】开启语音信箱转录（如支持）
        if ("vm_transcription_enabled" in obj) obj.vm_transcription_enabled = true;
        if ("vm_transcription_user_enabled" in obj) obj.vm_transcription_user_enabled = true;
    }
}

// ==================== 钱包/订阅/会员状态接口 ====================
if (url.indexOf(wallet) != -1 || url.indexOf(subscription) != -1 || url.indexOf(premium_state) != -1) {
    // 修改顶层字段（如果存在）
    if (obj.state) obj.state = "PREMIUM_SUBSCRIPTION";
    if (obj.show_ads) obj.show_ads = false;
    if (obj.premium_calling) obj.premium_calling = true;
    if (obj.platform) obj.platform = "TN_IOS_PREMIUM";

    // 修改嵌套 result 对象（如果存在）
    if (obj.result) {
        obj.result.state = "PREMIUM_SUBSCRIPTION";
        obj.result.show_ads = false;
        obj.result.premium_calling = true;
        obj.result.platform = "TN_IOS_PREMIUM";
        obj.result.code = "10000";

        // 修复：expiryTime.date 格式应为 ISO 或兼容格式
        if (obj.result.expiryTime && obj.result.expiryTime.date) {
            obj.result.expiryTime.date = "2099-12-30T15:06:08.000Z"; // 合法 ISO 格式
        }

        // 设置积分和余额
        if ("textnow_credit" in obj.result) obj.result.textnow_credit = 65532;
        if ("account_balance" in obj.result) obj.result.account_balance = 20098;
    }

    // 设置顶层 code 为成功
    obj.code = "10000";
}

// 返回篡改后的响应
$done({ body: JSON.stringify(obj) });
