import express from 'express';
import cors from 'cors';

// 文本处理工具函数
const textProcessors = {
  wordCount: (text) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return {
      words: words.length,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      lines: text.split('\n').length
    };
  },
  
  textTransform: (text, operation) => {
    switch (operation) {
      case 'uppercase': return text.toUpperCase();
      case 'lowercase': return text.toLowerCase();
      case 'capitalize': return text.replace(/\b\w/g, l => l.toUpperCase());
      case 'reverse': return text.split('').reverse().join('');
      default: return text;
    }
  },
  
  textClean: (text) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .replace(/[^\w\s\u4e00-\u9fff]/g, '');
  },
  
  extractKeywords: (text) => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const frequency = {};
    words.forEach(word => {
      if (word.length > 2) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  },
  
  formatJson: (text, operation) => {
    try {
      const parsed = JSON.parse(text);
      switch (operation) {
        case 'beautify':
          return JSON.stringify(parsed, null, 2);
        case 'minify':
          return JSON.stringify(parsed);
        case 'validate':
          return { valid: true, message: 'JSON格式正确' };
        default:
          return JSON.stringify(parsed, null, 2);
      }
    } catch (error) {
      if (operation === 'validate') {
        return { valid: false, message: `JSON格式错误: ${error.message}` };
      }
      throw new Error(`JSON解析失败: ${error.message}`);
    }
  }
};

// Express服务器
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API端点
app.post('/api/process', (req, res) => {
  const { text, operation, type } = req.body;
  
  try {
    let result;
    switch (type) {
      case 'count':
        result = textProcessors.wordCount(text);
        break;
      case 'transform':
        result = textProcessors.textTransform(text, operation);
        break;
      case 'clean':
        result = textProcessors.textClean(text);
        break;
      case 'keywords':
        result = textProcessors.extractKeywords(text);
        break;
      case 'json':
        result = textProcessors.formatJson(text, operation);
        break;
      default:
        throw new Error('未知操作类型');
    }
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`文本处理服务器运行在 http://localhost:${PORT}`);
});

export { textProcessors };