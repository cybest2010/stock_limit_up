async function fetchTopLimitUpStocks() {
  try {
    const response = await fetch('https://flash-api.xuangubao.cn/api/pool/detail?pool_name=limit_up');
    const data = await response.json();
    
    const sortedStocks = data.data
      .sort((a, b) => b.limit_up_days - a.limit_up_days)
      .slice(0, 10)
      .map(stock => ({
        name: stock.name,
        price: stock.price,
        limit_up_days: stock.limit_up_days,
        reason: stock.reason || '未披露'
      }));
    
    return sortedStocks;
  } catch (error) {
    console.error('API请求失败:', error);
    return [];
  }
}

// 渲染表格
fetchTopLimitUpStocks().then(stocks => {
  const tableBody = document.getElementById('stocks-table');
  if (stocks.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">数据加载失败，请刷新重试</td></tr>';
    return;
  }
  
  stocks.forEach(stock => {
    const row = `<tr>
      <td>${stock.name}</td>
      <td>${stock.price}</td>
      <td>${stock.limit_up_days}</td>
      <td>${stock.reason}</td>
    </tr>`;
    tableBody.insertAdjacentHTML('beforeend', row);
  });
});
