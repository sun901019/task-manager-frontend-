import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/task.service';  // 引入服務層 API

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');  // 添加錯誤狀態

  const [isEditing, setIsEditing] = useState(false);  // 是否編輯模式
  const [currentTask, setCurrentTask] = useState(null);  // 當前編輯的任務
  const [searchTerm, setSearchTerm] = useState('');  // 搜尋字串
  const [filterByDate, setFilterByDate] = useState('');  // 日期篩選

  const [currentPage, setCurrentPage] = useState(1);  // 當前頁數
  const itemsPerPage = 10;  // 每頁顯示的項目數

  useEffect(() => {
    loadTasks();  // 頁面加載時讀取任務
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();  // 調用 API 獲取任務
      setTasks(response.data);  // 更新狀態
      setError('');  // 清除錯誤訊息
    } catch (err) {
      console.error('加載任務時出錯：', err);
      setError('加載任務失敗，請稍後再試。');  // 設置錯誤信息
    }
  };

  const handleCreateTask = async () => {
    const newTask = { title, description, priority, due_date: dueDate };  // 構建新任務對象
    await createTask(newTask);  // 調用 API 新增任務
    loadTasks();  // 重新加載任務
    clearForm();  // 清空表單
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);  // 調用 API 刪除任務
    loadTasks();  // 重新加載任務
  };

  const handleEditTask = (task) => {
    setIsEditing(true);
    setCurrentTask(task);  // 將任務資料填入表單
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.due_date);
  };

  const handleUpdateTask = async () => {
    const updatedTask = { title, description, priority, due_date: dueDate };
    await updateTask(currentTask.id, updatedTask);  // 調用 API 更新任務
    loadTasks();  // 重新加載任務列表
    setIsEditing(false);  // 編輯完成後退出編輯模式
    clearForm();  // 清空表單
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';  // 切換狀態
    await updateTask(taskId, { status: newStatus });
    loadTasks();  // 重新加載任務
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Low');
    setDueDate('');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);  // 分頁顯示當前頁數的任務

  const filteredTasks = currentTasks.filter(task => {
    return task.title.includes(searchTerm) || task.due_date === filterByDate;
  });

  const handleExport = () => {
    // 這裡實現導出功能
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.due_date === today);
    
    // 創建一個包含今天任務的 CSV 字符串
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Title,Description,Priority,Due Date,Status\n";
    todayTasks.forEach(task => {
      csvContent += `${task.title},${task.description},${task.priority},${task.due_date},${task.status}\n`;
    });

    // 創建一個下載鏈接並觸發下載
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tasks_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="task-list">
      <h1>待辦事項管理系統</h1>
      <h2>WORK LIST</h2>
      <p className="description">在這裡管理您的待辦事項。您可以添加新的任務，編輯現有任務，標記任務為完成，或刪除任務。</p>
      
      {error && <div className="error-message">{error}</div>}

      <div className="search-filter-section">
        <h3>搜尋和篩選</h3>
        <p className="description">使用以下選項來搜尋特定任務或按日期篩選任務。</p>
        <div className="search-filter">
          <div className="form-group">
            <label htmlFor="searchTerm">搜尋代辦事項：</label>
            <input 
              id="searchTerm" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              placeholder="輸入關鍵字搜尋任務" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="filterDate">按日期篩選：</label>
            <input 
              id="filterDate" 
              type="date" 
              value={filterByDate} 
              onChange={e => setFilterByDate(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">截止日期：</label>
            <input 
              id="dueDate" 
              type="date" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="task-form">
        <h3>新增代辦事項</h3>
        <div className="form-group">
          <label htmlFor="title">標題：</label>
          <input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="請輸入任務標題" />
        </div>
        <div className="form-group">
          <label htmlFor="description">描述：</label>
          <input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="請輸入任務描述" />
        </div>
        <div className="form-group">
          <label htmlFor="priority">優先級：</label>
          <select id="priority" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="Low">低</option>
            <option value="Medium">中</option>
            <option value="High">高</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">截止日期：</label>
          <input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="notes">備註：</label>
          <textarea id="notes" value={description} onChange={e => setDescription(e.target.value)} placeholder="請輸入任務備註" />
        </div>
        <button onClick={isEditing ? handleUpdateTask : handleCreateTask}>
          {isEditing ? '更新任務' : '新增代辦事項'}
        </button>
      </div>

      <div className="task-sections">
        <div className="task-section">
          <h3>未處理</h3>
          <ul>
            {filteredTasks.filter(task => task.status === 'Pending').map(task => (
              <li key={task.id}>
                <span>{task.title}</span>
                <div className="task-buttons">
                  <button onClick={() => handleToggleStatus(task.id, task.status)}>完成</button>
                  <button onClick={() => handleEditTask(task)}>編輯</button>
                  <button onClick={() => handleDeleteTask(task.id)}>刪除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="task-section">
          <h3>已處理</h3>
          <ul>
            {filteredTasks.filter(task => task.status === 'Completed').map(task => (
              <li key={task.id}>
                <span>{task.title}</span>
                <div className="task-buttons">
                  <button onClick={() => handleToggleStatus(task.id, task.status)}>未完成</button>
                  <button onClick={() => handleDeleteTask(task.id)}>刪除</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>上一頁</button>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * itemsPerPage >= tasks.length}>下一頁</button>
      </div>

      <button className="export-button" onClick={handleExport}>匯出當日清單</button>
    </div>
  );
};

export default TaskList;
