const supabase = require('../utils/supabase');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(201).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const { data: task, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error || !task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;

        const { data: task, error } = await supabase
            .from('tasks')
            .insert([{ title, description, status, user_id: req.user.id }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        const { data: updatedTask, error } = await supabase
            .from('tasks')
            .update(req.body)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error || !updatedTask) {
            return res.status(400).json({ success: false, message: 'Task not found or not authorized' });
        }

        res.status(200).json({
            success: true,
            data: updatedTask,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Task removed',
        });
    } catch (error) {
        next(error);
    }
};
