# Crypto URL Whitelist

为加密货币行业提供可靠的URL白名单，帮助用户识别官方网站，避免仿冒网站和钓鱼攻击。

![版本](https://img.shields.io/badge/版本-0.1.0-blue)
![许可证](https://img.shields.io/badge/许可证-MIT-green)

## 项目简介

加密货币行业中，钓鱼网站和仿冒攻击层出不穷，给用户造成了巨大的资产损失。本项目通过社区协作方式，建立权威、透明的URL参考数据库，帮助用户和开发者快速识别官方网站，为行业安全生态做出贡献。

### 主要目标

- 建立并维护加密项目官方URL的标准化数据库
- 开发高效的数据收集工具，从多个可靠来源获取信息
- 实现严格的验证流程，确保数据准确性
- 提供多种格式的数据输出，便于集成和使用
- 构建开放透明的社区协作机制，持续更新数据

## 安全价值

通过实现上述目标，本项目为加密行业提供以下安全价值：

1. **防范钓鱼攻击** - 帮助用户快速识别官方网站，避免访问仿冒网站
2. **降低资产损失风险** - 减少因访问恶意网站导致的资产被盗事件
3. **提高安全工具效能** - 为钱包、浏览器插件等安全工具提供可靠的数据源
4. **增强行业透明度** - 通过开源方式维护数据，提高整个行业的安全意识
5. **节省开发资源** - 避免每个项目都需要独立开发和维护URL验证系统

## 数据来源

目前，本项目的数据来源包括：

- [DeFiLlama](https://defillama.com/directory) - DeFi项目目录
- (未来将添加更多可靠来源)

## 数据格式

白名单数据以JSON和CSV格式提供，包含以下字段：

- `name`: 项目名称
- `url`: 官方网站URL
- `category`: 项目类别 (如DeFi, CEX, NFT等)
- `verified`: 验证状态
- `source`: 数据来源
- `last_updated`: 最后更新时间

## 使用方法

### 直接使用数据

```bash
# 克隆仓库
git clone https://github.com/dongzhenye/crypto-url-whitelist.git
cd crypto-url-whitelist
# 数据位于 data/ 目录
```

### 运行数据收集工具

对于DeFiLlama数据源:

1. 打开 [DeFiLlama 协议目录](https://defillama.com/directory)
2. 确保展开所有"See more"按钮
3. 打开浏览器开发者工具 (F12)，切换到"Console"标签
4. 复制粘贴 `tools/defillama-extractor.js` 中的脚本内容并执行
5. 按照提示操作，完成数据提取
6. 导出的数据可以贡献回项目

## 项目结构

```plaintext
crypto-url-whitelist/
├── data/                 # 白名单数据文件
│   ├── whitelist.json    # 完整白名单(JSON格式)
│   └── whitelist.csv     # 完整白名单(CSV格式)
├── tools/                # 数据收集和处理工具
│   └── defillama-extractor.js  # DeFiLlama数据提取工具
├── docs/                 # 文档
│   ├── TECHNICAL.md      # 技术实现文档
│   └── PROTOCOL.md       # 数据协议文档
├── CONTRIBUTING.md       # 贡献指南
├── LICENSE               # 许可证
└── README.md             # 项目说明
```

## 如何贡献

我们欢迎社区贡献！您可以通过以下方式参与：

- 提交新的官方URL
- 报告可疑或过时的URL
- 开发新的数据收集工具
- 改进现有工具和文档

详细贡献指南请参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 未来计划

1. **扩展数据源** - 添加更多可靠的数据源，如CoinGecko、CoinMarketCap等
2. **自动验证机制** - 开发自动验证工具，检查URL的有效性和安全性
3. **API接口** - 提供API接口，方便其他项目集成
4. **浏览器扩展** - 开发浏览器扩展，帮助用户识别安全网址
5. **更多元数据** - 为每个项目添加更多元数据，如社交媒体链接、合约地址等

## 免责声明

本项目尽力提供准确的信息，但不能保证所有数据的绝对准确性和时效性。用户在访问任何URL前应自行验证其真实性。项目维护者不对因使用本白名单而导致的任何损失负责。

## 联系方式

项目维护者：[Zhenye Dong](https://github.com/dongzhenye)

如有问题或建议，请通过GitHub Issues提交。
