/**
 * Crypto URL Whitelist - DeFiLlama数据提取工具
 * 功能：提取DeFiLlama目录页面的所有协议名称及其真实外部链接
 * 版本：0.1.0 (2025-03-07)
 * 
 * 此工具是Crypto URL Whitelist项目的一部分
 * 项目地址：https://github.com/dongzhenye/crypto-url-whitelist
 * 
 * 注意：这是一个非官方工具，与DeFiLlama无关。
 * 使用时请遵循合理的请求频率，避免对服务器造成负担。
 * 
 * 使用方法：
 * 1. 打开 https://defillama.com/directory
 * 2. 打开浏览器控制台 (F12)
 * 3. 复制粘贴此脚本并执行
 * 4. 按照提示操作，完成数据提取
 */
function extractDefILlamaProtocols() {
    console.log("开始提取DeFiLlama协议数据...");
    
    // 显示进度指示器
    function showProgressIndicator() {
      const existingIndicator = document.getElementById('defi-extract-progress');
      if (existingIndicator) {
        existingIndicator.remove();
      }
      
      const indicator = document.createElement('div');
      indicator.id = 'defi-extract-progress';
      indicator.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        min-width: 280px;
        max-width: 350px;
        transition: all 0.3s ease;
      `;
      
      // 添加标题
      const title = document.createElement('div');
      title.style = `
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      `;
      title.textContent = 'DeFiLlama 数据提取器';
      indicator.appendChild(title);
      
      document.body.appendChild(indicator);
      
      // 开始计时
      const startTime = new Date();
      let timeInterval = null;
      
      // 返回控制对象
      return {
        // 更新状态文本
        updateStatus: function(text) {
          const statusElement = indicator.querySelector('.status-text');
          if (statusElement) {
            statusElement.textContent = text;
          } else {
            const div = document.createElement('div');
            div.className = 'status-text';
            div.style = `
              font-weight: bold;
              margin: 8px 0;
              color: #4CAF50;
            `;
            div.textContent = text;
            indicator.appendChild(div);
          }
        },
        
        // 更新展开进度
        updateExpandProgress: function(current, total, status = '正在展开') {
          // 清除时间间隔（如果存在）
          if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
          }
          
          // 清空指示器内容，但保留标题
          while (indicator.childNodes.length > 1) {
            indicator.removeChild(indicator.lastChild);
          }
          
          // 添加状态文本
          const statusText = document.createElement('div');
          statusText.className = 'status-text';
          statusText.style = `
            font-weight: bold;
            margin: 8px 0;
            color: #4CAF50;
          `;
          statusText.textContent = '展开"See more"按钮';
          indicator.appendChild(statusText);
          
          // 添加子状态
          const subStatus = document.createElement('div');
          subStatus.style = 'margin-bottom: 8px; font-size: 14px;';
          subStatus.textContent = status;
          indicator.appendChild(subStatus);
          
          // 添加进度条
          const progressBarContainer = document.createElement('div');
          progressBarContainer.style = `
            background: rgba(255, 255, 255, 0.1);
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
            margin: 8px 0;
          `;
          
          const progressBar = document.createElement('div');
          progressBar.style = `
            background: #4CAF50;
            height: 100%;
            width: ${Math.round(current/Math.max(1, total)*100)}%;
            transition: width 0.3s ease;
          `;
          
          progressBarContainer.appendChild(progressBar);
          indicator.appendChild(progressBarContainer);
          
          // 添加计数器
          const counter = document.createElement('div');
          counter.style = 'text-align: center; font-size: 13px; margin-top: 5px;';
          counter.textContent = `${current}/${total}`;
          indicator.appendChild(counter);
        },
        
        // 初始化数据提取UI
        initDataExtractionUI: function() {
          // 清除时间间隔（如果存在）
          if (timeInterval) {
            clearInterval(timeInterval);
          }
          
          // 清空指示器内容，但保留标题
          while (indicator.childNodes.length > 1) {
            indicator.removeChild(indicator.lastChild);
          }
          
          // 添加状态文本
          const statusText = document.createElement('div');
          statusText.className = 'status-text';
          statusText.style = `
            font-weight: bold;
            margin: 8px 0;
            color: #2196F3;
          `;
          statusText.textContent = '初始化数据提取...';
          indicator.appendChild(statusText);
          
          // 添加批次进度部分
          const batchSection = document.createElement('div');
          batchSection.style = 'margin-top: 12px;';
          
          const batchTitle = document.createElement('div');
          batchTitle.style = 'font-size: 13px; color: #aaa; margin-bottom: 5px;';
          batchTitle.textContent = '当前批次';
          batchSection.appendChild(batchTitle);
          
          // 批次进度
          const batchProgressRow = document.createElement('div');
          batchProgressRow.style = 'display: flex; justify-content: space-between; margin-bottom: 3px;';
          
          const batchProgressLabel = document.createElement('div');
          batchProgressLabel.style = 'font-size: 13px;';
          batchProgressLabel.textContent = '进度:';
          
          const batchProgressValue = document.createElement('div');
          batchProgressValue.className = 'batch-progress';
          batchProgressValue.style = 'font-size: 13px;';
          batchProgressValue.textContent = '0 / 0 (0%)';
          
          batchProgressRow.appendChild(batchProgressLabel);
          batchProgressRow.appendChild(batchProgressValue);
          batchSection.appendChild(batchProgressRow);
          
          // 批次成功率
          const batchSuccessRow = document.createElement('div');
          batchSuccessRow.style = 'display: flex; justify-content: space-between; margin-bottom: 3px;';
          
          const batchSuccessLabel = document.createElement('div');
          batchSuccessLabel.style = 'font-size: 13px;';
          batchSuccessLabel.textContent = '成功率:';
          
          const batchSuccessValue = document.createElement('div');
          batchSuccessValue.className = 'batch-success';
          batchSuccessValue.style = 'font-size: 13px;';
          batchSuccessValue.textContent = '0 / 0 (0%)';
          
          batchSuccessRow.appendChild(batchSuccessLabel);
          batchSuccessRow.appendChild(batchSuccessValue);
          batchSection.appendChild(batchSuccessRow);
          
          // 批次剩余时间
          const batchRemainingRow = document.createElement('div');
          batchRemainingRow.style = 'display: flex; justify-content: space-between;';
          
          const batchRemainingLabel = document.createElement('div');
          batchRemainingLabel.style = 'font-size: 13px;';
          batchRemainingLabel.textContent = '剩余时间:';
          
          const batchRemainingValue = document.createElement('div');
          batchRemainingValue.className = 'batch-remaining';
          batchRemainingValue.style = 'font-size: 13px;';
          batchRemainingValue.textContent = '计算中...';
          
          batchRemainingRow.appendChild(batchRemainingLabel);
          batchRemainingRow.appendChild(batchRemainingValue);
          batchSection.appendChild(batchRemainingRow);
          
          indicator.appendChild(batchSection);
          
          // 添加总体进度部分
          const totalSection = document.createElement('div');
          totalSection.style = 'margin-top: 15px;';
          
          const totalTitle = document.createElement('div');
          totalTitle.style = 'font-size: 13px; color: #aaa; margin-bottom: 5px;';
          totalTitle.textContent = '总体进度';
          totalSection.appendChild(totalTitle);
          
          // 总体进度
          const totalProgressRow = document.createElement('div');
          totalProgressRow.style = 'display: flex; justify-content: space-between; margin-bottom: 3px;';
          
          const totalProgressLabel = document.createElement('div');
          totalProgressLabel.style = 'font-size: 13px;';
          totalProgressLabel.textContent = '进度:';
          
          const totalProgressValue = document.createElement('div');
          totalProgressValue.className = 'total-progress';
          totalProgressValue.style = 'font-size: 13px;';
          totalProgressValue.textContent = '0 / 0 (0%)';
          
          totalProgressRow.appendChild(totalProgressLabel);
          totalProgressRow.appendChild(totalProgressValue);
          totalSection.appendChild(totalProgressRow);
          
          // 总体成功率
          const totalSuccessRow = document.createElement('div');
          totalSuccessRow.style = 'display: flex; justify-content: space-between; margin-bottom: 3px;';
          
          const totalSuccessLabel = document.createElement('div');
          totalSuccessLabel.style = 'font-size: 13px;';
          totalSuccessLabel.textContent = '成功率:';
          
          const totalSuccessValue = document.createElement('div');
          totalSuccessValue.className = 'total-success';
          totalSuccessValue.style = 'font-size: 13px;';
          totalSuccessValue.textContent = '0 / 0 (0%)';
          
          totalSuccessRow.appendChild(totalSuccessLabel);
          totalSuccessRow.appendChild(totalSuccessValue);
          totalSection.appendChild(totalSuccessRow);
          
          // 已运行时间
          const timeElapsedRow = document.createElement('div');
          timeElapsedRow.style = 'display: flex; justify-content: space-between; margin-bottom: 3px;';
          
          const timeElapsedLabel = document.createElement('div');
          timeElapsedLabel.style = 'font-size: 13px;';
          timeElapsedLabel.textContent = '已运行:';
          
          const timeElapsedValue = document.createElement('div');
          timeElapsedValue.className = 'time-elapsed';
          timeElapsedValue.style = 'font-size: 13px;';
          timeElapsedValue.textContent = '0分0秒';
          
          timeElapsedRow.appendChild(timeElapsedLabel);
          timeElapsedRow.appendChild(timeElapsedValue);
          totalSection.appendChild(timeElapsedRow);
          
          // 总体剩余时间
          const totalRemainingRow = document.createElement('div');
          totalRemainingRow.style = 'display: flex; justify-content: space-between;';
          
          const totalRemainingLabel = document.createElement('div');
          totalRemainingLabel.style = 'font-size: 13px;';
          totalRemainingLabel.textContent = '预计剩余:';
          
          const totalRemainingValue = document.createElement('div');
          totalRemainingValue.className = 'total-remaining';
          totalRemainingValue.style = 'font-size: 13px;';
          totalRemainingValue.textContent = '计算中...';
          
          totalRemainingRow.appendChild(totalRemainingLabel);
          totalRemainingRow.appendChild(totalRemainingValue);
          totalSection.appendChild(totalRemainingRow);
          
          indicator.appendChild(totalSection);
          
          // 开始计时
          timeInterval = setInterval(() => {
          const elapsed = Math.floor((new Date() - startTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
            const timeElem = indicator.querySelector('.time-elapsed');
            if (timeElem) {
          timeElem.textContent = `${minutes}分${seconds}秒`;
        }
          }, 1000);
        },
        
        // 更新批次进度
        updateBatchProgress: function(current, total) {
          const batchProgressElement = indicator.querySelector('.batch-progress');
          if (batchProgressElement) {
            batchProgressElement.textContent = `${current} / ${total} (${Math.round((current/Math.max(1, total))*100)}%)`;
          }
        },
        
        // 更新批次成功率
        updateBatchSuccess: function(success, total) {
          const batchSuccessElement = indicator.querySelector('.batch-success');
          if (batchSuccessElement) {
            batchSuccessElement.textContent = `${success} / ${total} (${Math.round((success/Math.max(1, total))*100)}%)`;
          }
        },
        
        // 更新批次剩余时间
        updateBatchRemaining: function(time) {
          const batchRemainingElement = indicator.querySelector('.batch-remaining');
          if (batchRemainingElement) {
            batchRemainingElement.textContent = time;
          }
        },
        
        // 更新总体进度
        updateTotalProgress: function(current, total) {
          const totalProgressElement = indicator.querySelector('.total-progress');
          if (totalProgressElement) {
            totalProgressElement.textContent = `${current} / ${total} (${Math.round((current/Math.max(1, total))*100)}%)`;
          }
        },
        
        // 更新总体成功率
        updateTotalSuccess: function(success, total) {
          const totalSuccessElement = indicator.querySelector('.total-success');
          if (totalSuccessElement) {
            totalSuccessElement.textContent = `${success} / ${total} (${Math.round((success/Math.max(1, total))*100)}%)`;
          }
        },
        
        // 更新总体剩余时间
        updateTotalRemaining: function(time) {
          const totalRemainingElement = indicator.querySelector('.total-remaining');
          if (totalRemainingElement) {
            totalRemainingElement.textContent = time;
          }
        },
        
        // 移除指示器
        remove: function() {
          if (timeInterval) {
          clearInterval(timeInterval);
          }
          indicator.remove();
        }
      };
    }
    
    // 自动展开所有"See more"按钮
    async function expandAllSeeMore() {
      return new Promise((resolve) => {
        // 使用共享的进度指示器
        const progress = showProgressIndicator();
        
        function getSeeMoreButtons() {
          return Array.from(document.querySelectorAll('button')).filter(
            btn => btn.textContent.includes('See more')
          );
        }
        
        let expandButtons = getSeeMoreButtons();
        let expanded = 0;
        let totalInitial = expandButtons.length;
        
        if (totalInitial === 0) {
          progress.updateStatus("所有内容已展开");
          setTimeout(() => {
            resolve();
          }, 1500);
          return;
        }
        
        // 询问用户是否要展开所有内容
        const shouldExpand = confirm("是否自动展开所有'See more'按钮？这将确保获取完整数据。");
        if (shouldExpand) {
          progress.updateStatus("正在展开'See more'按钮...");
          progress.updateExpandProgress(expanded, totalInitial);
          
          function clickNext() {
            // 重新获取按钮，因为DOM可能已更新
            expandButtons = getSeeMoreButtons();
            
            if (expandButtons.length > 0) {
              expandButtons[0].click();
              expanded++;
              
              // 更新总数（可能会增加）
              const newTotal = Math.max(totalInitial, expanded + expandButtons.length);
              totalInitial = newTotal;
              
              progress.updateExpandProgress(expanded, totalInitial);
              setTimeout(clickNext, 800); // 增加延迟，避免过快请求
            } else {
              progress.updateExpandProgress(totalInitial, totalInitial, '所有内容已展开');
              setTimeout(() => {
                resolve();
              }, 1500);
            }
          }
          
          clickNext();
        } else {
          // 用户选择不展开，直接进入下一阶段
          progress.updateStatus("跳过展开'See more'按钮");
          
          // 重要：移除之前的指示器，创建新的指示器
          progress.remove();
          setTimeout(() => {
            resolve();
          }, 1000);
        }
      });
    }
    
    // 1. 找到协议列表容器
    function findProtocolContainer() {
      // 尝试通过ID找到容器
      let container = document.getElementById(':rav:');
      
      // 如果找不到指定ID，尝试通过role属性找到
      if (!container) {
        container = document.querySelector('div[role="listbox"]');
      }
      
      // 如果还找不到，尝试通过其他特征找到
      if (!container) {
        // 查找包含多个option角色元素的容器
        const divs = Array.from(document.querySelectorAll('div')).filter(div => {
          const options = div.querySelectorAll('[role="option"]');
          return options.length > 100; // 预期有超过100个选项
        });
        
        if (divs.length > 0) {
          container = divs[0];
        }
      }
      
      if (container) {
        console.log(`找到协议容器，ID: ${container.id}`);
        return container;
      }
      
      console.error("未找到协议列表容器");
      return null;
    }
    
    // 2. 从容器中提取所有协议选项
    function extractProtocolOptions(container) {
      if (!container) return [];
      
      // 查找所有role为option的元素
      const options = container.querySelectorAll('[role="option"]');
      console.log(`找到 ${options.length} 个协议选项`);
      
      return Array.from(options);
    }
    
    // 3. 从选项中提取数据
    function extractDataFromOptions(options) {
      if (!options || options.length === 0) return [];
      
      const protocols = [];
      let lastAddedName = ""; // 用于跟踪是否有重复项
      
      options.forEach((option, index) => {
        // 提取协议名称
        const nameSpan = option.querySelector('span');
        let name = nameSpan ? nameSpan.textContent.trim() : option.textContent.trim();
        
        // 如果名称为空或与上一个添加的名称相同，跳过
        if (!name || name === lastAddedName) return;
        lastAddedName = name;
        
        // 构建协议对象
        const protocol = {
          index: protocols.length + 1,
          name: name,
          elementId: option.id,
          internalUrl: `https://defillama.com/protocol/${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')}`
        };
        
        protocols.push(protocol);
      });
      
      return protocols;
    }
    
    // 4. 批量获取外部URL通过点击事件
    async function batchCaptureExternalUrls(protocols, progress, batchOptions, globalStats) {
      console.log("开始批量捕获外部URL...");
      
      // 提取选项
      const {
        startIndex = 0,
        batchSize = 200,
        pauseInterval = 10,
        pauseDuration = 1000,
        captureTimeout = 300
      } = batchOptions || {};
      
      // 备份原始方法
      const originalWindowOpen = window.open;
      const originalLocation = window.location.href;
      let navigatedUrl = null;
      
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
      
      // 恢复原始方法的函数
      function restoreOriginal() {
        window.open = originalWindowOpen;
        document.removeEventListener('click', clickListener, true);
      }
      
      // 确定要处理的总数量
      const endIndex = Math.min(startIndex + batchSize, protocols.length);
      const totalToProcess = endIndex - startIndex;
      
      // 统计信息
      let processedCount = 0;
      let capturedUrlCount = 0;
      let failedCount = 0;
      let batchStartTime = new Date();
      
      // 进度更新函数 - 批次级别
      const updateBatchProgress = () => {
        // 计算进度和统计
        const elapsedSeconds = (new Date() - batchStartTime) / 1000;
        const rate = processedCount / Math.max(1, elapsedSeconds);
        const estimatedTotal = rate > 0 ? Math.round(totalToProcess / rate) : 0;
        const estimatedRemaining = Math.max(0, estimatedTotal - elapsedSeconds);
        
        // 转换为分钟和秒
        const remainingMinutes = Math.floor(estimatedRemaining / 60);
        const remainingSeconds = Math.floor(estimatedRemaining % 60);
        
        // 更新批次统计显示
        progress.updateBatchProgress(processedCount, totalToProcess);
        progress.updateBatchSuccess(capturedUrlCount, processedCount);
        progress.updateBatchRemaining(`${remainingMinutes}分${remainingSeconds}秒`);
        
        // 更新全局统计
        if (globalStats) {
          const totalProcessed = globalStats.processedTotal + processedCount;
          const totalCaptured = globalStats.capturedTotal + capturedUrlCount;
          const totalToProcess = protocols.length;
          
          // 计算全局剩余时间
          const globalElapsedSeconds = (new Date() - globalStats.startTime) / 1000;
          const globalRate = totalProcessed / Math.max(1, globalElapsedSeconds);
          const globalEstimatedTotal = globalRate > 0 ? Math.round(totalToProcess / globalRate) : 0;
          const globalEstimatedRemaining = Math.max(0, globalEstimatedTotal - globalElapsedSeconds);
          
          // 转换为分钟和秒
          const globalRemainingMinutes = Math.floor(globalEstimatedRemaining / 60);
          const globalRemainingSeconds = Math.floor(globalEstimatedRemaining % 60);
          
          progress.updateTotalProgress(totalProcessed, totalToProcess);
          progress.updateTotalSuccess(totalCaptured, totalProcessed);
          progress.updateTotalRemaining(`${globalRemainingMinutes}分${globalRemainingSeconds}秒`);
        }
      };
      
      // 分批处理协议
      for (let i = startIndex; i < endIndex; i++) {
        processedCount++;
        const protocol = protocols[i];
        
        progress.updateStatus(`正在获取 ${protocol.name} 的外部URL`);
        
        try {
          // 重置URL
          navigatedUrl = null;
          
          // 获取元素并点击
          const element = document.getElementById(protocol.elementId);
          if (!element) {
            console.log(`未找到 ${protocol.name} 的元素`);
            failedCount++;
            continue;
          }
          
          // 执行点击
          element.click();
          
          // 等待捕获URL
          await new Promise(resolve => setTimeout(resolve, captureTimeout));
          
          if (navigatedUrl) {
            protocol.externalUrl = navigatedUrl;
            protocol.captured = true;
            capturedUrlCount++;
            console.log(`成功捕获 #${i+1} ${protocol.name}: ${navigatedUrl}`);
          } else {
            console.log(`未能捕获 ${protocol.name} 的URL`);
            failedCount++;
          }
        } catch (error) {
          console.error(`处理 ${protocol.name} 时出错:`, error);
          failedCount++;
        }
        
        // 更新进度
        if (processedCount % 5 === 0) {
          updateBatchProgress();
        }
        
        // 每处理一定数量的协议暂停一下，避免浏览器过载
        if (i % pauseInterval === pauseInterval - 1 && i < endIndex - 1) {
          progress.updateStatus(`已处理${processedCount}个协议，短暂暂停...`);
          await new Promise(resolve => setTimeout(resolve, pauseDuration));
        }
      }
      
      // 最后更新一次统计
      updateBatchProgress();
      
      // 恢复原始方法
      restoreOriginal();
      
      console.log(`批量URL捕获完成，成功率: ${capturedUrlCount}/${processedCount} (${Math.round(capturedUrlCount/Math.max(1,processedCount)*100)}%)`);
      return {
        processedCount,
        capturedUrlCount,
        failedCount
      };
    }
    
    // 5. 下载捕获的数据为CSV (修复版)
    function downloadCSV(data, prefix = '') {
      if (!data || data.length === 0) {
        console.log(" 没有数据可下载");
        // 返回一个对象，表示下载状态
        return {
          success: false,
          message: "没有数据可下载",
          count: 0,
          withUrlCount: 0,
          percent: 0
        };
      }
      
      // 准备CSV数据
      const headers = ["name", "category", "url", "externalUrl", "source", "verified", "timestamp"];
      const csvContent = [
        headers.join(","),
        ...data.map(item => {
          return [
            `"${(item.name || '').replace(/"/g, '""')}"`,
            `"${(item.category || '').replace(/"/g, '""')}"`,
            `"${(item.url || '').replace(/"/g, '""')}"`,
            `"${(item.externalUrl || '').replace(/"/g, '""')}"`,
            `"${(item.source || '').replace(/"/g, '""')}"`,
            item.verified ? "true" : "false",
            `"${item.timestamp || new Date().toISOString()}"`
          ].join(",");
        })
      ].join("\n");
      
      // 创建Blob和下载链接
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `defillama_protocols${prefix ? '_' + prefix : ''}_${timestamp}.csv`;
      
      try {
        // 尝试打开新窗口下载
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>DeFiLlama协议数据下载</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                  h1 { color: #333; }
                  .info { margin: 20px 0; }
                  .button { 
                    display: inline-block; 
                    background: #4CAF50; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 4px;
                    margin-top: 20px;
                  }
                  .stats { 
                    background: #f5f5f5; 
                    padding: 15px; 
                    border-radius: 4px; 
                    margin: 20px 0;
                  }
                </style>
              </head>
              <body>
                <h1>DeFiLlama协议数据下载</h1>
                <div class="info">文件已准备好，点击下面的按钮下载：</div>
                <div class="stats">
                  <div>总记录数: ${data.length}</div>
                  <div>有外部URL的记录数: ${data.filter(item => item.externalUrl).length}</div>
                  <div>成功率: ${Math.round((data.filter(item => item.externalUrl).length / data.length) * 100)}%</div>
                </div>
                <a href="${url}" download="${filename}" class="button">下载CSV文件</a>
              </body>
            </html>
          `);
        } else {
          // 如果无法打开新窗口，使用备用方法
            const link = document.createElement('a');
          link.href = url;
          link.download = filename;
            document.body.appendChild(link);
            
            setTimeout(() => {
              link.click();
              setTimeout(() => {
                document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 1000);
            }, 100);
        }
        
        // 统计有效URL
        const withUrl = data.filter(item => item.externalUrl).length;
        const percent = Math.round((withUrl / data.length) * 100);
        
        console.log(`已导出CSV文件，包含 ${data.length} 条记录，其中 ${withUrl} 条 (${percent}%) 有外部URL`);
        return {
          success: true,
          message: "数据已下载",
          count: data.length,
          withUrlCount: withUrl,
          percent: percent
        };
      } catch (e) {
        console.error("导出数据失败:", e);
        return {
          success: false,
          message: "导出数据失败: " + e.message,
          count: data.length,
          withUrlCount: data.filter(item => item.externalUrl).length,
          percent: Math.round((data.filter(item => item.externalUrl).length / data.length) * 100)
        };
      }
    }
    
    // 6. 保存数据到localStorage (加强版)
    function saveDataToLocalStorage(data, key = 'defiLlamaProtocolData') {
      try {
        // 只保存有效数据
        const validData = data.filter(p => p.name && (p.internalUrl || p.externalUrl));
        
        // 检查数据大小
        const dataJson = JSON.stringify(validData);
        const dataSize = (dataJson.length * 2) / 1024 / 1024; // 近似大小(MB)
        
        console.log(`数据大小: 约 ${dataSize.toFixed(2)} MB`);
        
        // localStorage通常限制在5-10MB，如果数据过大，分块保存
        if (dataSize > 4) {
          console.log("数据过大，进行分块保存");
          const chunkSize = 1000; // 每块保存的记录数
          const chunks = Math.ceil(validData.length / chunkSize);
          
          for (let i = 0; i < chunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, validData.length);
            const chunk = validData.slice(start, end);
            const chunkKey = `${key}_chunk${i+1}of${chunks}`;
            
            localStorage.setItem(chunkKey, JSON.stringify({
              chunkIndex: i+1,
              totalChunks: chunks,
              records: chunk
            }));
            
            console.log(`已保存分块 ${i+1}/${chunks}, 包含 ${chunk.length} 条记录 到 ${chunkKey}`);
          }
          
          // 保存索引信息
          localStorage.setItem(`${key}_index`, JSON.stringify({
            totalRecords: validData.length,
            chunks: chunks,
            chunkSize: chunkSize,
            chunkPrefix: key
          }));
          
          return {
            success: true,
            chunked: true,
            totalChunks: chunks,
            count: validData.length
          };
        }
        
        // 数据量较小时，直接保存
        localStorage.setItem(key, JSON.stringify(validData));
        console.log(`成功保存 ${validData.length} 条记录到localStorage [${key}]`);
        
        return {
          success: true,
          count: validData.length
        };
      } catch (e) {
        console.error(`保存到localStorage失败:`, e);
        
        // 尝试分块保存
        if (e.name === 'QuotaExceededError' && !key.includes('_chunk')) {
          console.log("存储空间不足，尝试分块保存...");
          return saveDataToLocalStorage(data, `${key}_chunked`);
        }
        
        return {
          success: false,
          error: e.message
        };
      }
    }
    
    // 7. 将数据分批处理并保存 - 改进版，只在第一批后确认一次
    async function processInBatches(protocols, progress) {
      const startTime = new Date();
      const batchSize = 200; // 每批处理的数量
      const totalProtocols = protocols.length;
      
      // 全局统计
      const globalStats = {
        startTime: startTime,
        processedTotal: 0,
        capturedTotal: 0,
        failedTotal: 0
      };
      
      // 确认是否要处理全部
      const userConfirmedAll = confirm(
        `DeFiLlama协议URL提取器\n\n` +
        `已找到${totalProtocols}个协议。\n\n` +
        `• 点击"确定"：获取所有协议的外部URL（分批处理，只在第一批后需确认）\n` +
        `• 点击"取消"：仅获取前200个协议的URL`
      );
      
      // 确定要处理的总数量
      const totalToProcess = userConfirmedAll ? totalProtocols : Math.min(200, totalProtocols);
      
      // 初始化全局统计显示
      progress.updateTotalProgress(0, totalToProcess);
      progress.updateTotalSuccess(0, 0);
      progress.updateTotalRemaining("计算中...");
      
      let continueProcessing = true; // 控制是否继续处理
      
      // 分批处理
      for (let startIndex = 0; startIndex < totalToProcess && continueProcessing; startIndex += batchSize) {
        const batchNum = Math.floor(startIndex / batchSize) + 1;
        const endIndex = Math.min(startIndex + batchSize, totalToProcess);
        
        progress.updateStatus(`处理第${batchNum}批 (${startIndex+1}-${endIndex})...`);
        
        // 初始化批次统计显示
        progress.updateBatchProgress(0, endIndex - startIndex);
        progress.updateBatchSuccess(0, 0);
        progress.updateBatchRemaining("计算中...");
        
        // 处理当前批次
        const batchResult = await batchCaptureExternalUrls(protocols, progress, {
          startIndex,
          batchSize: endIndex - startIndex,
          pauseInterval: 10, // 每10个暂停一次
          pauseDuration: 1000, // 暂停1秒
          captureTimeout: 300 // 等待URL捕获的超时时间
        }, globalStats);
        
        // 累计统计
        globalStats.processedTotal += batchResult.processedCount;
        globalStats.capturedTotal += batchResult.capturedUrlCount;
        globalStats.failedTotal += batchResult.failedCount;
        
        // 更新总体统计显示
        progress.updateTotalProgress(globalStats.processedTotal, totalToProcess);
        progress.updateTotalSuccess(globalStats.capturedTotal, globalStats.processedTotal);
        
        // 每批次下载一次CSV - 处理当前批次数据
        progress.updateStatus(`批次${batchNum}完成，正在下载数据...`);
        const batchData = protocols.slice(0, endIndex);
        const batchDownloadResult = downloadCSV(batchData, `batch${batchNum}`);
        
        // 询问用户是否保存到localStorage
        let saveToLocalStorage = false;
        if (batchNum === 1) { // 只在第一批次询问
          saveToLocalStorage = confirm(
            `是否将数据保存到浏览器的localStorage中？\n\n` +
            `• 点击"确定"：保存数据，以便稍后导出\n` +
            `• 点击"取消"：不保存数据`
          );
        }
        
        // 如果用户选择保存，则保存到localStorage
        if (saveToLocalStorage) {
        // 也保存到localStorage
        const batchKey = `defiLlamaProtocols_batch${batchNum}`;
        saveDataToLocalStorage(batchData, batchKey);
        }
        
        // 如果是第一批次，询问用户是否继续
        if (batchNum === 1 && startIndex + batchSize < totalToProcess && userConfirmedAll) {
          const shouldContinue = confirm(
            `DeFiLlama URL提取器 - 第1批完成\n\n` +
            `已处理 ${endIndex}/${totalToProcess} 个协议。\n` +
            `成功获取 ${globalStats.capturedTotal} 个外部URL (${Math.round(globalStats.capturedTotal/globalStats.processedTotal*100)}%)。\n\n` +
            `• 点击"确定"：自动处理剩余全部协议（无需再次确认）\n` +
            `• 点击"取消"：停止并使用当前结果`
          );
          
          if (!shouldContinue) {
            console.log(`用户选择停止于第${batchNum}批`);
            continueProcessing = false;
            
            // 用户选择停止时，确保下载当前已处理的数据
            progress.updateStatus(`用户选择停止，正在下载已处理数据...`);
            downloadCSV(batchData, `stopped_at_batch${batchNum}`);
          }
        }
      }
      
      // 计算总执行时间
      const endTime = new Date();
      const executionTimeSeconds = (endTime - startTime) / 1000;
      const executionTimeMinutes = Math.floor(executionTimeSeconds / 60);
      const executionTimeRemainingSeconds = Math.floor(executionTimeSeconds % 60);
      
      // 显示完成信息
      progress.updateStatus("数据提取完成！");
      
      // 设置自动关闭指示器的延迟
      setTimeout(() => progress.remove(), 10000); // 10秒后自动关闭
      
      // 返回最终结果
      return {
        processedTotal: globalStats.processedTotal,
        capturedTotal: globalStats.capturedTotal,
        failedTotal: globalStats.failedTotal,
        successRate: Math.round((globalStats.capturedTotal / Math.max(1, globalStats.processedTotal)) * 100),
        executionTime: `${executionTimeMinutes}分${executionTimeRemainingSeconds}秒`,
        executionTimeSeconds
      };
    }
    
    // 8. 主执行流程
    async function main() {
      // 显示进度指示器
      let progress = showProgressIndicator();
      let result = {
        success: false,
        message: "未完成",
        stats: {}
      };
      
      try {
        // 自动展开所有"See more"按钮
        progress.updateStatus("准备展开'See more'按钮...");
        await expandAllSeeMore();
        
        // 重新创建进度指示器（因为如果用户选择不展开，之前的指示器已被移除）
        progress = showProgressIndicator();
        
        // 初始化数据提取UI
        progress.initDataExtractionUI();
        
        // 查找容器
        progress.updateStatus("查找协议容器...");
        const container = findProtocolContainer();
        if (!container) {
          progress.updateStatus("未找到协议容器。请确保页面已加载完成。");
          setTimeout(() => progress.remove(), 5000); // 5秒后自动关闭
          result.message = "未找到协议容器";
          return result;
        }
        
        // 提取选项
        progress.updateStatus("提取协议选项...");
        const options = extractProtocolOptions(container);
        if (options.length === 0) {
          progress.updateStatus("未找到协议选项。请确保已展开所有'See more'按钮。");
          setTimeout(() => progress.remove(), 5000); // 5秒后自动关闭
          result.message = "未找到协议选项";
          return result;
        }
        
        console.log(`找到 ${options.length} 个协议选项`);
        
        // 提取数据
        progress.updateStatus("提取协议数据...");
        const protocols = extractDataFromOptions(options);
        
        // 检查是否有协议数据
        if (protocols.length === 0) {
          progress.updateStatus("未提取到任何协议数据。");
          setTimeout(() => progress.remove(), 5000); // 5秒后自动关闭
          result.message = "未提取到协议数据";
          return result;
        }
        
        console.log(`提取到 ${protocols.length} 个唯一协议`);
        
        // 询问用户是否要获取所有协议的外部URL
        const totalProtocols = protocols.length;
        const batchSize = 50; // 每批处理的数量
        
        // 全局统计
        const globalStats = {
          processedTotal: 0,
          capturedTotal: 0,
          failedTotal: 0
        };
        
        // 记录开始时间
        const startTime = new Date();
        
        // 询问用户是否处理所有协议
        const userConfirmedAll = totalProtocols > 200 && confirm(
          `DeFiLlama URL提取器 - 找到 ${totalProtocols} 个协议\n\n` +
          `• 点击"确定"：获取所有协议的外部URL（分批处理，只在第一批后需确认）\n` +
          `• 点击"取消"：仅获取前200个协议的URL`
        );
        
        // 确定要处理的总数量
        const totalToProcess = userConfirmedAll ? totalProtocols : Math.min(200, totalProtocols);
        
        // 如果没有要处理的协议，提前结束
        if (totalToProcess === 0) {
          progress.updateStatus("没有协议需要处理。");
          setTimeout(() => progress.remove(), 5000); // 5秒后自动关闭
          result.message = "没有协议需要处理";
          result.success = true;
          return result;
        }
        
        // 初始化全局统计显示
        progress.updateTotalProgress(0, totalToProcess);
        progress.updateTotalSuccess(0, 0);
        progress.updateTotalRemaining("计算中...");
        
        let continueProcessing = true; // 控制是否继续处理
        
        // 分批处理
        for (let startIndex = 0; startIndex < totalToProcess && continueProcessing; startIndex += batchSize) {
          const batchNum = Math.floor(startIndex / batchSize) + 1;
          const endIndex = Math.min(startIndex + batchSize, totalToProcess);
          
          progress.updateStatus(`处理第${batchNum}批 (${startIndex+1}-${endIndex})...`);
          
          // 初始化批次统计显示
          progress.updateBatchProgress(0, endIndex - startIndex);
          progress.updateBatchSuccess(0, 0);
          progress.updateBatchRemaining("计算中...");
          
          // 处理当前批次
          const batchResult = await batchCaptureExternalUrls(protocols, progress, {
            startIndex,
            batchSize: endIndex - startIndex,
            pauseInterval: 10, // 每10个暂停一次
            pauseDuration: 1000, // 暂停1秒
            captureTimeout: 300 // 等待URL捕获的超时时间
          }, globalStats);
          
          // 累计统计
          globalStats.processedTotal += batchResult.processedCount;
          globalStats.capturedTotal += batchResult.capturedUrlCount;
          globalStats.failedTotal += batchResult.failedCount;
          
          // 更新总体统计显示
          progress.updateTotalProgress(globalStats.processedTotal, totalToProcess);
          progress.updateTotalSuccess(globalStats.capturedTotal, globalStats.processedTotal);
          
          // 每批次下载一次CSV - 处理当前批次数据
          progress.updateStatus(`批次${batchNum}完成，正在下载数据...`);
          const batchData = protocols.slice(0, endIndex);
          const batchDownloadResult = downloadCSV(batchData, `batch${batchNum}`);
          
          // 询问用户是否保存到localStorage
          let saveToLocalStorage = false;
          if (batchNum === 1) { // 只在第一批次询问
            saveToLocalStorage = confirm(
              `是否将数据保存到浏览器的localStorage中？\n\n` +
              `• 点击"确定"：保存数据，以便稍后导出\n` +
              `• 点击"取消"：不保存数据`
            );
          }
          
          // 如果用户选择保存，则保存到localStorage
          if (saveToLocalStorage) {
            // 也保存到localStorage
            const batchKey = `defiLlamaProtocols_batch${batchNum}`;
            saveDataToLocalStorage(batchData, batchKey);
          }
          
          // 如果是第一批次，询问用户是否继续
          if (batchNum === 1 && startIndex + batchSize < totalToProcess && userConfirmedAll) {
            const shouldContinue = confirm(
              `DeFiLlama URL提取器 - 第1批完成\n\n` +
              `已处理 ${endIndex}/${totalToProcess} 个协议。\n` +
              `成功获取 ${globalStats.capturedTotal} 个外部URL (${Math.round(globalStats.capturedTotal/globalStats.processedTotal*100)}%)。\n\n` +
              `• 点击"确定"：自动处理剩余全部协议（无需再次确认）\n` +
              `• 点击"取消"：停止并使用当前结果`
            );
            
            if (!shouldContinue) {
              console.log(`用户选择停止于第${batchNum}批`);
              continueProcessing = false;
              
              // 用户选择停止时，确保下载当前已处理的数据
              progress.updateStatus(`用户选择停止，正在下载已处理数据...`);
              downloadCSV(batchData, `stopped_at_batch${batchNum}`);
            }
          }
        }
        
        // 计算总执行时间
        const endTime = new Date();
        const executionTimeSeconds = (endTime - startTime) / 1000;
        const executionTimeMinutes = Math.floor(executionTimeSeconds / 60);
        const executionTimeRemainingSeconds = Math.floor(executionTimeSeconds % 60);
        
        // 显示完成信息
        progress.updateStatus("数据提取完成！");
        
        // 设置自动关闭指示器的延迟
        setTimeout(() => progress.remove(), 10000); // 10秒后自动关闭
        
        // 返回最终结果
        result.success = true;
        result.message = "提取完成";
        result.stats = {
          processedTotal: globalStats.processedTotal,
          capturedTotal: globalStats.capturedTotal,
          failedTotal: globalStats.failedTotal,
          successRate: Math.round((globalStats.capturedTotal / Math.max(1, globalStats.processedTotal)) * 100),
          executionTime: `${executionTimeMinutes}分${executionTimeRemainingSeconds}秒`,
          executionTimeSeconds
        };
        return result;
      } catch (error) {
        console.error("执行过程中出错:", error);
        progress.updateStatus(`执行出错: ${error.message}`);
        
        // 设置自动关闭指示器的延迟
        setTimeout(() => progress.remove(), 8000); // 8秒后自动关闭
        
        result.message = `执行出错: ${error.message}`;
        return result;
      }
    }
    
    // 9. 导出保存的数据 (加强版)
    function exportSavedData() {
      try {
        // 检查是否有完整数据
        const completeData = localStorage.getItem('defiLlamaProtocolData_complete');
        if (completeData) {
          const data = JSON.parse(completeData);
          console.log(`找到完整数据，包含 ${data.length} 条记录`);
          downloadCSV(data, 'complete_export');
          return true;
        }
        
        // 检查是否有分块数据
        const indexData = localStorage.getItem('defiLlamaProtocolData_complete_index');
        if (indexData) {
          const index = JSON.parse(indexData);
          console.log(`找到分块数据索引，共 ${index.totalRecords} 条记录，分为 ${index.chunks} 块`);
          
          // 重组数据
          const allData = [];
          let missingChunks = false;
          
          for (let i = 1; i <= index.chunks; i++) {
            const chunkKey = `${index.chunkPrefix}_chunk${i}of${index.chunks}`;
            const chunkData = localStorage.getItem(chunkKey);
            
            if (chunkData) {
              const chunk = JSON.parse(chunkData);
              if (chunk.records && Array.isArray(chunk.records)) {
                allData.push(...chunk.records);
                console.log(`加载分块 ${i}/${index.chunks}, 包含 ${chunk.records.length} 条记录`);
              } else {
                console.error(`分块 ${i} 数据格式不正确`);
                missingChunks = true;
              }
            } else {
              console.error(`未找到分块 ${i}`);
              missingChunks = true;
            }
          }
          
          if (allData.length > 0) {
            console.log(`重组数据完成，包含 ${allData.length} 条记录${missingChunks ? ' (有缺失)' : ''}`);
            downloadCSV(allData, 'chunked_export');
            return true;
          }
        }
        
        // 查找最新的批次数据
        const batchKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('defiLlamaProtocols_batch')) {
            batchKeys.push(key);
          }
        }
        
        if (batchKeys.length > 0) {
          // 找出批次号最大的
          const latestBatch = batchKeys.sort().pop();
          const batchData = JSON.parse(localStorage.getItem(latestBatch));
          
          console.log(`找到最新批次数据 ${latestBatch}，包含 ${batchData.length} 条记录`);
          downloadCSV(batchData, 'latest_batch_export');
          return true;
        }
        
        // 查找错误恢复数据
        const errorData = localStorage.getItem('defiLlamaProtocolData_error_recovery');
        if (errorData) {
          const data = JSON.parse(errorData);
          console.log(`找到错误恢复数据，包含 ${data.length} 条记录`);
          downloadCSV(data, 'error_recovery_export');
          return true;
        }
        
        console.log("未找到任何已保存的数据");
        return false;
      } catch (e) {
        console.error("导出保存数据失败:", e);
        return false;
      }
    }
    
    // 检查是否有已保存的数据
    const existingData = localStorage.getItem('defiLlamaProtocolData_complete');
    if (existingData) {
      const useExisting = confirm(
        `DeFiLlama URL提取器\n\n` +
        `发现有之前保存的完整协议数据。\n\n` +
        `• 点击"确定"：使用已保存的数据\n` +
        `• 点击"取消"：重新提取数据`
      );
      
      if (useExisting) {
        console.log("使用已保存的数据");
        try {
          const data = JSON.parse(existingData);
          console.log(`从localStorage读取 ${data.length} 条记录`);
          
          // 显示前10条数据
          console.table(data.slice(0, 10));
          
          // 下载CSV
          downloadCSV(data, 'from_storage');
          
          return {
            success: true,
            message: "使用已保存数据",
            stats: {
              total: data.length,
              fromStorage: true
            }
          };
        } catch (e) {
          console.error("读取已保存数据失败:", e);
        }
      }
    }
    
    // 执行主流程
    return main();
  }
  
  // 创建一个便捷函数来导出保存在localStorage中的数据
  function exportSavedDefiLlamaData(key = 'defiLlamaProtocolData_complete') {
    try {
      const dataJson = localStorage.getItem(key);
      if (!dataJson) {
        console.log(`localStorage中没有找到键为'${key}'的数据`);
        return false;
      }
      
      const data = JSON.parse(dataJson);
      console.log(`从localStorage中读取 ${data.length} 条记录`);
      
      // 显示前10条数据作为示例
      console.table(data.slice(0, 10));
      
      // 为CSV文件创建内容
      const headers = ["Index", "Protocol Name", "Internal URL", "External URL", "URL Captured"];
      const csvContent = [
        headers.join(","),
        ...data.map(item => {
          return `${item.index},"${item.name.replace(/"/g, '""')}","${item.internalUrl || ''}","${item.externalUrl || ''}","${item.captured ? 'Yes' : 'No'}"`;
        })
      ].join("\n");
      
      // 下载函数重写，直接使用dataURL
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // 在新窗口中打开数据URL（这种方法更可靠）
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>下载CSV文件</title>
            </head>
            <body>
              <p>CSV文件已准备好，请点击下方链接下载:</p>
              <a href="${url}" download="defillama_protocols_export_${new Date().toISOString().slice(0,10)}.csv" id="download">下载CSV文件</a>
              <script>
                // 自动触发下载
                document.getElementById('download').click();
              </script>
            </body>
          </html>
        `);
      } else {
        // 如果无法打开新窗口，使用备用方法
        const link = document.createElement('a');
        link.href = url;
        link.download = `defillama_protocols_export_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        
        setTimeout(() => {
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 1000);
        }, 100);
      }
      
      // 统计有效URL
      const withUrl = data.filter(item => item.externalUrl).length;
      const percent = Math.round((withUrl / data.length) * 100);
      
      console.log(`已导出CSV文件，包含 ${data.length} 条记录，其中 ${withUrl} 条 (${percent}%) 有外部URL`);
      return true;
    } catch (e) {
      console.error("导出保存数据失败:", e);
      return false;
    }
  }
  
  // 列出所有保存的DeFiLlama数据
  function listSavedDefiLlamaData() {
    const savedKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('defiLlama')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(data)) {
            savedKeys.push({
              key,
              records: data.length,
              withUrl: data.filter(item => item.externalUrl).length,
              firstItem: data[0].name,
              lastItem: data[data.length - 1].name
            });
          } else if (data && data.totalRecords) {
            // 索引数据
            savedKeys.push({
              key,
              type: '索引',
              chunks: data.chunks,
              records: data.totalRecords
            });
          } else if (data && data.records) {
            // 分块数据
            savedKeys.push({
              key,
              type: '分块',
              chunkIndex: data.chunkIndex,
              totalChunks: data.totalChunks,
              records: data.records.length
            });
          }
        } catch (e) {
          savedKeys.push({ key, error: e.message });
        }
      }
    }
    
    console.table(savedKeys);
    console.log("要导出某个数据集，请使用: exportSavedDefiLlamaData('键名')");
    return savedKeys;
  }
  
  // 一键导出最新数据
  function exportLatestDefiLlamaData() {
    // 找出保存的最新批次
    const batchPrefix = 'defiLlamaProtocols_batch';
    const batchKeys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(batchPrefix)) {
        batchKeys.push(key);
      }
    }
    
    if (batchKeys.length === 0) {
      console.log("未找到任何批次数据");
      return false;
    }
    
    // 按批次号排序
    batchKeys.sort((a, b) => {
      const numA = parseInt(a.replace(batchPrefix, '')) || 0;
      const numB = parseInt(b.replace(batchPrefix, '')) || 0;
      return numB - numA; // 降序，最大的批次号在前
    });
    
    console.log(`找到${batchKeys.length}个批次，最新批次: ${batchKeys[0]}`);
    return exportSavedDefiLlamaData(batchKeys[0]);
  }
  
  // 执行脚本
  console.log("=== DeFiLlama URL提取器 v0.1.0 ===");
  console.log("提示：如需导出之前保存的数据，请使用:");
  console.log("1. listSavedDefiLlamaData() - 查看所有保存的数据");
  console.log("2. exportSavedDefiLlamaData('键名') - 导出指定数据");
  console.log("3. exportLatestDefiLlamaData() - 导出最新批次数据");

  // 添加一个函数来显示执行结果
  function displayExecutionResults(result) {
    console.log("\n=== DeFiLlama URL提取完成 ===");
    
    if (result.success) {
      console.log(`✅ 状态: 成功 - ${result.message}`);
      
      if (result.stats) {
        console.log("\n📊 统计信息:");
        console.log(`• 处理协议数: ${result.stats.processedTotal || 0}`);
        console.log(`• 成功捕获URL: ${result.stats.capturedTotal || 0} (${result.stats.successRate || 0}%)`);
        console.log(`• 失败数量: ${result.stats.failedTotal || 0}`);
        console.log(`• 执行时间: ${result.stats.executionTime || '0分0秒'}`);
      }
      
      console.log("\n💡 提示:");
      console.log("• 如需再次查看数据，可使用 exportLatestDefiLlamaData() 函数");
      console.log("• 如需查看所有保存的数据，可使用 listSavedDefiLlamaData() 函数");
    } else {
      console.log(`❌ 状态: 失败 - ${result.message}`);
      console.log("\n💡 建议:");
      console.log("• 请确保页面已完全加载");
      console.log("• 尝试刷新页面后重新运行脚本");
      console.log("• 检查浏览器控制台是否有错误信息");
    }
    
    console.log("\n感谢使用 DeFiLlama URL提取器！");
  }

  extractDefILlamaProtocols().then(result => {
    displayExecutionResults(result);
  });