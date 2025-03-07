# Crypto URL Whitelist - 技术实现文档

**版本**: 0.1.0 (2025-03-07)

本文档详细描述了 Crypto URL Whitelist 项目中 DeFiLlama 数据提取工具的技术实现细节，包括核心功能模块、关键算法和设计决策。

> **重要声明**: 本文档描述的工具是非官方的，与 DeFiLlama 无关。该工具仅用于教育和研究目的，使用时请遵循合理的请求频率，避免对数据源服务器造成负担。

## 核心技术概述

DeFiLlama 数据提取工具是一个纯JavaScript实现的浏览器端脚本，不依赖任何外部库。它通过DOM操作和事件监听来实现数据提取和用户交互。

## 关键模块

### 1. DOM 提取模块

工具首先需要找到并解析 DeFiLlama 协议目录页面中的协议列表：

```javascript
function findProtocolContainer() {
  // 尝试多种策略找到协议列表容器
  let container = document.getElementById(':rav:');
  
  if (!container) {
    container = document.querySelector('div[role="listbox"]');
  }
  
  if (!container) {
    const divs = Array.from(document.querySelectorAll('div')).filter(div => {
      const options = div.querySelectorAll('[role="option"]');
      return options.length > 100;
    });
    
    if (divs.length > 0) {
      container = divs[0];
    }
  }
  
  return container;
}
```

### 2. URL 捕获模块

URL捕获是该工具的核心功能，通过重写 `window.open` 方法和添加点击事件监听器来实现。这些方法仅用于捕获用户点击操作触发的URL导航，不会干扰网站的正常功能：

```javascript
// 修改window.open方法来捕获URL
window.open = function(url) {
  navigatedUrl = url;
  console.log(`捕获URL: ${url}`);
  return { closed: false }; // 返回模拟window对象
};

// 添加全局点击监听器来捕获链接点击
const clickListener = function(e) {
  if (e.target.tagName === 'A' && e.target.href) {
    navigatedUrl = e.target.href;
    console.log(`捕获链接点击: ${navigatedUrl}`);
    e.preventDefault();
  }
};
document.addEventListener('click', clickListener, true);
```

### 3. 批处理模块

为了处理大量数据而不使浏览器过载，工具采用了批处理策略，并实现了合理的请求间隔，避免对服务器造成负担：

```javascript
async function processInBatches(protocols, progress) {
  const batchSize = 200; // 每批处理的数量
  const totalProtocols = protocols.length;
  
  // 分批处理
  for (let startIndex = 0; startIndex < totalToProcess; startIndex += batchSize) {
    const batchNum = Math.floor(startIndex / batchSize) + 1;
    const endIndex = Math.min(startIndex + batchSize, totalToProcess);
    
    // 处理当前批次
    const batchResult = await batchCaptureExternalUrls(protocols, progress, {
      startIndex,
      batchSize: endIndex - startIndex,
      pauseInterval: 10, // 每10个暂停一次
      pauseDuration: 1000, // 暂停1秒
      captureTimeout: 300 // 等待URL捕获的超时时间
    }, globalStats);
    
    // 保存批次进度
    // ...
  }
}
```

### 4. 数据存储模块

工具使用多种策略保存数据，包括CSV下载和localStorage备份：

```javascript
// 下载为CSV
function downloadCSV(data, prefix = '') {
  // 创建CSV内容
  const headers = ["Index", "Protocol Name", "Internal URL", "External URL", "URL Captured"];
  const csvContent = [
    headers.join(","),
    ...data.map(item => {
      return `${item.index},"${item.name.replace(/"/g, '""')}","${item.internalUrl || ''}","${item.externalUrl || ''}","${item.captured ? 'Yes' : 'No'}"`;
    })
  ].join("\n");
  
  // 使用多种下载策略
  // ...
}

