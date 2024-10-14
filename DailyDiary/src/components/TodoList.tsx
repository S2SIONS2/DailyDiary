import './TodoList.scss'

interface TodoListProps {
    selectedDate: Date | null
}

const TodoList: React.FC<TodoListProps> = ({ selectedDate }) => {
    

    return (
        <div className="TodoList">
            
        </div>
    )
}

export default TodoList;