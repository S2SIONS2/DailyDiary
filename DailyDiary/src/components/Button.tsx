import './Button.scss';

const Button = ({ text, type, onClick }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`Button Button_${type} m-0 g-0`}
        >
            {text}
        </button>
    );
}

export default Button;
