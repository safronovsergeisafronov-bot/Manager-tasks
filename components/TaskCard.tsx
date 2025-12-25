
import React from 'react';
import { Task, Priority, Status } from '../types';
import { 
  AlertCircle, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  ArrowUpCircle,
  AlertTriangle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const colors = {
    [Priority.LOW]: 'bg-gray-100 text-gray-600',
    [Priority.NORMAL]: 'bg-blue-100 text-blue-600',
    [Priority.HIGH]: 'bg-orange-100 text-orange-600',
    [Priority.URGENT]: 'bg-red-100 text-red-600',
  };

  const icons = {
    [Priority.LOW]: <Circle className="w-3 h-3" />,
    [Priority.NORMAL]: <ArrowUpCircle className="w-3 h-3" />,
    [Priority.HIGH]: <AlertTriangle className="w-3 h-3" />,
    [Priority.URGENT]: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}>
      {icons[priority]}
      {priority}
    </span>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onStatusChange }) => {
  return (
    <div 
      onClick={() => onClick(task)}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">
        {task.description || "No description provided."}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <PriorityBadge priority={task.priority} />
        </div>
        
        <div className="flex items-center text-gray-400 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          <span>{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
