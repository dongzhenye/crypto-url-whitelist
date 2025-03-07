# Crypto URL Whitelist - 数据协议文档

本文档说明了Crypto URL Whitelist项目的数据协议和处理规范。

## 数据协议

### 数据格式

白名单数据以JSON和CSV格式提供，包含以下字段：

- `name`: 项目名称
- `url`: 官方网站URL
- `category`: 项目类别 (如DeFi, CEX, NFT等)
- `verified`: 验证状态
- `source`: 数据来源
- `last_updated`: 最后更新时间

### JSON格式示例

```json
{
  "version": "0.1.0",
  "last_updated": "2023-03-07",
  "total_entries": 3,
  "entries": [
    {
      "name": "Uniswap",
      "url": "https://uniswap.org",
      "category": "DEX",
      "verified": true,
      "source": "defillama",
      "last_updated": "2023-03-07"
    }
  ]
}
```

### CSV格式示例

```
name,url,category,verified,source,last_updated
Uniswap,https://uniswap.org,DEX,true,defillama,2023-03-07
```

## 数据收集规范

### 数据来源

目前，项目支持以下数据来源：

1. **DeFiLlama** - 通过浏览器脚本从DeFiLlama协议目录提取数据
2. **社区贡献** - 通过GitHub Pull Request提交的数据

未来将添加更多数据来源。

### 数据验证流程

所有添加到白名单的URL都需要经过以下验证流程：

1. **初步验证** - 确保URL格式正确，使用HTTPS，不包含跟踪参数
2. **来源验证** - 确认数据来源的可靠性
3. **交叉验证** - 与其他可靠来源交叉验证
4. **社区审核** - 通过Pull Request流程接受社区审核

## 使用协议

### 许可条款

本项目采用MIT许可证发布，允许用户自由使用、修改和分发，但需遵循以下条件：

- 保留原始版权声明
- 不提供任何担保
- 作者不承担任何责任

详细许可条款请参见项目根目录的[LICENSE](../LICENSE)文件。

### 使用限制

使用时请遵循以下限制：

- **请勿滥用** - 不要过度频繁地请求数据源服务器
- **遵守速率限制** - 工具内置了暂停机制，请勿修改这些限制
- **合理使用** - 仅将工具和数据用于合法、合理的目的

## 法律和伦理考虑

### 免责声明

- 本项目不保证提供的URL数据的完整性或准确性
- 用户应自行验证URL的真实性
- 项目维护者不对因使用本项目或其提供的数据而导致的任何损失负责

---

*最后更新日期：2023年3月7日* 