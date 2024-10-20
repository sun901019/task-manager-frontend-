import React from 'react';
import TaskList from './components/TaskList';
import './App.css';  // 確保導入了 CSS 文件

function App() {
  return (
    <div className="App">
      <h1>待辦事項管理系統</h1>
      <TaskList />
    </div>
  );
}

export default App;
