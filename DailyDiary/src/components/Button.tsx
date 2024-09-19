import './Button.scss';

const Button = ({ text, type, onClick }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`Button Button_${type}`}
        >
            {text}
        </button>
    );
}

export default Button;
