
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Settings, 
  Search, 
  Plus, 
  Bell, 
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  User,
  MoreVertical
} from 'lucide-react';
import { Task, Status, Priority, ViewType } from './types';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design System Update',
    description: 'Update the main color palette and button components for the Q3 release.',
    status: Status.TODO,
    priority: Priority.HIGH,
    dueDate: '2024-10-25',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'API Integration',
    description: 'Connect the frontend with the new auth service endpoints.',
    status: Status.IN_PROGRESS,
    priority: Priority.URGENT,
    dueDate: '2024-10-22',
    createdAt: Date.now()
  },
  {
    id: '3',
    title: 'User Testing',
    description: 'Conduct feedback sessions with at least 5 beta users.',
    status: Status.REVIEW,
    priority: Priority.NORMAL,
    dueDate: '2024-11-01',
    createdAt: Date.now()
  }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      setTasks(tasks.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t));
    } else {
      const newTask: Task = {
        ...taskData as Task,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const updateTaskStatus = (id: string, newStatus: Status) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">Z</div>
          <h1 className="text-xl font-bold tracking-tight">ZenithTask</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <button 
            onClick={() => setActiveView('board')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeView === 'board' ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800/50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Board View</span>
          </button>
          <button 
            onClick={() => setActiveView('list')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${activeView === 'list' ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800/50'}`}
          >
            <ListTodo className="w-5 h-5" />
            <span className="font-medium">List View</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-indigo-100 hover:bg-indigo-800/50 transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Calendar</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-indigo-100 hover:bg-indigo-800/50 transition-colors">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI Insights</span>
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-indigo-100 hover:bg-indigo-800/50 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <div className="mt-4 flex items-center gap-3 px-4">
            <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Alex Doe</p>
              <p className="text-indigo-300 text-xs">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold text-sm">New Task</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-auto bg-gray-50/50 p-8">
          {activeView === 'board' ? (
            <div className="flex gap-6 min-h-full">
              {Object.values(Status).map(status => (
                <div key={status} className="w-80 flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-600 text-sm uppercase tracking-wider">{status}</h2>
                      <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                        {filteredTasks.filter(t => t.status === status).length}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3 kanban-column">
                    {filteredTasks.filter(t => t.status === status).map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onClick={handleTaskClick}
                        onStatusChange={updateTaskStatus}
                      />
                    ))}
                    {filteredTasks.filter(t => t.status === status).length === 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm">
                        No tasks here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b">
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTasks.map(task => (
                    <tr 
                      key={task.id} 
                      onClick={() => handleTaskClick(task)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="rounded text-indigo-600" onClick={(e) => e.stopPropagation()} />
                          <span className="text-sm font-medium text-gray-800">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          task.status === Status.DONE ? 'bg-green-100 text-green-700' :
                          task.status === Status.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold ${
                          task.priority === Priority.URGENT ? 'text-red-600' :
                          task.priority === Priority.HIGH ? 'text-orange-600' :
                          'text-gray-500'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {task.dueDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 group-hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Task Creation/Editing Modal */}
      {isModalOpen && (
        <TaskModal 
          task={editingTask}
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default App;
