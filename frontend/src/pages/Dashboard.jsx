import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as taskService from '../services/taskService';
import {
    Plus,
    LogOut,
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
    LayoutDashboard,
    Settings,
    User as UserIcon,
    Search,
    Filter,
    MoreVertical,
    Loader2
} from 'lucide-react';

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await taskService.getTasks();
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await taskService.createTask(newTask);
            setTasks([response.data, ...tasks]);
            setNewTask({ title: '', description: '', status: 'todo' });
            setShowAddForm(false);
        } catch (err) {
            console.error('Failed to create task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (task, newStatus) => {
        try {
            const response = await taskService.updateTask(task._id, { status: newStatus });
            setTasks(tasks.map(t => t._id === task._id ? response.data : t));
        } catch (err) {
            console.error('Failed to update task');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await taskService.deleteTask(id);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error('Failed to delete task');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-green-500" size={20} />;
            case 'in-progress': return <Clock className="text-amber-500" size={20} />;
            default: return <Circle className="text-gray-400" size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3 text-primary-600 mb-8">
                        <LayoutDashboard size={28} />
                        <span className="text-xl font-bold tracking-tight text-gray-900">StackForge</span>
                    </div>

                    <nav className="space-y-1">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium">
                            <LayoutDashboard size={20} /> Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <UserIcon size={20} /> Profile
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                            <Settings size={20} /> Settings
                        </a>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logoutUser}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none w-64"
                                />
                            </div>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="btn-primary flex items-center gap-2 py-2"
                            >
                                <Plus size={18} /> New Task
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto p-6">
                    {/* Add Task Modal-like Form */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
                                    <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                                        <Plus className="rotate-45" size={24} />
                                    </button>
                                </div>
                                <form onSubmit={handleAddTask} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="input-field"
                                            placeholder="What needs to be done?"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            className="input-field min-h-[100px]"
                                            placeholder="Add some details..."
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-primary px-8"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Task'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Tasks List */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 className="animate-spin mb-4" size={40} />
                            <p>Loading your tasks...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 mb-4">
                                <LayoutDashboard size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No tasks yet</h3>
                            <p className="text-gray-500 mt-1 mb-6">Start by creating your first task above.</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="text-primary-600 font-semibold hover:underline"
                            >
                                + Create your first task
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {tasks.map((task) => (
                                <div key={task._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <button
                                                onClick={() => handleUpdateStatus(task, task.status === 'completed' ? 'todo' : 'completed')}
                                                className="mt-1 transition-transform active:scale-90"
                                            >
                                                {getStatusIcon(task.status)}
                                            </button>
                                            <div>
                                                <h4 className={`font-bold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                                    {task.title}
                                                </h4>
                                                {task.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                                )}
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                            task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {task.status.replace('-', ' ')}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                                                        <Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