// 保存到localStorage，支持分块存储
function saveDataToLocalStorage(data, key) {
  // 检查数据大小
  const dataJson = JSON.stringify(validData);
  const dataSize = (dataJson.length * 2) / 1024 / 1024; // 近似大小(MB)
  
  // 大数据分块存储
  if (dataSize > 4) {
    const chunkSize = 1000; // 每块保存的记录数
    const chunks = Math.ceil(validData.length / chunkSize);
    
    // 分块保存
    // ...
  } else {
    localStorage.setItem(key, JSON.stringify(validData));
  }
}
```

### 5. 进度指示器模块

提供实时反馈的用户界面组件：

```javascript
function showProgressIndicator() {
  // 创建UI元素
  // ...
  
  return {
    updateStatus: (message) => { /* ... */ },
    updateBatchProgress: (current, total) => { /* ... */ },
    updateBatchSuccess: (success, total) => { /* ... */ },
    updateTotalProgress: (current, total) => { /* ... */ },
    // ...
  };
}
```

## 关键算法

### URL 捕获算法

工具使用以下策略捕获外部URL：

1. **重写window.open方法** - 捕获通过window.open打开的URL
2. **监听点击事件** - 捕获链接点击事件
3. **模拟点击协议元素** - 触发协议元素的点击事件

### 分块存储算法

为处理大量数据，工具实现了分块存储机制：

1. 检测数据大小，判断是否需要分块
2. 将数据分割为固定大小的块
3. 每块都有元数据，包括块索引和总块数
4. 创建索引记录，便于后续重组完整数据

## 优化策略

1. **批处理** - 避免一次处理过多数据
2. **定期暂停** - 每处理10个协议暂停一秒，避免浏览器过载
3. **多重下载机制** - 多种下载方法确保数据能够被导出
4. **进度保存** - 每批次处理完成后保存进度，防止数据丢失
5. **错误恢复** - 出错时自动保存已处理数据

## 设计决策

### 为什么选择纯JavaScript实现？

纯JavaScript实现确保了工具的便携性，用户只需复制粘贴代码即可使用，无需安装任何插件或扩展。

### 为什么批处理默认大小为200？

通过测试发现，200是平衡处理效率和浏览器稳定性的合适数值。太小会导致频繁中断，太大可能导致浏览器过载。

### 为什么同时使用CSV下载和localStorage保存？

CSV提供了便捷的数据导出格式，而localStorage作为备份确保即使下载失败，数据也不会丢失。

## 使用限制和建议

为了负责任地使用本工具，请遵循以下建议：

1. **合理的请求频率** - 默认的暂停机制（每10个请求暂停1秒）是为了避免对服务器造成负担，请勿修改这些限制
2. **个人使用** - 获取的数据仅供个人研究和学习使用，请勿大规模重新分发
3. **定期更新** - 定期运行工具获取最新数据，而非依赖旧数据
4. **遵守使用条款** - 使用工具时请遵守相关数据源的使用条款

## 未来改进方向

1. **增强URL捕获率** - 探索更多捕获URL的方法
2. **支持更多导出格式** - 如JSON、Excel等
3. **添加数据分析功能** - 对提取的数据进行分类和统计
4. **用户界面改进** - 开发为Chrome扩展，提供更友好的界面
5. **批量处理参数自动优化** - 根据浏览器性能自动调整批处理参数
6. **支持更多数据源** - 添加对其他加密项目目录的支持
7. **自动验证机制** - 实现URL的自动验证流程
8. **社区贡献平台** - 建立便捷的社区贡献机制

## 与整体项目的集成

DeFiLlama 数据提取工具是 Crypto URL Whitelist 项目的第一个数据源工具。未来，项目将添加更多数据源工具，并建立统一的数据处理和验证流程，以构建一个全面、可靠的加密项目URL白名单。

## 免责声明

本文档描述的工具仅供教育和研究目的。使用本工具时：

- 请遵循合理的请求频率，避免对数据源服务器造成负担
- 获取的数据仅供个人使用，请勿大规模重新分发
- 用户应自行验证URL的真实性和安全性
- 项目维护者不对因使用本工具而导致的任何损失负责

---

*最后更新日期：2025-03-07*
