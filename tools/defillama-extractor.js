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
 * 2. 确保展开所有"See more"按钮
 * 3. 打开浏览器控制台 (F12)
 * 4. 复制粘贴此脚本并执行
 * 5. 按照提示操作，完成数据提取
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
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 18px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        max-width: 450px;
        min-width: 350px;
      `;
      indicator.innerHTML = `
        <div style="margin-bottom:12px;font-weight:bold;font-size:16px;border-bottom:1px solid #444;padding-bottom:8px;">DeFiLlama 协议提取器</div>
        <div id="defi-extract-status" style="font-size:14px;margin-bottom:8px;">初始化...</div>
        
        <div style="margin-top:12px;margin-bottom:4px;font-size:13px;color:#aaa;">当前批次</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <div style="font-size:13px;">进度:</div>
          <div id="defi-extract-batch-progress" style="font-size:13px;">0 / 0 (0%)</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <div style="font-size:13px;">成功率:</div>
          <div id="defi-extract-batch-success" style="font-size:13px;">0 / 0 (0%)</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <div style="font-size:13px;">剩余时间:</div>
          <div id="defi-extract-batch-remaining" style="font-size:13px;">计算中...</div>
        </div>
        
        <div style="margin-top:12px;margin-bottom:4px;font-size:13px;color:#aaa;">总体进度</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <div style="font-size:13px;">进度:</div>
          <div id="defi-extract-total-progress" style="font-size:13px;">0 / 0 (0%)</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <div style="font-size:13px;">成功率:</div>
          <div id="defi-extract-total-success" style="font-size:13px;">0 / 0 (0%)</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
          <div style="font-size:13px;">已运行:</div>
          <div id="defi-extract-time-elapsed" style="font-size:13px;">0分0秒</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:13px;">预计剩余:</div>
          <div id="defi-extract-time-remaining" style="font-size:13px;">计算中...</div>
        </div>
      `;
      document.body.appendChild(indicator);
      
      // 开始计时
      const startTime = new Date();
      
      // 更新时间显示的函数
      const updateTime = () => {
        const timeElem = document.getElementById('defi-extract-time-elapsed');
        if (timeElem) {
          const elapsed = Math.floor((new Date() - startTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          timeElem.textContent = `${minutes}分${seconds}秒`;
        }
      };
      
      // 每秒更新一次时间
      const timeInterval = setInterval(updateTime, 1000);
      
      return {
        updateStatus: (message) => {
          const statusElem = document.getElementById('defi-extract-status');
          if (statusElem) {
            statusElem.textContent = message;
          }
        },
        updateBatchProgress: (current, total) => {
          const elem = document.getElementById('defi-extract-batch-progress');
          if (elem) {
            const percent = total > 0 ? Math.floor((current / total) * 100) : 0;
            elem.textContent = `${current} / ${total} (${percent}%)`;
          }
        },
        updateBatchSuccess: (success, total) => {
          const elem = document.getElementById('defi-extract-batch-success');
          if (elem) {
            const percent = total > 0 ? Math.floor((success / total) * 100) : 0;
            elem.textContent = `${success} / ${total} (${percent}%)`;
          }
        },
        updateBatchRemaining: (time) => {
          const elem = document.getElementById('defi-extract-batch-remaining');
          if (elem) {
            elem.textContent = time;
          }
        },
        updateTotalProgress: (current, total) => {
          const elem = document.getElementById('defi-extract-total-progress');
          if (elem) {
            const percent = total > 0 ? Math.floor((current / total) * 100) : 0;
            elem.textContent = `${current} / ${total} (${percent}%)`;
          }
        },
        updateTotalSuccess: (success, total) => {
          const elem = document.getElementById('defi-extract-total-success');
          if (elem) {
            const percent = total > 0 ? Math.floor((success / total) * 100) : 0;
            elem.textContent = `${success} / ${total} (${percent}%)`;
          }
        },
        updateTotalRemaining: (time) => {
          const elem = document.getElementById('defi-extract-time-remaining');
          if (elem) {
            elem.textContent = time;
          }
        },
        remove: () => {
          clearInterval(timeInterval);
          indicator.remove();
        }
      };
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
        console.error("没有数据可下载");
        return false;
      }
      
      // 计算有效URL的统计
      const withExternalUrl = data.filter(item => item.externalUrl).length;
      const capturedPercent = Math.round((withExternalUrl / data.length) * 100);
      
      // 为CSV文件创建内容
      const headers = ["Index", "Protocol Name", "Internal URL", "External URL", "URL Captured"];
      const csvContent = [
        headers.join(","),
        ...data.map(item => {
          return `${item.index},"${item.name.replace(/"/g, '""')}","${item.internalUrl || ''}","${item.externalUrl || ''}","${item.captured ? 'Yes' : 'No'}"`;
        })
      ].join("\n");
      
      try {
        // 创建用于下载的Blob
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        
        // 准备文件名
        const dateStr = new Date().toISOString().slice(0,10);
        const fileName = `defillama_protocols${prefix ? '_' + prefix : ''}_${dateStr}.csv`;
        
        // 修复方法1: 使用window.navigator.msSaveBlob (适用于IE10+)
        if (window.navigator && window.navigator.msSaveBlob) {
          window.navigator.msSaveBlob(blob, fileName);
          console.log(`已使用msSaveBlob下载CSV文件: ${fileName}`);
        } 
        // 修复方法2: 直接创建iframe并设置data URL（更兼容的方法）
        else {
          const downloadIframe = document.createElement('iframe');
          downloadIframe.style.display = 'none';
          document.body.appendChild(downloadIframe);
          
          try {
            // 在iframe中创建下载链接
            const iframeDoc = downloadIframe.contentDocument || downloadIframe.contentWindow.document;
            const link = iframeDoc.createElement('a');
            link.href = url;
            link.download = fileName;
            link.textContent = 'Download CSV';
            
            iframeDoc.body.appendChild(link);
            
            // 尝试触发点击
            link.click();
            
            // 延迟清理
            setTimeout(() => {
              URL.revokeObjectURL(url);
              document.body.removeChild(downloadIframe);
            }, 1000);
            
          } catch (iframeErr) {
            console.warn("iframe下载方法失败，尝试备用方法:", iframeErr);
            document.body.removeChild(downloadIframe);
            
            // 修复方法3: 传统A标签方法，但使用setTimeout确保URL不会被过早释放
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.display = 'none';
            document.body.appendChild(link);
            
            // 使用setTimeout确保下载事件在之前的所有事件完成后被处理
            setTimeout(() => {
              // 尝试直接click()
              link.click();
              // 还添加一个备用的鼠标事件
              const clickEvent = new MouseEvent('click');
              link.dispatchEvent(clickEvent);
              
              // 清理，但给浏览器足够时间处理下载
              setTimeout(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
              }, 2000);
            }, 100);
          }
        }
        
        // 打印成功信息
        console.log(`已创建CSV文件，包含 ${data.length} 条记录，其中 ${withExternalUrl} 条 (${capturedPercent}%) 有外部URL`);
        return {
          total: data.length,
          withUrl: withExternalUrl,
          percent: capturedPercent,
          fileName: fileName
        };
      } catch (error) {
        console.error("下载CSV时出错:", error);
        
        // 错误时的备用方案：尝试将数据复制到剪贴板
        try {
          const textArea = document.createElement('textarea');
          textArea.value = csvContent;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          console.log("已将CSV内容复制到剪贴板，请手动保存。");
          alert("无法自动下载CSV文件，但内容已复制到剪贴板。请创建一个.csv文件并粘贴内容。");
        } catch (clipboardErr) {
          console.error("复制到剪贴板失败:", clipboardErr);
        }
        
        return {
          total: data.length,
          withUrl: withExternalUrl,
          percent: capturedPercent,
          error: error.message
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
        
        // 也保存到localStorage
        const batchKey = `defiLlamaProtocols_batch${batchNum}`;
        saveDataToLocalStorage(batchData, batchKey);
        
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
      const progress = showProgressIndicator();
      let result = {
        success: false,
        message: "未完成",
        stats: {}
      };
      
      try {
        // 查找容器
        progress.updateStatus("查找协议容器...");
        const container = findProtocolContainer();
        if (!container) {
          progress.updateStatus("未找到协议容器。请确保页面已加载完成。");
          setTimeout(() => progress.remove(), 3000);
          result.message = "未找到协议容器";
          return result;
        }
        
        // 提取选项
        progress.updateStatus("提取协议选项...");
        const options = extractProtocolOptions(container);
        if (options.length === 0) {
          progress.updateStatus("未找到协议选项。请确保已展开所有'See more'按钮。");
          setTimeout(() => progress.remove(), 3000);
          result.message = "未找到协议选项";
          return result;
        }
        
        // 提取基本数据
        progress.updateStatus("处理协议数据...");
        let protocols = extractDataFromOptions(options);
        console.log(`提取到 ${protocols.length} 个唯一协议`);
        
        // 验证
        if (protocols.length > 0) {
          console.log(`第一个协议: ${protocols[0].name}`);
          console.log(`最后一个协议: ${protocols[protocols.length - 1].name}`);
        }
        
        // 分批处理并保存
        const processingResult = await processInBatches(protocols, progress);
        
        // 下载完整数据
        progress.updateStatus("准备下载完整数据...");
        const downloadResult = downloadCSV(protocols, 'complete');
        
        // 保存到localStorage
        progress.updateStatus("保存数据到本地存储...");
        const storageResult = saveDataToLocalStorage(protocols, 'defiLlamaProtocolData_complete');
        
        // 更新最终状态
        progress.updateStatus(`完成! 处理了 ${processingResult.processedTotal} 个协议，捕获了 ${processingResult.capturedTotal} 个URL`);
        
        // 在控制台显示统计信息
        console.log("=== DeFiLlama URL提取完成 ===");
        console.log(`总协议数: ${protocols.length}`);
        console.log(`处理数量: ${processingResult.processedTotal}`);
        console.log(`成功捕获URL: ${processingResult.capturedTotal} (${processingResult.successRate}%)`);
        console.log(`失败数量: ${processingResult.failedTotal}`);
        console.log(`执行时间: ${processingResult.executionTime}`);
        console.log(`CSV文件已下载，包含 ${downloadResult.total} 条记录，其中 ${downloadResult.withUrl} 条有外部URL (${downloadResult.percent}%)`);
        
        // 完成
        setTimeout(() => progress.remove(), 10000);
        
        // 更新结果
        result = {
          success: true,
          message: "提取完成",
          stats: {
            total: protocols.length,
            processed: processingResult.processedTotal,
            captured: processingResult.capturedTotal,
            failed: processingResult.failedTotal,
            successRate: processingResult.successRate,
            executionTime: processingResult.executionTime,
            csvStats: downloadResult
          }
        };
        
        return result;
      } catch (error) {
        console.error("执行过程中出错:", error);
        progress.updateStatus(`错误: ${error.message}`);
        
        // 发生错误时，尝试保存当前数据
        try {
          if (protocols && protocols.length > 0) {
            progress.updateStatus(`正在保存已收集的数据...`);
            downloadCSV(protocols, 'error_recovery');
            saveDataToLocalStorage(protocols, 'defiLlamaProtocolData_error_recovery');
            console.log(`已保存错误恢复数据，包含 ${protocols.length} 条记录`);
          }
        } catch (saveError) {
          console.error("保存错误恢复数据失败:", saveError);
        }
        
        setTimeout(() => progress.remove(), 5000);
        
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
  extractDefILlamaProtocols().then(result => {
    if (result.success) {
      console.log(`脚本执行成功: ${result.message}`);
      if (result.stats) {
        console.table(result.stats);
      }
    } else {
      console.error(`脚本执行失败: ${result.message}`);
    }
  });